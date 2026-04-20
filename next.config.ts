import type { NextConfig } from 'next';

/**
 * Z-PAD — Next.js configuration
 *
 * Security posture: enterprise-grade.
 * CSP is enforced via middleware (nonce-based) for dynamic routes.
 * All other headers are set here for static/edge delivery.
 */
const nextConfig: NextConfig = {
  // React strict mode for catching bugs early
  reactStrictMode: true,

  // Hide Next.js version from response headers (information disclosure)
  poweredByHeader: false,

  // Strict TypeScript — no escape hatches in production
  typescript: {
    ignoreBuildErrors: false,
  },

  eslint: {
    ignoreDuringBuilds: false,
  },

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'bscscan.com' },
      { protocol: 'https', hostname: 'zettaword.com' },
    ],
    minimumCacheTTL: 3600,
  },

  // Enable compression
  compress: true,

  // Progressive enhancement
  experimental: {
    // React 19 + Server Components
    reactCompiler: false,
    // Better package imports for tree-shaking
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Prevent MIME type sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Clickjacking protection
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // Referrer privacy
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Disable dangerous browser features by default
          {
            key: 'Permissions-Policy',
            value: [
              'camera=()',
              'microphone=()',
              'geolocation=()',
              'interest-cohort=()',
              'payment=(self)',
              'usb=()',
              'magnetometer=()',
              'accelerometer=()',
              'gyroscope=()',
            ].join(', '),
          },
          // HSTS — force HTTPS for 2 years, subdomains + preload list
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          // Cross-Origin isolation
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'same-origin',
          },
          // DNS prefetch control
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          // Legacy XSS protection (modern browsers ignore, older respect)
          {
            key: 'X-XSS-Protection',
            value: '0',
          },
        ],
      },
      {
        // Cache immutable assets aggressively
        source: '/assets/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Security-sensitive files
        source: '/(.well-known|security.txt|robots.txt|sitemap.xml)(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600',
          },
          {
            key: 'X-Robots-Tag',
            value: 'all',
          },
        ],
      },
    ];
  },

  // Redirects for SEO / security
  async redirects() {
    return [
      // Always redirect www → apex (or inverse — adjust when domain is live)
      // { source: '/:path*', has: [{ type: 'host', value: 'www.zpad.io' }], destination: 'https://zpad.io/:path*', permanent: true },
    ];
  },
};

export default nextConfig;
