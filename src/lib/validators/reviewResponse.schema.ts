import { z } from "zod";

export const ReviewIssueSchema = z.object({
  line: z.number().nullable().optional(),
  message: z.string(),
  severity: z.enum(["low", "medium", "high"]),
});

export const ReviewResponseSchema = z.object({
  summary: z.string(),
  score: z.number().min(1).max(10),
  issues: z.array(ReviewIssueSchema),
  improvements: z.array(z.string()),
  optimizedCode: z.string(),
  explanation: z.string(),
  meta: z
    .object({
      provider: z.string(),
      fallbackUsed: z.boolean(),
      warning: z.string().optional(),
      retryAfterSeconds: z.number().nullable().optional(),
    })
    .optional(),
});

export type ReviewResponse = z.infer<typeof ReviewResponseSchema>;
