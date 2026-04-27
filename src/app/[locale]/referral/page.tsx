'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Users, Copy, Check, Gift, ChevronRight, TrendingUp,
  Twitter, Send, Star, Zap, Crown
} from 'lucide-react';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/Button';

const MOCK_REF_CODE = 'ZPAD-X7K2M';
const MOCK_REF_LINK = `https://zpad.io/r/${MOCK_REF_CODE}`;

const REFERRED_USERS = [
  { addr: '0x8a2e...4f1c', date: '2 days ago', invested: '$2,400', reward: '+48 Z', status: 'active' },
  { addr: '0x3b7d...9c3a', date: '5 days ago', invested: '$800', reward: '+16 Z', status: 'active' },
  { addr: '0x1e5f...2b8d', date: '12 days ago', invested: '$500', reward: '+10 Z', status: 'pending' },
];

export default function ReferralPage() {
  const t = useTranslations('referral');
  const tc = useTranslations('common');
  const [copied, setCopied] = useState(false);
  const totalRefs = REFERRED_USERS.length;
  const totalEarned = 74;

  const TIERS = [
    { refs: 1,  label: t('tier1Label'), reward: t('tier1Reward'), color: 'text-[#c0c0c0]', bg: 'bg-[#c0c0c0]/10' },
    { refs: 5,  label: t('tier2Label'), reward: t('tier2Reward'), color: 'text-[#ffd700]', bg: 'bg-[#ffd700]/10' },
    { refs: 15, label: t('tier3Label'), reward: t('tier3Reward'), color: 'text-cyan-400',   bg: 'bg-cyan-500/10'  },
    { refs: 50, label: t('tier4Label'), reward: t('tier4Reward'), color: 'text-violet-400', bg: 'bg-violet-500/10'},
  ];

  const currentTier = TIERS.find(tier => totalRefs >= tier.refs) ?? TIERS[0]!;
  const nextTier = TIERS[TIERS.indexOf(currentTier) + 1];

  const HOW_STEPS = [
    { n: '1', text: t('how1') },
    { n: '2', text: t('how2') },
    { n: '3', text: t('how3') },
    { n: '4', text: t('how4') },
  ];

  const copy = (text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const shareTwitter = () => {
    const text = encodeURIComponent(`Join Z-PAD — the AI-vetted crypto launchpad! Use my referral link and get bonus XP on your first investment. ${MOCK_REF_LINK}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const shareTelegram = () => {
    const text = encodeURIComponent(`Join Z-PAD — the AI-vetted crypto launchpad! Use my referral link: ${MOCK_REF_LINK}`);
    window.open(`https://t.me/share/url?url=${encodeURIComponent(MOCK_REF_LINK)}&text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="pt-[100px] pb-20 min-h-screen">
      <section className="pt-8">
        <div className="max-w-[860px] mx-auto px-4 sm:px-6">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[0.82rem] text-white/50 mb-6">
            <Link href="/" className="hover:text-cyan-400">{tc('home')}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span>{t('breadcrumb')}</span>
          </div>

          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-[0.78rem] font-semibold mb-4">
              <Gift className="w-3.5 h-3.5" /> {t('earnBadge')}
            </div>
            <h1 className="font-[family-name:var(--font-display)] text-[clamp(2rem,5vw,3.2rem)] font-extrabold tracking-[-0.04em] mb-3">
              {t('title')}
            </h1>
            <p className="text-white/60 text-[1rem] max-w-[520px] mx-auto">
              {t('desc')}
            </p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              { icon: Users, label: t('statRefs'), value: String(totalRefs), color: 'text-cyan-400' },
              { icon: Zap, label: t('statEarned'), value: `${totalEarned} Z`, color: 'text-green-400' },
              { icon: TrendingUp, label: t('statTier'), value: currentTier.label, color: currentTier.color },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="bg-bg-075 border border-white/10 rounded-[14px] p-4 text-center">
                <Icon className={cn('w-5 h-5 mx-auto mb-2', color)} />
                <div className={cn('font-[family-name:var(--font-display)] text-[1.4rem] font-extrabold tracking-tight mb-0.5', color)}>
                  {value}
                </div>
                <div className="text-[0.73rem] text-white/40">{label}</div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-[1fr_320px] gap-6">
            {/* Left column */}
            <div className="space-y-5">

              {/* Referral link card */}
              <div className="bg-bg-075 border border-cyan-500/20 rounded-[18px] p-6">
                <div className="text-[0.76rem] text-white/50 uppercase tracking-wider font-semibold mb-2">{t('yourLink')}</div>
                <div className="flex gap-2 mb-4">
                  <div className="flex-1 flex items-center px-4 py-3 rounded-[10px] bg-white/[0.03] border border-white/10 font-[family-name:var(--font-mono)] text-[0.84rem] text-cyan-300 overflow-hidden">
                    <span className="truncate">{MOCK_REF_LINK}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copy(MOCK_REF_LINK)}
                    className={cn(
                      'w-12 h-12 rounded-[10px] flex items-center justify-center border transition-all shrink-0',
                      copied
                        ? 'bg-green-400/15 border-green-400/40 text-green-400'
                        : 'bg-white/[0.03] border-white/10 text-white/60 hover:border-cyan-500/40 hover:text-cyan-400'
                    )}
                    aria-label="Copy link"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <div className="flex-1 h-px bg-white/8"/>
                  <span className="text-[0.74rem] text-white/30">{t('orCopyCode')}</span>
                  <div className="flex-1 h-px bg-white/8"/>
                </div>

                <div className="flex gap-2 items-center mb-5">
                  <div className="flex-1 flex items-center justify-center px-4 py-2.5 rounded-[10px] bg-gradient-to-br from-cyan-500/10 to-blue-500/5 border border-cyan-500/25 font-[family-name:var(--font-display)] font-extrabold text-[1.1rem] tracking-[0.12em] text-cyan-300">
                    {MOCK_REF_CODE}
                  </div>
                  <button
                    type="button"
                    onClick={() => copy(MOCK_REF_CODE)}
                    className="w-10 h-10 rounded-[8px] bg-white/[0.03] border border-white/10 text-white/50 flex items-center justify-center hover:text-cyan-400 hover:border-cyan-500/30 transition-all"
                    aria-label="Copy code"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Share buttons */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={shareTwitter}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[10px] bg-[#1d9bf0]/10 border border-[#1d9bf0]/25 text-[#1d9bf0] text-[0.84rem] font-semibold hover:bg-[#1d9bf0]/15 transition-all"
                  >
                    <Twitter className="w-4 h-4" /> {t('twitterBtn')}
                  </button>
                  <button
                    type="button"
                    onClick={shareTelegram}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[10px] bg-[#24a1de]/10 border border-[#24a1de]/25 text-[#24a1de] text-[0.84rem] font-semibold hover:bg-[#24a1de]/15 transition-all"
                  >
                    <Send className="w-4 h-4" /> {t('telegramBtn')}
                  </button>
                </div>
              </div>

              {/* Referred users table */}
              <div className="bg-bg-075 border border-white/10 rounded-[14px] p-6">
                <div className="font-[family-name:var(--font-display)] font-bold text-[1.05rem] mb-4">
                  {t('yourReferrals')} ({totalRefs})
                </div>
                {REFERRED_USERS.length > 0 ? (
                  <div className="space-y-2.5">
                    {REFERRED_USERS.map((u, i) => (
                      <div key={i} className="flex items-center gap-3 p-3.5 rounded-[10px] bg-white/[0.02] border border-white/5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center text-[0.72rem] font-bold text-cyan-400 shrink-0">
                          #{i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-[family-name:var(--font-mono)] text-[0.82rem] font-semibold">{u.addr}</div>
                          <div className="text-[0.72rem] text-white/40">{u.date} · invested {u.invested}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-green-400 font-[family-name:var(--font-mono)] font-bold text-[0.84rem]">{u.reward}</div>
                          <div className={cn(
                            'text-[0.7rem]',
                            u.status === 'active' ? 'text-green-400/70' : 'text-yellow-400/70'
                          )}>
                            {u.status}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-white/30 text-[0.9rem]">
                    {t('noReferrals')}
                  </div>
                )}
              </div>
            </div>

            {/* Right column — tier system */}
            <div className="space-y-4">
              <div className="bg-bg-075 border border-white/10 rounded-[14px] p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Crown className="w-4 h-4 text-yellow-400" />
                  <span className="font-[family-name:var(--font-display)] font-bold text-[0.95rem]">{t('rewardTiers')}</span>
                </div>

                <div className="space-y-2.5">
                  {TIERS.map((tier) => {
                    const active = tier.label === currentTier.label;
                    return (
                      <div key={tier.label} className={cn(
                        'rounded-[10px] p-3.5 border transition-all',
                        active ? cn(tier.bg, 'border-cyan-500/30') : 'bg-white/[0.02] border-white/8'
                      )}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <Star className={cn('w-3.5 h-3.5', active ? tier.color : 'text-white/30')} fill={active ? 'currentColor' : 'none'} />
                            <span className={cn('font-bold text-[0.88rem]', active ? tier.color : 'text-white/50')}>
                              {tier.label}
                            </span>
                          </div>
                          {active && (
                            <span className="text-[0.65rem] uppercase tracking-wider bg-cyan-500/15 text-cyan-400 px-1.5 py-0.5 rounded-full font-bold">
                              {t('currentBadge')}
                            </span>
                          )}
                        </div>
                        <div className="text-[0.78rem] text-white/50 ml-5.5">
                          {tier.refs}+ {t('referralsCount')} · <span className="text-white/70">{tier.reward}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {nextTier && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="text-[0.76rem] text-white/40 mb-2">{t('progressTo')} {nextTier.label}</div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-1.5">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                        style={{ width: `${(totalRefs / nextTier.refs) * 100}%` }}
                      />
                    </div>
                    <div className="text-[0.72rem] text-white/40">
                      {totalRefs}/{nextTier.refs} {t('referralsCount')}
                    </div>
                  </div>
                )}
              </div>

              {/* How it works */}
              <div className="bg-bg-075 border border-white/10 rounded-[14px] p-5">
                <div className="font-[family-name:var(--font-display)] font-bold text-[0.95rem] mb-3.5">{t('howItWorksTitle')}</div>
                <div className="space-y-3">
                  {HOW_STEPS.map(({ n, text }) => (
                    <div key={n} className="flex gap-3 items-start">
                      <div className="w-6 h-6 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center text-[0.72rem] font-extrabold shrink-0">
                        {n}
                      </div>
                      <div className="text-[0.84rem] text-white/60 pt-0.5">{text}</div>
                    </div>
                  ))}
                </div>
              </div>

              <Button block variant="secondary" asChild>
                <Link href="/projects">{t('exploreProjects')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
