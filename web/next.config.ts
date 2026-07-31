import type { NextConfig } from "next";

const apiUrl = new URL(
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333"
);
const apiPathname = apiUrl.pathname.replace(/\/$/, "");

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== "production",
    remotePatterns: [
      {
        protocol: apiUrl.protocol.replace(":", "") as "http" | "https",
        hostname: apiUrl.hostname,
        port: apiUrl.port,
        pathname: `${apiPathname}/uploads/**`,
      },
    ],
  },
};

export default nextConfig;
