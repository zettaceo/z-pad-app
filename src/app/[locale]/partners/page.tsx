'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ExternalLink, Mail } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/Button';

interface Partner {
  name: string;
  desc: string;
  category: 'vc' | 'audit' | 'dex' | 'infra' | 'media';
  initials: string;
  color: string;
  url: string;
  tier?: 'strategic' | 'official';
}

const PARTNERS: Partner[] = [
  // VCs
  { name: 'ZettaFund',      desc: 'Lead investor and ecosystem fund of the ZETTA network.',                         category: 'vc',    initials: 'ZF', color: 'from-cyan-500 to-blue-500',      url: '#', tier: 'strategic' },
  { name: 'ChainCapital',   desc: 'Tier-1 Web3 VC with $300M AUM across 80+ portfolio projects.',                  category: 'vc',    initials: 'CC', color: 'from-violet-500 to-purple-600',  url: '#', tier: 'strategic' },
  { name: 'DeFi Ventures',  desc: 'Early-stage DeFi-focused fund backing infrastructure and launchpad tooling.',   category: 'vc',    initials: 'DV', color: 'from-blue-500 to-indigo-600',    url: '#' },
  { name: 'Apex Capital',   desc: 'Multi-chain investment firm specializing in BSC and ZettaChain ecosystems.',     category: 'vc',    initials: 'AC', color: 'from-amber-500 to-orange-500',   url: '#' },
  // Auditors
  { name: 'CertiK',         desc: 'Leading blockchain security firm. All Z-PAD contracts are CertiK verified.',    category: 'audit', initials: 'CK', color: 'from-red-500 to-rose-600',       url: '#', tier: 'official' },
  { name: 'Cyberscope',     desc: 'Real-time on-chain threat detection and smart contract audit.',                  category: 'audit', initials: 'CS', color: 'from-green-500 to-emerald-600',  url: '#', tier: 'official' },
  { name: 'Hacken',         desc: 'Web3 cybersecurity ecosystem. Recommended auditor for projects on Z-PAD.',      category: 'audit', initials: 'HK', color: 'from-teal-500 to-cyan-600',      url: '#' },
  { name: 'Trail of Bits',  desc: 'Elite security research firm trusted by the most critical protocols in Web3.',  category: 'audit', initials: 'TB', color: 'from-slate-500 to-gray-600',     url: '#' },
  // DEX / CEX
  { name: 'PancakeSwap',    desc: 'Leading BSC DEX. Projects launching on Z-PAD get a fast-tracked DEX listing.',  category: 'dex',   initials: 'PS', color: 'from-yellow-400 to-amber-500',   url: '#', tier: 'official' },
  { name: 'ZettaDEX',       desc: 'Native DEX of ZettaChain. Deep liquidity for ZETTA ecosystem tokens.',          category: 'dex',   initials: 'ZD', color: 'from-cyan-500 to-blue-600',      url: '#', tier: 'strategic' },
  { name: 'Uniswap',        desc: 'Ethereum DeFi benchmark DEX. Z-PAD ETH projects auto-listed at TGE.',           category: 'dex',   initials: 'UX', color: 'from-pink-500 to-rose-500',      url: '#' },
  { name: 'MEXC Global',    desc: 'Centralized exchange supporting token launches from Z-PAD with fast listing.',  category: 'dex',   initials: 'MX', color: 'from-blue-400 to-blue-600',      url: '#' },
  // Infrastructure
  { name: 'Chainlink',      desc: 'Decentralized oracle network powering Z-PAD price feeds and VRF for NFTs.',     category: 'infra', initials: 'CL', color: 'from-blue-600 to-indigo-700',    url: '#', tier: 'official' },
  { name: 'The Graph',      desc: 'Indexing protocol used by Z-PAD for real-time on-chain data queries.',          category: 'infra', initials: 'TG', color: 'from-violet-600 to-purple-700',  url: '#' },
  { name: 'WalletConnect',  desc: 'Open-source protocol connecting 300+ wallets natively to Z-PAD.',               category: 'infra', initials: 'WC', color: 'from-blue-500 to-cyan-600',      url: '#', tier: 'official' },
  { name: 'IPFS / Filecoin','desc': 'Decentralized storage for project metadata, whitepapers and media on Z-PAD.', category: 'infra', initials: 'IF', color: 'from-teal-400 to-green-500',     url: '#' },
  // Media
  { name: 'CoinGecko',      desc: 'Top crypto data aggregator. Z-PAD projects get expedited CoinGecko listings.',  category: 'media', initials: 'CG', color: 'from-green-500 to-lime-500',     url: '#', tier: 'official' },
  { name: 'CoinMarketCap',  desc: 'Global crypto market cap tracker. Fast-track listing for Z-PAD graduates.',     category: 'media', initials: 'CM', color: 'from-blue-500 to-blue-700',      url: '#' },
  { name: 'BSC News',       desc: 'Premier BSC media outlet covering every launch on Z-PAD.',                      category: 'media', initials: 'BN', color: 'from-yellow-500 to-amber-600',   url: '#' },
  { name: 'DappRadar',      desc: 'Tracks Z-PAD platform metrics and project launches in real-time.',              category: 'media', initials: 'DR', color: 'from-cyan-600 to-blue-700',      url: '#' },
];

