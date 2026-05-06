import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ── Tell Next.js these packages ONLY run on the server ──────────────────────
  // firebase-admin uses Node.js built-ins (fs, path, grpc) that don't exist
  // in the browser. This prevents Next.js from trying to bundle them client-side.
  serverExternalPackages: [
    "firebase-admin",
    "@firebase/app",
    "google-auth-library",
  ],

  images: {
    localPatterns: [{ pathname: "/**" }],
    remotePatterns: [
      { protocol: "https", hostname: "i.pravatar.cc" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdnsnty.tonyrobbins.com" },
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "*.firebasestorage.app" },
      { protocol: "https", hostname: "firebasestorage.app" },
    ],
  },

  // ── Webpack: stub out Node.js-only modules in browser bundle ────────────────
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false,
        path: false,
        os: false,
        crypto: false,
        stream: false,
        http: false,
        https: false,
        zlib: false,
      };
    }
    return config;
  },
};

export default nextConfig;
