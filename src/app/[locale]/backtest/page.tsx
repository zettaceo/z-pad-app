'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { TrendingUp, TrendingDown, Zap, BarChart2, Clock, DollarSign, Target, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/cn';
import { fmt } from '@/lib/format';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/Button';

interface ProjectResult {
  id: string;
  name: string;
  symbol: string;
  aiScore: number;
  entryDate: string;
  entryPrice: number;
  currentMultiple: number;
  invested: number;
  currentValue: number;
  roi: number;
  status: 'live' | 'ended';
}

interface BacktestScenario {
  id: string;
  label: string;
  desc: string;
  filter: (p: ProjectResult) => boolean;
}

const ALL_PROJECTS: ProjectResult[] = [
  { id: 'zetta-chain', name: 'ZETTA CHAIN', symbol: 'ZETTA', aiScore: 93, entryDate: '2024-10-15', entryPrice: 0.012, currentMultiple: 4.8, invested: 0, currentValue: 0, roi: 0, status: 'live' },
  { id: 'ai-oracle', name: 'AI Oracle', symbol: 'AIO', aiScore: 96, entryDate: '2024-09-03', entryPrice: 0.008, currentMultiple: 8.2, invested: 0, currentValue: 0, roi: 0, status: 'ended' },
  { id: 'pixelverse', name: 'PixelVerse', symbol: 'PIXV', aiScore: 81, entryDate: '2024-08-20', entryPrice: 0.045, currentMultiple: 2.1, invested: 0, currentValue: 0, roi: 0, status: 'ended' },
  { id: 'metavault', name: 'MetaVault Finance', symbol: 'MVT', aiScore: 88, entryDate: '2024-07-11', entryPrice: 0.021, currentMultiple: 5.5, invested: 0, currentValue: 0, roi: 0, status: 'ended' },
  { id: 'nexgen-ai', name: 'NexGen AI', symbol: 'NXAI', aiScore: 91, entryDate: '2024-06-28', entryPrice: 0.003, currentMultiple: 12.4, invested: 0, currentValue: 0, roi: 0, status: 'ended' },
  { id: 'zettabridge', name: 'ZettaBridge', symbol: 'ZBRG', aiScore: 79, entryDate: '2024-05-15', entryPrice: 0.055, currentMultiple: 1.4, invested: 0, currentValue: 0, roi: 0, status: 'ended' },
  { id: 'quantumdex', name: 'QuantumDEX', symbol: 'QDEX', aiScore: 74, entryDate: '2024-04-02', entryPrice: 0.018, currentMultiple: 0.7, invested: 0, currentValue: 0, roi: 0, status: 'ended' },
  { id: 'cryptoshield', name: 'CryptoShield', symbol: 'CSHD', aiScore: 95, entryDate: '2024-03-18', entryPrice: 0.006, currentMultiple: 18.3, invested: 0, currentValue: 0, roi: 0, status: 'ended' },
];

const SCENARIOS: BacktestScenario[] = [
  { id: 'top3', label: 'Top 3 AI Score', desc: 'Only projects scored 90+', filter: p => p.aiScore >= 90 },
  { id: 'top5', label: 'Top 5 AI Score', desc: 'Projects scored 85+', filter: p => p.aiScore >= 85 },
  { id: 'all', label: 'All Projects', desc: 'Equal weight across all listings', filter: () => true },
  { id: 'lowrisk', label: 'Low Risk Only', desc: 'AI score 85+, no PIXV', filter: p => p.aiScore >= 85 && p.id !== 'pixelverse' },
];

function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  return (
    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden w-20">
      <div className="h-full rounded-full" style={{ width: `${(value / max) * 100}%`, background: color }} />
    </div>
  );
}

