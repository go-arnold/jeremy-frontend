import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ── Image Optimization ──
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: false,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year for immutable assets
  },

  // ── Headers for Caching ──
  async headers() {
    return [
      // Cache images for 1 year (immutable)
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Cache public assets for 1 week
      {
        source: '/:path((?!api).*)*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=604800, must-revalidate',
          },
        ],
        has: [
          {
            type: 'query',
            key: '__static',
          },
        ],
      },
      // API routes - no cache
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
        ],
      },
    ];
  },

  // ── Redirects & Rewrites ──
  async redirects() {
    return [];
  },

  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [],
    };
  },

  // ── Turbopack Configuration (Next.js 16) ──
  turbopack: {},

  // ── Logging ──
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;
