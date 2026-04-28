'use client';

import { Lock } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/cn';

const TIERS = [
  { name: 'Bronze',   minZ: 0,       maxZ: 4999,   alloc: 0.5,   color: 'text-[#cd7f32]', bg: 'bg-[#cd7f32]/10', border: 'border-[#cd7f32]/25' },
  { name: 'Silver',   minZ: 5000,    maxZ: 19999,  alloc: 2,     color: 'text-[#c0c0c0]', bg: 'bg-[#c0c0c0]/10', border: 'border-[#c0c0c0]/25' },
  { name: 'Gold',     minZ: 20000,   maxZ: 49999,  alloc: 5,     color: 'text-[#ffd700]', bg: 'bg-[#ffd700]/10', border: 'border-[#ffd700]/25' },
  { name: 'Diamond',  minZ: 50000,   maxZ: 99999,  alloc: 15,    color: 'text-cyan-400',   bg: 'bg-cyan-500/10',  border: 'border-cyan-500/25'  },
  { name: 'Legendary',minZ: 100000,  maxZ: Infinity,alloc: 50,   color: 'text-violet-400', bg: 'bg-violet-500/10',border: 'border-violet-500/25' },
] as const;

interface Props {
  userZ?: number;      // mock — future: from wallet store
  maxBuy: number;
  currency: string;
  status: 'live' | 'upcoming' | 'ended';
}

export function AllocationTier({ userZ = 0, maxBuy, currency, status }: Props) {
  const t = useTranslations('alloc');
  const tier = [...TIERS].reverse().find(tr => userZ >= tr.minZ) ?? TIERS[0]!;
  const nextTier = TIERS[TIERS.indexOf(tier as typeof TIERS[number]) + 1];
  const allocation = Math.min(maxBuy, tier.alloc);
  const progressToNext = nextTier
    ? Math.min(100, ((userZ - tier.minZ) / (nextTier.minZ - tier.minZ)) * 100)
    : 100;

  if (status === 'ended') return null;

  return (
    <div className="bg-bg-075 border border-white/10 rounded-[14px] p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-cyan-500/10 flex items-center justify-center shrink-0">
            <Lock className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <span className="font-[family-name:var(--font-display)] font-bold text-[0.95rem]">{t('title')}</span>
        </div>
        <span className={cn('text-[0.75rem] font-bold px-2.5 py-1 rounded-full border', tier.color, tier.bg, tier.border)}>
          {tier.name}
        </span>
      </div>

      {/* Tier grid */}
      <div className="grid grid-cols-5 gap-1 mb-4">
        {TIERS.map((tr) => {
          const active = tr.name === tier.name;
          return (
            <div
              key={tr.name}
              className={cn(
                'rounded-[6px] py-1.5 text-center text-[0.62rem] font-bold border transition-all',
                active ? cn(tr.bg, tr.border, tr.color) : 'bg-white/[0.02] border-white/8 text-white/30'
              )}
            >
              {tr.name.slice(0, 3).toUpperCase()}
            </div>
          );
        })}
      </div>

      {/* Allocation amount */}
      <div className="rounded-[10px] bg-gradient-to-br from-white/[0.03] to-transparent border border-white/10 p-3 mb-3">
        <div className="text-[0.7rem] text-white/50 uppercase tracking-wider mb-1">{t('maxCap')}</div>
        <div className="flex items-baseline gap-1.5">
          <span className={cn('font-[family-name:var(--font-display)] text-[1.6rem] font-extrabold tracking-tight', tier.color)}>
            {allocation}
          </span>
          <span className="text-white/60 text-[0.9rem] font-semibold">{currency}</span>
          <span className="text-white/30 text-[0.78rem] ml-auto">{t('ofMax', { max: maxBuy, currency })}</span>
        </div>
      </div>

      {/* Z held */}
      <div className="flex justify-between text-[0.8rem] mb-2">
        <span className="text-white/50">{t('zHeld')}</span>
        <span className="font-[family-name:var(--font-mono)] font-semibold">{userZ.toLocaleString()} Z</span>
      </div>

      {/* Progress to next tier */}
      {nextTier && (
        <div>
          <div className="flex justify-between text-[0.72rem] text-white/40 mb-1.5">
            <span>{tier.name} ({tier.minZ.toLocaleString()} Z)</span>
            <span>{nextTier.name} ({nextTier.minZ.toLocaleString()} Z)</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className={cn('h-full rounded-full transition-all', tier.bg.replace('/10', ''), 'bg-gradient-to-r from-cyan-500/60 to-cyan-400')}
              style={{ width: `${progressToNext}%` }}
            />
          </div>
          <p className="text-[0.72rem] text-white/40 mt-1.5">
            {t('stakeMore', { amount: (nextTier.minZ - userZ).toLocaleString(), tier: nextTier.name, alloc: nextTier.alloc, currency })}
          </p>
        </div>
      )}
    </div>
  );
}
