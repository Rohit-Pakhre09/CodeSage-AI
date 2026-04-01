import Link from "next/link";
import { HOME_STATS } from "@/components/home/homeContent";

export default function HomeHero() {
  return (
    <section className="overflow-hidden rounded-[36px] border border-white/70 bg-white/80 p-6 shadow-[0_24px_80px_-32px_rgba(15,23,42,0.35)] backdrop-blur sm:p-8 lg:p-10">
      <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
        <div>
          <span className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
            CodeSage AI
          </span>
          <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            AI code reviews that are fast to read and easy to act on.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            CodeSage helps developers paste a snippet, choose a language and
            skill level, and instantly get structured feedback with issues,
            improvements, optimized code, and a clear explanation.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/review"
              className="inline-flex cursor-pointer items-center justify-center rounded-2xl bg-slate-950 px-7 py-4 text-base font-semibold text-white shadow-[0_20px_40px_-18px_rgba(15,23,42,0.78)] transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-[0_26px_48px_-20px_rgba(15,23,42,0.78)]"
            >
              Start Reviewing Code
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {HOME_STATS.map((stat) => (
              <div
                key={stat.title}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  {stat.title}
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[30px] border border-slate-200 bg-slate-950 p-5 text-slate-100 shadow-[0_30px_70px_-35px_rgba(15,23,42,0.9)]">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-400" />
              <span className="h-3 w-3 rounded-full bg-amber-400" />
              <span className="h-3 w-3 rounded-full bg-emerald-400" />
            </div>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-sky-200">
              Product Intro
            </span>
          </div>

          <div className="mt-5 rounded-2xl bg-slate-900 p-5 ring-1 ring-white/10">
            <p className="text-xs uppercase tracking-[0.22em] text-sky-300">
              Why It Helps
            </p>
            <div className="mt-4 space-y-3 text-sm leading-6 text-slate-200">
              <p>Find bugs, bad practices, and weak spots in a code snippet.</p>
              <p>See improved code without digging through a long response.</p>
              <p>
                Get explanations that match the developer&apos;s experience
                level.
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-emerald-300">
              Built For Clarity
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              The review workspace is designed to keep summary, issues,
              improvements, optimized code, and explanation in one clean flow.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
