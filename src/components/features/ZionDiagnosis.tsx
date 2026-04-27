'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { AlertTriangle, CheckCircle, TrendingUp, Zap, Shield } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/cn';
import type { Position } from '@/types';

interface RiskFactor {
  id: string;
  level: 'critical' | 'warning' | 'ok';
  title: string;
  detail: string;
  action?: string;
}

type TFn = (key: string, values?: Record<string, unknown>) => string;

function analyzePortfolio(positions: Position[], t: TFn): {
  score: number;
  label: string;
  color: string;
  summary: string;
  factors: RiskFactor[];
} {
  const factors: RiskFactor[] = [];
  const totalValue = positions.reduce((s, p) => s + p.value, 0);

  const maxConc = Math.max(...positions.map(p => p.value / totalValue));
  if (maxConc > 0.55) {
    factors.push({
      id: 'conc', level: 'critical',
      title: t('riskHighConc'),
      detail: t('riskHighConcDetail', { pct: Math.round(maxConc * 100) }),
      action: t('riskHighConcAction'),
    });
  } else if (maxConc > 0.35) {
    factors.push({
      id: 'conc', level: 'warning',
      title: t('riskModConc'),
      detail: t('riskModConcDetail', { pct: Math.round(maxConc * 100) }),
    });
  } else {
    factors.push({ id: 'conc', level: 'ok', title: t('riskGoodDiv'), detail: t('riskGoodDivDetail') });
  }

  const losers = positions.filter(p => p.change < 0);
  if (losers.length >= 2) {
    factors.push({
      id: 'loss', level: 'warning',
      title: t('riskUnderwater', { count: losers.length }),
      detail: t('riskUnderwaterDetail', { symbols: losers.map(p => p.symbol).join(', ') }),
      action: t('riskUnderwaterAction'),
    });
  }

  const cliffPositions = positions.filter(p => p.vestingEnds && p.vestingEnds > Date.now() && p.claimable === 0);
  if (cliffPositions.length > 0) {
    factors.push({
      id: 'cliff', level: 'warning',
      title: t('riskCliff'),
      detail: t('riskCliffDetail', { symbols: cliffPositions.map(p => p.symbol).join(', ') }),
      action: t('riskCliffAction'),
    });
  }

  const idleClaim = positions.filter(p => p.claimable > 0);
  if (idleClaim.length > 0) {
    factors.push({
      id: 'idle', level: 'warning',
      title: t('riskIdle'),
      detail: t('riskIdleDetail', { symbols: idleClaim.map(p => p.symbol).join(', ') }),
      action: t('riskIdleAction'),
    });
  }

  const winners = positions.filter(p => p.change >= 50);
  if (winners.length > 0) {
    factors.push({
      id: 'win', level: 'ok',
      title: t('riskWinners', { count: winners.length, suffix: winners.length > 1 ? 's' : '' }),
      detail: t('riskWinnersDetail', { items: winners.map(p => `${p.symbol} +${p.change}%`).join(', ') }),
    });
  }

  const criticals = factors.filter(f => f.level === 'critical').length;
  const warnings = factors.filter(f => f.level === 'warning').length;
  const score = Math.max(20, Math.min(98, 90 - criticals * 25 - warnings * 10));

  const labelKey = score >= 85 ? 'labelHealthy' : score >= 70 ? 'labelModerate' : score >= 50 ? 'labelHighRisk' : 'labelCritical';
  const label = t(labelKey);
  const color = score >= 85 ? '#00e676' : score >= 70 ? '#00d4ff' : score >= 50 ? '#ffd700' : '#ff5252';
  const summaryKey = score >= 85 ? 'summaryHealthy' : score >= 70 ? 'summaryModerate' : score >= 50 ? 'summaryHigh' : 'summaryCritical';
  const summary = t(summaryKey);

  return { score, label, color, summary, factors };
}

interface Props {
  positions: Position[];
}

export function ZionDiagnosis({ positions }: Props) {
  const t = useTranslations('zion');
  const [open, setOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const [shown, setShown] = useState(false);

  const result = analyzePortfolio(positions, t as TFn);

  useEffect(() => {
    if (open && !shown) {
      setTyping(true);
      const timer = setTimeout(() => { setTyping(false); setShown(true); }, 1600);
      return () => clearTimeout(timer);
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
            {t('diagnosisTitle')}
          </div>
          <div className="text-[0.78rem] text-white/50">
            {t('aiRiskAnalysis')} · {result.factors.filter(f => f.level !== 'ok').length} {t('issuesDetected')}
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-center">
            <div className="font-[family-name:var(--font-display)] text-[1.6rem] font-extrabold" style={{ color: result.color }}>
              {result.score}
            </div>
            <div className="text-[0.65rem] text-white/40 uppercase tracking-wider">{t('riskScore')}</div>
          </div>
          <div
            className="w-7 h-7 rounded-md flex items-center justify-center text-white/40 border border-white/10 text-[0.8rem] transition-transform"
            style={{ transform: open ? 'rotate(180deg)' : 'none' }}
          >
            ▾
          </div>
        </div>
      </button>

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
              <span className="text-[0.78rem] text-white/40">{t('analyzing')}</span>
            </div>
          ) : (
            <>
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

              <div className="grid grid-cols-3 gap-2 mb-5">
                {[
                  { icon: Shield, label: t('riskScore'), val: `${result.score}/100`, color: result.color },
                  { icon: TrendingUp, label: t('profitLoss'), val: `${positions.reduce((s, p) => s + (p.value - p.invested), 0) >= 0 ? '+' : ''}$${(positions.reduce((s, p) => s + (p.value - p.invested), 0)).toFixed(0)}`, color: positions.reduce((s, p) => s + (p.value - p.invested), 0) >= 0 ? '#00e676' : '#ff5252' },
                  { icon: Zap, label: t('claimable'), val: `${positions.reduce((s, p) => s + p.claimable, 0).toLocaleString()} ${t('tokens')}`, color: '#ffd700' },
                ].map(({ icon: Icon, label, val, color }) => (
                  <div key={label} className="rounded-[10px] bg-white/[0.02] border border-white/8 p-3 text-center">
                    <Icon className="w-4 h-4 mx-auto mb-1.5" style={{ color }} />
                    <div className="font-bold text-[0.88rem]" style={{ color }}>{val}</div>
                    <div className="text-[0.68rem] text-white/40 mt-0.5">{label}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-2.5">
                <div className="text-[0.74rem] text-white/40 uppercase tracking-wider font-semibold mb-3">{t('findings')}</div>
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
