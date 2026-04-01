type ExplanationLevel = "beginner" | "intermediate" | "advanced";

interface BuildPromptParams {
  code: string;
  language: string;
  level: ExplanationLevel;
}

interface BuildRepairPromptParams extends BuildPromptParams {
  issues: Array<{
    line: number | null;
    message: string;
    severity: "low" | "medium" | "high";
  }>;
  optimizedCode: string;
  explanation: string;
}

export function buildReviewPrompt({
  code,
  language,
  level,
}: BuildPromptParams): string {
  return `
    You are a senior software engineer and professional code reviewer.

    Review the following ${language} code carefully.

    Your tasks:
    1. Analyze the code quality.
    2. Identify bugs, errors, and bad practices.
    3. Classify each issue with severity: low, medium, or high.
    4. Include the exact line number for each issue whenever possible.
    5. Suggest improvements.
    6. Provide an optimized version of the code.
    7. Give a clear explanation suitable for a ${level} developer.

    IMPORTANT RULES:
    - Respond ONLY in valid JSON.
    - Do NOT include markdown.
    - Do NOT include extra commentary.
    - Follow the exact JSON structure below.
    - For each issue, set "line" to the most relevant 1-based line number from the submitted code.
    - Use null for "line" only if a specific line genuinely cannot be determined.
    - Return "optimizedCode" as properly formatted code with real line breaks and indentation, not as a single-line snippet.
    - "optimizedCode" must directly fix the issues you identified.
    - Do not return broken, placeholder, or partially corrected code.
    - If you report an undefined variable or syntax/runtime bug, the "optimizedCode" must resolve that exact problem.
    - Always include a non-empty "explanation" tailored to the selected developer level.
    - Before responding, verify that every required JSON field is present and non-empty.

    JSON STRUCTURE:
    {
        "summary": "string",
        "score": number (1-10),
        "issues": [
            {
                "line": number | null,
                "message": "string",
                "severity": "low | medium | high"
            }
        ],
        "improvements": ["string"],
        "optimizedCode": "string",
        "explanation": "string"
    }

    CODE TO REVIEW:
    ${code} 
`;
}

export function buildRepairPrompt({
  code,
  language,
  level,
  issues,
  optimizedCode,
  explanation,
}: BuildRepairPromptParams): string {
  return `
    You are repairing a partially incomplete ${language} code review response.

    The original submitted code is:
    ${code}

    The current detected issues are:
    ${JSON.stringify(issues, null, 2)}

    The current optimizedCode is:
    ${optimizedCode}

    The current explanation is:
    ${explanation}

    Your job:
    1. Keep the same review intent and issue list unless they are clearly contradicted by the submitted code.
    2. Rewrite "optimizedCode" so it fully fixes the reported issues.
    3. Rewrite "explanation" so it is complete, non-empty, and suitable for a ${level} developer.
    4. Return every required field in valid JSON.

    IMPORTANT RULES:
    - Respond ONLY in valid JSON.
    - Do NOT include markdown.
    - Do NOT include extra commentary.
    - Preserve useful fields when possible, but correct incomplete or broken ones.
    - "optimizedCode" must not repeat the original bug when a high- or medium-severity issue was reported.
    - "explanation" must be a proper explanation of what is wrong and how the fix improves the code.
    - Verify that "summary", "issues", "improvements", "optimizedCode", and "explanation" are all present before responding.

    JSON STRUCTURE:
    {
      "summary": "string",
      "score": number,
      "issues": [
        {
          "line": number | null,
          "message": "string",
          "severity": "low | medium | high"
        }
      ],
      "improvements": ["string"],
      "optimizedCode": "string",
      "explanation": "string"
    }
`;
}
