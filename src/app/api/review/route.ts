import { NextResponse } from "next/server";
import { AIProviderError, getAIResponse } from "@/lib/ai/aiClient";
import { buildFallbackReview } from "@/lib/ai/fallbackReview";
import { buildRepairPrompt, buildReviewPrompt } from "@/lib/ai/promptBuilder";
import { ReviewResponseSchema } from "@/lib/validators/reviewResponse.schema";

const INCOMPLETE_EXPLANATION_MESSAGE =
  "The AI response did not include a complete explanation, so the original code was preserved for review.";

function formatProviderName(provider: string) {
  return provider.toUpperCase();
}

type ReviewShape = ReturnType<typeof normalizeReviewResponse>;

function normalizeReviewResponse(
  rawResponse: unknown,
  provider: string,
  originalCode: string,
) {
  const response =
    rawResponse && typeof rawResponse === "object"
      ? (rawResponse as Record<string, unknown>)
      : {};

  const summary =
    typeof response.summary === "string" && response.summary.trim()
      ? response.summary
      : "Review generated, but the AI response was partially incomplete.";

  const score =
    typeof response.score === "number" && Number.isFinite(response.score)
      ? response.score
      : 5;

  const issues = Array.isArray(response.issues)
    ? response.issues
        .filter(
          (issue): issue is Record<string, unknown> =>
            !!issue && typeof issue === "object",
        )
        .map((issue) => ({
          line:
            typeof issue.line === "number" && Number.isFinite(issue.line)
              ? issue.line
              : null,
          message:
            typeof issue.message === "string" && issue.message.trim()
              ? issue.message
              : "Issue details were incomplete in the AI response.",
          severity:
            issue.severity === "low" ||
            issue.severity === "medium" ||
            issue.severity === "high"
              ? issue.severity
              : "medium",
        }))
    : [];

  const improvements = Array.isArray(response.improvements)
    ? response.improvements.filter(
        (item): item is string =>
          typeof item === "string" && item.trim().length > 0,
      )
    : [];

  const optimizedCode =
    typeof response.optimizedCode === "string" && response.optimizedCode.trim()
      ? response.optimizedCode
      : originalCode;

  const explanation =
    typeof response.explanation === "string" && response.explanation.trim()
      ? response.explanation
      : INCOMPLETE_EXPLANATION_MESSAGE;

  return {
    summary,
    score: Math.min(10, Math.max(1, score)),
    issues,
    improvements,
    optimizedCode,
    explanation,
    meta: {
      provider: formatProviderName(provider),
      fallbackUsed: false,
      warning:
        typeof response.optimizedCode !== "string" ||
        typeof response.explanation !== "string"
          ? "The AI response was incomplete, so some fields were safely filled in."
          : undefined,
    },
  };
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function extractFunctionParameters(code: string) {
  const declarationMatch = code.match(
    /function\s+\w*\s*\(([^)]*)\)|\(([^)]*)\)\s*=>|([A-Za-z_$][\w$]*)\s*=>/,
  );

  if (!declarationMatch) {
    return [];
  }

  const rawParameters =
    declarationMatch[1] ?? declarationMatch[2] ?? declarationMatch[3] ?? "";

  return rawParameters
    .split(",")
    .map((parameter) => parameter.trim())
    .filter(Boolean)
    .map((parameter) => parameter.replace(/=.*$/, "").trim())
    .filter(Boolean);
}

