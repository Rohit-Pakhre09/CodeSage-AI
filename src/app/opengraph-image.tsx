import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/metadata";

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        height: "100%",
        width: "100%",
        background:
          "radial-gradient(circle at top left, rgba(14,165,233,0.28), transparent 34%), radial-gradient(circle at bottom right, rgba(249,115,22,0.20), transparent 32%), linear-gradient(135deg, #020617 0%, #0f172a 48%, #082f49 100%)",
        color: "#e2e8f0",
        fontFamily: "sans-serif",
        padding: "56px",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "100%",
          border: "1px solid rgba(148, 163, 184, 0.22)",
          borderRadius: "32px",
          background: "rgba(15, 23, 42, 0.72)",
          boxShadow: "0 30px 80px rgba(2, 6, 23, 0.35)",
          padding: "48px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "22px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                fontSize: "28px",
                fontWeight: 700,
                color: "#67e8f9",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "62px",
                  height: "62px",
                  borderRadius: "18px",
                  background:
                    "linear-gradient(135deg, #22d3ee 0%, #0ea5e9 100%)",
                  color: "#082f49",
                  fontSize: "34px",
                  fontWeight: 900,
                }}
              >
                {"</>"}
              </div>
              <span>{siteConfig.name}</span>
            </div>

            <div
              style={{
                display: "flex",
                fontSize: "68px",
                lineHeight: 1.05,
                fontWeight: 800,
                letterSpacing: "-0.04em",
                color: "#f8fafc",
                maxWidth: "820px",
              }}
            >
              AI-powered code reviews that stay readable
            </div>

            <div
              style={{
                display: "flex",
                fontSize: "30px",
                lineHeight: 1.4,
                color: "#cbd5e1",
                maxWidth: "860px",
              }}
            >
              Paste code, get structured issues, improvements, optimized code,
              and explanations matched to your level.
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "16px",
              fontSize: "24px",
              color: "#bae6fd",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                borderRadius: "999px",
                background: "rgba(14, 165, 233, 0.16)",
                padding: "12px 20px",
              }}
            >
              Structured feedback
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                borderRadius: "999px",
                background: "rgba(16, 185, 129, 0.16)",
                padding: "12px 20px",
                color: "#bbf7d0",
              }}
            >
              Beginner to advanced
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                borderRadius: "999px",
                background: "rgba(249, 115, 22, 0.16)",
                padding: "12px 20px",
                color: "#fdba74",
              }}
            >
              Vercel-ready preview
            </div>
          </div>
        </div>
      </div>
    </div>,
    size,
  );
}
