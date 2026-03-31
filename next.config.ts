import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lastfm.freetls.fastly.net",
        pathname: "/i/u/**",
      },
      {
        protocol: "https",
        hostname: "*.lastfm.freetls.fastly.net",
      },
      {
        protocol: "https",
        hostname: "coverartarchive.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.dzcdn.net",
      },
      {
        protocol: "https",
        hostname: "e-cdns-images.dzcdn.net",
      },
    ],
  },
};

export default nextConfig;
