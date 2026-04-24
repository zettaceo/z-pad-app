// ISR: regenerate the homepage every hour so the featured-project countdown
// and live-grid statuses reflect current mock timestamps.
export const revalidate = 3600;

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Plus, Shield, CheckCircle, Lock, Sparkles } from 'lucide-react';

import { PROJECTS } from '@/lib/mock-data';
import { fmt } from '@/lib/format';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ChainChip } from '@/components/features/ChainChip';
import { AiScore } from '@/components/features/AiScore';
import { ProjectCard } from '@/components/features/ProjectCard';
import { Countdown } from '@/components/features/Countdown';

const FEATURES = [
  {
    title: 'ZION AI Vetting',
    desc: 'Every project gets an AI Score 0-100 analyzing tokenomics, smart contracts, team history, and market fit. No other launchpad has this.',
    badge: 'ai' as const,
  },
  {
    title: 'Fiat On-Ramp Built-In',
    desc: 'Buy tokens directly with credit card, PIX, or wire transfer via Z-PAY. Zero other launchpads offer this.',
    badge: 'hot' as const,
  },
  {
    title: 'Refundable Sales (DYCO)',
    desc: 'Full refund within 48h of TGE if KPIs not met. Protects investors — pioneered by DAO Maker, now default here.',
    badge: 'refundable' as const,
  },
  {
    title: 'Reputation Over Staking',
    desc: 'Your on-chain reputation replaces staking requirements. No more locking $50k in platform tokens to access good projects.',
  },
  {
    title: 'All Sale Mechanisms',
    desc: 'Fair Launch, Presale, Private, LBP, Bonding Curve — we support everything. Competitors support 1-2.',
  },
  {
    title: 'Z-BANCK Integration',
    desc: 'Native Z-BANCK fintech integration: invest with fiat balance, receive profits in USD/BRL, use positions as collateral.',
  },
];

const HOW_STEPS = [
  { n: 1, title: 'Connect Wallet', desc: 'Link MetaMask, Obelisk-Z, or pay with fiat — no wallet required.' },
  { n: 2, title: 'Complete KYC', desc: 'Verify once. Unlocks private rounds across the entire ZETTA ecosystem.' },
  { n: 3, title: 'Invest', desc: 'Browse AI-vetted projects. Participate with crypto or fiat.' },
  { n: 4, title: 'Claim & Earn', desc: 'Claim at TGE, track vesting, stake for extra rewards.' },
];

