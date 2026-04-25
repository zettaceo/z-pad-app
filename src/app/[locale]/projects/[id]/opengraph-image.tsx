import { ImageResponse } from 'next/og';
import { PROJECTS } from '@/lib/mock-data';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

interface Props {
  params: Promise<{ id: string; locale: string }>;
}

export default async function ProjectOgImage({ params }: Props) {
  const { id } = await params;
  const p = PROJECTS.find(x => x.id === id);

  if (!p) {
    return new ImageResponse(
      <div style={{ width: 1200, height: 630, background: '#020b1e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: '#fff', fontSize: 40 }}>Project not found</span>
      </div>,
      { ...size }
    );
  }

  const progress = p.target > 0 ? Math.min(100, (p.raised / p.target) * 100) : 0;
  const scoreColor = p.aiScore >= 90 ? '#00e676' : p.aiScore >= 75 ? '#00d4ff' : p.aiScore >= 60 ? '#ffd700' : '#ff5252';
  const statusColor = p.status === 'live' ? '#00e676' : p.status === 'upcoming' ? '#ffd700' : '#888';
  const statusLabel = p.status === 'live' ? '● LIVE' : p.status === 'upcoming' ? '◆ UPCOMING' : '✗ ENDED';

  const fmt = (n: number) => {
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
    return `$${n}`;
  };

  return new ImageResponse(
    (
      <div style={{
        width: 1200, height: 630,
        background: 'linear-gradient(150deg, #020b1e 0%, #030e26 60%, #040d24 100%)',
        display: 'flex', fontFamily: 'system-ui, sans-serif',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }} />

        {/* Glow orb top-right */}
        <div style={{
          position: 'absolute', top: -200, right: -100, width: 700, height: 700,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${scoreColor}22 0%, transparent 65%)`,
        }} />
        <div style={{
          position: 'absolute', bottom: -150, left: -80, width: 500, height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 65%)',
        }} />

        {/* Main layout: two columns */}
        <div style={{ display: 'flex', flex: 1, padding: '56px 72px', gap: 60, zIndex: 1 }}>

          {/* LEFT */}
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
            {/* Top: Status + Chain */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{
                color: statusColor, fontSize: 15, fontWeight: 800, letterSpacing: 2,
                background: `${statusColor}18`, border: `1px solid ${statusColor}40`,
                borderRadius: 100, paddingLeft: 14, paddingRight: 14, paddingTop: 6, paddingBottom: 6,
              }}>
                {statusLabel}
              </span>
              <span style={{
                color: 'rgba(255,255,255,0.5)', fontSize: 14, fontWeight: 600, letterSpacing: 1.5,
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 100, paddingLeft: 12, paddingRight: 12, paddingTop: 5, paddingBottom: 5,
              }}>
                {p.chainName.toUpperCase()}
              </span>
              <span style={{
                color: 'rgba(255,255,255,0.4)', fontSize: 14, fontWeight: 600, letterSpacing: 1.5,
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 100, paddingLeft: 12, paddingRight: 12, paddingTop: 5, paddingBottom: 5,
              }}>
                {p.saleType.toUpperCase()}
              </span>
            </div>

            {/* Middle: Name + Symbol + Desc */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 16 }}>
                <span style={{
                  fontSize: 68, fontWeight: 900, color: '#ffffff',
                  lineHeight: 1, letterSpacing: -3,
                }}>
                  {p.name}
                </span>
                <span style={{
                  fontSize: 28, fontWeight: 700, color: 'rgba(0,212,255,0.7)',
                  letterSpacing: -1, fontFamily: 'monospace',
                }}>
                  ${p.symbol}
                </span>
              </div>
              <p style={{
                fontSize: 20, color: 'rgba(255,255,255,0.55)',
                lineHeight: 1.55, margin: 0, maxWidth: 520,
              }}>
                {p.description.length > 120 ? p.description.slice(0, 120) + '…' : p.description}
              </p>
            </div>

            {/* Bottom: stats + progress */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Progress bar */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13 }}>Sale Progress</span>
                  <span style={{ color: '#00d4ff', fontSize: 13, fontWeight: 700 }}>{progress.toFixed(0)}%</span>
                </div>
                <div style={{ height: 8, background: 'rgba(255,255,255,0.07)', borderRadius: 100, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #00d4ff, #0080ff)', borderRadius: 100 }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>Raised {fmt(p.raised)}</span>
                  <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>Target {fmt(p.target)}</span>
                </div>
              </div>

              {/* Key stats */}
              <div style={{ display: 'flex', gap: 20 }}>
                {[
                  { v: fmt(p.raised), l: 'Raised' },
                  { v: String(p.participants.toLocaleString()), l: 'Participants' },
                  { v: `${p.liquidity}%`, l: 'Liquidity' },
                ].map(({ v, l }) => (
                  <div key={l} style={{
                    display: 'flex', flexDirection: 'column',
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 10, paddingLeft: 16, paddingRight: 16, paddingTop: 10, paddingBottom: 10,
                    flex: 1,
                  }}>
                    <span style={{ color: '#00d4ff', fontSize: 22, fontWeight: 900, letterSpacing: -1 }}>{v}</span>
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 2 }}>{l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — AI Score panel */}
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', width: 240, gap: 20,
          }}>
            {/* Score ring */}
            <div style={{
              width: 180, height: 180, borderRadius: '50%',
              border: `4px solid ${scoreColor}40`,
              background: `radial-gradient(circle, ${scoreColor}12 0%, rgba(2,11,30,0.9) 60%)`,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 0 60px ${scoreColor}35, 0 0 100px ${scoreColor}15`,
            }}>
              <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontWeight: 700, letterSpacing: 2, marginBottom: 4 }}>
                ZION AI
              </span>
              <span style={{ fontSize: 64, fontWeight: 900, color: scoreColor, lineHeight: 1, letterSpacing: -3 }}>
                {p.aiScore}
              </span>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', fontWeight: 600 }}>
                /100
              </span>
            </div>

            {/* Verification badges */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
              {[
                p.kyc ? { l: 'KYC Verified', c: '#00e676' } : null,
                p.audited ? { l: `Audited · ${p.audited}`, c: '#00d4ff' } : null,
                p.refundable ? { l: 'DYCO Refundable', c: '#c084fc' } : null,
              ].filter(Boolean).map((item) => item && (
                <div key={item.l} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: `${item.c}12`, border: `1px solid ${item.c}30`,
                  borderRadius: 8, paddingLeft: 12, paddingRight: 12, paddingTop: 7, paddingBottom: 7,
                }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: item.c, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: item.c, fontWeight: 600 }}>{item.l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 52,
          background: 'linear-gradient(90deg, rgba(0,212,255,0.07), rgba(124,58,237,0.05))',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          display: 'flex', alignItems: 'center',
          paddingLeft: 72, paddingRight: 72, justifyContent: 'space-between',
        }}>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15, fontWeight: 700, letterSpacing: 2 }}>
            Z-PAD · AI-VETTED LAUNCHPAD
          </span>
          <span style={{ color: 'rgba(0,212,255,0.6)', fontSize: 14, fontWeight: 600 }}>
            zpad.io/projects/{id}
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
