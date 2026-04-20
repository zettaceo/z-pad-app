'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Wallet as WalletIcon, TrendingUp, Grid3x3, Download } from 'lucide-react';

import { useWallet } from '@/lib/wallet-store';
import { POSITIONS, ACTIVITY } from '@/lib/mock-data';
import { fmt } from '@/lib/format';
import { Button } from '@/components/ui/Button';

export default function DashboardPage() {
  const { wallet, openWalletModal } = useWallet();

  const stats = useMemo(() => {
    const totalInvested = POSITIONS.reduce((s, p) => s + p.invested, 0);
    const totalValue = POSITIONS.reduce((s, p) => s + p.value, 0);
    const totalPnL = totalValue - totalInvested;
    const pnlPct = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;
    const claimable = POSITIONS.reduce((s, p) => s + p.claimable, 0);
    return { totalInvested, totalValue, totalPnL, pnlPct, claimable };
  }, []);

  if (!wallet.connected) {
    return (
      <div className="pt-[100px]">
        <div className="max-w-[1360px] mx-auto px-6 py-20">
          <div className="max-w-[520px] mx-auto text-center p-10 bg-bg-075 border border-white/10 rounded-[14px]">
            <WalletIcon className="w-14 h-14 mx-auto mb-4 text-white/30" />
            <h3 className="font-[family-name:var(--font-display)] text-xl font-bold mb-3">
              Connect Your Wallet
            </h3>
            <p className="text-white/70 mb-6">
              Connect to view your portfolio, positions, reputation, and activity on Z-PAD.
            </p>
            <Button size="lg" onClick={openWalletModal}>
              Connect Wallet
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-[100px]">
      <section className="pt-10 pb-6 border-b border-white/5">
        <div className="max-w-[1360px] mx-auto px-6">
          <div className="flex items-center gap-2 text-[0.82rem] text-white/50 mb-4">
            <Link href="/" className="hover:text-cyan-400">Home</Link>
            <span className="text-white/30">/</span>
            <span>Dashboard</span>
          </div>
          <div className="flex items-end justify-between flex-wrap gap-5">
            <div>
              <span className="inline-flex items-center gap-2 text-[0.72rem] font-semibold text-cyan-400 uppercase tracking-[0.12em] font-[family-name:var(--font-mono)] before:content-[''] before:w-6 before:h-px before:bg-cyan-500">
                Your Portfolio
              </span>
              <h1 className="font-[family-name:var(--font-display)] text-[clamp(1.8rem,4vw,2.8rem)] font-extrabold tracking-[-0.03em] mt-2.5">
                Welcome back,{' '}
                <span className="bg-gradient-to-br from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                  Ninja
                </span>
              </h1>
              <p className="text-white/70 mt-2">
                <span className="font-[family-name:var(--font-mono)] text-cyan-400">{fmt.address(wallet.address)}</span>
                {' · AI Reputation '}<strong className="text-cyan-400">{wallet.reputation}/100</strong>
                {' · Level '}<strong>{wallet.level}</strong>
              </p>
            </div>
            <div className="flex gap-2.5 flex-wrap">
              <Button variant="secondary" asChild><Link href="/rewards">Rewards</Link></Button>
              <Button variant="secondary" asChild><Link href="/staking">Staking</Link></Button>
              <Button asChild><Link href="/projects">Explore Projects</Link></Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-[1360px] mx-auto px-6">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
            {[
              { icon: TrendingUp, label: 'Portfolio Value', value: fmt.currency(stats.totalValue, { decimals: 2 }), change: `${stats.pnlPct >= 0 ? '↑' : '↓'} ${fmt.percent(Math.abs(stats.pnlPct))} all-time`, up: stats.pnlPct >= 0 },
              { icon: TrendingUp, label: 'Total P&L', value: `${stats.totalPnL >= 0 ? '+' : ''}${fmt.currency(stats.totalPnL, { decimals: 2 })}`, change: `Invested ${fmt.currency(stats.totalInvested)}`, color: stats.totalPnL >= 0 ? 'var(--color-green-400)' : 'var(--color-red-400)' },
              { icon: Grid3x3, label: 'Active Positions', value: String(POSITIONS.length), change: `${POSITIONS.filter((p) => p.change > 0).length} in profit` },
              { icon: Download, label: 'Claimable', value: fmt.token(stats.claimable, 0), change: 'Tokens ready', color: 'var(--color-gold-400)' },
            ].map((s, i) => (
              <div key={i} className="relative bg-bg-075 border border-white/10 rounded-[14px] p-5">
                <div className="absolute top-[18px] right-[18px] w-9 h-9 rounded-md bg-gradient-to-br from-cyan-500/12 to-blue-500/8 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <s.icon className="w-[18px] h-[18px]" />
                </div>
                <div className="text-[0.76rem] text-white/50 uppercase tracking-wider mb-2.5 font-semibold">
                  {s.label}
                </div>
                <div className="font-[family-name:var(--font-display)] text-[1.8rem] font-extrabold tracking-[-0.025em] mb-1.5 leading-[1.1]" style={s.color ? { color: s.color } : {}}>
                  {s.value}
                </div>
                <div className={`font-[family-name:var(--font-mono)] text-[0.8rem] ${s.up === true ? 'text-green-400' : s.up === false ? 'text-red-400' : 'text-white/50'}`}>
                  {s.change}
                </div>
              </div>
            ))}
          </div>

          {/* Wallet Balance */}
          <div className="bg-bg-075 border border-white/10 rounded-[14px] p-6 mb-6">
            <div className="font-[family-name:var(--font-display)] text-[1.1rem] font-bold mb-4">Wallet Balance</div>
            {[
              { name: 'BNB', sub: 'Binance Smart Chain', amt: wallet.balance.bnb.toFixed(3), fiat: fmt.currency(wallet.balance.bnb * 600, { decimals: 2 }), bg: 'rgba(243,186,47,0.15)', c: '#f3ba2f' },
              { name: 'USDT', sub: 'Tether USD', amt: fmt.number(wallet.balance.usdt, 2), fiat: fmt.currency(wallet.balance.usdt, { decimals: 2 }), bg: 'rgba(38,161,123,0.15)', c: '#26a17b' },
              { name: 'Z Token', sub: `Staked: ${fmt.number(wallet.stakedZ)}`, amt: fmt.number(wallet.balance.z), fiat: '+95%', highlight: true, bg: 'linear-gradient(135deg, #00d4ff, #0066ff)', c: '#021628' },
            ].map((b, i) => (
              <div key={i} className={`flex items-center gap-3.5 p-3.5 rounded-[10px] border mb-2.5 last:mb-0 ${b.highlight ? 'bg-cyan-500/[0.04] border-cyan-500/20' : 'bg-white/[0.02] border-white/5'}`}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-extrabold shrink-0 text-base" style={{ background: b.bg, color: b.c }}>
                  {b.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[0.92rem]">{b.name}</div>
                  <div className={`text-[0.74rem] mt-0.5 ${b.highlight ? 'text-cyan-400' : 'text-white/50'}`}>{b.sub}</div>
                </div>
                <div className="text-right">
                  <div className="font-[family-name:var(--font-mono)] font-bold text-[0.92rem]">{b.amt}</div>
                  <div className={`font-[family-name:var(--font-mono)] text-[0.74rem] mt-0.5 ${b.highlight ? 'text-green-400' : 'text-white/50'}`}>{b.fiat}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Positions */}
          <div className="bg-bg-075 border border-white/10 rounded-[14px] p-6 mb-5">
            <div className="flex items-center justify-between mb-5">
              <div className="font-[family-name:var(--font-display)] text-[1.1rem] font-bold">Your Positions</div>
              <Link href="/projects" className="inline-flex items-center gap-1.5 text-cyan-400 text-[0.88rem] font-medium hover:gap-2.5 transition-all">
                Find more →
              </Link>
            </div>
            {POSITIONS.map((pos) => (
              <Link key={pos.id} href={`/projects/${pos.id}`} className="grid grid-cols-[auto_1fr_auto] gap-3.5 items-center p-3.5 rounded-[10px] bg-white/[0.02] border border-white/5 mb-2 last:mb-0 hover:border-cyan-500/35 hover:bg-cyan-500/[0.03] transition-all">
                <div className="w-[38px] h-[38px] rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center font-[family-name:var(--font-display)] font-extrabold text-[#021628] text-[0.82rem] shrink-0">
                  {pos.symbol[0]}
                </div>
                <div>
                  <div className="font-semibold text-[0.92rem]">{pos.name}</div>
                  <div className="text-[0.74rem] text-white/50">{pos.symbol} · Invested {fmt.currency(pos.invested)}</div>
                </div>
                <div className="text-right">
                  <div className="font-[family-name:var(--font-mono)] font-bold">{fmt.currency(pos.value, { decimals: 2 })}</div>
                  <div className={`font-[family-name:var(--font-mono)] text-[0.74rem] mt-0.5 ${pos.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {pos.change >= 0 ? '↑' : '↓'} {fmt.percent(Math.abs(pos.change))}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Activity */}
          <div className="bg-bg-075 border border-white/10 rounded-[14px] p-6 overflow-x-auto">
            <div className="font-[family-name:var(--font-display)] text-[1.1rem] font-bold mb-5">Recent Activity</div>
            <table className="w-full text-[0.88rem]">
              <thead>
                <tr>
                  {['Type', 'Project', 'Amount', 'Tokens', 'Time', 'Status'].map((h) => (
                    <th key={h} className="text-left p-3 font-semibold text-[0.7rem] uppercase tracking-[0.08em] text-white/50 border-b border-white/10">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ACTIVITY.map((a, i) => (
                  <tr key={i} className="hover:bg-white/[0.02]">
                    <td className="p-3.5 border-b border-white/5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[0.7rem] font-bold uppercase ${
                        a.type === 'buy' ? 'bg-cyan-500/10 text-cyan-400' :
                        a.type === 'claim' ? 'bg-green-400/10 text-green-400' :
                        'bg-violet-500/10 text-[#c4b5fd]'
                      }`}>
                        {a.type === 'buy' ? '↓ Buy' : a.type === 'claim' ? '⚡ Claim' : '🔒 Stake'}
                      </span>
                    </td>
                    <td className="p-3.5 border-b border-white/5 font-medium">{a.project}</td>
                    <td className="p-3.5 border-b border-white/5 font-[family-name:var(--font-mono)]">{a.amount}</td>
                    <td className="p-3.5 border-b border-white/5 font-[family-name:var(--font-mono)] text-cyan-400">{a.tokens ?? '—'}</td>
                    <td className="p-3.5 border-b border-white/5 text-white/50 text-[0.82rem]">{fmt.timeAgo(a.time)}</td>
                    <td className="p-3.5 border-b border-white/5">
                      <span className="inline-flex items-center gap-1.5 text-[0.78rem] text-green-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        Confirmed
                      </span>
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
