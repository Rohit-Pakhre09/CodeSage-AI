const APP_NAME = "CodeSage AI";
const APP_DESCRIPTION =
  "Paste code. Get clarity. Structured AI code reviews with optimized code and explanations tailored from beginner to advanced.";

function normalizeUrl(url: string) {
  return url.startsWith("http://") || url.startsWith("https://")
    ? url
    : `https://${url}`;
}

export function getSiteUrl() {
  const configuredUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    process.env.VERCEL_URL ||
    "https://codesage-ai-review.vercel.app";

  return new URL(normalizeUrl(configuredUrl));
}

export const siteConfig = {
  name: APP_NAME,
  description: APP_DESCRIPTION,
  url: getSiteUrl(),
  ogImage: "/opengraph-image",
} as const;
