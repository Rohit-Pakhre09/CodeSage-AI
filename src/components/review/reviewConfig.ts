export const LANGUAGE_OPTIONS = [
  {
    value: "JavaScript",
    label: "JavaScript",
    description: "Frontend, backend, and everyday scripting",
  },
  {
    value: "TypeScript",
    label: "TypeScript",
    description: "Type-safe JavaScript for larger codebases",
  },
  {
    value: "Python",
    label: "Python",
    description: "Readable scripting, automation, and data work",
  },
  {
    value: "Java",
    label: "Java",
    description: "Enterprise-style OOP and backend systems",
  },
  {
    value: "C++",
    label: "C++",
    description: "Performance-focused native programming",
  },
] as const;

export const LEVEL_OPTIONS = [
  {
    value: "beginner",
    label: "Beginner",
    description: "Simpler explanations with foundational guidance",
  },
  {
    value: "intermediate",
    label: "Intermediate",
    description: "Balanced reasoning with practical code quality advice",
  },
  {
    value: "advanced",
    label: "Advanced",
    description: "Sharper technical feedback with deeper engineering detail",
  },
] as const;

export type ReviewLevel = (typeof LEVEL_OPTIONS)[number]["value"];
