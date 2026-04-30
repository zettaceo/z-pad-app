'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { z, ZodError } from 'zod';
import { Rocket, ArrowRight, ArrowLeft, CheckCircle2, Plus, X, Lock, EyeOff, Shield, Users, Upload } from 'lucide-react';

import { useTranslations } from 'next-intl';

import { useWallet } from '@/lib/wallet-store';
import { computeAiPrescore } from '@/lib/ai-prescore';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { AiScore } from '@/components/features/AiScore';
import { cn } from '@/lib/cn';

interface LockEntry {
  id: string;
  label: string;
  pct: string;
  vesting: 'cliff' | 'linear';
  months: string;
}

interface FormState {
  name: string;
  symbol: string;
  description: string;
  chain: string;
  saleType: string;
  refundable: boolean;
  stealthLaunch: boolean;
  supply: string;
  presale: string;
  liquidity: string;
  team: string;
  marketing: string;
  rate: string;
  softCap: string;
  hardCap: string;
  minBuy: string;
  maxBuy: string;
  startDate: string;
  endDate: string;
  antiBotEnabled: boolean;
  maxWalletPct: string;
  txDelay: string;
  maxTxPerBlock: string;
  whitelistEnabled: boolean;
  whitelistRaw: string;
  terms: boolean;
}

const PURPOSE_COLORS: Record<string, string> = {
  'Team':      'bg-amber-400/10 text-amber-400 border-amber-400/25',
  'Liquidity': 'bg-cyan-400/10 text-cyan-400 border-cyan-400/25',
  'Marketing': 'bg-violet-400/10 text-violet-400 border-violet-400/25',
  'Staking':   'bg-blue-400/10 text-blue-400 border-blue-400/25',
};

const SALE_TYPES = [
  { value: 'presale',      icon: Rocket,  titleKey: 'saleTypePresale',      descKey: 'saleTypePresaleDesc' },
  { value: 'fairlaunch',   icon: Users,   titleKey: 'saleTypeFairLaunch',   descKey: 'saleTypeFairLaunchDesc' },
  { value: 'private',      icon: Lock,    titleKey: 'saleTypePrivate',      descKey: 'saleTypePrivateDesc' },
  { value: 'lbp',          icon: Shield,  titleKey: 'saleTypeLbp',          descKey: 'saleTypeLbpDesc' },
  { value: 'bondingcurve', icon: Rocket,  titleKey: 'saleTypeBondingCurve', descKey: 'saleTypeBondingCurveDesc' },
] as const;

