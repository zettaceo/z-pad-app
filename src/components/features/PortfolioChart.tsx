'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/cn';

// Mock time-series data for 3 ranges
const RAW: Record<'7d' | '30d' | 'all', number[]> = {
  '7d':  [8200, 8450, 8100, 8700, 9100, 8950, 9340],
  '30d': [7200, 7400, 7100, 7800, 8200, 7900, 8500, 8100, 8700, 9100,
          8950, 9200, 8800, 9400, 9100, 9600, 9300, 9800, 9500, 10100,
          9800, 10300, 10100, 10500, 10200, 10800, 10500, 11000, 10700, 11200],
  'all': [4000, 4200, 3800, 5000, 5500, 5200, 6000, 5700, 6500, 7000,
          6500, 7200, 7800, 7400, 8000, 8500, 8200, 9000, 8700, 9400,
          9100, 9800, 9500, 10200, 9900, 10600, 10300, 11000, 10700, 11200,
          10900, 11500, 11200, 11800, 11500, 12000],
};

const X_LABELS_MAP: Record<'7d' | '30d' | 'all', string[]> = {

  '7d':  ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  '30d': ['W1', '', '', '', '', '', '', 'W2', '', '', '', '', '', '', 'W3', '', '', '', '', '', '', 'W4', '', '', '', '', '', '', '', ''],
  'all': ['Jan', '', '', 'Apr', '', '', 'Jul', '', '', 'Oct', '', '', 'Jan', '', '', 'Apr', '', '', 'Jul', '', '', 'Oct', '', '', 'Jan', '', '', 'Apr', '', '', 'Jul', '', '', 'Oct', '', ''],
};

function buildPath(points: number[], w: number, h: number, pad = 20): string {
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const xs = points.map((_, i) => pad + (i / (points.length - 1)) * (w - pad * 2));
  const ys = points.map(v => h - pad - ((v - min) / range) * (h - pad * 2));

  let d = `M ${xs[0] ?? 0} ${ys[0] ?? 0}`;
  for (let i = 1; i < xs.length; i++) {
    const cpx = ((xs[i - 1] ?? 0) + (xs[i] ?? 0)) / 2;
    d += ` C ${cpx} ${ys[i - 1] ?? 0}, ${cpx} ${ys[i] ?? 0}, ${xs[i] ?? 0} ${ys[i] ?? 0}`;
  }
  return d;
}

function buildArea(points: number[], w: number, h: number, pad = 20): string {
  const path = buildPath(points, w, h, pad);
  const xs = points.map((_, i) => pad + (i / (points.length - 1)) * (w - pad * 2));
  return `${path} L ${xs[xs.length - 1]} ${h - pad} L ${xs[0]} ${h - pad} Z`;
}

export function PortfolioChart() {
  const t = useTranslations('dashboard');
  const [range, setRange] = useState<'7d' | '30d' | 'all'>('30d');

  const points = RAW[range];
  const first = points[0] ?? 0;
  const last = points[points.length - 1] ?? 0;
  const change = first > 0 ? ((last - first) / first) * 100 : 0;
  const up = change >= 0;

  const W = 800;
  const H = 180;
  const pathD = useMemo(() => buildPath(points, W, H), [points]);
  const areaD = useMemo(() => buildArea(points, W, H), [points]);

  const xLabels = X_LABELS_MAP[range];

  return (
    <div className="bg-bg-075 border border-white/10 rounded-[14px] p-5 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div>
          <div className="text-[0.76rem] text-white/50 uppercase tracking-wider font-semibold mb-1">{t('chartTitle')}</div>
          <div className="flex items-baseline gap-2">
            <span className="font-[family-name:var(--font-display)] text-[1.8rem] font-extrabold tracking-[-0.025em]">
              ${last.toLocaleString()}
            </span>
            <span className={cn('font-[family-name:var(--font-mono)] text-[0.85rem] font-semibold', up ? 'text-green-400' : 'text-red-400')}>
              {up ? '↑' : '↓'} {Math.abs(change).toFixed(2)}%
            </span>
          </div>
        </div>
        <div className="flex gap-1 bg-white/[0.03] border border-white/8 rounded-[8px] p-1">
          {(['7d', '30d', 'all'] as const).map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={cn(
                'px-3 py-1 rounded-[6px] text-[0.78rem] font-bold transition-all',
                range === r ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30' : 'text-white/40 hover:text-white/70'
              )}
              type="button"
            >
              {r === '7d' ? t('chart7d') : r === '30d' ? t('chart30d') : t('chartAll')}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Chart */}
      <div className="relative overflow-hidden rounded-[8px]">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          style={{ height: 160 }}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={up ? '#00d4ff' : '#ef4444'} stopOpacity="0.18" />
              <stop offset="100%" stopColor={up ? '#00d4ff' : '#ef4444'} stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Grid lines */}
          {[0.25, 0.5, 0.75].map(t => (
            <line
              key={t}
              x1={20} y1={20 + t * (H - 40)}
              x2={W - 20} y2={20 + t * (H - 40)}
              stroke="rgba(255,255,255,0.04)"
              strokeWidth="1"
            />
          ))}
          {/* Area fill */}
          <path d={areaD} fill="url(#chartGrad)" />
          {/* Line */}
          <path d={pathD} fill="none" stroke={up ? '#00d4ff' : '#ef4444'} strokeWidth="2" />
          {/* Last point dot */}
          {(() => {
            const i = points.length - 1;
            const min = Math.min(...points), max = Math.max(...points), range2 = max - min || 1;
            const x = 20 + (i / (points.length - 1)) * (W - 40);
            const y = H - 20 - (((points[i] ?? 0) - min) / range2) * (H - 40);
            return (
              <g>
                <circle cx={x} cy={y} r="4" fill={up ? '#00d4ff' : '#ef4444'} />
                <circle cx={x} cy={y} r="8" fill={up ? '#00d4ff' : '#ef4444'} fillOpacity="0.2" />
              </g>
            );
          })()}
        </svg>

        {/* X-axis labels */}
        <div className="flex justify-between px-5 mt-1">
          {xLabels.filter((_, i) => i % Math.ceil(xLabels.length / 6) === 0 || i === xLabels.length - 1).slice(0, 7).map((l, i) => (
            <span key={i} className="text-[0.65rem] text-white/25">{l}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
