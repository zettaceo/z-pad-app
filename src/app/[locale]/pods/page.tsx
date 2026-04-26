'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { Users, Plus, Lock, Unlock, Zap, TrendingUp, Shield, Copy, Check, ChevronRight, Flame } from 'lucide-react';
import { cn } from '@/lib/cn';
import { fmt } from '@/lib/format';
import { Button } from '@/components/ui/Button';
import { useTranslations } from 'next-intl';

import { useWallet } from '@/lib/wallet-store';

interface PodMember {
  address: string;
  alias?: string;
  contribution: number; // in BNB
  joinedAt: number;
  isLeader?: boolean;
}

interface Pod {
  id: string;
  name: string;
  targetProject: string;
  targetProjectName: string;
  leader: string;
  members: PodMember[];
  maxMembers: number;
  targetBNB: number;
  raisedBNB: number;
  status: 'open' | 'locked' | 'deployed';
  tier: 'Silver' | 'Gold' | 'Diamond' | 'Legendary';
  tierColor: string;
  createdAt: number;
  boostMultiplier: number; // allocation multiplier from pool size
}

const MOCK_PODS: Pod[] = [
  {
    id: 'pod-alpha',
    name: 'Alpha Squad',
    targetProject: 'zetta-chain',
    targetProjectName: 'ZETTA CHAIN',
    leader: '0x072c…668a',
    members: [
      { address: '0x072c…668a', alias: 'CryptoWhal', contribution: 8.5, joinedAt: Date.now() - 3600000, isLeader: true },
      { address: '0x3f4b…21c2', alias: 'DeFiKing', contribution: 6.2, joinedAt: Date.now() - 2800000 },
      { address: '0x8a1d…93f7', contribution: 4.0, joinedAt: Date.now() - 1800000 },
      { address: '0x5c9e…b4a1', alias: 'Moon100x', contribution: 5.5, joinedAt: Date.now() - 900000 },
      { address: '0x2e7f…3d8c', contribution: 3.8, joinedAt: Date.now() - 300000 },
    ],
    maxMembers: 10,
    targetBNB: 50,
    raisedBNB: 28.0,
    status: 'open',
    tier: 'Gold',
    tierColor: '#ffd700',
    createdAt: Date.now() - 7200000,
    boostMultiplier: 2.5,
  },
  {
    id: 'pod-diamond',
    name: 'Diamond Hands DAO',
    targetProject: 'ai-oracle',
    targetProjectName: 'AI Oracle',
    leader: '0x9a3b…4f2d',
    members: [
      { address: '0x9a3b…4f2d', alias: 'OracleMax', contribution: 25.0, joinedAt: Date.now() - 86400000, isLeader: true },
      { address: '0x1c8e…72a9', alias: 'AIWatcher', contribution: 18.5, joinedAt: Date.now() - 72000000 },
      { address: '0x4d2f…9b3c', contribution: 20.0, joinedAt: Date.now() - 50000000 },
      { address: '0x7e5a…1f4b', alias: 'DeepBlock', contribution: 16.5, joinedAt: Date.now() - 36000000 },
    ],
    maxMembers: 10,
    targetBNB: 100,
    raisedBNB: 80.0,
    status: 'open',
    tier: 'Diamond',
    tierColor: '#00d4ff',
    createdAt: Date.now() - 86400000,
    boostMultiplier: 4.0,
  },
  {
    id: 'pod-legend',
    name: 'Legendary Cartel',
    targetProject: 'pixelverse',
    targetProjectName: 'PixelVerse',
    leader: '0xf3e1…8c4b',
    members: [
      { address: '0xf3e1…8c4b', alias: 'PixelGod', contribution: 50.0, joinedAt: Date.now() - 172800000, isLeader: true },
      { address: '0xa7c4…2e9d', contribution: 42.0, joinedAt: Date.now() - 162000000 },
      { address: '0xb2f8…5a1c', alias: 'GameFi_X', contribution: 38.5, joinedAt: Date.now() - 140000000 },
      { address: '0xc5d3…7b2e', contribution: 45.5, joinedAt: Date.now() - 120000000 },
      { address: '0xd9a6…3f8b', alias: 'BlockPlay', contribution: 40.0, joinedAt: Date.now() - 100000000 },
      { address: '0xe1b4…6c3a', contribution: 35.0, joinedAt: Date.now() - 80000000 },
      { address: '0x12f5…9d4e', contribution: 38.0, joinedAt: Date.now() - 60000000 },
    ],
    maxMembers: 10,
    targetBNB: 300,
    raisedBNB: 289.0,
    status: 'locked',
    tier: 'Legendary',
    tierColor: '#c084fc',
    createdAt: Date.now() - 172800000,
    boostMultiplier: 8.0,
  },
];

