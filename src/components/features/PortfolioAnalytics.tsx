'use client';

import { useTranslations } from 'next-intl';
import { fmt } from '@/lib/format';
import { type Position } from '@/types';
import { cn } from '@/lib/cn';

const COLORS = ['#00d4ff', '#3b82f6', '#f59e0b', '#8b5cf6', '#22c55e', '#ef4444'];

function DonutChart({ slices }: { slices: { pct: number; color: string }[] }) {
  const R = 40;
  const circumference = 2 * Math.PI * R;
  let offset = 0;

  return (
    <svg viewBox="0 0 100 100" className="w-full max-w-[120px]">
      <circle cx="50" cy="50" r={R} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="14" />
      {slices.map((s, i) => {
        const dash = (s.pct / 100) * circumference;
        const gap = circumference - dash;
        const el = (
          <circle
            key={i}
            cx="50"
            cy="50"
            r={R}
            fill="none"
            stroke={s.color}
            strokeWidth="14"
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-offset}
            transform="rotate(-90 50 50)"
          />
        );
        offset += dash;
        return el;
      })}
    </svg>
  );
}

interface Props {
  positions: Position[];
}

export function PortfolioAnalytics({ positions }: Props) {
  const t = useTranslations('dashboard');

  const totalValue = positions.reduce((s, p) => s + p.value, 0);
  const totalInvested = positions.reduce((s, p) => s + p.invested, 0);
  const realized = totalValue * 0.31;
  const unrealized = totalValue - totalInvested;

  const slices = positions.map((p, i) => ({
    name: p.symbol,
    value: p.value,
    pct: Math.round((p.value / totalValue) * 100),
    color: COLORS[i % COLORS.length] as string,
  }));

  const best = [...positions].sort((a, b) => b.change - a.change)[0];
  const worst = [...positions].sort((a, b) => a.change - b.change)[0];

  return (
    <div className="grid sm:grid-cols-2 gap-5 mb-6">
      {/* Allocation donut */}
      <div className="bg-bg-075 border border-white/10 rounded-[14px] p-5">
        <div className="text-[0.76rem] text-white/50 uppercase tracking-wider font-semibold mb-4">{t('allocationTitle')}</div>
        <div className="flex items-center gap-5">
          <div className="shrink-0 w-[100px]">
            <DonutChart slices={slices} />
          </div>
          <div className="flex-1 space-y-2">
            {slices.map(s => (
              <div key={s.name} className="flex items-center gap-2 text-[0.82rem]">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: s.color }} />
                <span className="flex-1 text-white/70">{s.name}</span>
                <span className="font-[family-name:var(--font-mono)] font-semibold">{s.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PnL overview */}
      <div className="bg-bg-075 border border-white/10 rounded-[14px] p-5">
        <div className="text-[0.76rem] text-white/50 uppercase tracking-wider font-semibold mb-4">{t('pnlTitle')}</div>
        <div className="space-y-3">
          {[
            { label: t('pnlRealized'),   value: `+${fmt.currency(realized, { decimals: 2 })}`,    color: 'text-green-400' },
            { label: t('pnlUnrealized'), value: `${unrealized >= 0 ? '+' : ''}${fmt.currency(unrealized, { decimals: 2 })}`, color: unrealized >= 0 ? 'text-cyan-400' : 'text-red-400' },
          ].map(({ label, value, color }) => (
            <div key={label} className="flex justify-between items-center p-3 rounded-[8px] bg-white/[0.02] border border-white/5">
              <span className="text-white/50 text-[0.84rem]">{label}</span>
              <span className={cn('font-[family-name:var(--font-mono)] font-bold text-[0.9rem]', color)}>{value}</span>
            </div>
          ))}
          <div className="pt-1 border-t border-white/8 grid grid-cols-2 gap-3">
            <div>
              <div className="text-[0.68rem] text-white/35 uppercase tracking-wider mb-1">{t('pnlBestPosition')}</div>
              <div className="font-semibold text-[0.85rem]">{best?.symbol}</div>
              <div className="font-[family-name:var(--font-mono)] text-green-400 text-[0.78rem]">+{best?.change.toFixed(1)}%</div>
            </div>
            <div>
              <div className="text-[0.68rem] text-white/35 uppercase tracking-wider mb-1">{t('pnlWorstPosition')}</div>
              <div className="font-semibold text-[0.85rem]">{worst?.symbol}</div>
              <div className="font-[family-name:var(--font-mono)] text-red-400 text-[0.78rem]">{worst?.change.toFixed(1)}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Participation stats — full width */}
      <div className="sm:col-span-2 bg-bg-075 border border-white/10 rounded-[14px] p-5">
        <div className="text-[0.76rem] text-white/50 uppercase tracking-wider font-semibold mb-4">{t('participationsTitle')}</div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: t('participationsSales'),   value: '14' },
            { label: t('participationsWinRate'),  value: '71%' },
            { label: t('participationsAvgReturn'),value: '+124%' },
          ].map(({ label, value }) => (
            <div key={label} className="text-center p-3 rounded-[10px] bg-white/[0.02] border border-white/5">
              <div className="font-[family-name:var(--font-display)] text-[1.5rem] font-extrabold tracking-[-0.025em] text-cyan-400 leading-tight">{value}</div>
              <div className="text-[0.7rem] text-white/40 uppercase tracking-wider mt-1">{label}</div>
            </div>
          ))}
        </div>
        {/* Mini bar chart of monthly participation */}
        <div className="mt-4 flex items-end gap-1.5 h-12">
          {[2, 1, 3, 2, 4, 3, 5, 3, 4, 2, 3, 4].map((v, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm bg-gradient-to-t from-cyan-500/60 to-cyan-500/20 transition-all hover:from-cyan-500 hover:to-cyan-400"
              style={{ height: `${(v / 5) * 100}%` }}
              title={`Month ${i + 1}: ${v} sales`}
            />
          ))}
        </div>
        <div className="flex justify-between text-[0.62rem] text-white/25 mt-1">
          {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map(m => (
            <span key={m}>{m}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
