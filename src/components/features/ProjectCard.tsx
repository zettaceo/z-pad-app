'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { Project } from '@/types';
import { fmt } from '@/lib/format';
import { AiScore } from './AiScore';
import { Badge } from '@/components/ui/Badge';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project: p }: ProjectCardProps) {
  const t = useTranslations('projects');
  const progress = p.target > 0 ? Math.min(100, (p.raised / p.target) * 100) : 0;

  return (
    <Link
      href={`/projects/${p.id}`}
      className="group relative flex flex-col h-full p-[22px] bg-bg-075 border border-white/10 rounded-[14px] overflow-hidden transition-all duration-[250ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:border-cyan-500/35 hover:shadow-[0_0_32px_rgba(0,212,255,0.28),0_4px_24px_rgba(0,0,0,0.4)] focus-visible:outline-2 focus-visible:outline-cyan-500 focus-visible:outline-offset-2"
    >
      {/* Top gradient line on hover */}
      <span className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

      {/* AI Score in corner */}
      <div className="absolute top-[18px] right-[18px] z-10">
        <AiScore score={p.aiScore} />
      </div>

      {/* Identity */}
      <div className="flex items-center gap-3 mb-3.5 pr-[68px]">
        <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-white/10">
          <Image src={p.logo} alt={p.name} width={48} height={48} className="w-full h-full object-cover" />
        </div>
        <div className="min-w-0">
          <div className="font-[family-name:var(--font-display)] font-bold text-[1.02rem] truncate tracking-[-0.015em]">
            {p.name}
          </div>
          <div className="text-[0.75rem] text-white/50 mt-0.5">
            {p.symbol} · {p.chainName}
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-3.5">
        <Badge variant={p.status === 'live' ? 'live' : p.status === 'upcoming' ? 'upcoming' : 'ended'} />
        <Badge variant={p.saleTypeKey} />
        {p.refundable && <Badge variant="refundable" />}
        {p.hot && <Badge variant="hot" />}
        {p.trending && <Badge variant="trending" />}
      </div>

      {/* Description */}
      <p className="text-[0.82rem] text-white/50 leading-[1.5] mb-3.5 line-clamp-2">{p.description}</p>

      {/* Rows */}
      <div className="flex justify-between items-center mb-1.5 text-[0.82rem]">
        <span className="text-white/50">{t('target')}</span>
        <span className="font-[family-name:var(--font-mono)] font-medium tabular-nums">
          {fmt.currency(p.target, { compact: true })}
        </span>
      </div>
      <div className="flex justify-between items-center mb-1.5 text-[0.82rem]">
        <span className="text-white/50">{t('raised')}</span>
        <span className="font-[family-name:var(--font-mono)] font-semibold text-cyan-400 tabular-nums">
          {p.status === 'upcoming' ? '—' : fmt.currency(p.raised, { compact: true })}
        </span>
      </div>
      <div className="flex justify-between items-center mb-1.5 text-[0.82rem]">
        <span className="text-white/50">{t('participants')}</span>
        <span className="font-[family-name:var(--font-mono)] font-medium tabular-nums">
          {fmt.number(p.participants)}
        </span>
      </div>

      {/* Progress */}
      <div className="mt-auto pt-3.5">
        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full shadow-[0_0_12px_rgba(0,212,255,0.4)] transition-[width] duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-2.5 text-[0.75rem] text-white/50 font-[family-name:var(--font-mono)] tabular-nums">
          <span>{fmt.percent(progress)}</span>
          <span>{fmt.currency(p.target, { compact: true })}</span>
        </div>
      </div>
    </Link>
  );
}
