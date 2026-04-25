export const revalidate = 3600;

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Plus, Shield, CheckCircle, Lock, Sparkles } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { PROJECTS } from '@/lib/mock-data';
import { fmt } from '@/lib/format';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ChainChip } from '@/components/features/ChainChip';
import { AiScore } from '@/components/features/AiScore';
import { ProjectCard } from '@/components/features/ProjectCard';
import { Countdown } from '@/components/features/Countdown';

export default async function HomePage() {
  const t = await getTranslations('home');

  const featured = PROJECTS.find((p) => p.featured);
  const liveProjects = PROJECTS.filter((p) => p.status === 'live' || p.status === 'upcoming').slice(0, 6);

  const FEATURES = [
    { title: t('feature1Title'), desc: t('feature1Desc'), badge: 'ai' as const },
    { title: t('feature2Title'), desc: t('feature2Desc'), badge: 'hot' as const },
    { title: t('feature3Title'), desc: t('feature3Desc'), badge: 'refundable' as const },
    { title: t('feature4Title'), desc: t('feature4Desc') },
    { title: t('feature5Title'), desc: t('feature5Desc') },
    { title: t('feature6Title'), desc: t('feature6Desc') },
  ];

  const HOW_STEPS = [
    { n: 1, title: t('how1Title'), desc: t('how1Desc') },
    { n: 2, title: t('how2Title'), desc: t('how2Desc') },
    { n: 3, title: t('how3Title'), desc: t('how3Desc') },
    { n: 4, title: t('how4Title'), desc: t('how4Desc') },
  ];

  const TRUST_ITEMS = [
    { icon: Shield, text: t('trust1') },
    { icon: CheckCircle, text: t('trust2') },
    { icon: Lock, text: t('trust3') },
    { icon: Sparkles, text: t('trust4') },
  ];

  const STATS = [
    { v: '$48.2M', l: t('statRaised'), s: t('statRaisedSub') },
    { v: '127', l: t('statProjects'), s: t('statProjectsSub') },
    { v: '54,213', l: t('statParticipants'), s: t('statParticipantsSub') },
    { v: '12.4×', l: t('statRoi'), s: t('statRoiSub') },
  ];

  return (
    <div className="pt-[100px]">
      {/* HERO */}
      <section className="py-10 md:py-16 relative">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-[1.15fr_1fr] gap-12 items-center">
            <div>
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="live">{t('badge1')}</Badge>
                <Badge variant="ai" />
              </div>
              <h1 className="font-[family-name:var(--font-display)] text-[clamp(2.4rem,6vw,4.4rem)] font-extrabold leading-[0.98] tracking-[-0.04em] mb-5">
                {t('heroTitle1')}{' '}
                <span className="bg-gradient-to-br from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                  {t('heroTitle2')}
                </span>
                <br />
                <span className="text-white">{t('heroTitle3')}</span>
              </h1>
              <p className="text-white/70 text-[1.1rem] leading-relaxed mb-8 max-w-[540px]">
                {t('heroDesc')}
              </p>
              <div className="flex flex-wrap gap-3 mb-10">
                <Button size="lg" asChild>
                  <Link href="/create">
                    <Plus className="w-[18px] h-[18px]" />
                    {t('cta1')}
                  </Link>
                </Button>
                <Button variant="secondary" size="lg" asChild>
                  <Link href="/projects">
                    {t('cta2')}
                    <ArrowRight className="w-[18px] h-[18px]" />
                  </Link>
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-3 sm:gap-6 pt-7 border-t border-white/5">
                {TRUST_ITEMS.map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-[0.82rem] text-white/50">
                    <Icon className="w-4 h-4 text-cyan-500 shrink-0" />
                    {text}
                  </div>
                ))}
              </div>
            </div>

            {/* Rocket */}
            <div className="relative flex justify-center items-center min-h-[480px] order-first lg:order-last">
              <div
                className="absolute w-[90%] h-[90%] rounded-full opacity-70"
                style={{
                  background: 'radial-gradient(circle, rgba(0, 212, 255, 0.25), transparent 65%)',
                  filter: 'blur(50px)',
                  animation: 'glow-pulse 4s ease-in-out infinite',
                }}
              />
              <div
                className="absolute top-1/2 left-1/2 w-full h-full rounded-full border border-dashed border-cyan-500/15 pointer-events-none"
                style={{ animation: 'orbit 40s linear infinite' }}
              >
                <div className="absolute top-[5%] left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-cyan-500 shadow-[0_0_16px_#00d4ff]" />
                <div className="absolute bottom-[15%] left-[20%] w-2.5 h-2.5 rounded-full bg-violet-500 shadow-[0_0_16px_#8b5cf6]" />
              </div>
              <div
                className="absolute top-1/2 left-1/2 w-[115%] h-[115%] rounded-full border border-dashed border-violet-500/12 pointer-events-none"
                style={{ animation: 'orbit 60s linear infinite reverse' }}
              >
                <div className="absolute top-1/2 right-[5%] w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_16px_#0066ff]" />
              </div>
              <Image
                src="/assets/rocket.png"
                alt="Z-PAD Rocket"
                width={480}
                height={480}
                sizes="(max-width: 768px) 320px, 480px"
                className="max-w-[320px] md:max-w-[480px] w-full relative z-[3]"
                style={{
                  animation: 'float 6s ease-in-out infinite',
                  filter: 'drop-shadow(0 20px 60px rgba(0, 102, 255, 0.35))',
                }}
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="py-9 bg-gradient-to-b from-bg-100/40 to-bg-100/20 backdrop-blur-md border-y border-white/10 relative z-[1]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 text-center">
            {STATS.map((s) => (
              <div key={s.l} className="relative">
                <div className="font-[family-name:var(--font-display)] text-[clamp(1.6rem,3vw,2.4rem)] font-extrabold tracking-[-0.025em] leading-none mb-1.5 bg-gradient-to-br from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                  {s.v}
                </div>
                <div className="text-[0.78rem] text-white/50 uppercase tracking-[0.1em] font-semibold">{s.l}</div>
                <div className="text-[0.72rem] text-green-400 mt-1 font-[family-name:var(--font-mono)]">{s.s}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PROJECT */}
      {featured && (
        <section className="py-15 md:py-20">
          <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
            <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
              <div>
                <span className="inline-flex items-center gap-2 text-[0.72rem] font-semibold text-cyan-400 uppercase tracking-[0.12em] font-[family-name:var(--font-mono)] before:content-[''] before:w-6 before:h-px before:bg-cyan-500">
                  {t('featuredLabel')}
                </span>
                <h2 className="font-[family-name:var(--font-display)] text-[1.6rem] md:text-[2rem] font-extrabold tracking-[-0.025em] mt-2">
                  {t('featuredTitle')}<span className="text-cyan-500 font-black">.</span>
                </h2>
              </div>
              <Link href="/projects" className="inline-flex items-center gap-1.5 text-cyan-400 text-[0.88rem] font-medium hover:gap-2.5 transition-all">
                {t('viewDetails')} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="relative p-4 sm:p-6 md:p-8 bg-bg-075 border border-white/10 rounded-[20px] overflow-hidden">
              <span className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-cyan-500 via-blue-500 via-cyan-500 to-transparent" style={{ backgroundSize: '200% 100%', animation: 'shimmer 3s linear infinite' }} />

              <div className="flex flex-wrap gap-5 md:gap-8 items-start md:items-center mb-7">
                <div className="flex items-center gap-5">
                  <Image
                    src={featured.logo}
                    alt={featured.name}
                    width={80}
                    height={80}
                    sizes="80px"
                    priority
                    className="w-20 h-20 rounded-full border-2 border-cyan-500/30 shadow-[0_0_32px_rgba(0,212,255,0.28)] object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-[family-name:var(--font-display)] text-[1.8rem] font-extrabold tracking-[-0.025em] leading-tight mb-1.5">
                      {featured.name}
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-2.5">
                      <Badge variant="fairlaunch" />
                      <Badge variant="kyc" />
                      <Badge variant="audit" />
                      <Badge variant="refundable" />
                      <Badge variant="ai" />
                    </div>
                    <p className="text-white/70 text-[0.92rem] leading-relaxed max-w-[380px]">
                      {featured.description}
                    </p>
                  </div>
                </div>

                <div className="text-center">
                  <AiScore score={featured.aiScore} size="lg" />
                  <div className="mt-2.5 text-[0.72rem] text-white/50 max-w-[120px] mx-auto">
                    {t('badge2')}
                  </div>
                </div>

                <div className="flex sm:flex-col gap-2 w-full sm:w-auto sm:min-w-[140px]">
                  <div className="p-3 rounded-[10px] bg-white/[0.02] border border-white/10">
                    <div className="text-[0.7rem] text-white/50 uppercase tracking-[0.08em] font-semibold mb-1">Token</div>
                    <div className="font-[family-name:var(--font-mono)] font-extrabold">{featured.symbol}</div>
                  </div>
                  <div className="p-3 rounded-[10px] bg-white/[0.02] border border-white/10">
                    <div className="text-[0.7rem] text-white/50 uppercase tracking-[0.08em] font-semibold mb-1">Chain</div>
                    <ChainChip chain={featured.chain} chainName={featured.chainName} />
                  </div>
                </div>
              </div>

              <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6 lg:gap-10 pt-6 border-t border-white/5">
                <div>
                  <h4 className="text-[0.72rem] text-white/50 uppercase tracking-[0.08em] font-bold mb-3">{t('raised')}</h4>
                  <div className="font-[family-name:var(--font-display)] text-[2.4rem] font-extrabold tracking-[-0.025em] leading-none mb-2 bg-gradient-to-br from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                    {fmt.currency(featured.raised)}
                  </div>
                  <div className="text-[0.9rem] text-white/50 mb-4">
                    of <strong className="text-white font-semibold font-[family-name:var(--font-mono)]">{fmt.currency(featured.target)}</strong>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mb-2.5">
                    <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full shadow-[0_0_12px_rgba(0,212,255,0.4)]" style={{ width: `${(featured.raised / featured.target) * 100}%` }} />
                  </div>
                  <div className="flex justify-between text-[0.75rem] text-white/50">
                    <span>{t('softCap')}: {fmt.currency(featured.softCap)}</span>
                    <span>{t('liquidity')}: {featured.liquidity}%</span>
                  </div>
                  <div className="mt-5 flex gap-2.5 flex-wrap">
                    <Button asChild>
                      <Link href={`/projects/${featured.id}`}>{t('participateNow')}</Link>
                    </Button>
                    <Button variant="secondary" asChild>
                      <Link href={`/projects/${featured.id}`}>{t('viewDetails')}</Link>
                    </Button>
                  </div>
                </div>

                <div className="lg:text-right">
                  <h4 className="text-[0.72rem] text-white/50 uppercase tracking-[0.08em] font-bold mb-3 lg:text-right">{t('remaining')}</h4>
                  <Countdown targetMs={featured.endsAt} className="lg:justify-end" />
                  <div className="mt-3.5 inline-flex items-center gap-1.5 text-[0.8rem] text-green-400 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_6px_#00e676] animate-pulse-dot" />
                    {t('saleLive')} · {fmt.number(featured.participants)} {t('participants')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* LIVE GRID */}
      <section className="py-8">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-7 flex-wrap gap-4">
            <div>
              <span className="inline-flex items-center gap-2 text-[0.72rem] font-semibold text-cyan-400 uppercase tracking-[0.12em] font-[family-name:var(--font-mono)] before:content-[''] before:w-6 before:h-px before:bg-cyan-500">
                {t('liveLabel')}
              </span>
              <h2 className="font-[family-name:var(--font-display)] text-[1.6rem] md:text-[2rem] font-extrabold tracking-[-0.025em] mt-2">
                {t('liveTitle')}<span className="text-cyan-500 font-black">.</span>
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {liveProjects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-15 md:py-20">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center text-center mb-12">
            <span className="inline-flex items-center gap-2 text-[0.72rem] font-semibold text-cyan-400 uppercase tracking-[0.12em] font-[family-name:var(--font-mono)] before:content-[''] before:w-6 before:h-px before:bg-cyan-500 mb-3">
              {t('featuresLabel')}
            </span>
            <h2 className="font-[family-name:var(--font-display)] text-[2.2rem] md:text-[2.6rem] font-extrabold tracking-[-0.025em]">
              {t('featuresTitle1')}{' '}
              <span className="bg-gradient-to-br from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                {t('featuresTitle2')}
              </span>
            </h2>
            <p className="text-white/70 max-w-[620px] mt-3.5 text-[1.02rem] leading-relaxed">
              {t('featuresDesc')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="bg-bg-075 border border-white/10 rounded-[14px] p-7 transition-all duration-[250ms] hover:border-cyan-500/35 hover:-translate-y-0.5 hover:shadow-[0_0_16px_rgba(0,212,255,0.18)]"
              >
                <div className="w-[52px] h-[52px] rounded-[10px] bg-gradient-to-br from-cyan-500/12 to-blue-500/8 border border-cyan-500/20 flex items-center justify-center mb-5 text-cyan-400">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="font-[family-name:var(--font-display)] font-bold text-[1.1rem] mb-2.5 tracking-[-0.015em]">
                  {f.title}
                </h3>
                <p className="text-white/70 text-[0.9rem] leading-relaxed">{f.desc}</p>
                {f.badge && (
                  <div className="mt-4">
                    <Badge variant={f.badge} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-15">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center text-center mb-10">
            <span className="inline-flex items-center gap-2 text-[0.72rem] font-semibold text-cyan-400 uppercase tracking-[0.12em] font-[family-name:var(--font-mono)] before:content-[''] before:w-6 before:h-px before:bg-cyan-500">
              {t('howLabel')}
            </span>
            <h2 className="font-[family-name:var(--font-display)] text-[1.6rem] md:text-[2rem] font-extrabold tracking-[-0.025em] mt-2.5">
              {t('howTitle')}<span className="text-cyan-500 font-black">.</span>
            </h2>
            <p className="text-white/70 max-w-[540px] mt-3">{t('howDesc')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {HOW_STEPS.map((s) => (
              <div
                key={s.n}
                className="relative bg-bg-075 border border-white/10 rounded-[14px] p-7 transition-all hover:border-cyan-500/35 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center font-[family-name:var(--font-display)] font-extrabold text-[1.2rem] text-[#021628] mb-4 shadow-[0_0_32px_rgba(0,212,255,0.28)]">
                  {s.n}
                </div>
                <h3 className="font-[family-name:var(--font-display)] font-bold text-[1.05rem] mb-2 tracking-[-0.015em]">
                  {s.title}
                </h3>
                <p className="text-[0.86rem] text-white/70 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden text-center">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(0, 212, 255, 0.12), transparent 60%)' }}
        />
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 relative">
          <h2 className="font-[family-name:var(--font-display)] text-[2.2rem] md:text-[3.6rem] font-extrabold tracking-[-0.035em] leading-tight mb-4">
            {t('ctaTitle1')}{' '}
            <span className="bg-gradient-to-br from-cyan-500 to-blue-500 bg-clip-text text-transparent">
              {t('ctaTitle2')}
            </span>
            ?
          </h2>
          <p className="text-white/70 text-[1.08rem] max-w-[560px] mx-auto mb-9 leading-relaxed">
            {t('ctaDesc')}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button size="xl" asChild>
              <Link href="/create">
                <Plus className="w-5 h-5" />
                {t('cta1')}
              </Link>
            </Button>
            <Button variant="secondary" size="xl" asChild>
              <Link href="/projects">{t('ctaBrowse')}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
