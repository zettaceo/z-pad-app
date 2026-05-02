import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Z-PAD — The Only Launchpad You\'ll Ever Need';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: 'linear-gradient(135deg, #020b1e 0%, #040d28 50%, #050f32 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Grid pattern */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(0,212,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.04) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        {/* Glow orbs */}
        <div style={{
          position: 'absolute', top: -120, right: 80,
          width: 600, height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,212,255,0.18) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: -100, left: 120,
          width: 400, height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)',
        }} />

        {/* Left content */}
        <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: 90, paddingRight: 80, flex: 1, justifyContent: 'center', zIndex: 1 }}>

          {/* Badge */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'rgba(0,212,255,0.1)',
            border: '1px solid rgba(0,212,255,0.3)',
            borderRadius: 100, paddingLeft: 18, paddingRight: 18, paddingTop: 8, paddingBottom: 8,
            width: 'fit-content', marginBottom: 32,
          }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00e5ff', boxShadow: '0 0 8px #00e5ff' }} />
            <span style={{ color: '#00d4ff', fontSize: 16, fontWeight: 700, letterSpacing: 2 }}>
              LIVE ON 7 CHAINS · AI VERIFIED
            </span>
          </div>

          {/* Main title */}
          <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 24 }}>
            <span style={{
              fontSize: 80, fontWeight: 900, color: '#ffffff',
              lineHeight: 1, letterSpacing: -3, marginBottom: 4,
            }}>
              The Only
            </span>
            <span style={{
              fontSize: 80, fontWeight: 900, lineHeight: 1, letterSpacing: -3,
              background: 'linear-gradient(135deg, #00d4ff, #0080ff)',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              marginBottom: 4,
            }}>
              Launchpad
            </span>
            <span style={{
              fontSize: 80, fontWeight: 900, color: '#ffffff',
              lineHeight: 1, letterSpacing: -3,
            }}>
              You&apos;ll Ever Need.
            </span>
          </div>

          {/* Description */}
          <p style={{
            fontSize: 22, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5,
            maxWidth: 560, marginBottom: 44,
          }}>
            AI-vetted. Permissionless. Multi-chain. Fiat rails. DYCO refunds. The launchpad every other platform wishes it was.
          </p>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 32 }}>
            {[
              { v: '$48.2M', l: 'Total Raised' },
              { v: '127', l: 'Projects Launched' },
              { v: '12.4×', l: 'Avg. ROI' },
              { v: '54K+', l: 'Participants' },
            ].map(({ v, l }) => (
              <div key={l} style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 28, fontWeight: 900, color: '#00d4ff', letterSpacing: -1 }}>{v}</span>
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — AI Score showcase */}
        <div style={{
          position: 'absolute', right: 80, top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
        }}>
          {/* Big AI score ring */}
          <div style={{
            width: 180, height: 180,
            borderRadius: '50%',
            border: '4px solid rgba(0,212,255,0.2)',
            background: 'linear-gradient(135deg, rgba(0,212,255,0.08), rgba(124,58,237,0.06))',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 60px rgba(0,212,255,0.25), 0 0 120px rgba(0,212,255,0.1)',
          }}>
            <span style={{ fontSize: 60, fontWeight: 900, color: '#00d4ff', letterSpacing: -3 }}>96</span>
            <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', letterSpacing: 2, fontWeight: 700 }}>AI SCORE</span>
          </div>

          {/* Mini feature cards */}
          {[
            { label: 'KYC Verified', color: '#00e676' },
            { label: 'Audited', color: '#00d4ff' },
            { label: 'DYCO Refundable', color: '#c084fc' },
          ].map(({ label, color }) => (
            <div key={label} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,0.04)',
              border: `1px solid ${color}33`,
              borderRadius: 8, paddingLeft: 14, paddingRight: 14,
              paddingTop: 8, paddingBottom: 8, width: 180,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0 }} />
              <span style={{ fontSize: 13, color, fontWeight: 600 }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: 60,
          background: 'linear-gradient(90deg, rgba(0,212,255,0.08), rgba(124,58,237,0.06), rgba(0,212,255,0.04))',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center',
          paddingLeft: 90, paddingRight: 80,
          justifyContent: 'space-between',
        }}>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16, fontWeight: 700, letterSpacing: 2 }}>
            Z-PAD · ZETTA ECOSYSTEM
          </span>
          <span style={{ color: 'rgba(0,212,255,0.7)', fontSize: 15, fontWeight: 600 }}>
            zpad.io
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
