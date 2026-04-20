import { NextRequest, NextResponse } from 'next/server';

/**
 * Z-PAD — Edge Middleware
 *
 * Responsibilities:
 *  1. Generate a per-request CSP nonce (strict CSP without 'unsafe-inline')
 *  2. Set Content-Security-Policy header (nonce-based + strict-dynamic)
 *  3. Apply basic in-memory rate limiting for API routes (per IP)
 *  4. Attach X-Request-Id for audit tracing
 *
 * Runs on the Edge Runtime for sub-10ms overhead globally.
 */

// --- In-memory rate limiter (per Edge instance) ---
// IMPORTANT: Edge instances are short-lived and cold-start, so this store
// is best-effort only. For real multi-instance rate limiting, replace with
// Upstash Redis via @upstash/ratelimit. No top-level setInterval is used
// because Edge runtime disposes isolates aggressively — stale entries age
// out naturally on access.
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60_000; // 1 min
const RATE_LIMIT_MAX = 100; // 100 req/min per IP

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();

  // Opportunistic cleanup: bound the store size
  if (rateLimitStore.size > 10_000) {
    for (const [k, v] of rateLimitStore) {
      if (now > v.resetAt) rateLimitStore.delete(k);
      if (rateLimitStore.size <= 5_000) break;
    }
  }

  const record = rateLimitStore.get(ip);
  if (!record || now > record.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 };
  }
  if (record.count >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0 };
  }
  record.count += 1;
  return { allowed: true, remaining: RATE_LIMIT_MAX - record.count };
}

function extractIp(req: NextRequest): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) {
    const first = xff.split(',')[0];
    if (first) return first.trim();
  }
  return req.headers.get('x-real-ip') ?? 'unknown';
}

function generateNonce(): string {
  // 128-bit nonce, base64-encoded (22 chars after stripping padding)
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]!);
  return btoa(bin);
}

export function middleware(request: NextRequest) {
  const nonce = generateNonce();
  const requestId = crypto.randomUUID();
  const isDev = process.env.NODE_ENV !== 'production';

  // --- Content-Security-Policy (strict, nonce-based) ---
  // - `script-src`: strict-dynamic lets the nonce'd bootstrap load its children
  //   without needing to individually allowlist Vercel script origins.
  // - `style-src`: 'unsafe-inline' is unavoidable for React/Tailwind inline styles;
  //   this is the accepted industry compromise for App Router apps. No way to avoid
  //   it without breaking Next.js hydration.
  // - In development we also allow `'unsafe-eval'` for React DevTools/Turbopack HMR.
  const scriptSrc = isDev
    ? `'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-eval'`
    : `'self' 'nonce-${nonce}' 'strict-dynamic'`;

  const csp = [
    `default-src 'self'`,
    `script-src ${scriptSrc}`,
    `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
    `img-src 'self' data: blob: https:`,
    `font-src 'self' data: https://fonts.gstatic.com`,
    `connect-src 'self' https://vitals.vercel-insights.com https://va.vercel-scripts.com https://*.vercel-insights.com`,
    `media-src 'self'`,
    `object-src 'none'`,
    `frame-src 'none'`,
    `frame-ancestors 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `manifest-src 'self'`,
    `worker-src 'self' blob:`,
    `report-uri /api/csp-report`,
    `report-to csp-endpoint`,
    ...(isDev ? [] : [`upgrade-insecure-requests`]),
  ].join('; ');

  // --- Rate limiting for /api/* ---
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const ip = extractIp(request);
    const { allowed, remaining } = checkRateLimit(ip);
    if (!allowed) {
      return new NextResponse(
        JSON.stringify({ error: 'Rate limit exceeded', requestId }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': String(RATE_LIMIT_MAX),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(Math.ceil((Date.now() + RATE_LIMIT_WINDOW) / 1000)),
            'Retry-After': '60',
            'X-Request-Id': requestId,
          },
        }
      );
    }
    const apiResp = NextResponse.next();
    apiResp.headers.set('X-RateLimit-Limit', String(RATE_LIMIT_MAX));
    apiResp.headers.set('X-RateLimit-Remaining', String(remaining));
    apiResp.headers.set('X-Request-Id', requestId);
    return apiResp;
  }

  // --- Pass nonce to React via request header ---
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('x-request-id', requestId);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  response.headers.set('Content-Security-Policy', csp);
  response.headers.set(
    'Report-To',
    JSON.stringify({
      group: 'csp-endpoint',
      max_age: 10886400,
      endpoints: [{ url: '/api/csp-report' }],
    })
  );
  response.headers.set('X-Request-Id', requestId);

  return response;
}

export const config = {
  // Run on all routes except static assets, images, and optimizer
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|assets/|.*\\.(?:png|jpg|jpeg|gif|webp|avif|svg|ico|woff|woff2|ttf|otf)$).*)',
  ],
};
