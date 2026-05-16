import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // COOP header improves process isolation and security
  // Note: COEP is intentionally omitted — it would block Sandpack's CDN resources
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
        ],
      },
    ];
  },
  // Silence the "multiple lockfiles" Turbopack workspace root warning
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
