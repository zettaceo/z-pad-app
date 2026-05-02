'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Users, ShieldCheck, FileSearch } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import type { Project, ChainId } from '@/types';
import { fmt } from '@/lib/format';
import { cn } from '@/lib/cn';
import { AiScore } from './AiScore';
import { ChainChip } from './ChainChip';
import { Countdown } from './Countdown';
import { Badge } from '@/components/ui/Badge';
import { getProjectContent } from '@/lib/project-i18n';

const CHAIN_BANNER: Record<ChainId, string> = {
  bsc:      'from-[#f3ba2f]/25 via-[#f3ba2f]/8 to-transparent',
  eth:      'from-[#627eea]/25 via-[#627eea]/8 to-transparent',
  polygon:  'from-[#8247e5]/25 via-[#8247e5]/8 to-transparent',
  arbitrum: 'from-[#28a0f0]/25 via-[#28a0f0]/8 to-transparent',
  zetta:    'from-cyan-500/25 via-cyan-500/8 to-transparent',
  solana:   'from-[#9945ff]/20 via-[#14f195]/8 to-transparent',
  base:     'from-[#0052ff]/25 via-[#0052ff]/8 to-transparent',
};

const CHAIN_BAR: Record<ChainId, string> = {
  bsc:      'from-[#f3ba2f] to-[#e9a800]',
  eth:      'from-[#627eea] to-[#4a5fd4]',
  polygon:  'from-[#8247e5] to-[#6830c9]',
  arbitrum: 'from-[#28a0f0] to-[#1785ce]',
  zetta:    'from-cyan-400 to-blue-500',
  solana:   'from-[#9945ff] to-[#14f195]',
  base:     'from-[#0052ff] to-[#3a7bff]',
};

const CHAIN_GLOW: Record<ChainId, string> = {
  bsc:      'shadow-[0_0_10px_rgba(243,186,47,0.55)]',
  eth:      'shadow-[0_0_10px_rgba(98,126,234,0.55)]',
  polygon:  'shadow-[0_0_10px_rgba(130,71,229,0.55)]',
  arbitrum: 'shadow-[0_0_10px_rgba(40,160,240,0.55)]',
  zetta:    'shadow-[0_0_10px_rgba(0,212,255,0.6)]',
  solana:   'shadow-[0_0_10px_rgba(153,69,255,0.55)]',
  base:     'shadow-[0_0_10px_rgba(0,82,255,0.55)]',
};

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project: p }: ProjectCardProps) {
  const t = useTranslations('projects');
  const locale = useLocale();
  const i18n = getProjectContent(p.id, locale);
  const description = i18n?.description ?? p.description;
  const progress = p.target > 0 ? Math.min(100, (p.raised / p.target) * 100) : 0;
  const isLive = p.status === 'live';
  const isUpcoming = p.status === 'upcoming';
  const isEnded = p.status === 'ended';

  return (
    <Link
      href={`/projects/${p.id}`}
      className="group relative flex flex-col h-full bg-bg-075 border border-white/[0.08] rounded-[16px] overflow-hidden transition-all duration-[250ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:border-white/[0.18] hover:shadow-[0_12px_48px_rgba(0,0,0,0.5)] focus-visible:outline-2 focus-visible:outline-cyan-500 focus-visible:outline-offset-2"
    >
      {/* Top shimmer on hover */}
      <span className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-20" />

      {/* ── Banner ── */}
      <div className={cn('relative h-[68px] bg-gradient-to-r shrink-0', CHAIN_BANNER[p.chain])}>
        {/* Dot mesh texture */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '16px 16px',
          }}
        />
        {/* Status badge — top left */}
        <div className="absolute top-3 left-3 z-10">
          <Badge variant={isLive ? 'live' : isUpcoming ? 'upcoming' : 'ended'} />
        </div>
        {/* AI Score — top right */}
        <div className="absolute top-3 right-3 z-10">
          <AiScore score={p.aiScore} />
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-col flex-1 px-4 pb-4">
        {/* Logo row — overlaps banner by 24px */}
        <div className="flex items-end gap-3 -mt-6 mb-3">
          <div className="w-12 h-12 rounded-[12px] shrink-0 overflow-hidden border-[2.5px] border-bg-075 shadow-md ring-1 ring-white/10 bg-bg-100">
            <Image
              src={p.logo}
              alt={p.name}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>
          {/* Trust chips */}
          <div className="flex flex-wrap gap-1.5 mb-0.5">
            {p.kyc && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[0.62rem] font-semibold">
                <ShieldCheck className="w-2.5 h-2.5" />
                KYC
              </span>
            )}
            {p.audited && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-[0.62rem] font-semibold">
                <FileSearch className="w-2.5 h-2.5" />
                {t('auditedBadge')}
              </span>
            )}
          </div>
        </div>

        {/* Name + meta row */}
        <div className="mb-2.5">
          <div className="font-[family-name:var(--font-display)] font-bold text-[1.03rem] tracking-[-0.02em] leading-tight truncate">
            {p.name}
          </div>
          <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
            <span className="font-[family-name:var(--font-mono)] text-[0.68rem] text-white/35">
              {p.symbol}
            </span>
            <ChainChip chain={p.chain} chainName={p.chainName} />
            <Badge variant={p.saleTypeKey} />
            {p.hot && <Badge variant="hot" />}
            {p.trending && <Badge variant="trending" />}
            {p.refundable && <Badge variant="refundable" />}
          </div>
        </div>

        {/* Description */}
        <p className="text-[0.79rem] text-white/40 leading-[1.55] line-clamp-2 flex-shrink-0">
          {description}
        </p>

        {/* Stats */}
        <div className="mt-3 space-y-1">
          <div className="flex justify-between items-center text-[0.78rem]">
            <span className="text-white/40">{t('raised')}</span>
            <span className="font-[family-name:var(--font-mono)] font-semibold text-white tabular-nums">
              {isUpcoming ? '—' : fmt.currency(p.raised, { compact: true })}
            </span>
          </div>
          <div className="flex justify-between items-center text-[0.78rem]">
            <span className="text-white/40">{t('target')}</span>
            <span className="font-[family-name:var(--font-mono)] text-white/55 tabular-nums">
              {fmt.currency(p.target, { compact: true })}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-auto pt-3.5">
          <div className="w-full h-[6px] bg-white/[0.06] rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full bg-gradient-to-r rounded-full transition-[width] duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]',
                CHAIN_BAR[p.chain],
                CHAIN_GLOW[p.chain]
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-1.5 text-[0.69rem] text-white/35 font-[family-name:var(--font-mono)] tabular-nums">
            <span>{fmt.percent(progress)}</span>
            <span>{fmt.currency(p.target, { compact: true })}</span>
          </div>
        </div>

        {/* Footer row */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.06]">
          <div className="flex items-center gap-1.5 text-[0.73rem] text-white/40">
            <Users className="w-3.5 h-3.5 shrink-0" />
            <span className="font-[family-name:var(--font-mono)] tabular-nums">
              {fmt.number(p.participants)}
            </span>
            <span className="text-white/25">{t('participants')}</span>
          </div>
          {!isEnded && (
            <Countdown
              targetMs={isLive ? p.endsAt : p.startsAt}
              variant="inline"
              className={cn(
                'text-[0.7rem]',
                isLive ? 'text-amber-400' : 'text-cyan-400'
              )}
            />
          )}
        </div>
      </div>
    </Link>
  );
}
