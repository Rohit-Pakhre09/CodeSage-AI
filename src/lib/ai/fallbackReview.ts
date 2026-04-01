import type { ReviewResponse } from "@/lib/validators/reviewResponse.schema";

type BuildFallbackReviewParams = {
  code: string;
  language: string;
  level: "beginner" | "intermediate" | "advanced";
  reason: string;
  provider: string;
  retryAfterSeconds?: number;
};

export function buildFallbackReview({
  code,
  language,
  level,
  reason,
  provider,
  retryAfterSeconds,
}: BuildFallbackReviewParams): ReviewResponse {
  const issues = detectIssues(code);
  const score = Math.max(
    3,
    10 -
      issues.reduce(
        (total, issue) => total + severityWeight(issue.severity),
        0,
      ),
  );
  const improvements = buildImprovements(issues, language);
  const optimizedCode = optimizeCode(code);

  return {
    summary:
      issues.length > 0
        ? `Fallback review generated because ${provider} is currently unavailable. The code has ${issues.length} potential issue${issues.length === 1 ? "" : "s"} worth checking.`
        : `Fallback review generated because ${provider} is currently unavailable. The code looks fairly clean from the local heuristic checks.`,
    score,
    issues,
    improvements,
    optimizedCode,
    explanation: [
      `This is a local fallback review for a ${level} ${language} developer.`,
      "It is based on lightweight static checks, so treat it as a safety net rather than a full AI review.",
      `Reason: ${reason}`,
      retryAfterSeconds
        ? `You can retry the AI review in about ${retryAfterSeconds} second${retryAfterSeconds === 1 ? "" : "s"}.`
        : "You can retry the AI review after updating your provider key or waiting for quota to reset.",
    ].join(" "),
    meta: {
      provider: provider.toUpperCase(),
      fallbackUsed: true,
      warning: reason,
      retryAfterSeconds: retryAfterSeconds ?? null,
    },
  };
}

function detectIssues(code: string): ReviewResponse["issues"] {
  const lines = code.split(/\r?\n/);
  const issues: ReviewResponse["issues"] = [];

  lines.forEach((line, index) => {
    const lineNumber = index + 1;

    if (/\beval\s*\(/.test(line)) {
      issues.push({
        line: lineNumber,
        message:
          "Avoid using eval because it can introduce serious security risks.",
        severity: "high",
      });
    }

    if (/\bvar\s+/.test(line)) {
      issues.push({
        line: lineNumber,
        message:
          "Prefer let or const over var to avoid function-scoped variables.",
        severity: "medium",
      });
    }

    if (/(^|[^=!])==([^=]|$)/.test(line)) {
      issues.push({
        line: lineNumber,
        message: "Use strict equality to avoid unexpected type coercion.",
        severity: "medium",
      });
    }

    if (/console\.log\s*\(/.test(line)) {
      issues.push({
        line: lineNumber,
        message: "Remove or guard debug logging before production use.",
        severity: "low",
      });
    }

    if (/^\s*catch\s*\(\s*\w*\s*\)\s*{\s*}$/.test(line)) {
      issues.push({
        line: lineNumber,
        message: "Empty catch blocks hide failures and make debugging harder.",
        severity: "medium",
      });
    }
  });

  if (issues.length === 0 && code.trim().length === 0) {
    issues.push({
      line: null,
      message: "No code was provided to analyze.",
      severity: "high",
    });
  }

  return issues;
}

function buildImprovements(
  issues: ReviewResponse["issues"],
  language: string,
): string[] {
  const suggestions = new Set<string>();

  if (issues.some((issue) => issue.severity === "high")) {
    suggestions.add(
      "Fix the high-severity issues first because they can affect security or runtime stability.",
    );
  }

  if (issues.some((issue) => issue.message.includes("strict equality"))) {
    suggestions.add(
      "Replace loose equality checks with strict equality operators.",
    );
  }

  if (issues.some((issue) => issue.message.includes("var"))) {
    suggestions.add(
      "Use const by default and let only when reassignment is needed.",
    );
  }

  if (issues.some((issue) => issue.message.includes("debug logging"))) {
    suggestions.add(
      "Keep debug logging behind a development flag or remove it from final code paths.",
    );
  }

  suggestions.add(
    `Add tests around the most important ${language} behavior so regressions are easier to catch.`,
  );

  return [...suggestions];
}

function optimizeCode(code: string): string {
  return code.replace(/\bvar\b/g, "const").trim();
}

function severityWeight(
  severity: ReviewResponse["issues"][number]["severity"],
) {
  if (severity === "high") {
    return 3;
  }

  if (severity === "medium") {
    return 2;
  }

  return 1;
}
