"use client";

import CodeEditor from "@/components/editor/CodeEditor";
import {
  LANGUAGE_OPTIONS,
  LEVEL_OPTIONS,
  type ReviewLevel,
} from "@/components/review/reviewConfig";

interface ReviewWorkspaceProps {
  code: string;
  language: string;
  level: ReviewLevel;
  loading: boolean;
  error: string | null;
  onCodeChange: (value: string) => void;
  onLanguageChange: (value: string) => void;
  onLevelChange: (value: ReviewLevel) => void;
  onReview: () => void;
}

export default function ReviewWorkspace({
  code,
  language,
  level,
  loading,
  error,
  onCodeChange,
  onLanguageChange,
  onLevelChange,
  onReview,
}: ReviewWorkspaceProps) {
  const selectedLanguage =
    LANGUAGE_OPTIONS.find((option) => option.value === language) ??
    LANGUAGE_OPTIONS[0];
  const selectedLevel =
    LEVEL_OPTIONS.find((option) => option.value === level) ?? LEVEL_OPTIONS[0];

  return (
    <section className="min-w-0 flex flex-col rounded-[28px] border border-white/70 bg-white/85 p-5 shadow-[0_24px_80px_-32px_rgba(15,23,42,0.3)] backdrop-blur sm:p-6">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-950">Workspace</h2>
          <p className="mt-1 text-md text-slate-500">
            Paste your code and tune the review before running it.
          </p>
        </div>

        <div className="grid w-full items-start gap-3 sm:grid-cols-2 lg:w-auto">
          <label className="flex min-w-0 flex-col gap-1.5 text-sm font-medium text-slate-700 lg:min-w-[220px]">
            Language
            <div className="relative">
              <select
                value={language}
                onChange={(e) => onLanguageChange(e.target.value)}
                className="w-full appearance-none cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-2.5 pr-9 text-sm text-slate-900 shadow-sm outline-none transition hover:border-sky-300 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              >
                {LANGUAGE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] leading-none text-slate-400">
                v
              </span>
            </div>
            <span className="text-[11px] font-normal leading-4 text-slate-500">
              {selectedLanguage.description}
            </span>
          </label>

          <label className="flex min-w-0 flex-col gap-1.5 text-sm font-medium text-slate-700 lg:min-w-[220px]">
            Level
            <div className="relative">
              <select
                value={level}
                onChange={(e) => onLevelChange(e.target.value as ReviewLevel)}
                className="w-full appearance-none cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-2.5 pr-9 text-sm text-slate-900 shadow-sm outline-none transition hover:border-sky-300 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              >
                {LEVEL_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] leading-none text-slate-400">
                v
              </span>
            </div>
            <span className="text-[11px] font-normal leading-4 text-slate-500">
              {selectedLevel.description}
            </span>
          </label>
        </div>
      </div>

      <div className="h-[460px] overflow-hidden rounded-2xl border border-slate-200 shadow-inner">
        <CodeEditor
          value={code}
          onChange={onCodeChange}
          language={language}
          height="100%"
        />
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">
          Tip: focused snippets usually produce better review quality than
          entire files.
        </p>

        <button
          type="button"
          onClick={onReview}
          disabled={loading || !code.trim()}
          className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_-18px_rgba(15,23,42,0.75)] transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-[0_18px_36px_-20px_rgba(15,23,42,0.75)] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
        >
          {loading ? "Reviewing..." : "Review Code"}
        </button>
      </div>

      {error && (
        <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
    </section>
  );
}
