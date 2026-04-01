interface ReviewHeroProps {
  loading: boolean;
}

export default function ReviewHero({ loading }: ReviewHeroProps) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-[0_24px_80px_-32px_rgba(15,23,42,0.35)] backdrop-blur sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <span className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
            CodeSage AI
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Review code with a clean, modern workspace
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
            Choose the language, match the explanation to your skill level, and
            get structured review results that are easy to scan and act on.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:w-auto">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Provider
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-800">
              Groq + Fallback
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Status
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-800">
              {loading ? "Reviewing..." : "Ready"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