const TIERS = [
  { name: 'Silver', minBNB: 5, maxMembers: 5, boost: '1.5×', color: '#94a3b8', desc: 'Pool 5–25 BNB, up to 5 wallets' },
  { name: 'Gold', minBNB: 20, maxMembers: 8, boost: '2.5×', color: '#ffd700', desc: 'Pool 20–80 BNB, up to 8 wallets' },
  { name: 'Diamond', minBNB: 80, maxMembers: 10, boost: '4×', color: '#00d4ff', desc: 'Pool 80–200 BNB, up to 10 wallets' },
  { name: 'Legendary', minBNB: 200, maxMembers: 10, boost: '8×', color: '#c084fc', desc: 'Pool 200+ BNB, exclusive access' },
];

function PodCard({ pod }: { pod: Pod }) {
  const fillPct = (pod.raisedBNB / pod.targetBNB) * 100;
  const membersLeft = pod.maxMembers - pod.members.length;

  return (
    <div className="bg-bg-075 border border-white/10 rounded-[14px] p-5 hover:border-white/20 transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-[family-name:var(--font-display)] font-bold text-[1.05rem]">{pod.name}</span>
            <span
              className="text-[0.65rem] font-bold uppercase px-2 py-0.5 rounded-full border"
              style={{ color: pod.tierColor, borderColor: `${pod.tierColor}40`, background: `${pod.tierColor}12` }}
            >
              {pod.tier}
            </span>
          </div>
          <div className="text-[0.76rem] text-white/50">
            Target: <span className="text-cyan-400 font-medium">{pod.targetProjectName}</span>
          </div>
        </div>
        <div className={cn(
          'text-[0.68rem] font-bold uppercase px-2 py-1 rounded-[6px]',
          pod.status === 'open' ? 'bg-green-400/10 text-green-400' :
          pod.status === 'locked' ? 'bg-yellow-400/10 text-yellow-400' :
          'bg-violet-500/10 text-violet-400'
        )}>
          {pod.status === 'open' ? <><Unlock className="w-2.5 h-2.5 inline mr-1" />Open</> :
           pod.status === 'locked' ? <><Lock className="w-2.5 h-2.5 inline mr-1" />Locked</> :
           <><Zap className="w-2.5 h-2.5 inline mr-1" />Deployed</>}
        </div>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-[0.74rem] mb-1.5">
          <span className="text-white/50">Pool Progress</span>
          <span className="font-[family-name:var(--font-mono)] text-white/70">{pod.raisedBNB} / {pod.targetBNB} BNB</span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${Math.min(fillPct, 100)}%`, background: `linear-gradient(90deg, ${pod.tierColor}cc, ${pod.tierColor})` }}
          />
        </div>
        <div className="flex justify-between mt-1 text-[0.68rem] text-white/35">
          <span>{fillPct.toFixed(0)}% filled</span>
          <span>{pod.raisedBNB < pod.targetBNB ? `${(pod.targetBNB - pod.raisedBNB).toFixed(1)} BNB needed` : 'Target reached'}</span>
        </div>
      </div>

      {/* Members */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex -space-x-2">
          {pod.members.slice(0, 5).map((m, i) => (
            <div
              key={i}
              className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-violet-600 border-2 border-[#040d24] flex items-center justify-center text-[0.62rem] font-bold text-white shrink-0"
              title={m.alias ?? m.address}
            >
              {(m.alias ?? m.address).slice(0, 1).toUpperCase()}
            </div>
          ))}
          {pod.members.length > 5 && (
            <div className="w-7 h-7 rounded-full bg-white/10 border-2 border-[#040d24] flex items-center justify-center text-[0.6rem] text-white/60">
              +{pod.members.length - 5}
            </div>
          )}
        </div>
        <div className="text-[0.74rem] text-white/50">
          <span className="text-white font-medium">{pod.members.length}</span>/{pod.maxMembers} members
          {membersLeft > 0 && pod.status === 'open' && (
            <span className="ml-2 text-green-400">{membersLeft} spots left</span>
          )}
        </div>
      </div>

      {/* Boost */}
      <div className="flex items-center justify-between p-3 rounded-[10px] bg-white/[0.02] border border-white/8 mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-cyan-400" />
          <span className="text-[0.78rem] text-white/70">Allocation Boost</span>
        </div>
        <span className="font-[family-name:var(--font-mono)] font-bold text-cyan-400 text-[0.9rem]">
          {pod.boostMultiplier}×
        </span>
      </div>

      <Button
        block
        variant={pod.status === 'open' ? 'primary' : 'secondary'}
        disabled={pod.status !== 'open'}
        size="sm"
      >
        {pod.status === 'open' ? 'Join Pod' : pod.status === 'locked' ? 'Pod Locked' : 'Deployed'}
        {pod.status === 'open' && <ChevronRight className="w-4 h-4 ml-1" />}
      </Button>
    </div>
  );
}

export default function PodsPage() {
  const { wallet, openWalletModal } = useWallet();
  const t = useTranslations('pods');
  const tc = useTranslations('common');
  const [showCreate, setShowCreate] = useState(false);
  const [podName, setPodName] = useState('');
  const [selectedProject, setSelectedProject] = useState('zetta-chain');
  const [targetBNB, setTargetBNB] = useState('50');
  const [copied, setCopied] = useState(false);

  const handleCopyInvite = useCallback(() => {
    navigator.clipboard.writeText('https://zpad.io/pods/pod-alpha?ref=0x072c').catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const myPod = MOCK_PODS[0]!;

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
                Group DeFi
              </span>
              <h1 className="font-[family-name:var(--font-display)] text-[clamp(1.8rem,4vw,2.8rem)] font-extrabold tracking-[-0.03em] mt-2.5">
                Investment{' '}
                <span className="bg-gradient-to-br from-cyan-500 to-violet-500 bg-clip-text text-transparent">
                  Pods
                </span>
              </h1>
              <p className="text-white/70 mt-2 max-w-[540px]">
                Pool BNB with up to 10 wallets and unlock higher-tier allocations. The bigger the pod, the larger the boost — together you participate like a whale.
              </p>
            </div>
            <Button onClick={() => wallet.connected ? setShowCreate(s => !s) : openWalletModal()}>
              <Plus className="w-4 h-4 mr-1.5" />
              Create Pod
            </Button>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
          {/* How it works */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-8">
            {[
              { icon: Users, title: 'Form a Pod', desc: 'Create or join a group of up to 10 wallets targeting the same project', color: 'text-cyan-400', bg: 'bg-cyan-500/8 border-cyan-500/20' },
              { icon: TrendingUp, title: 'Pool BNB', desc: 'Each member contributes BNB. Larger pools unlock higher allocation tiers', color: 'text-green-400', bg: 'bg-green-400/8 border-green-400/20' },
              { icon: Zap, title: 'Deploy Together', desc: 'When target is reached the pod leader deploys in one transaction', color: 'text-violet-400', bg: 'bg-violet-500/8 border-violet-500/20' },
              { icon: Shield, title: 'Smart Split', desc: 'Tokens distributed proportionally on-chain. No trust required', color: 'text-gold-400', bg: 'bg-gold-500/8 border-gold-500/20' },
            ].map(({ icon: Icon, title, desc, color, bg }) => (
              <div key={title} className={cn('rounded-[12px] border p-4', bg)}>
                <Icon className={cn('w-5 h-5 mb-2.5', color)} />
                <div className={cn('font-bold text-[0.9rem] mb-1', color)}>{title}</div>
                <div className="text-[0.78rem] text-white/60 leading-[1.5]">{desc}</div>
              </div>
            ))}
          </div>

          {/* Create form */}
          {showCreate && (
            <div className="bg-bg-075 border border-cyan-500/30 rounded-[14px] p-6 mb-6">
              <div className="font-[family-name:var(--font-display)] font-bold text-[1.1rem] mb-5 flex items-center gap-2">
                <Plus className="w-5 h-5 text-cyan-400" /> Create a New Pod
              </div>
              <div className="grid sm:grid-cols-3 gap-4 mb-5">
                <div>
                  <label className="block text-[0.74rem] text-white/50 uppercase tracking-wider mb-2">Pod Name</label>
                  <input
                    className="w-full bg-white/[0.03] border border-white/10 rounded-[10px] px-4 py-2.5 text-[0.9rem] outline-none focus:border-cyan-500/50 transition-colors"
                    placeholder="e.g. Alpha Squad"
                    value={podName}
                    onChange={e => setPodName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[0.74rem] text-white/50 uppercase tracking-wider mb-2">Target Project</label>
                  <select
                    className="w-full bg-white/[0.03] border border-white/10 rounded-[10px] px-4 py-2.5 text-[0.9rem] outline-none focus:border-cyan-500/50 transition-colors"
                    value={selectedProject}
                    onChange={e => setSelectedProject(e.target.value)}
                  >
                    <option value="zetta-chain">ZETTA CHAIN</option>
                    <option value="ai-oracle">AI Oracle</option>
                    <option value="pixelverse">PixelVerse</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[0.74rem] text-white/50 uppercase tracking-wider mb-2">Target Pool (BNB)</label>
                  <input
                    type="number"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-[10px] px-4 py-2.5 text-[0.9rem] outline-none focus:border-cyan-500/50 transition-colors font-[family-name:var(--font-mono)]"
                    value={targetBNB}
                    min={5}
                    onChange={e => setTargetBNB(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Button>
                  <Zap className="w-4 h-4 mr-1.5" /> Launch Pod
                </Button>
                <Button variant="secondary" onClick={() => setShowCreate(false)}>{tc('cancel')}</Button>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-[1fr_320px] gap-6">
            {/* Pod list */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="font-[family-name:var(--font-display)] font-bold text-[1.1rem]">Active Pods</div>
                <div className="text-[0.78rem] text-white/40">{MOCK_PODS.filter(p => p.status === 'open').length} open</div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {MOCK_PODS.map(pod => <PodCard key={pod.id} pod={pod} />)}
              </div>
            </div>

            {/* Right panel */}
            <div className="flex flex-col gap-5">
              {/* My pod card */}
              {wallet.connected && (
                <div className="bg-bg-075 border border-cyan-500/25 rounded-[14px] p-5">
                  <div className="font-[family-name:var(--font-display)] font-bold mb-4 flex items-center gap-2">
                    <Flame className="w-4 h-4 text-cyan-400" /> My Pod
                  </div>
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center text-[0.7rem] font-bold">
                      A
                    </div>
                    <div>
                      <div className="font-semibold text-[0.92rem]">{myPod.name}</div>
                      <div className="text-[0.72rem] text-white/50">Leader · {myPod.targetProjectName}</div>
                    </div>
                  </div>
                  <div className="text-[0.78rem] text-white/50 mb-1.5">Your contribution</div>
                  <div className="font-[family-name:var(--font-mono)] font-bold text-[1.4rem] text-cyan-400 mb-3">
                    8.5 BNB
                  </div>
                  <div className="text-[0.72rem] text-white/40 mb-3">
                    Share = {((8.5 / myPod.raisedBNB) * 100).toFixed(1)}% of pool · {myPod.boostMultiplier}× boost active
                  </div>
                  <button
                    onClick={handleCopyInvite}
                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-[10px] bg-white/[0.03] border border-white/10 hover:border-cyan-500/30 hover:bg-cyan-500/[0.04] transition-all text-[0.78rem] text-white/60"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="flex-1 text-left truncate">Invite link: zpad.io/pods/pod-alpha?ref=…</span>
                  </button>
                </div>
              )}

              {/* Tier table */}
              <div className="bg-bg-075 border border-white/10 rounded-[14px] p-5">
                <div className="font-[family-name:var(--font-display)] font-bold mb-4">Pod Tiers</div>
                <div className="space-y-2">
                  {TIERS.map(t => (
                    <div key={t.name} className="flex items-center gap-3 p-3 rounded-[10px] bg-white/[0.02] border border-white/5">
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ background: t.color, boxShadow: `0 0 6px ${t.color}` }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-[0.84rem]" style={{ color: t.color }}>{t.name}</div>
                        <div className="text-[0.7rem] text-white/40 truncate">{t.desc}</div>
                      </div>
                      <div className="font-[family-name:var(--font-mono)] font-bold text-[0.88rem]" style={{ color: t.color }}>
                        {t.boost}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="bg-bg-075 border border-white/10 rounded-[14px] p-5">
                <div className="font-[family-name:var(--font-display)] font-bold mb-4">Pod Stats</div>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { v: '47', l: 'Active Pods' },
                    { v: '312', l: 'Total Members' },
                    { v: fmt.currency(2840000, { compact: true }), l: 'BNB Pooled' },
                    { v: '4.2×', l: 'Avg Boost' },
                  ].map(({ v, l }) => (
                    <div key={l} className="rounded-[10px] bg-white/[0.02] border border-white/8 p-3 text-center">
                      <div className="font-[family-name:var(--font-display)] font-extrabold text-[1.4rem] text-cyan-400">{v}</div>
                      <div className="text-[0.68rem] text-white/40 mt-0.5">{l}</div>
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
