"use client";

import { useState } from "react";
import CodeEditor from "@/components/editor/CodeEditor";
import type { ReviewResponse } from "@/lib/validators/reviewResponse.schema";

export default function ReviewPage() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReviewResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleReview() {
    try {
      setLoading(true);
      setError(null);
      setResult(null);

      const response = await fetch("/api/review", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          code,
          language: "JavaScript",
          level: "beginner",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to review code!");
      }

      const data = await response.json();
      setResult(data);
    } catch (error: any) {
      setError(error.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section style={{ padding: "20px" }}>
      <h1>CodeSage - AI Code Reviewer</h1>
      <CodeEditor value={code} onChange={setCode} />

      <button
        onClick={handleReview}
        disabled={loading || !code}
        style={{ marginTop: "16px" }}
      >
        {loading ? "Reviewing..." : "Review Code"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <section style={{ marginTop: "20px" }}>
          <h2>Summary</h2>
          <p>{result.summary}</p>

          <h2>Score</h2>
          <p>{result.score}</p>

          <h2>Issues</h2>
          <ul>
            {result.issues.map((issue, index) => (
              <li key={index}>
                {issue.line ? `Line ${issue.line}: ` : ""}
                {issue.message} ({issue.severity})
              </li>
            ))}
          </ul>

          <h2>Improvements</h2>
          <ul>
            {result.improvements.map((imp, index) => (
              <li key={index}>{imp}</li>
            ))}
          </ul>

          <h2>Optimized Code</h2>
          <pre>{result.optimizedCode}</pre>

          <h2>Explanation</h2>
          <p>{result.explanation}</p>
        </section>
      )}
    </section>
  );
}