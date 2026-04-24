import { NextRequest, NextResponse } from 'next/server';

/**
 * CSP Violation Reporting Endpoint
 *
 * Browsers POST to this endpoint when a Content-Security-Policy directive
 * is violated. In production, forward these to a SIEM or log aggregator
 * (Datadog, Sentry, etc.) for security monitoring.
 *
 * Spec: https://www.w3.org/TR/CSP3/#reporting
 */

export const runtime = 'edge';

const MAX_PAYLOAD_BYTES = 10_240; // 10 KB — prevents log flooding / DoS

export async function POST(request: NextRequest) {
  try {
    const contentLength = Number(request.headers.get('content-length') ?? 0);
    if (contentLength > MAX_PAYLOAD_BYTES) {
      return NextResponse.json({ error: 'Payload too large' }, { status: 413 });
    }

    const raw = await request.text();
    if (raw.length > MAX_PAYLOAD_BYTES) {
      return NextResponse.json({ error: 'Payload too large' }, { status: 413 });
    }
    const report = JSON.parse(raw) as unknown;
    const requestId = request.headers.get('x-request-id') ?? 'unknown';

    // In development, log to console for debugging
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[CSP Violation]', { requestId, report });
    }

    // Production: forward to SIEM (placeholder)
    // await fetch(process.env.SIEM_ENDPOINT!, { method: 'POST', body: JSON.stringify({ requestId, report, timestamp: Date.now() }) });

    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: 'Invalid report payload' }, { status: 400 });
  }
}

// Reject all other methods
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
