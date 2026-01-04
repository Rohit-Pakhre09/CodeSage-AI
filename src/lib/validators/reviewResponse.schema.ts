import { z } from "zod";

export const ReviewIssueSchema = z.object({
  line: z.number().optional(),
  message: z.string(),
  severity: z.enum(["low", "medium", "hard"]),
});

export const ReviewResponseSchema = z.object({
  summary: z.string(),
  score: z.number().min(1).max(10),
  issues: z.array(ReviewIssueSchema),
  improvements: z.array(z.string()),
  optimizedCode: z.string(),
  explaination: z.string(),
});

export type ReviewResponse = z.infer<typeof ReviewResponseSchema>;