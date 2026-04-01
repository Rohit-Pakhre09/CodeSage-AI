import { HOME_FEATURES } from "@/components/home/homeContent";

export default function HomeFeatureGrid() {
  return (
    <section className="grid gap-6 md:grid-cols-3">
      {HOME_FEATURES.map((feature) => (
        <article
          key={feature.title}
          className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-[0_24px_80px_-32px_rgba(15,23,42,0.25)] backdrop-blur transition duration-200 hover:-translate-y-1 hover:shadow-[0_28px_90px_-34px_rgba(15,23,42,0.3)]"
        >
          <p
            className={`text-xs font-medium uppercase tracking-[0.22em] ${feature.eyebrowClassName}`}
          >
            {feature.eyebrow}
          </p>
          <h2 className="mt-4 text-xl font-semibold text-slate-950">
            {feature.title}
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            {feature.description}
          </p>
        </article>
      ))}
    </section>
  );
}
