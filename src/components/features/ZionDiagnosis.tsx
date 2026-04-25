'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { AlertTriangle, CheckCircle, TrendingUp, Zap, Shield } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { Position } from '@/types';

interface RiskFactor {
  id: string;
  level: 'critical' | 'warning' | 'ok';
  title: string;
  detail: string;
  action?: string;
}

function analyzePortfolio(positions: Position[]): {
  score: number;
  label: string;
  color: string;
  summary: string;
  factors: RiskFactor[];
} {
  const factors: RiskFactor[] = [];
  const totalValue = positions.reduce((s, p) => s + p.value, 0);

  // Concentration risk
  const maxConc = Math.max(...positions.map(p => p.value / totalValue));
  if (maxConc > 0.55) {
    factors.push({
      id: 'conc', level: 'critical',
      title: 'High concentration risk',
      detail: `${Math.round(maxConc * 100)}% of portfolio in a single asset. A single bad exit can wipe out the majority of gains.`,
      action: 'Diversify across at least 5 projects.',
    });
  } else if (maxConc > 0.35) {
    factors.push({
      id: 'conc', level: 'warning',
      title: 'Moderate concentration',
      detail: `${Math.round(maxConc * 100)}% concentration in top holding. Consider adding 2-3 more positions.`,
    });
  } else {
    factors.push({ id: 'conc', level: 'ok', title: 'Good diversification', detail: 'No single asset dominates. Risk is spread well.' });
  }

  // Losing positions
  const losers = positions.filter(p => p.change < 0);
  if (losers.length >= 2) {
    factors.push({
      id: 'loss', level: 'warning',
      title: `${losers.length} positions underwater`,
      detail: `${losers.map(p => p.symbol).join(', ')} are negative. Consider DCA-ing or cutting losses on assets below your stop-loss.`,
      action: 'Review vesting schedules before exiting.',
    });
  }

  // Vesting cliff risk
  const cliffPositions = positions.filter(p => p.vestingEnds && p.vestingEnds > Date.now() && p.claimable === 0);
  if (cliffPositions.length > 0) {
    factors.push({
      id: 'cliff', level: 'warning',
      title: 'Vesting cliff upcoming',
      detail: `${cliffPositions.map(p => p.symbol).join(', ')} are fully locked. Sell pressure may spike at unlock.`,
      action: 'Plan exit strategy before TGE unlocks.',
    });
  }

  // Claimable tokens sitting idle
  const idleClaim = positions.filter(p => p.claimable > 0);
  if (idleClaim.length > 0) {
    factors.push({
      id: 'idle', level: 'warning',
      title: 'Unclaimed tokens sitting idle',
      detail: `${idleClaim.map(p => p.symbol).join(', ')} have tokens ready. Unclaimed tokens miss potential staking rewards.`,
      action: 'Claim and stake or LP immediately.',
    });
  }

  // Positive: profitable positions
  const winners = positions.filter(p => p.change >= 50);
  if (winners.length > 0) {
    factors.push({
      id: 'win', level: 'ok',
      title: `${winners.length} strong performer${winners.length > 1 ? 's' : ''}`,
      detail: `${winners.map(p => `${p.symbol} +${p.change}%`).join(', ')} — strong AI scores validated by market performance.`,
    });
  }

  // Compute score
  const criticals = factors.filter(f => f.level === 'critical').length;
  const warnings = factors.filter(f => f.level === 'warning').length;
  const score = Math.max(20, Math.min(98, 90 - criticals * 25 - warnings * 10));

  const label = score >= 85 ? 'Healthy' : score >= 70 ? 'Moderate Risk' : score >= 50 ? 'High Risk' : 'Critical';
  const color = score >= 85 ? '#00e676' : score >= 70 ? '#00d4ff' : score >= 50 ? '#ffd700' : '#ff5252';

  const summaries = {
    Healthy: 'Your portfolio shows strong fundamentals. Diversification is solid and your best performers are carrying gains.',
    'Moderate Risk': 'Some risks detected. Addressing concentration and unclaimed tokens would improve your position.',
    'High Risk': 'Multiple risk factors identified. Immediate action recommended to protect capital.',
    Critical: 'Critical portfolio risks detected. Urgent rebalancing advised.',
  };

  return { score, label, color, summary: summaries[label as keyof typeof summaries], factors };
}

interface Props {
  positions: Position[];
}

