'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Lock, Plus, X, CheckCircle, Clock, Unlock } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

import { useWallet } from '@/lib/wallet-store';
import { fmt } from '@/lib/format';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';

const now = Date.now();
const d = 86400000;

const MOCK_LOCKS = [
  { id: '1', token: 'ZETTA', address: '0x3A4c...f82E', purpose: 'Team', amount: 50000000, symbol: 'ZETTA', vesting: 'cliff', lockedAt: now - 12 * d, unlocksAt: now + 353 * d, owner: '0x3A4c...f82E', project: 'ZETTA CHAIN' },
  { id: '2', token: 'ZETTA', address: '0x3A4c...f82E', purpose: 'Marketing', amount: 50000000, symbol: 'ZETTA', vesting: 'linear', lockedAt: now - 12 * d, unlocksAt: now + 168 * d, owner: '0x3A4c...f82E', project: 'ZETTA CHAIN' },
  { id: '3', token: 'AIO', address: '0xAA2b...7F1C', purpose: 'Team', amount: 30000000, symbol: 'AIO', vesting: 'cliff', lockedAt: now - d, unlocksAt: now + 364 * d, owner: '0xAA2b...7F1C', project: 'AI Oracle' },
  { id: '4', token: 'PIXV', address: '0x5F9a...1C8E', purpose: 'Liquidity', amount: 225000000, symbol: 'PIXV', vesting: 'cliff', lockedAt: now - 3 * d, unlocksAt: now + 36500 * d, owner: '0x5F9a...1C8E', project: 'PixelVerse' },
  { id: '5', token: 'PIXV', address: '0x5F9a...1C8E', purpose: 'Marketing', amount: 75000000, symbol: 'PIXV', vesting: 'linear', lockedAt: now - 3 * d, unlocksAt: now + 177 * d, owner: '0x5F9a...1C8E', project: 'PixelVerse' },
];

const PURPOSE_COLORS: Record<string, string> = {
  Team:      'text-amber-400 bg-amber-400/10 border-amber-400/25',
  Liquidity: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/25',
  Marketing: 'text-violet-400 bg-violet-400/10 border-violet-400/25',
  Staking:   'text-blue-400 bg-blue-400/10 border-blue-400/25',
  Airdrops:  'text-green-400 bg-green-400/10 border-green-400/25',
  Custom:    'text-white/60 bg-white/5 border-white/15',
};

interface LockForm {
  tokenAddr: string;
  amount: string;
  purpose: string;
  vesting: string;
  unlockDate: string;
}