function inferReplacementVariable(
  issueMessage: string,
  originalCode: string,
  wrongVariable: string,
) {
  const shouldBeMatch = issueMessage.match(
    /should be ['"`](\w+)['"`] instead/i,
  );

  if (shouldBeMatch) {
    return shouldBeMatch[1];
  }

  const expectedVariablesMatch = issueMessage.match(
    /Expected .*?['"`](\w+)['"`].*?['"`](\w+)['"`].*?but ['"`](\w+)['"`] is used/i,
  );

  if (expectedVariablesMatch) {
    const [, firstExpected, secondExpected, reportedVariable] =
      expectedVariablesMatch;

    if (reportedVariable === wrongVariable) {
      return secondExpected !== wrongVariable ? secondExpected : firstExpected;
    }
  }

  const functionParameters = extractFunctionParameters(originalCode);

  return (
    functionParameters.find((parameter) => parameter !== wrongVariable) ??
    functionParameters.at(-1) ??
    null
  );
}

function extractUndefinedVariableReplacement(
  issueMessage: string,
  originalCode: string,
) {
  const undefinedVariableMatch = issueMessage.match(
    /(?:Undefined variable|Variable)\s+['"`](\w+)['"`](?:\s+is not defined)?/i,
  );

  if (!undefinedVariableMatch) {
    return null;
  }

  const wrongVariable = undefinedVariableMatch[1];
  const replacementVariable = inferReplacementVariable(
    issueMessage,
    originalCode,
    wrongVariable,
  );

  if (!replacementVariable || replacementVariable === wrongVariable) {
    return null;
  }

  return {
    wrongVariable,
    replacementVariable,
  };
}

function buildIssueDrivenOptimizedCode(
  originalCode: string,
  issues: ReviewShape["issues"],
) {
  let repairedCode = originalCode;

  for (const issue of issues) {
    const replacement = extractUndefinedVariableReplacement(
      issue.message,
      originalCode,
    );

    if (replacement) {
      repairedCode = repairedCode.replace(
        new RegExp(`\\b${escapeRegExp(replacement.wrongVariable)}\\b`, "g"),
        replacement.replacementVariable,
      );
    }
  }

  repairedCode = repairedCode
    .replace(/\bvar\b/g, "const")
    .replace(/(^|[^=!])==([^=]|$)/g, "$1===$2");

  return repairedCode;
}

function buildIssueDrivenExplanation(
  issues: ReviewShape["issues"],
  level: "beginner" | "intermediate" | "advanced",
) {
  if (issues.length === 0) {
    return level === "advanced"
      ? "The code appears mostly sound after normalization. The final review preserves the original intent while applying safer defaults and formatting fixes where needed."
      : level === "intermediate"
        ? "The code looks mostly fine after cleanup. The final version keeps the same behavior while applying safer and clearer defaults."
        : "The code looks mostly okay after cleanup. The final version keeps the same idea and makes the code safer and easier to read.";
  }

  const topIssues = issues.slice(0, 3).map((issue) => issue.message);

  if (level === "advanced") {
    return [
      `Primary concerns: ${topIssues.join(" ")}`,
      "The revised code focuses on correcting the reported defects while preserving behavior and improving implementation safety.",
    ].join(" ");
  }

  if (level === "intermediate") {
    return [
      `Main problems found: ${topIssues.join(" ")}`,
      "The revised version fixes those issues and makes the code more reliable and easier to maintain.",
    ].join(" ");
  }

  return [
    `Main issues found: ${topIssues.join(" ")}`,
    "The improved version fixes those problems so the code behaves more predictably and is easier to understand.",
  ].join(" ");
}

function shouldRepairOptimizedCode(
  optimizedCode: string,
  originalCode: string,
  issues: ReviewShape["issues"],
) {
  const normalizedOptimized = optimizedCode.trim();
  const normalizedOriginal = originalCode.trim();

  if (!normalizedOptimized) {
    return true;
  }

  if (
    normalizedOptimized === normalizedOriginal &&
    issues.some((issue) => issue.severity !== "low")
  ) {
    return true;
  }

  return issues.some((issue) => {
    const replacement = extractUndefinedVariableReplacement(
      issue.message,
      originalCode,
    );

    if (!replacement) {
      return false;
    }

    return (
      new RegExp(`\\b${escapeRegExp(replacement.wrongVariable)}\\b`).test(
        normalizedOptimized,
      ) &&
      !new RegExp(
        `\\b${escapeRegExp(replacement.replacementVariable)}\\b`,
      ).test(normalizedOptimized)
    );
  });
}

function strengthenReviewResponse(
  review: ReviewShape,
  originalCode: string,
  language: string,
  level: "beginner" | "intermediate" | "advanced",
  provider: string,
) {
  const repairedOptimizedCode = shouldRepairOptimizedCode(
    review.optimizedCode,
    originalCode,
    review.issues,
  )
    ? buildIssueDrivenOptimizedCode(originalCode, review.issues)
    : review.optimizedCode;

  const explanation =
    review.explanation === INCOMPLETE_EXPLANATION_MESSAGE
      ? buildIssueDrivenExplanation(review.issues, level)
      : review.explanation;

  const improvements =
    review.improvements.length > 0
      ? review.improvements
      : buildFallbackReview({
          code: originalCode,
          language,
          level,
          provider,
          reason: "AI review quality needed local repair for some fields.",
        }).improvements;

  const warningMessages = [
    review.meta.warning,
    repairedOptimizedCode !== review.optimizedCode
      ? "The optimized code was locally repaired because the AI rewrite did not resolve the reported issue correctly."
      : undefined,
    explanation !== review.explanation
      ? "The explanation was completed locally because the AI response was incomplete."
      : undefined,
  ].filter((message): message is string => Boolean(message));

  return {
    ...review,
    improvements,
    optimizedCode: repairedOptimizedCode,
    explanation,
    meta: {
      ...review.meta,
      provider: formatProviderName(provider),
      fallbackUsed: false,
      warning:
        warningMessages.length > 0 ? warningMessages.join(" ") : undefined,
    },
  };
}

function extractJsonPayload(rawResponse: string) {
  const trimmed = rawResponse.trim();

  if (trimmed.startsWith("```")) {
    return trimmed
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/, "");
  }

  return trimmed;
}

function parseAIReviewPayload(rawResponse: string) {
  try {
    return JSON.parse(extractJsonPayload(rawResponse));
  } catch (error) {
    throw new Error(
      `AI returned invalid JSON: ${error instanceof Error ? error.message : "unknown parse error"}`,
    );
  }
}

function needsSecondPass(review: ReviewShape, originalCode: string) {
  return (
    review.explanation === INCOMPLETE_EXPLANATION_MESSAGE ||
    shouldRepairOptimizedCode(
      review.optimizedCode,
      originalCode,
      review.issues,
    ) ||
    review.improvements.length === 0
  );
}

function mergeReviewResponses(primary: ReviewShape, repair: ReviewShape) {
  const explanation =
    repair.explanation !== INCOMPLETE_EXPLANATION_MESSAGE
      ? repair.explanation
      : primary.explanation;

  const optimizedCode =
    repair.optimizedCode.trim() &&
    repair.optimizedCode !== primary.optimizedCode
      ? repair.optimizedCode
      : primary.optimizedCode;

  return {
    ...primary,
    summary: repair.summary || primary.summary,
    score: repair.score || primary.score,
    issues: repair.issues.length > 0 ? repair.issues : primary.issues,
    improvements:
      repair.improvements.length > 0
        ? repair.improvements
        : primary.improvements,
    optimizedCode,
    explanation,
  };
}

async function requestReviewedCode(
  code: string,
  language: string,
  level: "beginner" | "intermediate" | "advanced",
) {
  const aiResponse = await getAIResponse(
    buildReviewPrompt({
      code,
      language,
      level,
    }),
  );

  let normalizedResponse = normalizeReviewResponse(
    parseAIReviewPayload(aiResponse.text),
    aiResponse.provider,
    code,
  );

  if (needsSecondPass(normalizedResponse, code)) {
    try {
      const repairResponse = await getAIResponse(
        buildRepairPrompt({
          code,
          language,
          level,
          issues: normalizedResponse.issues as Array<{
            line: number | null;
            message: string;
            severity: "low" | "medium" | "high";
          }>,
          optimizedCode: normalizedResponse.optimizedCode,
          explanation: normalizedResponse.explanation,
        }),
      );

      const normalizedRepairResponse = normalizeReviewResponse(
        parseAIReviewPayload(repairResponse.text),
        repairResponse.provider,
        code,
      );

      normalizedResponse = mergeReviewResponses(
        normalizedResponse,
        normalizedRepairResponse,
      );
    } catch (error) {
      console.error("AI review repair pass failed:", error);
    }
  }

  return {
    normalizedResponse,
    provider: aiResponse.provider,
  };
}

export async function POST(request: Request) {
  let requestBody: {
    code: string;
    language: string;
    level: "beginner" | "intermediate" | "advanced";
  } | null = null;

  try {
    const body = await request.json();
    const { code, language, level } = body;
    requestBody = { code, language, level };

    if (!code || !language || !level) {
      return NextResponse.json(
        { error: "Missing required fields!" },
        { status: 400 },
      );
    }

    const { normalizedResponse, provider } = await requestReviewedCode(
      code,
      language,
      level,
    );
    const strengthenedResponse = strengthenReviewResponse(
      normalizedResponse,
      code,
      language,
      level,
      provider,
    );
    const validateResponse = ReviewResponseSchema.parse(strengthenedResponse);

    return NextResponse.json(validateResponse, { status: 200 });
  } catch (error: unknown) {
    console.error("API Review Error: ", error);

    if (requestBody) {
      const fallbackReview = buildFallbackReview({
        code: requestBody.code,
        language: requestBody.language,
        level: requestBody.level,
        provider: error instanceof AIProviderError ? error.provider : "local",
        reason:
          error instanceof Error
            ? error.message
            : "The AI review could not be completed reliably.",
        retryAfterSeconds:
          error instanceof AIProviderError
            ? error.retryAfterSeconds
            : undefined,
      });

      return NextResponse.json(ReviewResponseSchema.parse(fallbackReview), {
        status: 200,
      });
    }

    const message =
      error instanceof Error ? error.message : "Failed to review code";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
