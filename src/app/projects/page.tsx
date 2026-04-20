'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';

import { PROJECTS } from '@/lib/mock-data';
import { ProjectCard } from '@/components/features/ProjectCard';
import type { Project, SaleStatus, ChainId } from '@/types';

type SortKey = 'ai' | 'raised' | 'participants' | 'ending';

export default function ProjectsPage() {
  const [status, setStatus] = useState<SaleStatus | 'all'>('all');
  const [chain, setChain] = useState<ChainId | 'all'>('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortKey>('ai');

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
        <div className="max-w-[1360px] mx-auto px-6">
          <div className="flex items-center gap-2 text-[0.82rem] text-white/50 mb-4">
            <Link href="/" className="hover:text-cyan-400">Home</Link>
            <span className="text-white/30">/</span>
            <span>Projects</span>
          </div>
          <div className="flex items-end justify-between flex-wrap gap-5">
            <div>
              <span className="inline-flex items-center gap-2 text-[0.72rem] font-semibold text-cyan-400 uppercase tracking-[0.12em] font-[family-name:var(--font-mono)] before:content-[''] before:w-6 before:h-px before:bg-cyan-500">
                All Projects
              </span>
              <h1 className="font-[family-name:var(--font-display)] text-[clamp(1.8rem,4vw,2.8rem)] font-extrabold tracking-[-0.03em] mt-2.5 leading-[1.05]">
                Discover{' '}
                <span className="bg-gradient-to-br from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                  vetted
                </span>{' '}
                launches
              </h1>
              <p className="text-white/70 mt-1.5">
                Every project scored by ZION AI. Filter by chain, sale type, or AI rating.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-[1360px] mx-auto px-6">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="flex gap-1 p-1 bg-white/[0.02] rounded-[10px] border border-white/10 overflow-x-auto">
              {(['all', 'live', 'upcoming', 'ended'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`px-4 py-2 rounded-md text-[0.84rem] font-medium whitespace-nowrap transition-all ${
                    status === s
                      ? 'bg-gradient-to-br from-cyan-500 to-blue-500 text-[#021628] font-semibold shadow-[0_2px_8px_rgba(0,212,255,0.25)]'
                      : 'text-white/70 hover:text-white'
                  }`}
                  type="button"
                >
                  {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>

            <div className="relative flex-1 min-w-[220px] max-w-[360px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search projects..."
                className="w-full pl-10 pr-3.5 py-2.5 rounded-[10px] border border-white/10 bg-white/[0.02] text-white text-[0.88rem] outline-none focus:border-cyan-500 focus:bg-cyan-500/[0.03] transition-all placeholder:text-white/30"
              />
            </div>

            <select
              value={chain}
              onChange={(e) => setChain(e.target.value as ChainId | 'all')}
              className="px-3.5 py-2.5 pr-9 rounded-[10px] border border-white/10 bg-white/[0.02] text-white text-[0.88rem] outline-none max-w-[170px] focus:border-cyan-500 cursor-pointer appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22white%22 stroke-opacity=%220.5%22 stroke-width=%222%22><path d=%22M6 9l6 6 6-6%22/></svg>')] bg-no-repeat bg-[right_14px_center]"
            >
              <option value="all">All Chains</option>
              <option value="bsc">BSC</option>
              <option value="eth">Ethereum</option>
              <option value="polygon">Polygon</option>
              <option value="arbitrum">Arbitrum</option>
              <option value="zetta">ZettaChain</option>
              <option value="solana">Solana</option>
              <option value="base">Base</option>
            </select>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="px-3.5 py-2.5 pr-9 rounded-[10px] border border-white/10 bg-white/[0.02] text-white text-[0.88rem] outline-none max-w-[180px] focus:border-cyan-500 cursor-pointer appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22white%22 stroke-opacity=%220.5%22 stroke-width=%222%22><path d=%22M6 9l6 6 6-6%22/></svg>')] bg-no-repeat bg-[right_14px_center]"
            >
              <option value="ai">Sort: AI Score</option>
              <option value="raised">Sort: Raised</option>
              <option value="participants">Sort: Participants</option>
              <option value="ending">Sort: Ending Soon</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-15 text-white/50">
              <Search className="w-14 h-14 mx-auto mb-4 opacity-35" />
              <h3 className="font-[family-name:var(--font-display)] text-[1.2rem] text-white mb-2 font-bold">
                No projects match
              </h3>
              <div>Try different filters</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