const CAT_KEYS = ['all', 'vc', 'audit', 'dex', 'infra', 'media'] as const;

export default function PartnersPage() {
  const t = useTranslations('partners');
  const tc = useTranslations('common');
  const [cat, setCat] = useState<typeof CAT_KEYS[number]>('all');

  const filtered = cat === 'all' ? PARTNERS : PARTNERS.filter(p => p.category === cat);

  const CAT_LABELS: Record<string, string> = {
    all:   t('catAll'),
    vc:    t('catVc'),
    audit: t('catAudit'),
    dex:   t('catDex'),
    infra: t('catInfra'),
    media: t('catMedia'),
  };

  const TIER_BADGE: Record<string, string> = {
    strategic: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/25',
    official:  'text-amber-400 bg-amber-500/10 border-amber-500/25',
  };

  return (
    <div className="pt-[100px]">
      {/* Header */}
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
          <p className="text-white/70 mt-2 max-w-[620px]">{t('desc')}</p>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6">

          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {CAT_KEYS.map(k => (
              <button
                key={k}
                onClick={() => setCat(k)}
                className={cn(
                  'px-4 py-2 rounded-[10px] text-[0.84rem] font-semibold border transition-all',
                  cat === k
                    ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30'
                    : 'border-white/10 text-white/50 hover:text-white/80 hover:border-white/20'
                )}
                type="button"
              >
                {CAT_LABELS[k]}
                <span className="ml-2 text-[0.7rem] opacity-60">
                  {k === 'all' ? PARTNERS.length : PARTNERS.filter(p => p.category === k).length}
                </span>
              </button>
            ))}
          </div>

          {/* Partners grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-12">
            {filtered.map(partner => (
              <div
                key={partner.name}
                className={cn(
                  'group relative bg-bg-075 border rounded-[14px] p-5 flex flex-col gap-3 transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)]',
                  partner.tier === 'strategic' ? 'border-cyan-500/25 hover:border-cyan-500/50' :
                  partner.tier === 'official'  ? 'border-amber-500/20 hover:border-amber-500/40' :
                  'border-white/10 hover:border-white/20'
                )}
              >
                {/* Tier badge */}
                {partner.tier && (
                  <span className={cn('absolute top-3 right-3 text-[0.62rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border', TIER_BADGE[partner.tier])}>
                    {partner.tier}
                  </span>
                )}

                {/* Logo */}
                <div className={cn('w-12 h-12 rounded-[12px] bg-gradient-to-br flex items-center justify-center font-extrabold text-white text-[1rem] shrink-0', partner.color)}>
                  {partner.initials}
                </div>

                <div className="flex-1">
                  <div className="font-bold text-[0.95rem] mb-1">{partner.name}</div>
                  <p className="text-white/50 text-[0.8rem] leading-relaxed">{partner.desc}</p>
                </div>

                <div className="flex items-center justify-between">
                  <span className={cn(
                    'text-[0.68rem] font-semibold uppercase tracking-wider px-2 py-0.5 rounded',
                    partner.category === 'vc'    ? 'text-violet-400 bg-violet-500/10' :
                    partner.category === 'audit' ? 'text-red-400 bg-red-500/10' :
                    partner.category === 'dex'   ? 'text-yellow-400 bg-yellow-500/10' :
                    partner.category === 'infra' ? 'text-blue-400 bg-blue-500/10' :
                    'text-green-400 bg-green-500/10'
                  )}>
                    {CAT_LABELS[partner.category]}
                  </span>
                  <a
                    href={partner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[0.76rem] text-white/30 hover:text-cyan-400 transition-colors"
                  >
                    {t('visitWebsite')} <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Become a partner CTA */}
          <div className="relative overflow-hidden rounded-[18px] border border-cyan-500/20 bg-gradient-to-br from-cyan-500/[0.06] to-blue-500/[0.04] p-8 sm:p-12 text-center">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,212,255,0.06),transparent_70%)]" />
            <div className="relative">
              <Mail className="w-10 h-10 mx-auto mb-4 text-cyan-400/60" />
              <h2 className="font-[family-name:var(--font-display)] text-[1.6rem] font-extrabold tracking-[-0.02em] mb-3">
                {t('becomePartner')}
              </h2>
              <p className="text-white/60 max-w-[480px] mx-auto mb-6 text-[0.92rem] leading-relaxed">
                {t('becomePartnerDesc')}
              </p>
              <Button size="lg" asChild>
                <a href="mailto:partnerships@zpad.io">{t('contactUs')}</a>
              </Button>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