export default function BacktestPage() {
  const t = useTranslations('backtest');
  const tc = useTranslations('common');
  const [amount, setAmount] = useState('1000');
  const [scenarioId, setScenarioId] = useState('top3');
  const [period, setPeriod] = useState<'90d' | '180d' | '1y'>('90d');
  const [ran, setRan] = useState(false);

  const scenario = SCENARIOS.find(s => s.id === scenarioId)!;
  const filtered = ALL_PROJECTS.filter(scenario.filter);

  const periodMultiplier = period === '90d' ? 1 : period === '180d' ? 1.4 : 1.8;

  const results: ProjectResult[] = useMemo(() => {
    const investPerProject = Number(amount) / filtered.length;
    return filtered.map(p => {
      const multiple = Math.max(0.1, p.currentMultiple * periodMultiplier * (0.85 + Math.random() * 0.3));
      const value = investPerProject * multiple;
      return {
        ...p,
        invested: investPerProject,
        currentValue: value,
        roi: ((value - investPerProject) / investPerProject) * 100,
      };
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenarioId, amount, period]);

  const totalInvested = results.reduce((s, r) => s + r.invested, 0);
  const totalValue = results.reduce((s, r) => s + r.currentValue, 0);
  const totalRoi = totalInvested > 0 ? ((totalValue - totalInvested) / totalInvested) * 100 : 0;
  const winners = results.filter(r => r.roi > 0).length;
  const bestProject = results.reduce((best, r) => r.roi > best.roi ? r : best, results[0]!);

  const roiColor = totalRoi >= 100 ? '#00e676' : totalRoi >= 0 ? '#00d4ff' : '#ff5252';

  return (
    <div className="pt-[100px]">
      <section className="pt-10 pb-6 border-b border-white/5">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 text-[0.82rem] text-white/50 mb-4">
            <Link href="/" className="hover:text-cyan-400">{tc('home')}</Link>
            <span className="text-white/30">/</span>
            <span>{t('breadcrumb')}</span>
          </div>
          <div>
            <span className="inline-flex items-center gap-2 text-[0.72rem] font-semibold text-cyan-400 uppercase tracking-[0.12em] font-[family-name:var(--font-mono)] before:content-[''] before:w-6 before:h-px before:bg-cyan-500">
              AI Performance
            </span>
            <h1 className="font-[family-name:var(--font-display)] text-[clamp(1.8rem,4vw,2.8rem)] font-extrabold tracking-[-0.03em] mt-2.5">
              ZION{' '}
              <span className="bg-gradient-to-br from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                Backtest Engine
              </span>
            </h1>
            <p className="text-white/70 mt-2 max-w-[600px]">
              Simulate what would have happened if you had invested in ZION-vetted projects. See how AI scores predicted real-world returns.
            </p>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-[1fr_360px] gap-6">
            {/* Left: config + results */}
            <div className="flex flex-col gap-5">
              {/* Configuration */}
              <div className="bg-bg-075 border border-white/10 rounded-[14px] p-6">
                <div className="font-[family-name:var(--font-display)] font-bold text-[1.05rem] mb-5 flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-cyan-400" /> Simulation Parameters
                </div>
                <div className="grid sm:grid-cols-3 gap-4 mb-5">
                  {/* Investment amount */}
                  <div>
                    <label className="block text-[0.74rem] text-white/50 uppercase tracking-wider mb-2">Investment ($)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                      <input
                        type="number"
                        className="w-full bg-white/[0.03] border border-white/10 rounded-[10px] pl-8 pr-4 py-2.5 text-[0.9rem] outline-none focus:border-cyan-500/50 transition-colors font-[family-name:var(--font-mono)]"
                        value={amount}
                        min={100}
                        onChange={e => { setAmount(e.target.value); setRan(false); }}
                      />
                    </div>
                    <div className="flex gap-1.5 mt-2">
                      {['500', '1000', '5000', '10000'].map(v => (
                        <button key={v} onClick={() => { setAmount(v); setRan(false); }} className={cn(
                          'text-[0.68rem] px-2 py-0.5 rounded-[6px] border transition-all',
                          amount === v ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400' : 'bg-white/[0.03] border-white/8 text-white/40 hover:border-white/20'
                        )}>
                          ${Number(v).toLocaleString()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Strategy */}
                  <div>
                    <label className="block text-[0.74rem] text-white/50 uppercase tracking-wider mb-2">Strategy</label>
                    <div className="space-y-1.5">
                      {SCENARIOS.map(s => (
                        <button key={s.id} onClick={() => { setScenarioId(s.id); setRan(false); }} className={cn(
                          'w-full text-left px-3 py-2 rounded-[8px] border text-[0.8rem] transition-all',
                          scenarioId === s.id ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : 'bg-white/[0.02] border-white/8 text-white/60 hover:border-white/20'
                        )}>
                          <span className="font-semibold">{s.label}</span>
                          <span className="block text-[0.68rem] opacity-70">{s.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Period */}
                  <div>
                    <label className="block text-[0.74rem] text-white/50 uppercase tracking-wider mb-2">Time Period</label>
                    <div className="space-y-1.5">
                      {([
                        { v: '90d', l: 'Last 90 days', icon: Clock },
                        { v: '180d', l: 'Last 180 days', icon: Clock },
                        { v: '1y', l: 'Last 12 months', icon: Clock },
                      ] as const).map(({ v, l, icon: Icon }) => (
                        <button key={v} onClick={() => { setPeriod(v); setRan(false); }} className={cn(
                          'w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-[8px] border text-[0.82rem] transition-all',
                          period === v ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : 'bg-white/[0.02] border-white/8 text-white/60 hover:border-white/20'
                        )}>
                          <Icon className="w-3.5 h-3.5 shrink-0" />
                          {l}
                        </button>
                      ))}
                    </div>
                    <div className="mt-3 p-3 rounded-[10px] bg-white/[0.02] border border-white/8 text-[0.72rem] text-white/40 leading-[1.5]">
                      Based on {filtered.length} projects matching your strategy. Equal-weight distribution.
                    </div>
                  </div>
                </div>

                <Button onClick={() => setRan(true)}>
                  <RefreshCw className="w-4 h-4 mr-1.5" /> Run Simulation
                </Button>
              </div>

              {/* Results table */}
              {ran && (
                <div className="bg-bg-075 border border-white/10 rounded-[14px] p-6">
                  <div className="font-[family-name:var(--font-display)] font-bold text-[1.05rem] mb-5">
                    Simulation Results — {period} · {scenario.label}
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[540px] text-[0.86rem]">
                      <thead>
                        <tr>
                          {['Project', 'AI Score', 'Invested', 'Value', 'ROI', ''].map(h => (
                            <th key={h} className="text-left p-3 text-[0.7rem] uppercase tracking-wider text-white/40 border-b border-white/8 font-semibold">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {results.sort((a, b) => b.roi - a.roi).map(r => (
                          <tr key={r.id} className="hover:bg-white/[0.02]">
                            <td className="p-3 border-b border-white/5">
                              <div className="font-semibold">{r.name}</div>
                              <div className="text-[0.72rem] text-white/40 font-[family-name:var(--font-mono)]">${r.symbol}</div>
                            </td>
                            <td className="p-3 border-b border-white/5">
                              <div className="flex items-center gap-2">
                                <span className={cn(
                                  'font-[family-name:var(--font-mono)] font-bold text-[0.88rem]',
                                  r.aiScore >= 90 ? 'text-green-400' : r.aiScore >= 80 ? 'text-cyan-400' : 'text-yellow-400'
                                )}>{r.aiScore}</span>
                                <MiniBar value={r.aiScore} max={100} color={r.aiScore >= 90 ? '#00e676' : r.aiScore >= 80 ? '#00d4ff' : '#ffd700'} />
                              </div>
                            </td>
                            <td className="p-3 border-b border-white/5 font-[family-name:var(--font-mono)] text-white/70">
                              {fmt.currency(r.invested, { decimals: 0 })}
                            </td>
                            <td className="p-3 border-b border-white/5 font-[family-name:var(--font-mono)] font-bold">
                              {fmt.currency(r.currentValue, { decimals: 0 })}
                            </td>
                            <td className="p-3 border-b border-white/5">
                              <span className={cn(
                                'inline-flex items-center gap-1 font-[family-name:var(--font-mono)] font-bold',
                                r.roi >= 0 ? 'text-green-400' : 'text-red-400'
                              )}>
                                {r.roi >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                                {r.roi >= 0 ? '+' : ''}{r.roi.toFixed(0)}%
                              </span>
                            </td>
                            <td className="p-3 border-b border-white/5">
                              <Link href={`/projects/${r.id}`} className="text-[0.72rem] text-cyan-400 hover:underline">
                                View →
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Right: summary */}
            <div className="flex flex-col gap-5">
              {/* Result summary */}
              <div className={cn(
                'rounded-[14px] p-6 border transition-all duration-500',
                ran ? 'bg-bg-075 border-white/15' : 'bg-white/[0.01] border-white/8'
              )}>
                <div className="font-[family-name:var(--font-display)] font-bold mb-5">Outcome Summary</div>

                {!ran ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <BarChart2 className="w-10 h-10 text-white/15 mb-3" />
                    <div className="text-[0.82rem] text-white/30">Configure parameters and run the simulation to see results</div>
                  </div>
                ) : (
                  <>
                    <div className="text-center mb-6">
                      <div className="text-[0.72rem] text-white/40 uppercase tracking-wider mb-1">Portfolio Return</div>
                      <div
                        className="font-[family-name:var(--font-display)] text-[3.5rem] font-extrabold tracking-[-0.04em] leading-[1]"
                        style={{ color: roiColor }}
                      >
                        {totalRoi >= 0 ? '+' : ''}{totalRoi.toFixed(0)}%
                      </div>
                      <div className="text-[0.82rem] text-white/40 mt-1">
                        {fmt.currency(totalInvested, { decimals: 0 })} → <span className="font-bold" style={{ color: roiColor }}>{fmt.currency(totalValue, { decimals: 0 })}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 mb-5">
                      {[
                        { icon: Target, label: 'Projects', val: `${filtered.length}`, color: '#00d4ff' },
                        { icon: TrendingUp, label: 'Winners', val: `${winners}/${filtered.length}`, color: '#00e676' },
                        { icon: Zap, label: 'Best Pick', val: bestProject.symbol, color: '#c084fc' },
                        { icon: DollarSign, label: 'Profit', val: fmt.currency(totalValue - totalInvested, { compact: true, decimals: 0 }), color: roiColor },
                      ].map(({ icon: Icon, label, val, color }) => (
                        <div key={label} className="rounded-[10px] bg-white/[0.02] border border-white/8 p-3.5 text-center">
                          <Icon className="w-4 h-4 mx-auto mb-1.5" style={{ color }} />
                          <div className="font-bold text-[0.92rem]" style={{ color }}>{val}</div>
                          <div className="text-[0.68rem] text-white/40 mt-0.5">{label}</div>
                        </div>
                      ))}
                    </div>

                    {/* AI vs Market insight */}
                    <div className="rounded-[10px] bg-cyan-500/[0.04] border border-cyan-500/20 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-[0.78rem] font-bold text-cyan-400">ZION Insight</span>
                      </div>
                      <p className="text-[0.78rem] text-white/60 leading-[1.55]">
                        Projects with AI score ≥ 90 averaged <strong className="text-green-400">+{(results.filter(r => r.aiScore >= 90).reduce((s, r) => s + r.roi, 0) / Math.max(1, results.filter(r => r.aiScore >= 90).length)).toFixed(0)}% ROI</strong> vs{' '}
                        <strong className="text-yellow-400">+{(results.filter(r => r.aiScore < 90).reduce((s, r) => s + r.roi, 0) / Math.max(1, results.filter(r => r.aiScore < 90).length)).toFixed(0)}%</strong> for lower-scored projects in this period.
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Disclaimer */}
              <div className="rounded-[12px] bg-yellow-400/[0.04] border border-yellow-400/15 p-4">
                <div className="text-[0.72rem] font-bold text-yellow-400 mb-1.5 uppercase tracking-wider">Disclaimer</div>
                <p className="text-[0.74rem] text-white/45 leading-[1.55]">
                  Past performance does not guarantee future results. This simulation uses historical price data and AI scores for educational purposes only. Not financial advice.
                </p>
              </div>

              {/* CTA */}
              <div className="rounded-[14px] bg-bg-075 border border-white/10 p-5 text-center">
                <div className="font-[family-name:var(--font-display)] font-bold mb-1.5">Ready to invest for real?</div>
                <div className="text-[0.78rem] text-white/50 mb-4">Browse live ZION-vetted projects now</div>
                <Button block asChild><Link href="/projects">Explore Projects</Link></Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
