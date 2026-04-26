'use client';

import Link from 'next/link';
import { Zap, Users, Lock, Vote, Shield, TrendingUp, Trophy, Gift } from 'lucide-react';

import { useTranslations } from 'next-intl';

import { useWallet } from '@/lib/wallet-store';
import { QUESTS } from '@/lib/mock-data';
import { fmt } from '@/lib/format';
import { cn } from '@/lib/cn';

const ICONS = { Zap, Users, Lock, Vote, Shield, TrendingUp } as const;

const LEADERBOARD = [
  { rank: 1, address: '0x8a4c...f8e2', tier: 'Diamond', stake: 125000, value: 2480000 },
  { rank: 2, address: '0x7f23...a9b1', tier: 'Diamond', stake: 98000, value: 1920000 },
  { rank: 3, address: '0x3d12...c5f4', tier: 'Diamond', stake: 87500, value: 1650000 },
  { rank: 4, address: '0x9e45...d2a7', tier: 'Platinum', stake: 62000, value: 1180000 },
  { rank: 5, address: '0x5b28...e4c3', tier: 'Platinum', stake: 54000, value: 980000 },
  { rank: 42, address: '0x072c...1668a', tier: 'Silver', stake: 5000, value: 48750, you: true },
];

const TIER_COLORS: Record<string, string> = {
  Diamond: 'text-[#b9f2ff] bg-[#b9f2ff]/10 border-[#b9f2ff]/30',
  Platinum: 'text-[#e5e4e2] bg-white/10 border-white/30',
  Gold: 'text-gold-400 bg-gold-500/10 border-gold-500/30',
  Silver: 'text-white/60 bg-white/5 border-white/15',
};

