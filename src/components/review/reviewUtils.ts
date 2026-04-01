export function formatOptimizedCode(code: string, language: string) {
  const trimmed = code.trim();

  if (!trimmed || trimmed.includes("\n")) {
    return trimmed;
  }

  if (!["JavaScript", "TypeScript", "Java", "C++"].includes(language)) {
    return trimmed;
  }

  const normalized = trimmed
    .replace(/\s*{\s*/g, " {\n")
    .replace(/\s*}\s*/g, "\n}\n")
    .replace(/;\s*/g, ";\n")
    .replace(/\n{2,}/g, "\n")
    .trim();

  const lines = normalized.split("\n");
  let indentLevel = 0;

  return lines
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      if (line.startsWith("}")) {
        indentLevel = Math.max(indentLevel - 1, 0);
      }

      const formattedLine = `${"  ".repeat(indentLevel)}${line}`;

      if (line.endsWith("{")) {
        indentLevel += 1;
      }

      return formattedLine;
    })
    .join("\n");
}

export function getSeverityClasses(severity: "low" | "medium" | "high") {
  if (severity === "high") {
    return "border-red-200 bg-red-50 text-red-700";
  }

  if (severity === "medium") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  return "border-emerald-200 bg-emerald-50 text-emerald-700";
}