export default function HomePage() {
  const featured = PROJECTS.find((p) => p.featured);
  const liveProjects = PROJECTS.filter((p) => p.status === 'live' || p.status === 'upcoming').slice(0, 6);

  return (
    <div className="pt-[100px]">
      {/* HERO */}
      <section className="py-10 md:py-16 relative">
        <div className="max-w-[1360px] mx-auto px-6">
          <div className="grid lg:grid-cols-[1.15fr_1fr] gap-12 items-center">
            <div>
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="live">Live on 7 Chains</Badge>
                <Badge variant="ai" />
              </div>
              <h1 className="font-[family-name:var(--font-display)] text-[clamp(2.4rem,6vw,4.4rem)] font-extrabold leading-[0.98] tracking-[-0.04em] mb-5">
                The Only{' '}
                <span className="bg-gradient-to-br from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                  Launchpad
                </span>
                <br />
                <span className="text-white">You'll Ever Need.</span>
              </h1>
              <p className="text-white/70 text-[1.1rem] leading-relaxed mb-8 max-w-[540px]">
                Permissionless. AI-vetted. Multi-chain. With native fiat rails, Z-BANCK integration,
                and refundable sales. Every feature the competition lacks — and then some.
              </p>
              <div className="flex flex-wrap gap-3 mb-10">
                <Button size="lg" asChild>
                  <Link href="/create">
                    <Plus className="w-[18px] h-[18px]" />
                    Launch Your Project
                  </Link>
                </Button>
                <Button variant="secondary" size="lg" asChild>
                  <Link href="/projects">
                    Explore Sales
                    <ArrowRight className="w-[18px] h-[18px]" />
                  </Link>
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-6 pt-7 border-t border-white/5">
                {[
                  { icon: Shield, text: 'Audited by Cyberscope' },
                  { icon: CheckCircle, text: 'KYC Verified Teams' },
                  { icon: Lock, text: 'LP Locked 100 Years' },
                  { icon: Sparkles, text: 'AI-Powered Vetting' },
                ].map(({ icon: Icon, text }) => (
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
                style={{
                  animation: 'orbit 40s linear infinite',
                }}
              >
                <div className="absolute top-[5%] left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-cyan-500 shadow-[0_0_16px_#00d4ff]" />
                <div className="absolute bottom-[15%] left-[20%] w-2.5 h-2.5 rounded-full bg-violet-500 shadow-[0_0_16px_#8b5cf6]" />
              </div>
              <div
                className="absolute top-1/2 left-1/2 w-[115%] h-[115%] rounded-full border border-dashed border-violet-500/12 pointer-events-none"
                style={{
                  animation: 'orbit 60s linear infinite reverse',
                }}
              >
                <div className="absolute top-1/2 right-[5%] w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_16px_#0066ff]" />
              </div>
              <Image
                src="/assets/rocket.png"
                alt="Z-PAD Rocket"
                width={480}
                height={480}
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
        <div className="max-w-[1360px] mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { v: '$48.2M', l: 'Total Raised', s: '+$2.1M this week' },
              { v: '127', l: 'Projects Launched', s: '94% post-launch ROI' },
              { v: '54,213', l: 'Participants', s: '+842 today' },
              { v: '12.4×', l: 'Avg. ROI', s: 'Industry-leading' },
            ].map((s) => (
              <div key={s.l} className="relative">
                <div className="font-[family-name:var(--font-display)] text-[clamp(1.6rem,3vw,2.4rem)] font-extrabold tracking-[-0.025em] leading-none mb-1.5 bg-gradient-to-br from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                  {s.v}
                </div>
                <div className="text-[0.78rem] text-white/50 uppercase tracking-[0.1em] font-semibold">
                  {s.l}
                </div>
                <div className="text-[0.72rem] text-green-400 mt-1 font-[family-name:var(--font-mono)]">
                  {s.s}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PROJECT */}
      {featured && (
        <section className="py-15 md:py-20">
          <div className="max-w-[1360px] mx-auto px-6">
            <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
              <div>
                <span className="inline-flex items-center gap-2 text-[0.72rem] font-semibold text-cyan-400 uppercase tracking-[0.12em] font-[family-name:var(--font-mono)] before:content-[''] before:w-6 before:h-px before:bg-cyan-500">
                  Spotlight
                </span>
                <h2 className="font-[family-name:var(--font-display)] text-[1.6rem] md:text-[2rem] font-extrabold tracking-[-0.025em] mt-2">
                  Featured Project<span className="text-cyan-500 font-black">.</span>
                </h2>
              </div>
              <Link href="/projects" className="inline-flex items-center gap-1.5 text-cyan-400 text-[0.88rem] font-medium hover:gap-2.5 transition-all">
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="relative p-8 bg-bg-075 border border-white/10 rounded-[20px] overflow-hidden">
              <span className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-cyan-500 via-blue-500 via-cyan-500 to-transparent" style={{ backgroundSize: '200% 100%', animation: 'shimmer 3s linear infinite' }} />

              <div className="grid lg:grid-cols-[1fr_auto_auto] gap-8 items-center mb-7">
                <div className="flex items-center gap-5">
                  <Image
                    src="/assets/logo-z.png"
                    alt={featured.name}
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-full border-2 border-cyan-500/30 shadow-[0_0_32px_rgba(0,212,255,0.28)]"
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
                    Analyzed by ZION AI across 6 dimensions
                  </div>
                </div>

                <div className="flex flex-col gap-2 min-w-[140px]">
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

              <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10 pt-6 border-t border-white/5">
                <div>
                  <h4 className="text-[0.72rem] text-white/50 uppercase tracking-[0.08em] font-bold mb-3">Raised</h4>
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
                    <span>Soft Cap: {fmt.currency(featured.softCap)}</span>
                    <span>Liquidity: {featured.liquidity}%</span>
                  </div>
                  <div className="mt-5 flex gap-2.5 flex-wrap">
                    <Button asChild>
                      <Link href={`/projects/${featured.id}`}>Participate Now</Link>
                    </Button>
                    <Button variant="secondary" asChild>
                      <Link href={`/projects/${featured.id}`}>View Details</Link>
                    </Button>
                  </div>
                </div>

                <div className="lg:text-right">
                  <h4 className="text-[0.72rem] text-white/50 uppercase tracking-[0.08em] font-bold mb-3 lg:text-right">Remaining</h4>
                  <Countdown targetMs={featured.endsAt} className="lg:justify-end" />
                  <div className="mt-3.5 inline-flex items-center gap-1.5 text-[0.8rem] text-green-400 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_6px_#00e676] animate-pulse-dot" />
                    Sale is Live · {fmt.number(featured.participants)} participants
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* LIVE GRID */}
      <section className="py-8">
        <div className="max-w-[1360px] mx-auto px-6">
          <div className="flex items-end justify-between mb-7 flex-wrap gap-4">
            <div>
              <span className="eyebrow inline-flex items-center gap-2 text-[0.72rem] font-semibold text-cyan-400 uppercase tracking-[0.12em] font-[family-name:var(--font-mono)] before:content-[''] before:w-6 before:h-px before:bg-cyan-500">
                Now Trading
              </span>
              <h2 className="font-[family-name:var(--font-display)] text-[1.6rem] md:text-[2rem] font-extrabold tracking-[-0.025em] mt-2">
                Live & Upcoming<span className="text-cyan-500 font-black">.</span>
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
        <div className="max-w-[1360px] mx-auto px-6">
          <div className="flex flex-col items-center text-center mb-12">
            <span className="inline-flex items-center gap-2 text-[0.72rem] font-semibold text-cyan-400 uppercase tracking-[0.12em] font-[family-name:var(--font-mono)] before:content-[''] before:w-6 before:h-px before:bg-cyan-500 mb-3">
              Why Z-PAD
            </span>
            <h2 className="font-[family-name:var(--font-display)] text-[2.2rem] md:text-[2.6rem] font-extrabold tracking-[-0.025em]">
              Features{' '}
              <span className="bg-gradient-to-br from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                nobody else has
              </span>
            </h2>
            <p className="text-white/70 max-w-[620px] mt-3.5 text-[1.02rem] leading-relaxed">
              We built Z-PAD to solve every pain point of PinkSale, DAO Maker, Seedify, and every
              other launchpad combined.
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
        <div className="max-w-[1360px] mx-auto px-6">
          <div className="flex flex-col items-center text-center mb-10">
            <span className="inline-flex items-center gap-2 text-[0.72rem] font-semibold text-cyan-400 uppercase tracking-[0.12em] font-[family-name:var(--font-mono)] before:content-[''] before:w-6 before:h-px before:bg-cyan-500">
              Simple
            </span>
            <h2 className="font-[family-name:var(--font-display)] text-[1.6rem] md:text-[2rem] font-extrabold tracking-[-0.025em] mt-2.5">
              How It Works<span className="text-cyan-500 font-black">.</span>
            </h2>
            <p className="text-white/70 max-w-[540px] mt-3">
              From zero to invested in under 3 minutes.
            </p>
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
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(0, 212, 255, 0.12), transparent 60%)',
          }}
        />
        <div className="max-w-[1360px] mx-auto px-6 relative">
          <h2 className="font-[family-name:var(--font-display)] text-[2.2rem] md:text-[3.6rem] font-extrabold tracking-[-0.035em] leading-tight mb-4">
            Ready to{' '}
            <span className="bg-gradient-to-br from-cyan-500 to-blue-500 bg-clip-text text-transparent">
              launch
            </span>
            ?
          </h2>
          <p className="text-white/70 text-[1.08rem] max-w-[560px] mx-auto mb-9 leading-relaxed">
            Join 54,000+ investors already backing the next generation of Web3 projects through the
            most advanced launchpad ever built.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button size="xl" asChild>
              <Link href="/create">
                <Plus className="w-5 h-5" />
                Launch Your Project
              </Link>
            </Button>
            <Button variant="secondary" size="xl" asChild>
              <Link href="/projects">Browse Sales</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
