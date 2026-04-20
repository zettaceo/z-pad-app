import { NextResponse } from 'next/server';

/**
 * Health check endpoint for uptime monitoring and readiness probes.
 * Returns basic service status without leaking internal info.
 */

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(
    {
      status: 'ok',
      service: 'z-pad',
      version: process.env.NEXT_PUBLIC_APP_VERSION ?? '1.0.0',
      timestamp: new Date().toISOString(),
    },
    {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'X-Robots-Tag': 'noindex',
      },
    }
  );
}
