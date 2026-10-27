import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  headers() {
    const headers = [
      { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "no-referrer" },
    ];
    return ["/register", "/ticket"].map((source) => ({ source, headers }));
  },
};

export default nextConfig;
