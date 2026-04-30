'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, LayoutGrid, LayoutList, Clock } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/cn';

import { PROJECTS } from '@/lib/mock-data';
import { fmt } from '@/lib/format';
import { ProjectCard } from '@/components/features/ProjectCard';
import { ChainChip } from '@/components/features/ChainChip';
import { AiScore } from '@/components/features/AiScore';
import { Badge } from '@/components/ui/Badge';
import { Countdown } from '@/components/features/Countdown';
import type { Project, SaleStatus, ChainId } from '@/types';

type SortKey = 'ai' | 'raised' | 'participants' | 'ending';

export default function ProjectsPage() {
  const t = useTranslations('projects');
  const tc = useTranslations('common');
  const [status, setStatus] = useState<SaleStatus | 'all'>('all');
  const [chain, setChain] = useState<ChainId | 'all'>('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortKey>('ai');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const featured = PROJECTS.find((p) => p.featured);
  const liveCount = PROJECTS.filter((p) => p.status === 'live').length;
  const upcomingCount = PROJECTS.filter((p) => p.status === 'upcoming').length;
  const endedCount = PROJECTS.filter((p) => p.status === 'ended').length;

  const CHAIN_DOTS: Record<ChainId, string> = {
    bsc: 'bg-[#f3ba2f]', eth: 'bg-[#627eea]', polygon: 'bg-[#8247e5]',
    arbitrum: 'bg-[#28a0f0]', zetta: 'bg-cyan-500', solana: 'bg-[#9945ff]', base: 'bg-[#0052ff]',
  };
  const CHAIN_LABELS: Record<ChainId, string> = {
    bsc: 'BSC', eth: 'ETH', polygon: 'Polygon', arbitrum: 'Arbitrum',
    zetta: 'ZettaChain', solana: 'Solana', base: 'Base',
  };
  const ALL_CHAINS = (Object.keys(CHAIN_LABELS) as ChainId[]);

  const filtered = useMemo(() => {
    let list = [...PROJECTS];
    if (status !== 'all') list = list.filter((p) => p.status === status);
    if (chain !== 'all') list = list.filter((p) => p.chain === chain);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.symbol.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }
    const sorters: Record<SortKey, (a: Project, b: Project) => number> = {
      ai: (a, b) => b.aiScore - a.aiScore,
      raised: (a, b) => b.raised - a.raised,
      participants: (a, b) => b.participants - a.participants,
      ending: (a, b) => a.endsAt - b.endsAt,
    };
    return list.sort(sorters[sort]);
  }, [status, chain, search, sort]);

  return (
    <div className="pt-[100px]">
      <section className="pt-10 pb-6 border-b border-white/5">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 text-[0.82rem] text-white/50 mb-4">
            <Link href="/" className="hover:text-cyan-400">{tc('home')}</Link>
            <span className="text-white/30">/</span>
            <span>{t('breadcrumb')}</span>
          </div>
          <div className="flex items-end justify-between flex-wrap gap-5">
            <div>
              <span className="inline-flex items-center gap-2 text-[0.72rem] font-semibold text-cyan-400 uppercase tracking-[0.12em] font-[family-name:var(--font-mono)] before:content-[''] before:w-6 before:h-px before:bg-cyan-500">
                {t('label')}
              </span>
              <h1 className="font-[family-name:var(--font-display)] text-[clamp(1.8rem,4vw,2.8rem)] font-extrabold tracking-[-0.03em] mt-2.5 leading-[1.05]">
                {t('title1')}{' '}
                <span className="bg-gradient-to-br from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                  {t('title2')}
                </span>
              </h1>
              <p className="text-white/60 mt-1.5 text-[0.9rem]">{t('desc')}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[0.73rem] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_6px_#00e676]" style={{ animation: 'pulse-dot 1.5s ease-in-out infinite' }} />
                  {liveCount} {t('tabLive')}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[0.73rem] font-semibold">
                  <Clock className="w-3 h-3" />
                  {upcomingCount} {t('tabUpcoming')}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-white/40 text-[0.73rem] font-semibold">
                  {endedCount} {t('tabEnded')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED SPOTLIGHT */}
      {featured && (
        <section className="pt-6 pb-2">
          <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
            <Link href={`/projects/${featured.id}`} className="group relative flex flex-col sm:flex-row sm:items-center gap-4 p-4 sm:p-5 bg-bg-075 border border-cyan-500/20 rounded-[16px] overflow-hidden hover:border-cyan-500/40 hover:shadow-[0_0_40px_rgba(0,212,255,0.07)] transition-all duration-[250ms]">
              <span className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-70" style={{ backgroundSize: '200%', animation: 'shimmer 3s linear infinite' }} />
              <Image src={featured.logo} alt={featured.name} width={52} height={52} className="w-13 h-13 rounded-[12px] shrink-0 object-cover border border-cyan-500/25 shadow-[0_0_20px_rgba(0,212,255,0.2)]" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-[0.62rem] font-bold text-cyan-400 uppercase tracking-[0.12em] bg-cyan-500/10 border border-cyan-500/20 rounded-full px-2 py-0.5">✦ Featured</span>
                  <Badge variant={featured.status === 'live' ? 'live' : featured.status === 'upcoming' ? 'upcoming' : 'ended'} />
                </div>
                <div className="font-[family-name:var(--font-display)] font-bold text-[1rem] tracking-tight truncate">{featured.name}</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-[family-name:var(--font-mono)] text-[0.7rem] text-white/35">{featured.symbol}</span>
                  <ChainChip chain={featured.chain} chainName={featured.chainName} />
                </div>
              </div>
              <div className="hidden sm:block shrink-0 w-[150px]">
                <div className="flex justify-between text-[0.68rem] text-white/35 mb-1.5 font-[family-name:var(--font-mono)]">
                  <span>{fmt.percent(Math.min(100, (featured.raised / featured.target) * 100))}</span>
                  <span>{fmt.currency(featured.target, { compact: true })}</span>
                </div>
                <div className="w-full h-[5px] bg-white/[0.06] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full shadow-[0_0_8px_rgba(0,212,255,0.4)]" style={{ width: `${Math.min(100, (featured.raised / featured.target) * 100)}%` }} />
                </div>
                <div className="mt-1 text-[0.68rem] text-white/35 font-[family-name:var(--font-mono)]">{fmt.currency(featured.raised, { compact: true })} raised</div>
              </div>
              <div className="hidden md:block shrink-0"><AiScore score={featured.aiScore} /></div>
              {featured.status !== 'ended' && (
                <div className="hidden sm:block shrink-0 text-right min-w-[90px]">
                  <div className="text-[0.62rem] text-white/35 uppercase tracking-[0.08em] mb-1">{featured.status === 'live' ? 'Ends in' : 'Starts in'}</div>
                  <Countdown targetMs={(featured.status === 'live' ? featured.endsAt : featured.startsAt) * 1000} variant="inline" className={cn('text-[0.78rem] font-semibold', featured.status === 'live' ? 'text-amber-400' : 'text-cyan-400')} />
                </div>
              )}
              <div className="hidden sm:flex shrink-0 w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/20 items-center justify-center text-cyan-400 group-hover:bg-cyan-500/20 transition-all text-sm">→</div>
            </Link>
          </div>
        </section>
      )}

      <section className="py-8">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
          {/* Filters — Row 1: tabs + search + sort + view toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
            <div className="flex gap-1 p-1 bg-white/[0.02] rounded-[10px] border border-white/[0.08] overflow-x-auto shrink-0">
              {(['all', 'live', 'upcoming', 'ended'] as const).map((s) => (
                <button key={s} onClick={() => setStatus(s)} type="button"
                  className={cn('px-4 py-2 rounded-[8px] text-[0.82rem] font-medium whitespace-nowrap transition-all', status === s ? 'bg-gradient-to-br from-cyan-500 to-blue-500 text-[#021628] font-semibold shadow-[0_2px_8px_rgba(0,212,255,0.25)]' : 'text-white/60 hover:text-white')}>
                  {s === 'all' ? t('tabAll') : s === 'live' ? t('tabLive') : s === 'upcoming' ? t('tabUpcoming') : t('tabEnded')}
                </button>
              ))}
            </div>
            <div className="relative flex-1 min-w-[180px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} aria-label={t('searchPlaceholder')} placeholder={t('searchPlaceholder')}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-[10px] border border-white/[0.08] bg-white/[0.02] text-white text-[0.86rem] outline-none focus:border-cyan-500/50 focus:bg-cyan-500/[0.03] transition-all placeholder:text-white/25" />
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}
                className="px-3.5 py-2.5 pr-9 rounded-[10px] border border-white/[0.08] bg-white/[0.02] text-white text-[0.84rem] outline-none focus:border-cyan-500/50 cursor-pointer appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22white%22 stroke-opacity=%220.4%22 stroke-width=%222%22><path d=%22M6 9l6 6 6-6%22/></svg>')] bg-no-repeat bg-[right_12px_center]">
                <option value="ai">{t('sortAi')}</option>
                <option value="raised">{t('sortRaised')}</option>
                <option value="participants">{t('sortNewest')}</option>
                <option value="ending">{t('sortEnds')}</option>
              </select>
              <div className="flex gap-1 p-1 bg-white/[0.02] rounded-[10px] border border-white/[0.08]">
                <button onClick={() => setView('grid')} type="button" aria-label="Grid view"
                  className={cn('p-1.5 rounded-[6px] transition-all', view === 'grid' ? 'bg-cyan-500/20 text-cyan-400' : 'text-white/35 hover:text-white/60')}>
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button onClick={() => setView('list')} type="button" aria-label="List view"
                  className={cn('p-1.5 rounded-[6px] transition-all', view === 'list' ? 'bg-cyan-500/20 text-cyan-400' : 'text-white/35 hover:text-white/60')}>
                  <LayoutList className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Filters — Row 2: chain chips */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button onClick={() => setChain('all')} type="button"
              className={cn('px-3 py-1.5 rounded-[8px] text-[0.78rem] font-medium border transition-all', chain === 'all' ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30' : 'border-white/[0.08] text-white/45 hover:text-white/70 hover:border-white/20')}>
              {t('filterChains')}
            </button>
            {ALL_CHAINS.map((c) => (
              <button key={c} onClick={() => setChain(chain === c ? 'all' : c)} type="button"
                className={cn('inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-[0.78rem] font-medium border transition-all', chain === c ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30' : 'border-white/[0.08] text-white/45 hover:text-white/70 hover:border-white/20')}>
                <span className={cn('w-2 h-2 rounded-full shrink-0', CHAIN_DOTS[c])} />
                {CHAIN_LABELS[c]}
              </button>
            ))}
          </div>

          {/* Result count */}
          <div className="text-[0.78rem] text-white/35 mb-5 font-[family-name:var(--font-mono)]">
            {filtered.length} project{filtered.length !== 1 ? 's' : ''}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center">
                <Search className="w-7 h-7 text-white/25" />
              </div>
              <h3 className="font-[family-name:var(--font-display)] text-[1.15rem] text-white mb-2 font-bold">{t('noResults')}</h3>
              <p className="text-white/35 text-[0.86rem]">Try adjusting your filters or search term</p>
              <button onClick={() => { setStatus('all'); setChain('all'); setSearch(''); }} type="button"
                className="mt-5 px-4 py-2 rounded-[10px] border border-white/10 text-[0.84rem] text-white/50 hover:text-white hover:border-white/25 transition-all">
                Clear all filters
              </button>
            </div>
          ) : view === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((p) => <ProjectCard key={p.id} project={p} />)}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {filtered.map((p) => {
                const prog = p.target > 0 ? Math.min(100, (p.raised / p.target) * 100) : 0;
                const isLive = p.status === 'live';
                const isUpcoming = p.status === 'upcoming';
                const isEnded = p.status === 'ended';
                return (
                  <Link key={p.id} href={`/projects/${p.id}`}
                    className="group flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-bg-075 border border-white/[0.08] rounded-[12px] hover:border-white/[0.18] hover:shadow-[0_4px_24px_rgba(0,0,0,0.35)] transition-all duration-200">
                    <Image src={p.logo} alt={p.name} width={44} height={44} className="w-11 h-11 rounded-[10px] shrink-0 object-cover border border-white/10" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-[0.9rem] truncate max-w-[160px]">{p.name}</span>
                        <Badge variant={isLive ? 'live' : isUpcoming ? 'upcoming' : 'ended'} />
                        {p.hot && <Badge variant="hot" />}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-[family-name:var(--font-mono)] text-[0.68rem] text-white/35">{p.symbol}</span>
                        <ChainChip chain={p.chain} chainName={p.chainName} />
                      </div>
                    </div>
                    <div className="hidden sm:flex flex-col items-end gap-1 shrink-0 w-[100px]">
                      <div className="w-full h-[5px] bg-white/[0.06] rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full" style={{ width: `${prog}%` }} />
                      </div>
                      <span className="font-[family-name:var(--font-mono)] text-[0.67rem] text-white/35">{fmt.percent(prog)}</span>
                    </div>
                    <div className="hidden md:block shrink-0 text-right w-[86px]">
                      <div className="font-[family-name:var(--font-mono)] font-semibold text-[0.83rem]">{isUpcoming ? '—' : fmt.currency(p.raised, { compact: true })}</div>
                      <div className="text-[0.67rem] text-white/35">of {fmt.currency(p.target, { compact: true })}</div>
                    </div>
                    <div className="hidden lg:block shrink-0"><AiScore score={p.aiScore} /></div>
                    <div className="shrink-0 min-w-[80px] text-right">
                      {!isEnded
                        ? <Countdown targetMs={(isLive ? p.endsAt : p.startsAt) * 1000} variant="inline" className={cn('text-[0.7rem]', isLive ? 'text-amber-400' : 'text-cyan-400')} />
                        : <span className="text-[0.7rem] text-white/25 font-[family-name:var(--font-mono)]">Ended</span>
                      }
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
