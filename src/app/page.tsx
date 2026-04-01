import HomeFeatureGrid from "@/components/home/HomeFeatureGrid";
import HomeHero from "@/components/home/HomeHero";

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.12),transparent_26%),linear-gradient(to_bottom,#f8fafc,#e0f2fe)] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <HomeHero />
        <HomeFeatureGrid />
      </div>
    </main>
  );
}