export default function RewardsPage() {
  const { wallet } = useWallet();
  const t = useTranslations('rewards');
  const tc = useTranslations('common');
  const xpToNext = 3500;
  const xpProgress = (wallet.xp / xpToNext) * 100;

  return (
    <div className="pt-[100px]">
      <section className="pt-10 pb-6 border-b border-white/5">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 text-[0.82rem] text-white/50 mb-4">
            <Link href="/" className="hover:text-cyan-400">{tc('home')}</Link>
            <span className="text-white/30">/</span>
            <span>{t('breadcrumb')}</span>
          </div>
          <span className="inline-flex items-center gap-2 text-[0.72rem] font-semibold text-cyan-400 uppercase tracking-[0.12em] font-[family-name:var(--font-mono)] before:content-[''] before:w-6 before:h-px before:bg-cyan-500">
            {t('label')}
          </span>
          <h1 className="font-[family-name:var(--font-display)] text-[clamp(1.8rem,4vw,2.8rem)] font-extrabold tracking-[-0.03em] mt-2.5">
            {t('title1')} <span className="bg-gradient-to-br from-cyan-500 to-blue-500 bg-clip-text text-transparent">{t('title2')}</span>
          </h1>
          <p className="text-white/70 mt-2 max-w-[640px]">
            {t('desc')}
          </p>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
          {/* XP Panel */}
          <div className="relative bg-gradient-to-br from-cyan-500/[0.06] to-violet-500/[0.04] border border-cyan-500/20 rounded-[20px] p-8 mb-8 overflow-hidden">
            <div
              className="absolute inset-0 pointer-events-none opacity-40"
              style={{ background: 'radial-gradient(ellipse at 80% 20%, rgba(0,212,255,0.15), transparent 60%)' }}
            />
            <div className="grid sm:grid-cols-[auto_1fr] lg:grid-cols-[auto_1fr_auto] gap-6 items-center relative">
              <div className="w-[100px] h-[100px] rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-[#021628] shadow-[0_0_32px_rgba(0,212,255,0.4)] shrink-0">
                <Trophy className="w-12 h-12" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap mb-2">
                  <div className="font-[family-name:var(--font-display)] text-[1.6rem] font-extrabold tracking-[-0.02em]">
                    Level {wallet.level || 4}
                  </div>
                  <span className="px-2.5 py-[3px] rounded-full bg-gradient-to-br from-cyan-500/15 to-violet-500/15 text-[#c4b5fd] border border-violet-500/30 text-[0.68rem] font-bold uppercase tracking-wider">
                    {t('silverTier')}
                  </span>
                </div>
                <div className="text-[0.88rem] text-white/70 mb-3">
                  {t('reputation')}: <strong className="text-cyan-400">{wallet.reputation || 72}/100</strong>
                  {' · '}XP: <strong className="font-[family-name:var(--font-mono)]">{fmt.number(wallet.xp || 2840)} / {fmt.number(xpToNext)}</strong>
                </div>
                <div
                  className="h-2.5 bg-white/5 rounded-full overflow-hidden max-w-[480px]"
                  role="progressbar"
                  aria-label="XP progress"
                  aria-valuenow={Math.round(wallet.xp || 2840)}
                  aria-valuemin={0}
                  aria-valuemax={xpToNext}
                >
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full shadow-[0_0_12px_rgba(0,212,255,0.4)] transition-[width] duration-1000"
                    style={{ width: `${xpProgress}%` }}
                  />
                </div>
                <div className="text-[0.78rem] text-white/50 mt-2 font-[family-name:var(--font-mono)]">
                  {fmt.number(xpToNext - (wallet.xp || 2840))} {t('xpTo')} {(wallet.level || 4) + 1}
                </div>
              </div>
              <div className="flex sm:flex-row lg:flex-col gap-3 sm:col-span-full lg:col-span-1 lg:min-w-[180px]">
                <div className="p-3 rounded-[10px] bg-white/[0.03] border border-white/10 text-center">
                  <div className="text-[0.7rem] text-white/50 uppercase tracking-wider font-semibold mb-1">{t('earned')}</div>
                  <div className="font-[family-name:var(--font-mono)] text-cyan-400 font-extrabold text-xl">+2,150 Z</div>
                </div>
                <div className="p-3 rounded-[10px] bg-white/[0.03] border border-white/10 text-center">
                  <div className="text-[0.7rem] text-white/50 uppercase tracking-wider font-semibold mb-1">{t('nfts')}</div>
                  <div className="font-[family-name:var(--font-mono)] text-gold-400 font-extrabold text-xl">3</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quests */}
          <h2 className="font-[family-name:var(--font-display)] text-[1.4rem] font-extrabold tracking-[-0.025em] mb-5">
            {t('activeQuests')}<span className="text-cyan-500 font-black">.</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {QUESTS.map((q) => {
              const Icon = ICONS[q.icon as keyof typeof ICONS] ?? Gift;
              return (
                <div
                  key={q.id}
                  className={cn(
                    'relative bg-bg-075 border rounded-[14px] p-5 transition-all',
                    q.completed
                      ? 'border-green-500/30 bg-green-400/[0.03]'
                      : 'border-white/10 hover:border-cyan-500/35 hover:-translate-y-0.5'
                  )}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className={cn(
                        'w-11 h-11 rounded-md flex items-center justify-center shrink-0 border',
                        q.completed
                          ? 'bg-green-400/10 border-green-400/30 text-green-400'
                          : 'bg-gradient-to-br from-cyan-500/12 to-blue-500/8 border-cyan-500/20 text-cyan-400'
                      )}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-[family-name:var(--font-display)] font-bold text-[0.98rem] tracking-[-0.015em]">
                        {q.title}
                      </div>
                      <div className="text-[0.8rem] text-white/70 mt-1 leading-snug">{q.desc}</div>
                    </div>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden mb-2">
                    <div
                      className={cn(
                        'h-full rounded-full transition-[width] duration-700',
                        q.completed
                          ? 'bg-green-500'
                          : 'bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_8px_rgba(0,212,255,0.3)]'
                      )}
                      style={{ width: `${q.progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[0.76rem]">
                    <span className="text-cyan-400 font-[family-name:var(--font-mono)] font-semibold">{q.reward}</span>
                    <span className="text-white/50 font-[family-name:var(--font-mono)]">
                      {q.completed ? t('completed') : `${q.progress}%`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Leaderboard */}
          <h2 className="font-[family-name:var(--font-display)] text-[1.4rem] font-extrabold tracking-[-0.025em] mb-5">
            {t('leaderboard')}<span className="text-cyan-500 font-black">.</span>
          </h2>
          <div className="bg-bg-075 border border-white/10 rounded-[14px] overflow-x-auto">
            <table className="w-full min-w-[560px] text-[0.88rem]">
              <thead>
                <tr className="bg-white/[0.02]">
                  {[t('colRank'), t('colAddress'), t('colTier'), t('colStaked'), t('colPortfolio')].map((h) => (
                    <th key={h} className="text-left p-4 font-semibold text-[0.7rem] uppercase tracking-[0.08em] text-white/50 border-b border-white/10">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {LEADERBOARD.map((row) => (
                  <tr
                    key={row.rank}
                    className={cn(
                      'border-b border-white/5 last:border-0',
                      row.you ? 'bg-cyan-500/[0.05]' : 'hover:bg-white/[0.02]'
                    )}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          'font-[family-name:var(--font-display)] font-extrabold text-lg',
                          row.rank === 1 && 'text-gold-400',
                          row.rank === 2 && 'text-[#c0c0c0]',
                          row.rank === 3 && 'text-[#cd7f32]',
                          row.rank > 3 && 'text-white/70'
                        )}>
                          #{row.rank}
                        </span>
                        {row.you && (
                          <span className="text-[0.62rem] px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-bold uppercase">
                            {t('you')}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 font-[family-name:var(--font-mono)] text-cyan-400 text-[0.84rem]">
                      {row.address}
                    </td>
                    <td className="p-4">
                      <span className={cn(
                        'inline-flex items-center px-2.5 py-1 rounded-full border text-[0.68rem] font-bold uppercase tracking-wider',
                        TIER_COLORS[row.tier]
                      )}>
                        {row.tier}
                      </span>
                    </td>
                    <td className="p-4 font-[family-name:var(--font-mono)] font-semibold">
                      {fmt.number(row.stake)} Z
                    </td>
                    <td className="p-4 font-[family-name:var(--font-mono)] font-semibold">
                      {fmt.currency(row.value)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
