import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [{ pathname: "/**" }],
    remotePatterns: [
      { protocol: "https", hostname: "i.pravatar.cc" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdnsnty.tonyrobbins.com" },
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
    ],
  },

  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "dineshkoyyalamudi.com",
          },
        ],
        destination: "https://46dc.com/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.dineshkoyyalamudi.com",
          },
        ],
        destination: "https://46dc.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;