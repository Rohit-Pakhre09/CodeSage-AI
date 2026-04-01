"use client";

import { useEffect, useRef, useState } from "react";
import ReviewHero from "@/components/review/ReviewHero";
import ReviewResults from "@/components/review/ReviewResults";
import ReviewWorkspace from "@/components/review/ReviewWorkspace";
import type { ReviewLevel } from "@/components/review/reviewConfig";
import type { ReviewResponse } from "@/lib/validators/reviewResponse.schema";

export default function ReviewPage() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("JavaScript");
  const [level, setLevel] = useState<ReviewLevel>("beginner");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReviewResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const reviewSectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!actionMessage) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setActionMessage(null);
    }, 2500);

    return () => window.clearTimeout(timeoutId);
  }, [actionMessage]);

  useEffect(() => {
    if (!result || loading) {
      return;
    }

    reviewSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [result, loading]);

  async function handleReview() {
    try {
      setLoading(true);
      setError(null);
      setResult(null);
      setActionMessage(null);

      const response = await fetch("/api/review", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          code,
          language,
          level,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to review code!");
      }

      setResult(data);
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : "Something went wrong!",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleCopyOptimizedCode() {
    if (!result) {
      return;
    }

    try {
      await navigator.clipboard.writeText(result.optimizedCode);
      setActionMessage("Optimized code copied to clipboard.");
    } catch {
      setActionMessage("Could not copy the optimized code. Please try again.");
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.18),transparent_35%),linear-gradient(to_bottom,#f8fafc,#e0f2fe)] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
        <ReviewHero loading={loading} />

        <div className="flex flex-col gap-8">
          <ReviewWorkspace
            code={code}
            language={language}
            level={level}
            loading={loading}
            error={error}
            onCodeChange={setCode}
            onLanguageChange={setLanguage}
            onLevelChange={setLevel}
            onReview={handleReview}
          />

          <section
            ref={reviewSectionRef}
            className="min-w-0 rounded-[28px] border border-white/70 bg-white/85 p-5 shadow-[0_24px_80px_-32px_rgba(15,23,42,0.3)] backdrop-blur sm:p-6"
          >
            <ReviewResults
              language={language}
              result={result}
              actionMessage={actionMessage}
              onCopyOptimizedCode={handleCopyOptimizedCode}
            />
          </section>
        </div>
      </div>
    </main>
  );
}
