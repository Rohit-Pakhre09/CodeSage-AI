"use client";

import Image from "next/image";
import {
  formatOptimizedCode,
  getSeverityClasses,
} from "@/components/review/reviewUtils";
import type { ReviewResponse } from "@/lib/validators/reviewResponse.schema";

interface ReviewResultsProps {
  language: string;
  result: ReviewResponse | null;
  actionMessage: string | null;
  onCopyOptimizedCode: () => void;
}

export default function ReviewResults({
  language,
  result,
  actionMessage,
  onCopyOptimizedCode,
}: ReviewResultsProps) {
  return (
    <>
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-950">
            Review Results
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Your summary, issues, improvements, and optimized code appear here.
          </p>
        </div>
      </div>

      {!result && (
        <div className="flex min-h-[520px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50/70 px-6 text-center transition-colors duration-200 hover:border-sky-200 hover:bg-slate-50">
          <div className="rounded-[22px] border border-slate-200 bg-white p-3 shadow-sm">
            <Image
              src="/codesage-mark.svg"
              alt="CodeSage logo"
              width={52}
              height={52}
              className="h-[52px] w-[52px]"
              priority
            />
          </div>
          <h3 className="mt-4 text-base font-semibold text-slate-800">
            No review yet
          </h3>
          <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
            Run a review to see the score, detected issues, suggested
            improvements, and optimized code in one place.
          </p>
        </div>
      )}

      {result && (
        <div className="min-w-0 space-y-5">
          <div
            className={`rounded-2xl border px-4 py-4 ${
              result.meta?.fallbackUsed
                ? "border-amber-200 bg-amber-50"
                : "border-emerald-200 bg-emerald-50"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-slate-900 uppercase">
                {result.meta?.fallbackUsed
                  ? "Fallback Review"
                  : "AI Review Completed"}
              </p>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
                {result.meta?.provider ?? "unknown"}
              </span>
            </div>

            {result.meta?.warning && (
              <p className="mt-2 break-words text-sm text-slate-700">
                {result.meta.warning}
              </p>
            )}

            {typeof result.meta?.retryAfterSeconds === "number" && (
              <p className="mt-2 text-xs text-slate-600">
                Retry AI review in about {result.meta.retryAfterSeconds}{" "}
                seconds.
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-transform duration-200 hover:-translate-y-0.5">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Score
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-950">
                {result.score}
                <span className="ml-1 text-base font-medium text-slate-400">
                  /10
                </span>
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-transform duration-200 hover:-translate-y-0.5">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Issues
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-950">
                {result.issues.length}
              </p>
            </div>
          </div>

          <section className="rounded-2xl border border-slate-200 p-4">
            <h3 className="text-sm font-semibold text-slate-900">Summary</h3>
            <p className="mt-2 break-words text-sm leading-6 text-slate-600">
              {result.summary}
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 p-4">
            <h3 className="text-sm font-semibold text-slate-900">
              Issues Found
            </h3>
            <div className="mt-3 space-y-3">
              {result.issues.length === 0 && (
                <p className="text-sm text-slate-500">
                  No issues were reported.
                </p>
              )}

              {result.issues.map((issue) => (
                <div
                  key={`${issue.line ?? "na"}-${issue.message}`}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition duration-200 hover:border-slate-300 hover:bg-white"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-medium text-slate-800">
                      {issue.line ? `Line ${issue.line}` : "General"}
                    </p>
                    <span
                      className={`rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${getSeverityClasses(
                        issue.severity,
                      )}`}
                    >
                      {issue.severity}
                    </span>
                  </div>
                  <p className="mt-2 break-words text-sm leading-6 text-slate-600">
                    {issue.message}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 p-4">
            <h3 className="text-sm font-semibold text-slate-900">
              Improvements
            </h3>
            <ul className="mt-3 space-y-2">
              {result.improvements.map((improvement) => (
                <li
                  key={improvement}
                  className="rounded-xl bg-slate-100 cursor-pointer px-3 py-3 text-sm text-slate-600 transition duration-200 hover:bg-white"
                >
                  {improvement}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-slate-200 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Optimized Code
                </h3>
                {actionMessage && (
                  <p className="mt-1 text-xs text-slate-500">{actionMessage}</p>
                )}
              </div>

              <button
                type="button"
                onClick={onCopyOptimizedCode}
                className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition duration-200 hover:-translate-y-0.5 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-800"
                aria-label="Copy optimized code"
                title="Copy optimized code"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              </button>
            </div>
            <pre className="mt-3 max-w-full overflow-x-auto whitespace-pre-wrap break-words rounded-2xl bg-slate-950 p-4 text-sm leading-6 text-slate-100">
              {formatOptimizedCode(result.optimizedCode, language)}
            </pre>
          </section>

          <section className="rounded-2xl border border-slate-200 p-4">
            <h3 className="text-sm font-semibold text-slate-900">
              Explanation
            </h3>
            <p className="mt-2 break-words text-sm leading-6 text-slate-600">
              {result.explanation}
            </p>
          </section>
        </div>
      )}
    </>
  );
}
