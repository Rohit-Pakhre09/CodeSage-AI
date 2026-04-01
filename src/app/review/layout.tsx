import type { Metadata } from "next";
import { siteConfig } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "Review Workspace",
  description:
    "Open the CodeSage AI review workspace to analyze code, inspect issues, and copy optimized output.",
  alternates: {
    canonical: "/review",
  },
  openGraph: {
    title: `Review Workspace | ${siteConfig.name}`,
    description:
      "Analyze code with structured issues, suggestions, optimized output, and level-based explanations.",
    url: "/review",
    images: [siteConfig.ogImage],
  },
  twitter: {
    title: `Review Workspace | ${siteConfig.name}`,
    description:
      "Analyze code with structured issues, suggestions, optimized output, and level-based explanations.",
    images: [siteConfig.ogImage],
  },
};

export default function ReviewLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
