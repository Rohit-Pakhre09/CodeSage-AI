type ExplanationLevel = "beginner" | "intermediate";

interface BuildPromptParams {
  code: string;
  language: string;
  level: ExplanationLevel;
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
    4. Suggest improvements.
    5. Provide an optimized version of the code.
    6. Give a clear explanation suitable for a ${level} developer.

    IMPORTANT RULES:
    - Respond ONLY in valid JSON.
    - Do NOT include markdown.
    - Do NOT include extra commentary.
    - Follow the exact JSON structure below.

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