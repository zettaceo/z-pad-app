'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Clock, CheckCircle, Lock, Unlock, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/cn';
import type { Position } from '@/types';

interface Props {
  positions: Position[];
}

function formatDate(ms: number) {
  return new Date(ms).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTimeLeft(ms: number) {
  const diff = ms - Date.now();
  if (diff <= 0) return 'Vesting complete';
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  if (d > 0) return `${d}d ${h}h remaining`;
  return `${h}h remaining`;
}

export function VestingSchedule({ positions }: Props) {
  const withVesting = useMemo(
    () => positions.filter(p => p.vestingEnds !== null),
    [positions]
  );

  if (withVesting.length === 0) return null;

  const handleClaim = (symbol: string, amount: number) => {
    toast.success(`Claimed ${amount.toLocaleString()} ${symbol}!`, {
      description: 'Tokens sent to your wallet.',
    });
  };

  return (
    <div className="bg-bg-075 border border-white/10 rounded-[14px] p-6 mb-5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center">
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <span className="font-[family-name:var(--font-display)] text-[1.1rem] font-bold">Vesting Schedule</span>
        </div>
        <span className="text-[0.78rem] text-white/40 font-[family-name:var(--font-mono)]">
          {withVesting.filter(p => p.claimable > 0).length} claimable
        </span>
      </div>

      <div className="space-y-4">
        {withVesting.map((pos) => {
          const isComplete = pos.vestingEnds !== null && pos.vestingEnds <= Date.now();
          const hasClaim = pos.claimable > 0;
          const progressPct = pos.vestingEnds
            ? isComplete
              ? 100
              : Math.max(0, Math.min(99, (1 - (pos.vestingEnds - Date.now()) / (90 * 86400000)) * 100))
            : 100;

          // Mock unlock milestones based on typical TGE 25% + linear
          const milestones = [
            { label: 'TGE (25%)', pct: 25, done: true },
            { label: '1 month', pct: 50, done: progressPct >= 50 },
            { label: '2 months', pct: 75, done: progressPct >= 75 },
            { label: 'Full vest', pct: 100, done: isComplete },
          ];

          return (
            <div key={pos.id} className="rounded-[12px] border border-white/8 bg-white/[0.015] p-4">
              {/* Header row */}
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2.5">
                  <Link href={`/projects/${pos.id}`}>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center font-bold text-[#021628] text-[0.78rem] hover:scale-110 transition-transform">
                      {pos.symbol[0]}
                    </div>
                  </Link>
                  <div>
                    <div className="font-semibold text-[0.9rem]">{pos.name}</div>
                    <div className="text-[0.72rem] text-white/40 font-[family-name:var(--font-mono)]">{pos.symbol}</div>
                  </div>
                </div>
                {isComplete ? (
                  <span className="flex items-center gap-1.5 text-[0.74rem] font-semibold text-green-400 bg-green-400/10 px-2.5 py-1 rounded-full border border-green-400/20">
                    <CheckCircle className="w-3 h-3" /> Complete
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-[0.74rem] text-white/50 font-[family-name:var(--font-mono)]">
                    <Lock className="w-3 h-3" />
                    {pos.vestingEnds ? formatTimeLeft(pos.vestingEnds) : '—'}
                  </span>
                )}
              </div>

              {/* Progress track */}
              <div className="relative mb-3">
                {/* Track */}
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-700"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                {/* Milestone dots */}
                <div className="absolute inset-0 flex items-center">
                  {milestones.map((m) => (
                    <div
                      key={m.label}
                      className="absolute -translate-x-1/2 -translate-y-[1px]"
                      style={{ left: `${m.pct}%` }}
                    >
                      <div className={cn(
                        'w-3 h-3 rounded-full border-2 transition-all',
                        m.done
                          ? 'bg-cyan-400 border-cyan-500 shadow-[0_0_6px_rgba(0,212,255,0.6)]'
                          : 'bg-[#0d1636] border-white/20'
                      )} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Milestone labels (small) */}
              <div className="relative h-4 mb-3">
                {milestones.map((m) => (
                  <div
                    key={m.label}
                    className="absolute text-[0.6rem] text-white/30 -translate-x-1/2 whitespace-nowrap"
                    style={{ left: `${m.pct}%` }}
                  >
                    {m.label}
                  </div>
                ))}
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="text-center">
                  <div className="text-[0.68rem] text-white/40 uppercase tracking-wider mb-0.5">Claimable</div>
                  <div className={cn(
                    'font-[family-name:var(--font-mono)] font-bold text-[0.86rem]',
                    hasClaim ? 'text-cyan-300' : 'text-white/30'
                  )}>
                    {hasClaim ? pos.claimable.toLocaleString() : '—'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-[0.68rem] text-white/40 uppercase tracking-wider mb-0.5">Progress</div>
                  <div className="font-[family-name:var(--font-mono)] font-bold text-[0.86rem]">
                    {Math.round(progressPct)}%
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-[0.68rem] text-white/40 uppercase tracking-wider mb-0.5">Vests by</div>
                  <div className="font-[family-name:var(--font-mono)] text-[0.75rem] text-white/50">
                    {pos.vestingEnds ? (isComplete ? 'Completed' : formatDate(pos.vestingEnds)) : '—'}
                  </div>
                </div>
              </div>

              {/* Claim button */}
              {hasClaim && (
                <button
                  type="button"
                  onClick={() => handleClaim(pos.symbol, pos.claimable)}
                  className="w-full py-2 rounded-[8px] bg-gradient-to-r from-cyan-500/15 to-blue-500/10 border border-cyan-500/30 text-cyan-400 text-[0.84rem] font-semibold hover:from-cyan-500/25 hover:to-blue-500/20 hover:border-cyan-500/50 transition-all flex items-center justify-center gap-2"
                >
                  <Zap className="w-3.5 h-3.5" />
                  Claim {pos.claimable.toLocaleString()} {pos.symbol}
                  <Unlock className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
