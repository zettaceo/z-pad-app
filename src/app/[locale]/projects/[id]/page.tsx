import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { Share2, ExternalLink, Shield, CheckCircle, AlertTriangle, Lock, Twitter } from 'lucide-react';
import { getTranslations, getLocale } from 'next-intl/server';

import { PROJECTS } from '@/lib/mock-data';
import { getProjectContent } from '@/lib/project-i18n';
import { fmt } from '@/lib/format';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ChainChip } from '@/components/features/ChainChip';
import { AiScore } from '@/components/features/AiScore';
import { Countdown } from '@/components/features/Countdown';
import { TimeLeftInline } from '@/components/features/TimeLeftInline';
import { InvestmentCalculator } from '@/components/features/InvestmentCalculator';
import { AllocationTier } from '@/components/features/AllocationTier';
import { SentimentOracle } from '@/components/features/SentimentOracle';

// Revalidate every hour so mock timestamps (startsAt/endsAt) in the static
// HTML don't drift more than ~60 min from real time. Replace with on-demand
// revalidation once a real data layer is wired up.
export const revalidate = 3600;

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return PROJECTS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const p = PROJECTS.find((x) => x.id === id);
  if (!p) return { title: 'Project not found' };
  return {
    title: `${p.name} (${p.symbol})`,
    description: p.description,
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;
  const p = PROJECTS.find((x) => x.id === id);
  if (!p) notFound();

  const [pd, tp, tc, locale] = await Promise.all([
    getTranslations('projectDetail'),
    getTranslations('projects'),
    getTranslations('common'),
    getLocale(),
  ]);

  const i18n = getProjectContent(p.id, locale);
  const desc = i18n?.description ?? p.description;
  const aiSummary = i18n?.aiSummary ?? p.aiSummary;
  const aiStrengths = i18n?.aiStrengths ?? p.aiStrengths;
  const aiFlags = i18n?.aiFlags ?? p.aiFlags;

  const progress = p.target > 0 ? Math.min(100, (p.raised / p.target) * 100) : 0;
  const currency = p.chain === 'eth' ? 'ETH' : p.chain === 'solana' ? 'SOL' : 'BNB';
  const target = p.status === 'upcoming' ? p.startsAt : p.endsAt;

  return (
    <div className="pt-[100px]">
      <section className="pt-8">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 text-[0.82rem] text-white/50 mb-4">
            <Link href="/" className="hover:text-cyan-400">{tc('home')}</Link>
            <span className="text-white/30">/</span>
            <Link href="/projects" className="hover:text-cyan-400">{tp('breadcrumb')}</Link>
            <span className="text-white/30">/</span>
            <span>{p.name}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 sm:gap-5 items-start sm:items-center mb-6">
            <div className="flex items-start gap-4 flex-1 min-w-0">
              <Image
                src={p.logo}
                alt={p.name}
                width={88}
                height={88}
                sizes="88px"
                priority
                className="w-[64px] h-[64px] sm:w-[88px] sm:h-[88px] rounded-full border-2 border-cyan-500/35 shadow-[0_0_32px_rgba(0,212,255,0.28)] shrink-0 object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3 flex-wrap mb-2.5">
                  <h1 className="font-[family-name:var(--font-display)] text-[clamp(1.6rem,4vw,2.6rem)] font-extrabold tracking-[-0.03em] leading-[1.05]">
                    {p.name}
                  </h1>
                  <Badge variant={p.status === 'live' ? 'live' : p.status === 'upcoming' ? 'upcoming' : 'ended'} />
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3.5">
                  <ChainChip chain={p.chain} chainName={p.chainName} />
                  <Badge variant={p.saleTypeKey} />
                  {p.kyc && <Badge variant="kyc" />}
                  {p.audited && <Badge variant="audit" />}
                  {p.refundable && <Badge variant="refundable" />}
                  <Badge variant="ai" />
                </div>
                <p className="text-white/70 max-w-[640px] leading-relaxed">{desc}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <div className="text-center">
                <AiScore score={p.aiScore} size="xl" />
                <div className="mt-3 text-[0.74rem] text-white/50 max-w-[140px]">
                  <strong className="text-cyan-400 block mb-1">{pd('zionVerified')}</strong>
                  {pd('analyzedDims')}
                </div>
              </div>
              <div className="flex gap-2">
                <button className="w-10 h-10 rounded-md bg-white/[0.03] border border-white/10 text-white/70 flex items-center justify-center hover:bg-cyan-500/8 hover:border-cyan-500/35 hover:text-cyan-400 transition-all" aria-label={pd('share')}>
                  <Share2 className="w-[18px] h-[18px]" />
                </button>
                <button className="w-10 h-10 rounded-md bg-white/[0.03] border border-white/10 text-white/70 flex items-center justify-center hover:bg-cyan-500/8 hover:border-cyan-500/35 hover:text-cyan-400 transition-all" aria-label={pd('viewWebsite')}>
                  <ExternalLink className="w-[18px] h-[18px]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
          <div className="grid gap-6 md:grid-cols-[1fr_320px] lg:grid-cols-[1fr_400px]">
            {/* Main content */}
            <div className="flex flex-col gap-5">
              {/* Stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { l: tp('raised'), v: fmt.currency(p.raised, { compact: true }), c: `${fmt.percent(progress)} of target`, up: true },
                  { l: tp('target'), v: fmt.currency(p.target, { compact: true }), c: pd('hardCap') },
                  { l: tp('participants'), v: fmt.number(p.participants), c: `+${Math.floor(p.participants * 0.12)} today`, up: true },
                  { l: pd('liquidity'), v: `${p.liquidity}%`, c: pd('locked100y') },
                ].map((s) => (
                  <div key={s.l} className="bg-bg-075 border border-white/10 rounded-[14px] p-5 relative overflow-hidden">
                    <div className="text-[0.76rem] text-white/50 uppercase tracking-[0.08em] mb-2.5 font-semibold">
                      {s.l}
                    </div>
                    <div className="font-[family-name:var(--font-display)] text-[1.8rem] font-extrabold tracking-[-0.025em] leading-[1.1] mb-1.5">
                      {s.v}
                    </div>
                    <div className={`font-[family-name:var(--font-mono)] text-[0.8rem] ${s.up ? 'text-green-400' : 'text-white/50'}`}>
                      {s.c}
                    </div>
                  </div>
                ))}
              </div>

              {/* Progress panel */}
              <div className="bg-bg-075 border border-white/10 rounded-[14px] p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="font-[family-name:var(--font-display)] text-[1.1rem] font-bold">
                    {pd('saleProgress')}
                  </div>
                  <div className="font-[family-name:var(--font-mono)] text-cyan-400 font-bold">
                    {fmt.percent(progress)}
                  </div>
                </div>
                <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full shadow-[0_0_12px_rgba(0,212,255,0.4)]"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between mt-3 text-[0.82rem] text-white/50">
                  <span>{pd('softCap')}: {fmt.currency(p.softCap)}</span>
                  <span>{pd('raised')}: <strong className="text-white font-semibold">{fmt.currency(p.raised)}</strong></span>
                  <span>{pd('hardCap')}: {fmt.currency(p.target)}</span>
                </div>
              </div>

              {/* AI ANALYSIS PANEL */}
              <div className="bg-bg-075 border border-white/10 rounded-[14px] p-6">
                <div className="flex items-center justify-between mb-5">
                  <div className="font-[family-name:var(--font-display)] text-[1.1rem] font-bold flex items-center gap-2">
                    <svg className="w-5 h-5 text-cyan-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2L14.09 8.26L20 9.27L15.5 13.97L16.82 19.96L12 16.77L7.18 19.96L8.5 13.97L4 9.27L9.91 8.26L12 2z"/>
                    </svg>
                    {pd('aiAnalysis')}
                  </div>
                  <Badge variant="ai">POWERED BY ZION</Badge>
                </div>
                <p className="text-white/70 leading-[1.65] mb-5">{aiSummary}</p>

                <div className="grid grid-cols-2 gap-2.5">
                  {Object.entries(p.aiBreakdown).map(([k, v]) => (
                    <div key={k} className="p-3 rounded-[10px] bg-white/[0.02] border border-white/10">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[0.72rem] text-white/50 uppercase tracking-wider font-semibold">
                          {k}
                        </span>
                        <span className={`font-[family-name:var(--font-mono)] font-bold text-[0.9rem] ${
                          v >= 90 ? 'text-green-400' : v >= 75 ? 'text-cyan-400' : v >= 60 ? 'text-gold-400' : 'text-red-400'
                        }`}>
                          {v}
                        </span>
                      </div>
                      <div className="h-[3px] bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                          style={{ width: `${v}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {aiStrengths.length > 0 && (
                  <div className="mt-5 p-4 rounded-[10px] bg-green-400/[0.04] border border-green-400/15">
                    <div className="font-bold text-green-400 mb-2.5 text-[0.88rem] flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" /> {pd('strengths')}
                    </div>
                    <ul className="space-y-1.5">
                      {aiStrengths.map((s, i) => (
                        <li key={i} className="text-[0.86rem] text-white/70 flex gap-2">
                          <span className="text-green-400">•</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {aiFlags.length > 0 && (
                  <div className="mt-3 p-4 rounded-[10px] bg-gold-500/[0.04] border border-gold-500/15">
                    <div className="font-bold text-gold-400 mb-2.5 text-[0.88rem] flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" /> {pd('flags')}
                    </div>
                    <ul className="space-y-1.5">
                      {aiFlags.map((f, i) => (
                        <li key={i} className="text-[0.86rem] text-white/70 flex gap-2">
                          <span className="text-gold-400">•</span>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Market Metrics + Tokenomics Score */}
              {p.marketCap && (
                <div className="bg-bg-075 border border-white/10 rounded-[14px] p-6">
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                    <h3 className="font-[family-name:var(--font-display)] text-[1.15rem] font-bold">{pd('marketMetrics')}</h3>
                    {p.tokenomicsScore != null && (() => {
                      const s = p.tokenomicsScore!;
                      const [color, label] = s >= 95 ? ['text-cyan-400 border-cyan-500/40 bg-cyan-500/10', pd('scoreExcellent')]
                        : s >= 85 ? ['text-green-400 border-green-500/40 bg-green-500/10', pd('scoreGreat')]
                        : s >= 70 ? ['text-blue-400 border-blue-500/40 bg-blue-500/10', pd('scoreGood')]
                        : s >= 55 ? ['text-gold-400 border-gold-500/40 bg-gold-500/10', pd('scoreFair')]
                        : ['text-red-400 border-red-500/40 bg-red-500/10', pd('scorePoor')];
                      return (
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[0.78rem] font-bold ${color}`}>
                          <span className="font-[family-name:var(--font-mono)]">{s}</span>
                          <span>·</span>
                          <span>{label}</span>
                          <span className="text-[0.68rem] font-normal opacity-70">{pd('tokenomicsScore')}</span>
                        </div>
                      );
                    })()}
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { l: pd('initialMc'), v: fmt.currency(p.marketCap.initial, { compact: true }) },
                      { l: pd('circulatingMc'), v: fmt.currency(p.marketCap.circulating, { compact: true }) },
                      { l: pd('fdvMc'), v: fmt.currency(p.marketCap.fdv, { compact: true }) },
                    ].map(({ l, v }) => (
                      <div key={l} className="p-3.5 rounded-[10px] bg-white/[0.02] border border-white/5 text-center">
                        <div className="text-[0.7rem] text-white/50 uppercase tracking-wider mb-1.5 font-semibold">{l}</div>
                        <div className="font-[family-name:var(--font-mono)] font-bold text-[1.05rem]">{v}</div>
                      </div>
                    ))}
                  </div>
                  {(p.saleRate || p.listingRate) && (
                    <div className="mt-3 flex flex-col gap-2">
                      {p.saleRate != null && p.saleRate > 0 && (
                        <div className="flex justify-between p-3 rounded-[10px] bg-white/[0.02] border border-white/5 text-[0.84rem]">
                          <span className="text-white/50">{pd('saleRate')} {currency}</span>
                          <span className="font-[family-name:var(--font-mono)] font-semibold">{fmt.number(p.saleRate)} {p.symbol}</span>
                        </div>
                      )}
                      {p.listingRate != null && p.listingRate > 0 && (
                        <div className="flex justify-between p-3 rounded-[10px] bg-white/[0.02] border border-white/5 text-[0.84rem]">
                          <span className="text-white/50">{pd('listingRate')} {currency}</span>
                          <span className="font-[family-name:var(--font-mono)] font-semibold">{fmt.number(p.listingRate)} {p.symbol}</span>
                        </div>
                      )}
                      <div className="flex justify-between p-3 rounded-[10px] bg-white/[0.02] border border-white/5 text-[0.84rem]">
                        <span className="text-white/50">{pd('totalContributors')}</span>
                        <span className="font-[family-name:var(--font-mono)] font-semibold">{fmt.number(p.participants)}</span>
                      </div>
                      {p.participants > 0 && p.raised > 0 && (
                        <div className="flex justify-between p-3 rounded-[10px] bg-white/[0.02] border border-white/5 text-[0.84rem]">
                          <span className="text-white/50">{pd('avgContribution')}</span>
                          <span className="font-[family-name:var(--font-mono)] font-semibold">{(p.raised / p.participants / 600).toFixed(4)} {currency}</span>
                        </div>
                      )}
                      <div className="flex justify-between p-3 rounded-[10px] bg-cyan-500/[0.04] border border-cyan-500/15 text-[0.84rem]">
                        <span className="text-white/50">{pd('myContribution')}</span>
                        <span className="font-[family-name:var(--font-mono)] font-semibold">0 {currency}</span>
                      </div>
                      <div className="flex justify-between p-3 rounded-[10px] bg-cyan-500/[0.04] border border-cyan-500/15 text-[0.84rem]">
                        <span className="text-white/50">{pd('myTokens')}</span>
                        <span className="font-[family-name:var(--font-mono)] font-semibold">0 {p.symbol}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Social Sentiment + Whale Tracker */}
              <SentimentOracle projectId={p.id} aiScore={p.aiScore} status={p.status} />

              {/* Tokenomics */}
              <div className="bg-bg-075 border border-white/10 rounded-[14px] p-6">
                <h3 className="font-[family-name:var(--font-display)] text-[1.15rem] font-bold mb-4">{pd('tokenomics')}</h3>
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="flex justify-between p-3.5 rounded-[10px] bg-white/[0.02] border border-white/5">
                    <span className="text-[0.78rem] text-white/50">{pd('supply')}</span>
                    <span className="font-[family-name:var(--font-mono)] font-medium text-[0.88rem]">
                      {p.tokenomics.supply}
                    </span>
                  </div>
                  <div className="flex justify-between p-3.5 rounded-[10px] bg-white/[0.02] border border-white/5">
                    <span className="text-[0.78rem] text-white/50">{pd('token')}</span>
                    <span className="font-[family-name:var(--font-mono)] font-medium text-[0.88rem]">{p.symbol}</span>
                  </div>
                  <div className="flex justify-between p-3.5 rounded-[10px] bg-white/[0.02] border border-white/5">
                    <span className="text-[0.78rem] text-white/50">{pd('liquidityPct')}</span>
                    <span className="font-[family-name:var(--font-mono)] font-medium text-[0.88rem]">{p.tokenomics.liquidity}%</span>
                  </div>
                  <div className="flex justify-between p-3.5 rounded-[10px] bg-white/[0.02] border border-white/5">
                    <span className="text-[0.78rem] text-white/50">{pd('presale')}</span>
                    <span className="font-[family-name:var(--font-mono)] font-medium text-[0.88rem]">{p.tokenomics.presale}%</span>
                  </div>
                </div>

                <h4 className="font-[family-name:var(--font-display)] font-bold mb-3 text-[0.95rem]">{pd('allocation')}</h4>
                {/* Allocation bar — no text inside segments, legend below */}
                <div className="w-full h-2.5 rounded-full overflow-hidden flex mb-3">
                  {[
                    { pct: p.tokenomics.presale,   color: 'bg-cyan-500' },
                    { pct: p.tokenomics.liquidity,  color: 'bg-blue-500' },
                    { pct: p.tokenomics.team,       color: 'bg-amber-400' },
                    { pct: p.tokenomics.marketing,  color: 'bg-violet-500' },
                  ].map((s, i) => (
                    <div key={i} className={s.color} style={{ width: `${s.pct}%` }} />
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {[
                    { color: 'bg-cyan-500',   label: pd('presale'),      pct: p.tokenomics.presale },
                    { color: 'bg-blue-500',   label: pd('liquidityPct'), pct: p.tokenomics.liquidity },
                    { color: 'bg-amber-400',  label: pd('team'),         pct: p.tokenomics.team },
                    { color: 'bg-violet-500', label: pd('marketing'),    pct: p.tokenomics.marketing },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2 text-[0.78rem]">
                      <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${item.color}`} />
                      <span className="text-white/60 flex-1 truncate">{item.label}</span>
                      <span className="font-[family-name:var(--font-mono)] font-semibold">{item.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Token Locks */}
              {p.locks && p.locks.length > 0 && (
                <div className="bg-bg-075 border border-white/10 rounded-[14px] p-6">
                  <h3 className="font-[family-name:var(--font-display)] text-[1.15rem] font-bold mb-4 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-cyan-400" />
                    {pd('tokenLocks')}
                  </h3>
                  <div className="flex flex-col gap-3">
                    {p.locks.map((lock, i) => {
                      const totalMs = lock.unlocksAt - lock.lockedAt;
                      const elapsedMs = Date.now() - lock.lockedAt;
                      const progressPct = Math.min(100, Math.max(0, (elapsedMs / totalMs) * 100));
                      const lockDate = new Date(lock.lockedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                      const unlockDate = new Date(lock.unlocksAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                      return (
                        <div key={i} className="p-4 rounded-[12px] bg-white/[0.02] border border-white/8">
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div>
                              <div className="font-semibold text-[0.9rem]">{lock.label}</div>
                              <div className="text-[0.76rem] text-white/50 mt-0.5">{lock.purpose}</div>
                            </div>
                            <div className="font-[family-name:var(--font-mono)] font-bold text-cyan-400 text-[0.88rem] shrink-0">
                              {lock.pct}%
                            </div>
                          </div>
                          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-2">
                            <div
                              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-[0.72rem] text-white/40">
                            <span>{pd('lockLockedOn')} {lockDate}</span>
                            <span className="text-cyan-400/70">{lock.vested}% {pd('lockVested')}</span>
                            <span>{pd('lockUnlocksOn')} {unlockDate}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Team */}
              {p.team && p.team.length > 0 && (
                <div className="bg-bg-075 border border-white/10 rounded-[14px] p-6">
                  <h3 className="font-[family-name:var(--font-display)] text-[1.15rem] font-bold mb-4">{pd('teamSection')}</h3>
                  <div className="flex flex-col gap-3">
                    {p.team.map((member, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 rounded-[12px] bg-white/[0.02] border border-white/8 hover:border-white/15 transition-colors">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center text-[0.8rem] font-extrabold text-white shrink-0 shadow-[0_0_16px_rgba(0,212,255,0.25)]">
                          {member.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-[0.92rem]">{member.name}</span>
                            {i === 0 && (
                              <span className="text-[0.62rem] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 font-bold uppercase">
                                {pd('ownerLabel')}
                              </span>
                            )}
                          </div>
                          <div className="text-[0.76rem] text-white/50 mt-0.5">{member.role}</div>
                          <div className="flex items-center gap-1.5 mt-1">
                            <CheckCircle className="w-3 h-3 text-green-400 shrink-0" />
                            <span className="font-[family-name:var(--font-mono)] text-[0.72rem] text-cyan-400">{member.address}</span>
                          </div>
                        </div>
                        {member.twitter && (
                          <a
                            href={`https://twitter.com/${member.twitter.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-[8px] bg-white/[0.03] border border-white/10 flex items-center justify-center text-white/40 hover:text-[#1d9bf0] hover:border-[#1d9bf0]/30 transition-colors shrink-0"
                          >
                            <Twitter className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sticky buy panel */}
            <div className="flex flex-col gap-5">
              <div className="bg-bg-075 border border-white/10 rounded-[14px] p-6 lg:sticky lg:top-[110px]">
                {p.status === 'live' ? (
                  <div className="flex items-center gap-2 mb-3.5">
                    <Badge variant="live">{pd('saleLive')}</Badge>
                    <TimeLeftInline
                      targetMs={p.endsAt}
                      prefix={pd('remaining')}
                      className="font-[family-name:var(--font-mono)] text-[0.78rem] text-white/60"
                    />
                  </div>
                ) : p.status === 'upcoming' ? (
                  <div className="flex items-center gap-2 mb-3.5">
                    <Badge variant="upcoming">{pd('saleUpcoming')}</Badge>
                    <TimeLeftInline
                      targetMs={p.startsAt}
                      prefix={pd('saleUpcoming')}
                      className="font-[family-name:var(--font-mono)] text-[0.78rem] text-white/60"
                    />
                  </div>
                ) : (
                  <div className="mb-3.5">
                    <Badge variant="ended">{pd('saleEnded')}</Badge>
                  </div>
                )}

                <h3 className="font-[family-name:var(--font-display)] text-[1.2rem] font-bold mb-1">
                  {p.status === 'upcoming' ? pd('saleUpcoming') : p.status === 'ended' ? pd('saleEnded') : pd('joinSale')}
                </h3>
                <div className="text-[0.82rem] text-white/50 mb-5 font-[family-name:var(--font-mono)]">{p.rate}</div>

                <Countdown targetMs={target} className="mb-5 justify-between" />

                {p.status === 'live' ? (
                  <Button block size="lg">{pd('participateNow')}</Button>
                ) : p.status === 'upcoming' ? (
                  <Button variant="secondary" block size="lg">{pd('notifyMe')}</Button>
                ) : (
                  <Button variant="secondary" block size="lg" disabled>{pd('saleEnded')}</Button>
                )}

                <div className="mt-5 pt-5 border-t border-white/10 flex flex-col gap-2.5 text-[0.85rem]">
                  <div className="flex justify-between"><span className="text-white/50">{pd('minBuy')}</span><span className="font-[family-name:var(--font-mono)]">{p.minBuy} {currency}</span></div>
                  <div className="flex justify-between"><span className="text-white/50">{pd('maxBuy')}</span><span className="font-[family-name:var(--font-mono)]">{p.maxBuy} {currency}</span></div>
                  <div className="flex justify-between"><span className="text-white/50">{pd('saleType')}</span><span>{p.saleType}</span></div>
                  <div className="flex justify-between"><span className="text-white/50">{pd('liquidity')}</span><span>{p.liquidity}%</span></div>
                  {p.refundable && <div className="flex justify-between"><span className="text-white/50">{pd('refundable')}</span><span className="text-green-400">48h post-TGE</span></div>}
                </div>
              </div>

              <InvestmentCalculator
                ratePerBase={p.ratePerBase}
                minBuy={p.minBuy}
                maxBuy={p.maxBuy}
                currency={currency}
                symbol={p.symbol}
                vesting={p.vesting}
                status={p.status}
              />

              <AllocationTier
                maxBuy={p.maxBuy}
                currency={currency}
                status={p.status}
              />

              <div className="bg-bg-075 border border-white/10 rounded-[14px] p-6">
                <div className="font-[family-name:var(--font-display)] text-[1.1rem] font-bold mb-4">{pd('verification')}</div>
                <div className="flex flex-col gap-2.5">
                  {[
                    { ok: p.kyc, label: p.kyc ? `${pd('kyc')} ${pd('yes')}` : `${pd('kyc')} ${pd('no')}` },
                    { ok: !!p.audited, label: p.audited ? `${pd('audited')} ${p.audited}` : pd('auditPending') },
                    { ok: true, label: pd('lpLocked') },
                    { ok: true, label: pd('antiBot') },
                    { ok: true, label: pd('aiAnalyzed') },
                  ].map((v, i) => (
                    <div key={i} className="flex items-center gap-2.5 p-3 rounded-[10px] bg-white/[0.02] border border-white/5 text-[0.88rem]">
                      <div className={`w-[22px] h-[22px] rounded-full flex items-center justify-center shrink-0 ${
                        v.ok ? 'bg-green-400/15 text-green-400' : 'bg-gold-500/15 text-gold-400'
                      }`}>
                        {v.ok ? <CheckCircle className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                      </div>
                      <span>{v.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
