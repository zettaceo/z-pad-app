'use client';

import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

import { useWallet } from '@/lib/wallet-store';
import { Button } from '@/components/ui/Button';
import { fmt } from '@/lib/format';

const POOLS = [
  {
    name: 'Flexible',
    duration: 'No Lock',
    sub: 'Withdraw anytime',
    apy: 18,
    features: ['No lock period', 'Compound daily', 'Tier 1 boost'],
    variant: 'secondary' as const,
  },
  {
    name: 'Balanced',
    duration: '90 Days',
    sub: 'Best risk/reward',
    apy: 68,
    features: ['90-day lock', '50% fee discount', 'Tier 3 boost · 2x voting'],
    variant: 'primary' as const,
    recommended: true,
  },
  {
    name: 'Maximum',
    duration: '365 Days',
    sub: 'Maximum rewards',
    apy: 142,
    features: ['365-day lock', '100% fee discount', 'Tier 5 · private sales', 'Exclusive NFT drop'],
    variant: 'gold' as const,
  },
];

export default function StakingPage() {
  const { wallet } = useWallet();

  return (
    <div className="pt-[100px]">
      <section className="pt-10 pb-6 border-b border-white/5">
        <div className="max-w-[1360px] mx-auto px-6">
          <div className="flex items-center gap-2 text-[0.82rem] text-white/50 mb-4">
            <Link href="/" className="hover:text-cyan-400">Home</Link>
            <span className="text-white/30">/</span>
            <span>Staking</span>
          </div>
          <span className="inline-flex items-center gap-2 text-[0.72rem] font-semibold text-cyan-400 uppercase tracking-[0.12em] font-[family-name:var(--font-mono)] before:content-[''] before:w-6 before:h-px before:bg-cyan-500">
            Z Staking
          </span>
          <h1 className="font-[family-name:var(--font-display)] text-[clamp(1.8rem,4vw,2.8rem)] font-extrabold tracking-[-0.03em] mt-2.5">
            Stake Z. <span className="bg-gradient-to-br from-cyan-500 to-blue-500 bg-clip-text text-transparent">Earn everywhere.</span>
          </h1>
          <p className="text-white/70 mt-2 max-w-[640px]">
            Reduce fees, unlock tier boosts, earn rewards, and gain governance voting power.
          </p>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-[1360px] mx-auto px-6">
          {/* Stats panel */}
          <div className="bg-gradient-to-br from-cyan-500/[0.06] to-violet-500/[0.04] border border-white/10 rounded-[20px] p-9 mb-8 relative overflow-hidden">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 relative">
              {[
                { l: 'Total Staked', v: '48.2M Z', accent: true },
                { l: 'Your Stake', v: wallet.connected ? `${fmt.number(wallet.stakedZ)} Z` : '0 Z' },
                { l: 'Avg APY', v: '68.4%', accent: true },
                { l: 'Stakers', v: '12,847' },
              ].map((s) => (
                <div key={s.l}>
                  <div className="text-[0.72rem] text-white/50 uppercase tracking-wider font-semibold mb-1.5">
                    {s.l}
                  </div>
                  <div className={`font-[family-name:var(--font-display)] text-[1.8rem] font-extrabold tracking-[-0.025em] ${s.accent ? 'bg-gradient-to-br from-cyan-500 to-blue-500 bg-clip-text text-transparent' : ''}`}>
                    {s.v}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <h2 className="font-[family-name:var(--font-display)] text-[1.6rem] font-extrabold tracking-[-0.025em] mb-7">
            Choose your pool<span className="text-cyan-500 font-black">.</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-5">
            {POOLS.map((pool) => (
              <div
                key={pool.name}
                className={`relative bg-bg-075 border rounded-[14px] p-6 transition-all hover:-translate-y-1 ${
                  pool.recommended
                    ? 'border-cyan-500/35 bg-gradient-to-b from-cyan-500/[0.04] to-transparent'
                    : 'border-white/10'
                }`}
              >
                {pool.recommended && (
                  <div className="absolute top-4 right-4 px-2.5 py-[3px] rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 text-[#021628] text-[0.68rem] font-bold uppercase tracking-wider">
                    ★ Recommended
                  </div>
                )}
                <div className="text-[0.74rem] text-white/50 uppercase tracking-wider font-semibold mb-1">
                  {pool.name}
                </div>
                <div className="font-[family-name:var(--font-display)] text-[2rem] font-extrabold tracking-[-0.02em] leading-none mb-1">
                  {pool.duration}
                </div>
                <div className="text-[0.82rem] text-white/70 mt-1">{pool.sub}</div>
                <div className="text-[0.74rem] text-white/50 uppercase tracking-wider font-semibold mt-4 mb-2">
                  APY
                </div>
                <div className="font-[family-name:var(--font-display)] text-[2.6rem] font-extrabold bg-gradient-to-br from-cyan-500 to-blue-500 bg-clip-text text-transparent tracking-[-0.025em] leading-none mb-4">
                  {pool.apy}%
                </div>
                <ul className="my-4 space-y-1.5">
                  {pool.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-[0.86rem] text-white/70">
                      <CheckCircle className="w-3.5 h-3.5 text-green-400 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button block variant={pool.variant}>
                  Stake {pool.duration === 'No Lock' ? 'Flexible' : pool.duration}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