export default function CreatePage() {
  const { wallet, openWalletModal } = useWallet();
  const [step, setStep] = useState(1);
  const [deploying, setDeploying] = useState(false);
  const whitelistFileRef = useRef<HTMLInputElement>(null);
  const [locks, setLocks] = useState<LockEntry[]>([
    { id: '1', label: 'Team Tokens', pct: '', vesting: 'cliff', months: '12' },
    { id: '2', label: 'Marketing', pct: '', vesting: 'linear', months: '6' },
  ]);
  const [form, setForm] = useState<FormState>({
    name: '', symbol: '', description: '', chain: 'bsc', saleType: 'presale',
    refundable: false, stealthLaunch: false,
    supply: '', presale: '', liquidity: '', team: '', marketing: '',
    rate: '', softCap: '', hardCap: '', minBuy: '', maxBuy: '', startDate: '', endDate: '',
    antiBotEnabled: false, maxWalletPct: '3', txDelay: '30', maxTxPerBlock: '1',
    whitelistEnabled: false, whitelistRaw: '',
    terms: false,
  });

  const t = useTranslations('create');
  const tc = useTranslations('common');
  const tn = useTranslations('nav');

  const STEPS = [
    { n: 1, title: t('step1Title'), desc: t('step1Desc') },
    { n: 2, title: t('step2Title'), desc: t('step2Desc') },
    { n: 3, title: t('step3Title'), desc: t('step3Desc') },
    { n: 4, title: t('step4Title'), desc: t('step4Desc') },
    { n: 5, title: t('step5Title'), desc: t('step5Desc') },
  ];

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const addLock = () => setLocks(l => [...l, { id: Date.now().toString(), label: '', pct: '', vesting: 'cliff', months: '12' }]);
  const removeLock = (id: string) => setLocks(l => l.filter(x => x.id !== id));
  const updateLock = <K extends keyof LockEntry>(id: string, key: K, val: LockEntry[K]) =>
    setLocks(l => l.map(x => x.id === id ? { ...x, [key]: val } : x));

  const totalLockedPct = locks.reduce((s, l) => s + Number(l.pct || 0), 0);

  // Zod schemas per step
  const step1Schema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    symbol: z.string().min(2, 'Symbol must be at least 2 characters').max(8, 'Symbol too long'),
    description: z.string().min(100, 'Description must be at least 100 characters'),
  });

  const step2Schema = z
    .object({
      supply: z.string().min(1, 'Total supply required').regex(/^\d+$/, 'Supply must be a whole number').refine((v) => Number(v) > 0, 'Supply must be greater than 0'),
      presale: z.string(),
      liquidity: z.string(),
      team: z.string(),
      marketing: z.string(),
    })
    .refine(
      (v) =>
        Number(v.presale || 0) +
          Number(v.liquidity || 0) +
          Number(v.team || 0) +
          Number(v.marketing || 0) ===
        100,
      { message: 'Allocation must equal 100%' }
    );

  const step4Schema = z
    .object({
      rate: z.string().min(1, 'Rate required').refine((v) => Number(v) > 0, 'Must be greater than 0'),
      softCap: z.string().min(1, 'Soft cap required').refine((v) => Number(v) > 0, 'Must be greater than 0'),
      hardCap: z.string().min(1, 'Hard cap required').refine((v) => Number(v) > 0, 'Must be greater than 0'),
      minBuy: z.string().min(1, 'Min buy required').refine((v) => Number(v) > 0, 'Must be greater than 0'),
      maxBuy: z.string().min(1, 'Max buy required').refine((v) => Number(v) > 0, 'Must be greater than 0'),
      startDate: z.string().min(1, 'Start date required'),
      endDate: z.string().min(1, 'End date required'),
    })
    .refine((v) => Number(v.maxBuy) >= Number(v.minBuy), {
      message: 'Max buy must be ≥ min buy',
      path: ['maxBuy'],
    })
    .refine((v) => Number(v.hardCap) >= Number(v.softCap), {
      message: 'Hard cap must be ≥ soft cap',
      path: ['hardCap'],
    })
    .refine((v) => new Date(v.endDate).getTime() > new Date(v.startDate).getTime(), {
      message: 'End date must be after start date',
      path: ['endDate'],
    });

  const validateStep = (): boolean => {
    try {
      if (step === 1) step1Schema.parse(form);
      if (step === 2) step2Schema.parse(form);
      if (step === 4) step4Schema.parse(form);
      return true;
    } catch (err) {
      if (err instanceof ZodError) {
        const first = err.errors[0];
        toast.error(first?.message ?? t('toastValidFailed'));
      } else {
        toast.error(t('toastValidFailed'));
      }
      return false;
    }
  };

  const next = () => { if (validateStep()) setStep((s) => Math.min(6, s + 1)); };
  const back = () => setStep((s) => Math.max(1, s - 1));

  const deploy = () => {
    if (!form.terms) { toast.error(t('toastAcceptTerms')); return; }
    if (deploying) return; // idempotent: prevent double-click
    setDeploying(true);
    toast.loading(t('toastAiCheck'), { id: 'deploy' });
    setTimeout(() => {
      toast.loading(t('toastDeploying'), { id: 'deploy' });
      setTimeout(() => {
        toast.success(t('toastDeployed'), { id: 'deploy' });
        setStep(6);
        setDeploying(false);
      }, 1400);
    }, 1000);
  };

  if (!wallet.connected) {
    return (
      <div className="pt-[100px]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-20">
          <div className="max-w-[520px] mx-auto text-center p-10 bg-bg-075 border border-white/10 rounded-[14px]">
            <Rocket className="w-14 h-14 mx-auto mb-4 text-white/30" />
            <h3 className="font-[family-name:var(--font-display)] text-xl font-bold mb-3">
              {t('connectTitle')}
            </h3>
            <p className="text-white/70 mb-6">
              {t('connectDesc')}
            </p>
            <Button size="lg" onClick={openWalletModal}>
              {tn('connectWallet')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const total = Number(form.presale || 0) + Number(form.liquidity || 0) + Number(form.team || 0) + Number(form.marketing || 0);
  const preScore = computeAiPrescore({ liquidity: Number(form.liquidity || 0), team: Number(form.team || 0) });

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
          <p className="text-white/70 mt-2">{t('desc')}</p>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-[280px_1fr] gap-8">
            {/* Steps sidebar */}
            <div className="lg:sticky lg:top-[110px] lg:self-start flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
              {STEPS.map((s) => {
                const state = s.n < step ? 'completed' : s.n === step ? 'active' : '';
                return (
                  <button
                    key={s.n}
                    onClick={() => { if (s.n < step) setStep(s.n); }}
                    className={`relative flex items-start gap-3.5 p-3.5 rounded-[10px] border min-w-[200px] lg:min-w-0 text-left transition-all ${
                      state === 'active' ? 'bg-cyan-500/[0.04] border-cyan-500/15' :
                      state === 'completed' ? 'border-transparent cursor-pointer' : 'border-transparent'
                    }`}
                    type="button"
                  >
                    <div className={`w-[30px] h-[30px] rounded-full flex items-center justify-center font-[family-name:var(--font-mono)] text-[0.8rem] font-bold shrink-0 transition-all ${
                      state === 'active' ? 'bg-gradient-to-br from-cyan-500 to-blue-500 text-[#021628] shadow-[0_0_32px_rgba(0,212,255,0.28)] scale-105' :
                      state === 'completed' ? 'bg-green-500 text-[#012a11]' :
                      'bg-white/5 border border-white/10 text-white/50'
                    }`}>
                      {s.n < step ? '✓' : s.n}
                    </div>
                    <div>
                      <div className={`font-semibold text-[0.92rem] mb-0.5 ${state ? 'text-white' : 'text-white/70'}`}>
                        {s.title}
                      </div>
                      <div className="text-[0.76rem] text-white/50 leading-relaxed">{s.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Form */}
            <div className="bg-bg-075 border border-white/10 rounded-[14px] p-4 sm:p-6 md:p-8">
              {step === 1 && (
                <>
                  <h2 className="font-[family-name:var(--font-display)] text-[1.4rem] font-extrabold tracking-[-0.02em] mb-1.5">{t('projectInfoTitle')}</h2>
                  <p className="text-white/70 text-[0.92rem] mb-7">
                    {t.rich('projectInfoDesc', { strong: (chunks) => <strong className="text-cyan-400">{chunks}</strong> })}
                  </p>

                  <div className="grid sm:grid-cols-2 gap-4 mb-5">
                    <div>
                      <label htmlFor="field-name" className="block text-[0.74rem] font-semibold text-white/70 uppercase tracking-wider mb-2">{t('fieldName')} *</label>
                      <input id="field-name" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder={t('fieldNamePlaceholder')} className="w-full px-4 py-3 rounded-[10px] border border-white/10 bg-white/[0.02] text-white outline-none focus:border-cyan-500 focus:bg-cyan-500/[0.03]" />
                    </div>
                    <div>
                      <label htmlFor="field-symbol" className="block text-[0.74rem] font-semibold text-white/70 uppercase tracking-wider mb-2">{t('fieldSymbol')} *</label>
                      <input id="field-symbol" value={form.symbol} onChange={(e) => update('symbol', e.target.value.toUpperCase())} placeholder={t('fieldSymbolPlaceholder')} maxLength={8} className="w-full px-4 py-3 rounded-[10px] border border-white/10 bg-white/[0.02] text-white outline-none focus:border-cyan-500 focus:bg-cyan-500/[0.03]" />
                    </div>
                  </div>
                  <div className="mb-5">
                    <label htmlFor="field-description" className="block text-[0.74rem] font-semibold text-white/70 uppercase tracking-wider mb-2">{t('fieldDesc')} *</label>
                      <textarea id="field-description" value={form.description} onChange={(e) => update('description', e.target.value)} rows={4} placeholder={t('fieldDescPlaceholder')} className="w-full px-4 py-3 rounded-[10px] border border-white/10 bg-white/[0.02] text-white outline-none focus:border-cyan-500 resize-y" />
                    <div className="text-[0.78rem] text-white/50 mt-1.5">{t('fieldDescHint')}</div>
                  </div>

                  <div className="mb-5">
                    <label htmlFor="field-chain" className="block text-[0.74rem] font-semibold text-white/70 uppercase tracking-wider mb-2">{t('fieldChain')} *</label>
                    <select id="field-chain" value={form.chain} onChange={(e) => update('chain', e.target.value)} className="w-full px-4 py-3 rounded-[10px] border border-white/10 bg-white/[0.02] text-white outline-none focus:border-cyan-500">
                      <option value="bsc">BSC</option>
                      <option value="eth">Ethereum</option>
                      <option value="polygon">Polygon</option>
                      <option value="arbitrum">Arbitrum</option>
                      <option value="zetta">ZettaChain</option>
                      <option value="solana">Solana</option>
                      <option value="base">Base</option>
                    </select>
                  </div>

                  {/* Sale type cards */}
                  <div className="mb-5">
                    <label className="block text-[0.74rem] font-semibold text-white/70 uppercase tracking-wider mb-3">{t('fieldSaleType')} *</label>
                    <div className="grid sm:grid-cols-2 gap-2.5">
                      {SALE_TYPES.map(({ value, icon: Icon, titleKey, descKey }) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => update('saleType', value)}
                          className={cn(
                            'flex items-start gap-3 p-3.5 rounded-[10px] border text-left transition-all',
                            form.saleType === value
                              ? 'border-cyan-500/50 bg-cyan-500/[0.06]'
                              : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                          )}
                        >
                          <div className={cn(
                            'w-8 h-8 rounded-[8px] flex items-center justify-center shrink-0 mt-0.5',
                            form.saleType === value ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 text-white/40'
                          )}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className={cn('font-semibold text-[0.88rem]', form.saleType === value ? 'text-cyan-400' : 'text-white/80')}>
                              {t(titleKey as any)}
                            </div>
                            <p className="text-white/45 text-[0.75rem] leading-snug mt-0.5">{t(descKey as any)}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Options row */}
                  <div className="flex flex-col gap-3">
                    <label className={`flex items-start gap-3 p-3.5 rounded-[10px] border cursor-pointer transition-all ${form.refundable ? 'border-cyan-500/35 bg-cyan-500/[0.04]' : 'border-white/10 bg-white/[0.02]'}`}>
                      <input type="checkbox" checked={form.refundable} onChange={(e) => update('refundable', e.target.checked)} className="mt-1 accent-cyan-500" />
                      <div>
                        <div className="font-semibold text-[0.9rem] flex items-center gap-2 mb-1">
                          {t('refundableTitle')} <Badge variant="refundable" />
                        </div>
                        <div className="text-[0.78rem] text-white/50 leading-relaxed">
                          {t('refundableDesc')}
                        </div>
                      </div>
                    </label>

                    <label className={`flex items-start gap-3 p-3.5 rounded-[10px] border cursor-pointer transition-all ${form.stealthLaunch ? 'border-violet-500/35 bg-violet-500/[0.04]' : 'border-white/10 bg-white/[0.02]'}`}>
                      <input type="checkbox" checked={form.stealthLaunch} onChange={(e) => update('stealthLaunch', e.target.checked)} className="mt-1 accent-violet-500" />
                      <div>
                        <div className="font-semibold text-[0.9rem] flex items-center gap-2 mb-1">
                          <EyeOff className="w-4 h-4 text-violet-400" /> {t('stealthLaunch')}
                        </div>
                        <div className="text-[0.78rem] text-white/50 leading-relaxed">
                          {t('stealthLaunchDesc')}
                        </div>
                      </div>
                    </label>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <h2 className="font-[family-name:var(--font-display)] text-[1.4rem] font-extrabold tracking-[-0.02em] mb-1.5">{t('tokenomicsTitle')}</h2>
                  <p className="text-white/70 text-[0.92rem] mb-7">{t('tokenomicsDesc')}</p>

                  <div className="mb-5">
                    <label htmlFor="field-supply" className="block text-[0.74rem] font-semibold text-white/70 uppercase tracking-wider mb-2">{t('supplyField')} *</label>
                      <input id="field-supply" type="number" value={form.supply} onChange={(e) => update('supply', e.target.value)} placeholder="1000000000" className="w-full px-4 py-3 rounded-[10px] border border-white/10 bg-white/[0.02] text-white outline-none focus:border-cyan-500 font-[family-name:var(--font-mono)]" />
                  </div>

                  <div className="mb-5 p-4 rounded-[10px] bg-cyan-500/[0.04] border border-cyan-500/15">
                    <div className="flex justify-between mb-2.5">
                      <div className="font-semibold">{t('allocationTitle')}</div>
                      <div className={`font-[family-name:var(--font-mono)] font-bold ${total === 100 ? 'text-green-400' : total > 100 ? 'text-red-400' : 'text-gold-400'}`}>
                        {total}% / 100%
                      </div>
                    </div>
                    <div className="w-full h-2.5 rounded-full overflow-hidden flex mb-2">
                      {Number(form.presale) > 0   && <div className="bg-cyan-500"   style={{ width: `${form.presale}%` }} />}
                      {Number(form.liquidity) > 0  && <div className="bg-blue-500"   style={{ width: `${form.liquidity}%` }} />}
                      {Number(form.team) > 0       && <div className="bg-amber-400"  style={{ width: `${form.team}%` }} />}
                      {Number(form.marketing) > 0  && <div className="bg-violet-500" style={{ width: `${form.marketing}%` }} />}
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                      {[
                        { color: 'bg-cyan-500',   label: t('presaleField'),   val: form.presale },
                        { color: 'bg-blue-500',   label: t('liquidityField'), val: form.liquidity },
                        { color: 'bg-amber-400',  label: t('teamField'),      val: form.team },
                        { color: 'bg-violet-500', label: t('marketingField'), val: form.marketing },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center gap-2 text-[0.74rem]">
                          <span className={`w-2 h-2 rounded-full shrink-0 ${item.color}`} />
                          <span className="text-white/60 flex-1 truncate">{item.label}</span>
                          <span className="font-[family-name:var(--font-mono)] font-semibold">{item.val || 0}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {(['presale', 'liquidity', 'team', 'marketing'] as const).map((k) => (
                      <div key={k}>
                        <label htmlFor={`field-${k}`} className="block text-[0.74rem] font-semibold text-white/70 uppercase tracking-wider mb-2 capitalize">{k} %</label>
                        <input id={`field-${k}`} type="number" value={form[k]} onChange={(e) => update(k, e.target.value)} placeholder={k === 'liquidity' ? '70' : '10'} className="w-full px-4 py-3 rounded-[10px] border border-white/10 bg-white/[0.02] text-white outline-none focus:border-cyan-500 font-[family-name:var(--font-mono)]" />
                      </div>
                    ))}
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <h2 className="font-[family-name:var(--font-display)] text-[1.4rem] font-extrabold tracking-[-0.02em] mb-1.5">{t('locksTitle')}</h2>
                  <p className="text-white/70 text-[0.92rem] mb-7">{t('locksDesc')}</p>

                  <div className="flex flex-col gap-3 mb-5">
                    {locks.length === 0 ? (
                      <div className="p-5 rounded-[10px] border border-dashed border-white/15 text-center text-[0.84rem] text-white/40">
                        {t('noLocksHint')}
                      </div>
                    ) : locks.map((lock) => {
                      const colorKey = lock.label.toLowerCase().includes('team') ? 'Team'
                        : lock.label.toLowerCase().includes('liquid') ? 'Liquidity'
                        : lock.label.toLowerCase().includes('market') ? 'Marketing'
                        : lock.label.toLowerCase().includes('stak') ? 'Staking'
                        : 'Team';
                      return (
                        <div key={lock.id} className={cn('p-4 rounded-[12px] border', PURPOSE_COLORS[colorKey])}>
                          <div className="flex items-center justify-between mb-3">
                            <div className="font-semibold text-[0.9rem]">
                              {lock.label || t('lockLabel')}
                            </div>
                            <button
                              type="button"
                              onClick={() => removeLock(lock.id)}
                              className="w-7 h-7 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-red-400 hover:border-red-400/30 transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="grid sm:grid-cols-4 gap-3">
                            <div className="sm:col-span-1">
                              <label className="block text-[0.68rem] text-white/50 uppercase tracking-wider mb-1.5">{t('lockLabel')}</label>
                              <input
                                className="w-full px-3 py-2 rounded-[8px] border border-white/10 bg-white/[0.03] text-white text-[0.84rem] outline-none focus:border-cyan-500 transition-colors"
                                placeholder={t('lockLabelPlaceholder')}
                                value={lock.label}
                                onChange={e => updateLock(lock.id, 'label', e.target.value)}
                              />
                            </div>
                            <div>
                              <label className="block text-[0.68rem] text-white/50 uppercase tracking-wider mb-1.5">{t('lockPct')}</label>
                              <input
                                type="number"
                                className="w-full px-3 py-2 rounded-[8px] border border-white/10 bg-white/[0.03] text-white text-[0.84rem] outline-none focus:border-cyan-500 font-[family-name:var(--font-mono)] transition-colors"
                                placeholder="10"
                                value={lock.pct}
                                onChange={e => updateLock(lock.id, 'pct', e.target.value)}
                              />
                            </div>
                            <div>
                              <label className="block text-[0.68rem] text-white/50 uppercase tracking-wider mb-1.5">{t('lockVestingType')}</label>
                              <select
                                className="w-full px-3 py-2 rounded-[8px] border border-white/10 bg-[#040d24] text-white text-[0.84rem] outline-none focus:border-cyan-500 transition-colors"
                                value={lock.vesting}
                                onChange={e => updateLock(lock.id, 'vesting', e.target.value as 'cliff' | 'linear')}
                              >
                                <option value="cliff">{t('lockCliff')}</option>
                                <option value="linear">{t('lockLinear')}</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-[0.68rem] text-white/50 uppercase tracking-wider mb-1.5">{t('lockMonths')}</label>
                              <input
                                type="number"
                                className="w-full px-3 py-2 rounded-[8px] border border-white/10 bg-white/[0.03] text-white text-[0.84rem] outline-none focus:border-cyan-500 font-[family-name:var(--font-mono)] transition-colors"
                                placeholder="12"
                                min="1"
                                value={lock.months}
                                onChange={e => updateLock(lock.id, 'months', e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-3 mb-6">
                    <Button variant="secondary" size="sm" type="button" onClick={addLock}>
                      <Plus className="w-3.5 h-3.5 mr-1.5" /> {t('addLock')}
                    </Button>
                    {locks.length > 0 && (
                      <div className="flex items-center gap-2 text-[0.82rem] text-white/50">
                        <Lock className="w-3.5 h-3.5 text-cyan-400" />
                        {t('totalLocked')}: <strong className={cn('font-[family-name:var(--font-mono)]', totalLockedPct > 100 ? 'text-red-400' : 'text-cyan-400')}>{totalLockedPct}%</strong>
                      </div>
                    )}
                  </div>
                </>
              )}

              {step === 4 && (
                <>
                  <h2 className="font-[family-name:var(--font-display)] text-[1.4rem] font-extrabold tracking-[-0.02em] mb-1.5">{t('saleConfigTitle')}</h2>
                  <p className="text-white/70 text-[0.92rem] mb-7">{t('saleConfigDesc')}</p>

                  <div className="mb-5">
                    <label htmlFor="field-rate" className="block text-[0.74rem] font-semibold text-white/70 uppercase tracking-wider mb-2">{t('tokenRate')} *</label>
                      <input id="field-rate" type="number" value={form.rate} onChange={(e) => update('rate', e.target.value)} placeholder="125000" className="w-full px-4 py-3 rounded-[10px] border border-white/10 bg-white/[0.02] text-white outline-none focus:border-cyan-500 font-[family-name:var(--font-mono)]" />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 mb-5">
                    {(['softCap', 'hardCap', 'minBuy', 'maxBuy'] as const)
                      .filter(k => !(k === 'hardCap' && form.saleType === 'fairlaunch'))
                      .map((k) => (
                        <div key={k}>
                          <label htmlFor={`field-${k}`} className="block text-[0.74rem] font-semibold text-white/70 uppercase tracking-wider mb-2">
                            {k === 'softCap' ? t('softCap') : k === 'hardCap' ? t('hardCap') : k === 'minBuy' ? t('minBuy') : t('maxBuy')} *
                          </label>
                          <input id={`field-${k}`} type="number" step="0.01" value={form[k]} onChange={(e) => update(k, e.target.value)} className="w-full px-4 py-3 rounded-[10px] border border-white/10 bg-white/[0.02] text-white outline-none focus:border-cyan-500 font-[family-name:var(--font-mono)]" />
                        </div>
                      ))}
                  </div>
                  {form.saleType === 'fairlaunch' && (
                    <div className="mb-5 p-3 rounded-[8px] bg-cyan-500/[0.04] border border-cyan-500/15 text-[0.8rem] text-cyan-400">
                      Fair Launch: no hard cap — the sale closes when the end date is reached.
                    </div>
                  )}

                  <div className="grid sm:grid-cols-2 gap-4 mb-7">
                    <div>
                      <label htmlFor="field-start-date" className="block text-[0.74rem] font-semibold text-white/70 uppercase tracking-wider mb-2">{t('startDate')} *</label>
                      <input id="field-start-date" type="datetime-local" value={form.startDate} onChange={(e) => update('startDate', e.target.value)} className="w-full px-4 py-3 rounded-[10px] border border-white/10 bg-white/[0.02] text-white outline-none focus:border-cyan-500" />
                    </div>
                    <div>
                      <label htmlFor="field-end-date" className="block text-[0.74rem] font-semibold text-white/70 uppercase tracking-wider mb-2">{t('endDate')} *</label>
                      <input id="field-end-date" type="datetime-local" value={form.endDate} onChange={(e) => update('endDate', e.target.value)} className="w-full px-4 py-3 rounded-[10px] border border-white/10 bg-white/[0.02] text-white outline-none focus:border-cyan-500" />
                    </div>
                  </div>

                  {/* Anti-bot section */}
                  <div className="mb-5">
                    <label className={cn(
                      'flex items-start gap-3 p-3.5 rounded-[10px] border cursor-pointer transition-all mb-3',
                      form.antiBotEnabled ? 'border-green-500/35 bg-green-500/[0.04]' : 'border-white/10 bg-white/[0.02]'
                    )}>
                      <input type="checkbox" checked={form.antiBotEnabled} onChange={e => update('antiBotEnabled', e.target.checked)} className="mt-1 accent-green-500" />
                      <div>
                        <div className="font-semibold text-[0.9rem] flex items-center gap-2 mb-1">
                          <Shield className="w-4 h-4 text-green-400" /> {t('antiBotEnable')}
                        </div>
                        <p className="text-[0.78rem] text-white/50">{t('antiBotEnableDesc')}</p>
                      </div>
                    </label>

                    {form.antiBotEnabled && (
                      <div className="pl-4 border-l-2 border-green-500/30 space-y-4">
                        <div className="grid sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-[0.72rem] font-semibold text-white/60 uppercase tracking-wider mb-2">{t('maxWalletPct')}</label>
                            <input type="number" value={form.maxWalletPct} min={0.1} max={100} step={0.5}
                              onChange={e => update('maxWalletPct', e.target.value)}
                              className="w-full px-3 py-2.5 rounded-[10px] border border-white/10 bg-white/[0.02] text-white outline-none focus:border-green-500 font-[family-name:var(--font-mono)] text-[0.88rem]"
                            />
                            <p className="text-[0.7rem] text-white/35 mt-1">{t('maxWalletPctDesc')}</p>
                          </div>
                          <div>
                            <label className="block text-[0.72rem] font-semibold text-white/60 uppercase tracking-wider mb-2">{t('txDelay')}</label>
                            <input type="number" value={form.txDelay} min={0} max={300}
                              onChange={e => update('txDelay', e.target.value)}
                              className="w-full px-3 py-2.5 rounded-[10px] border border-white/10 bg-white/[0.02] text-white outline-none focus:border-green-500 font-[family-name:var(--font-mono)] text-[0.88rem]"
                            />
                            <p className="text-[0.7rem] text-white/35 mt-1">{t('txDelayDesc')}</p>
                          </div>
                          <div>
                            <label className="block text-[0.72rem] font-semibold text-white/60 uppercase tracking-wider mb-2">{t('maxTxPerBlock')}</label>
                            <input type="number" value={form.maxTxPerBlock} min={1} max={10}
                              onChange={e => update('maxTxPerBlock', e.target.value)}
                              className="w-full px-3 py-2.5 rounded-[10px] border border-white/10 bg-white/[0.02] text-white outline-none focus:border-green-500 font-[family-name:var(--font-mono)] text-[0.88rem]"
                            />
                            <p className="text-[0.7rem] text-white/35 mt-1">{t('maxTxPerBlockDesc')}</p>
                          </div>
                        </div>
                        <div className="p-3 rounded-[8px] bg-green-500/[0.04] border border-green-500/20 text-[0.78rem] text-green-400">
                          {t('antiBotNote')}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Whitelist section */}
                  <div>
                    <label className={cn(
                      'flex items-start gap-3 p-3.5 rounded-[10px] border cursor-pointer transition-all mb-3',
                      form.whitelistEnabled ? 'border-amber-500/35 bg-amber-500/[0.04]' : 'border-white/10 bg-white/[0.02]'
                    )}>
                      <input type="checkbox" checked={form.whitelistEnabled} onChange={e => update('whitelistEnabled', e.target.checked)} className="mt-1 accent-amber-500" />
                      <div>
                        <div className="font-semibold text-[0.9rem] flex items-center gap-2 mb-1">
                          <Users className="w-4 h-4 text-amber-400" /> {t('whitelistEnable')}
                        </div>
                        <p className="text-[0.78rem] text-white/50">{t('whitelistEnableDesc')}</p>
                      </div>
                    </label>

                    {form.whitelistEnabled && (
                      <div className="pl-4 border-l-2 border-amber-500/30 space-y-3">
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-[0.72rem] font-semibold text-white/60 uppercase tracking-wider">{t('whitelistAddrs')}</label>
                          <div className="flex items-center gap-2">
                            {form.whitelistRaw && (
                              <span className="text-[0.72rem] text-amber-400 font-[family-name:var(--font-mono)]">
                                {form.whitelistRaw.split('\n').filter(l => l.trim()).length} {t('whitelistCount')}
                              </span>
                            )}
                            <input ref={whitelistFileRef} type="file" accept=".csv,.txt" className="hidden"
                              onChange={e => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const reader = new FileReader();
                                reader.onload = ev => update('whitelistRaw', (ev.target?.result as string).replace(/,.*$/gm, '').replace(/\r/g, ''));
                                reader.readAsText(file);
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => whitelistFileRef.current?.click()}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] border border-white/15 bg-white/[0.02] text-white/50 hover:text-white text-[0.72rem] transition-all"
                            >
                              <Upload className="w-3 h-3" /> {t('whitelistUploadCsv')}
                            </button>
                            {form.whitelistRaw && (
                              <button type="button" onClick={() => update('whitelistRaw', '')}
                                className="text-[0.72rem] text-white/30 hover:text-red-400 transition-colors"
                              >
                                {t('whitelistClear')}
                              </button>
                            )}
                          </div>
                        </div>
                        <textarea
                          className="w-full px-3 py-2.5 rounded-[10px] border border-white/10 bg-white/[0.02] text-white outline-none focus:border-amber-500 font-[family-name:var(--font-mono)] text-[0.82rem] min-h-[120px] resize-y transition-colors"
                          placeholder={t('whitelistPlaceholder')}
                          value={form.whitelistRaw}
                          onChange={e => update('whitelistRaw', e.target.value)}
                        />
                        <p className="text-[0.72rem] text-white/35">{t('whitelistHint')}</p>
                      </div>
                    )}
                  </div>
                </>
              )}

              {step === 5 && (
                <>
                  <h2 className="font-[family-name:var(--font-display)] text-[1.4rem] font-extrabold tracking-[-0.02em] mb-1.5">{t('reviewTitle')}</h2>
                  <p className="text-white/70 text-[0.92rem] mb-7">{t('reviewDesc')}</p>

                  <div className="mb-5 p-5 rounded-[14px] bg-gradient-to-br from-cyan-500/[0.06] to-violet-500/[0.04] border border-cyan-500/15 flex gap-5 items-center">
                    <AiScore score={preScore} size="lg" />
                    <div className="flex-1">
                      <div className="font-bold flex items-center gap-2 mb-1">
                        <svg className="w-4 h-4 text-cyan-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L14.09 8.26L20 9.27L15.5 13.97L16.82 19.96L12 16.77L7.18 19.96L8.5 13.97L4 9.27L9.91 8.26L12 2z"/></svg>
                        {t('aiPreCheck')}
                      </div>
                      <div className="text-[0.86rem] text-white/70 leading-[1.55]">
                        {preScore >= 85 ? 'Excellent configuration — ready to launch with high investor confidence.' :
                         preScore >= 70 ? 'Good configuration. Consider increasing liquidity ratio.' :
                         'Below recommended thresholds. Consider adjusting tokenomics before deploy.'}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-[10px] bg-white/[0.02] border border-white/10 mb-5">
                    <div className="font-[family-name:var(--font-display)] font-bold mb-3">{t('summaryTitle')}</div>
                    <div className="grid sm:grid-cols-2 gap-2 text-[0.88rem]">
                      {[
                        [t('fieldName'), form.name || '—'],
                        [t('fieldSymbol'), form.symbol || '—'],
                        [t('fieldChain'), form.chain.toUpperCase()],
                        [t('fieldSaleType'), form.saleType],
                        [t('supplyField'), form.supply || '—'],
                        [t('softCap'), `${form.liquidity || 0}%`],
                      ].map(([k, v]) => (
                        <div key={k} className="flex justify-between p-2 rounded bg-white/[0.02]">
                          <span className="text-white/50">{k}</span>
                          <span className="font-[family-name:var(--font-mono)]">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <label className="flex items-start gap-3 p-3.5 rounded-[10px] border border-white/10 bg-white/[0.02] cursor-pointer text-[0.88rem]">
                    <input type="checkbox" checked={form.terms} onChange={(e) => update('terms', e.target.checked)} className="mt-1 accent-cyan-500" />
                    <span>{t('termsAccept')}</span>
                  </label>
                </>
              )}

              {step === 6 && (
                <div className="text-center py-10">
                  <div className="w-[100px] h-[100px] mx-auto mb-6 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-[0_0_64px_rgba(0,212,255,0.4)]" style={{ animation: 'glow-pulse 2s infinite' }}>
                    <CheckCircle2 className="w-12 h-12 text-[#021628]" strokeWidth={3} />
                  </div>
                  <h2 className="font-[family-name:var(--font-display)] text-[1.9rem] font-extrabold tracking-[-0.025em] mb-3">
                    {t('deployedTitle')}
                  </h2>
                  <p className="text-white/70 max-w-[440px] mx-auto mb-7 leading-relaxed">
                    {t('deployedDesc')}
                  </p>
                  <div className="inline-flex flex-col gap-3 p-5 rounded-[14px] bg-cyan-500/[0.04] border border-cyan-500/15 text-left max-w-[500px] w-full">
                    <div>
                      <div className="text-[0.72rem] text-white/50 uppercase tracking-wider mb-1">{t('contractAddress')} <span className="text-gold-400 normal-case">(demo)</span></div>
                      <div className="font-[family-name:var(--font-mono)] text-[0.82rem] text-cyan-400 break-all">0x0000000000000000000000000000000000001337</div>
                    </div>
                    <div>
                      <div className="text-[0.72rem] text-white/50 uppercase tracking-wider mb-1">{t('txHash')}</div>
                      <div className="font-[family-name:var(--font-mono)] text-[0.82rem] text-cyan-400 break-all">0x3f2a8b1d9c4e7a6f5b2e8d9c1a3b4e5f6a7b8c9d</div>
                    </div>
                  </div>
                  <div className="flex gap-3 justify-center mt-8 flex-wrap">
                    <Button asChild><Link href="/projects">{t('viewProjects')}</Link></Button>
                    <Button variant="secondary" asChild><Link href="/dashboard">{tn('dashboard')}</Link></Button>
                  </div>
                </div>
              )}

              {/* Actions */}
              {step < 6 && (
                <div className="flex justify-between pt-6 mt-7 border-t border-white/10 gap-3 flex-wrap">
                  {step === 1 ? (
                    <Button variant="ghost" asChild><Link href="/">{t('cancelAction')}</Link></Button>
                  ) : (
                    <Button variant="ghost" onClick={back}><ArrowLeft className="w-4 h-4" /> {t('backAction')}</Button>
                  )}
                  {step < 5 ? (
                    <Button onClick={next}>{t('nextAction')} <ArrowRight className="w-4 h-4" /></Button>
                  ) : (
                    <Button size="lg" onClick={deploy} disabled={deploying}><Rocket className="w-5 h-5" /> {deploying ? t('deploying') : t('deployButton')}</Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