export function ZionDiagnosis({ positions }: Props) {
  const [open, setOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const [shown, setShown] = useState(false);

  const result = analyzePortfolio(positions);

  useEffect(() => {
    if (open && !shown) {
      setTyping(true);
      const t = setTimeout(() => { setTyping(false); setShown(true); }, 1600);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [open, shown]);

  const iconMap: Record<string, typeof AlertTriangle> = {
    critical: AlertTriangle, warning: AlertTriangle, ok: CheckCircle,
  };
  const colorMap: Record<string, string> = {
    critical: 'text-red-400', warning: 'text-yellow-400', ok: 'text-green-400',
  };
  const bgMap: Record<string, string> = {
    critical: 'bg-red-400/8 border-red-400/20', warning: 'bg-yellow-400/8 border-yellow-400/20', ok: 'bg-green-400/8 border-green-400/20',
  };

  return (
    <div className="bg-bg-075 border border-white/10 rounded-[14px] overflow-hidden mb-5">
      {/* Header — always visible */}
      <button
        type="button"
        onClick={() => setOpen(s => !s)}
        className="w-full flex items-center gap-3.5 p-5 text-left hover:bg-white/[0.02] transition-colors"
        aria-expanded={open}
      >
        <div className="w-10 h-10 rounded-full overflow-hidden bg-[#040d24] border border-cyan-500/30 shadow-[0_0_12px_rgba(0,212,255,0.25)] shrink-0">
          <Image src="/assets/zion-avatar.svg" alt="ZION" width={40} height={40} className="w-full h-full" />
        </div>
        <div className="flex-1">
          <div className="font-[family-name:var(--font-display)] font-bold text-[1rem]">
            ZION Portfolio Diagnosis
          </div>
          <div className="text-[0.78rem] text-white/50">
            AI risk analysis · {result.factors.filter(f => f.level !== 'ok').length} issues detected
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-center">
            <div className="font-[family-name:var(--font-display)] text-[1.6rem] font-extrabold" style={{ color: result.color }}>
              {result.score}
            </div>
            <div className="text-[0.65rem] text-white/40 uppercase tracking-wider">Risk Score</div>
          </div>
          <div
            className="w-7 h-7 rounded-md flex items-center justify-center text-white/40 border border-white/10 text-[0.8rem] transition-transform"
            style={{ transform: open ? 'rotate(180deg)' : 'none' }}
          >
            ▾
          </div>
        </div>
      </button>

      {/* Expanded */}
      {open && (
        <div className="border-t border-white/10 p-5">
          {typing ? (
            <div className="flex items-center gap-3 py-4">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-[#040d24] border border-cyan-500/25 shrink-0">
                <Image src="/assets/zion-avatar.svg" alt="" width={32} height={32} />
              </div>
              <div className="bg-white/[0.04] border border-white/10 rounded-[12px] px-3.5 py-3">
                <div className="flex gap-1">
                  {[0, 0.2, 0.4].map((d, i) => (
                    <span key={i} className="w-1.5 h-1.5 rounded-full bg-cyan-400" style={{ animation: `pulse-dot 1.2s infinite`, animationDelay: `${d}s` }} />
                  ))}
                </div>
              </div>
              <span className="text-[0.78rem] text-white/40">Analyzing your portfolio…</span>
            </div>
          ) : (
            <>
              {/* AI Message */}
              <div className="flex gap-3 mb-5">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-[#040d24] border border-cyan-500/25 shrink-0">
                  <Image src="/assets/zion-avatar.svg" alt="" width={32} height={32} />
                </div>
                <div className="flex-1 bg-white/[0.03] border border-white/10 rounded-[12px] rounded-tl-[4px] p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-[0.88rem] text-cyan-400">ZION AI</span>
                    <span className={cn(
                      'text-[0.68rem] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide',
                      result.score >= 85 ? 'bg-green-400/15 text-green-400' : result.score >= 70 ? 'bg-cyan-500/15 text-cyan-400' : 'bg-yellow-400/15 text-yellow-400'
                    )}>
                      {result.label}
                    </span>
                  </div>
                  <p className="text-[0.86rem] text-white/70 leading-[1.6]">{result.summary}</p>
                </div>
              </div>

              {/* Score breakdown */}
              <div className="grid grid-cols-3 gap-2 mb-5">
                {[
                  { icon: Shield, label: 'Risk Score', val: `${result.score}/100`, color: result.color },
                  { icon: TrendingUp, label: 'Profit/Loss', val: `${positions.reduce((s, p) => s + (p.value - p.invested), 0) >= 0 ? '+' : ''}$${(positions.reduce((s, p) => s + (p.value - p.invested), 0)).toFixed(0)}`, color: positions.reduce((s, p) => s + (p.value - p.invested), 0) >= 0 ? '#00e676' : '#ff5252' },
                  { icon: Zap, label: 'Claimable', val: `${positions.reduce((s, p) => s + p.claimable, 0).toLocaleString()} tokens`, color: '#ffd700' },
                ].map(({ icon: Icon, label, val, color }) => (
                  <div key={label} className="rounded-[10px] bg-white/[0.02] border border-white/8 p-3 text-center">
                    <Icon className="w-4 h-4 mx-auto mb-1.5" style={{ color }} />
                    <div className="font-bold text-[0.88rem]" style={{ color }}>{val}</div>
                    <div className="text-[0.68rem] text-white/40 mt-0.5">{label}</div>
                  </div>
                ))}
              </div>

              {/* Risk factors */}
              <div className="space-y-2.5">
                <div className="text-[0.74rem] text-white/40 uppercase tracking-wider font-semibold mb-3">Findings</div>
                {result.factors.map(f => {
                  const Icon = iconMap[f.level]!;
                  return (
                    <div key={f.id} className={cn('rounded-[10px] border p-3.5', bgMap[f.level])}>
                      <div className="flex items-start gap-2.5">
                        <Icon className={cn('w-4 h-4 mt-0.5 shrink-0', colorMap[f.level])} />
                        <div className="flex-1">
                          <div className={cn('font-semibold text-[0.86rem] mb-1', colorMap[f.level])}>{f.title}</div>
                          <div className="text-[0.8rem] text-white/60 leading-[1.5]">{f.detail}</div>
                          {f.action && (
                            <div className="mt-1.5 text-[0.76rem] text-cyan-400 flex items-center gap-1">
                              <Zap className="w-3 h-3" /> {f.action}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