export default function LockerPage() {
  const { wallet, openWalletModal } = useWallet();
  const t = useTranslations('locker');
  const tc = useTranslations('common');
  const [showForm, setShowForm] = useState(false);
  const [tab, setTab] = useState<'all' | 'mine'>('all');
  const [form, setForm] = useState<LockForm>({ tokenAddr: '', amount: '', purpose: 'Team', vesting: 'cliff', unlockDate: '' });
  const [locking, setLocking] = useState(false);

  const update = <K extends keyof LockForm>(k: K, v: LockForm[K]) => setForm(f => ({ ...f, [k]: v }));

  const handleLock = () => {
    if (!form.tokenAddr || !form.amount || !form.unlockDate) {
      toast.error('Fill in all required fields');
      return;
    }
    setLocking(true);
    toast.loading('Approving token spend…', { id: 'lock' });
    setTimeout(() => {
      toast.loading('Confirming lock transaction…', { id: 'lock' });
      setTimeout(() => {
        toast.success('Tokens locked successfully!', { id: 'lock' });
        setLocking(false);
        setShowForm(false);
        setForm({ tokenAddr: '', amount: '', purpose: 'Team', vesting: 'cliff', unlockDate: '' });
      }, 1400);
    }, 1000);
  };

  const getLockStatus = (lock: typeof MOCK_LOCKS[0]) => {
    const progress = (Date.now() - lock.lockedAt) / (lock.unlocksAt - lock.lockedAt);
    if (progress >= 1) return 'unlocked';
    if (progress >= 0.8) return 'unlocking';
    return 'locked';
  };

  const getLockProgress = (lock: typeof MOCK_LOCKS[0]) =>
    Math.min(100, ((Date.now() - lock.lockedAt) / (lock.unlocksAt - lock.lockedAt)) * 100);

  const displayedLocks = tab === 'mine' && wallet.connected
    ? MOCK_LOCKS.filter(l => l.owner === wallet.address)
    : MOCK_LOCKS;

  const inputCls = 'w-full px-4 py-3 rounded-[10px] border border-white/10 bg-white/[0.02] text-white outline-none focus:border-cyan-500 focus:bg-cyan-500/[0.02] transition-colors text-[0.9rem]';
  const labelCls = 'block text-[0.74rem] font-semibold text-white/70 uppercase tracking-wider mb-2';

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
                {t('label')}
              </span>
              <h1 className="font-[family-name:var(--font-display)] text-[clamp(1.8rem,4vw,2.8rem)] font-extrabold tracking-[-0.03em] mt-2.5">
                {t('title1')} <span className="bg-gradient-to-br from-cyan-500 to-blue-500 bg-clip-text text-transparent">{t('title2')}</span>
              </h1>
              <p className="text-white/70 mt-2 max-w-[600px]">{t('desc')}</p>
            </div>
            <Button onClick={() => wallet.connected ? setShowForm(s => !s) : openWalletModal()}>
              <Plus className="w-4 h-4 mr-1.5" />
              {t('newLock')}
            </Button>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6">

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              { l: t('statTotal'), v: '$48.2M' },
              { l: t('statCount'), v: '1,247' },
              { l: t('statProjects'), v: '89' },
            ].map(({ l, v }) => (
              <div key={l} className="bg-bg-075 border border-white/10 rounded-[14px] p-4 sm:p-5 text-center">
                <div className="font-[family-name:var(--font-display)] text-[1.4rem] sm:text-[2rem] font-extrabold tracking-[-0.025em] text-cyan-400 mb-1 leading-tight">{v}</div>
                <div className="text-[0.62rem] sm:text-[0.76rem] text-white/50 uppercase tracking-wider font-semibold leading-tight">{l}</div>
              </div>
            ))}
          </div>

          {/* New Lock Form */}
          {showForm && (
            <div className="bg-bg-075 border border-cyan-500/30 rounded-[14px] p-6 mb-6 relative">
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-md bg-white/[0.03] border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="font-[family-name:var(--font-display)] font-bold text-[1.15rem] mb-5 flex items-center gap-2">
                <Lock className="w-5 h-5 text-cyan-400" /> {t('newLock')}
              </div>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div className="sm:col-span-2">
                  <label className={labelCls}>{t('tokenAddr')} *</label>
                  <input
                    className={inputCls + ' font-[family-name:var(--font-mono)]'}
                    placeholder={t('tokenAddrPlaceholder')}
                    value={form.tokenAddr}
                    onChange={e => update('tokenAddr', e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelCls}>{t('lockAmount')} *</label>
                  <input
                    type="number"
                    className={inputCls + ' font-[family-name:var(--font-mono)]'}
                    placeholder={t('lockAmountPlaceholder')}
                    value={form.amount}
                    onChange={e => update('amount', e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelCls}>{t('lockPurpose')}</label>
                  <select className={inputCls} value={form.purpose} onChange={e => update('purpose', e.target.value)}>
                    <option value="Team">{t('purposeTeam')}</option>
                    <option value="Liquidity">{t('purposeLiquidity')}</option>
                    <option value="Marketing">{t('purposeMarketing')}</option>
                    <option value="Staking">{t('purposeStaking')}</option>
                    <option value="Airdrops">{t('purposeAirdrop')}</option>
                    <option value="Custom">{t('purposeCustom')}</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>{t('vestingType')}</label>
                  <select className={inputCls} value={form.vesting} onChange={e => update('vesting', e.target.value)}>
                    <option value="cliff">{t('vestingCliff')}</option>
                    <option value="linear">{t('vestingLinear')}</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>{t('unlockDate')} *</label>
                  <input
                    type="datetime-local"
                    className={inputCls}
                    value={form.unlockDate}
                    onChange={e => update('unlockDate', e.target.value)}
                  />
                </div>
              </div>
              <Button onClick={handleLock} disabled={locking}>
                <Lock className="w-4 h-4 mr-1.5" />
                {t('lockBtn')}
              </Button>
            </div>
          )}

          {/* Tabs + Table */}
          <div className="flex items-center gap-1 mb-4 bg-white/[0.02] border border-white/8 rounded-[10px] p-1 w-fit">
            {(['all', 'mine'] as const).map((tabKey) => (
              <button
                key={tabKey}
                onClick={() => setTab(tabKey)}
                className={cn(
                  'px-4 py-2 rounded-[8px] text-[0.84rem] font-semibold transition-all',
                  tab === tabKey ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30' : 'text-white/50 hover:text-white/80'
                )}
              >
                {tabKey === 'all' ? t('allLocks') : t('myLocks')}
              </button>
            ))}
          </div>

          {tab === 'mine' && !wallet.connected ? (
            <div className="bg-bg-075 border border-white/10 rounded-[14px] p-10 text-center">
              <Lock className="w-10 h-10 mx-auto mb-3 text-white/20" />
              <p className="text-white/50 mb-4">{t('connectToLock')}</p>
              <Button variant="secondary" onClick={openWalletModal}>{tc('confirm')}</Button>
            </div>
          ) : displayedLocks.length === 0 ? (
            <div className="bg-bg-075 border border-white/10 rounded-[14px] p-10 text-center text-white/40">
              {t('noLocks')}
            </div>
          ) : (
            <div className="bg-bg-075 border border-white/10 rounded-[14px] overflow-x-auto">
              <table className="w-full min-w-[720px] text-[0.88rem]">
                <thead>
                  <tr className="bg-white/[0.02]">
                    {[t('colToken'), t('colAmount'), t('colPurpose'), t('colVesting'), t('colUnlocks'), t('colStatus')].map(h => (
                      <th key={h} className="text-left p-4 text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-white/50 border-b border-white/10">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {displayedLocks.map(lock => {
                    const status = getLockStatus(lock);
                    const progress = getLockProgress(lock);
                    const unlockStr = new Date(lock.unlocksAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                    return (
                      <tr key={lock.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.015] transition-colors">
                        <td className="p-4">
                          <div className="font-semibold">{lock.token}</div>
                          <div className="text-[0.72rem] text-white/40 font-[family-name:var(--font-mono)] mt-0.5">{lock.project}</div>
                        </td>
                        <td className="p-4 font-[family-name:var(--font-mono)] font-semibold">
                          {fmt.number(lock.amount)}
                          <span className="text-white/40 ml-1 font-normal">{lock.symbol}</span>
                        </td>
                        <td className="p-4">
                          <span className={cn('px-2.5 py-1 rounded-full border text-[0.68rem] font-bold uppercase tracking-wider', PURPOSE_COLORS[lock.purpose] ?? PURPOSE_COLORS.Custom)}>
                            {lock.purpose}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-[0.78rem] text-white/60">
                            {lock.vesting === 'cliff' ? t('vestingCliff_tag') : t('vestingLinear_tag')}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="text-[0.82rem] mb-1.5">{unlockStr}</div>
                          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden max-w-[100px]">
                            <div
                              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </td>
                        <td className="p-4">
                          {status === 'locked' && (
                            <div className="flex items-center gap-1.5 text-[0.78rem] text-white/60">
                              <Lock className="w-3 h-3 text-cyan-400" />
                              {t('statusLocked')}
                            </div>
                          )}
                          {status === 'unlocking' && (
                            <div className="flex items-center gap-1.5 text-[0.78rem] text-gold-400">
                              <Clock className="w-3 h-3" />
                              {t('statusUnlocking')}
                            </div>
                          )}
                          {status === 'unlocked' && (
                            <div className="flex items-center gap-1.5 text-[0.78rem] text-green-400">
                              <Unlock className="w-3 h-3" />
                              {t('statusUnlocked')}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
