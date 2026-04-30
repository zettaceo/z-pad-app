'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Coins, ChevronDown, CheckCircle, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

import { useWallet } from '@/lib/wallet-store';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';

const NETWORKS = ['networkBsc', 'networkEth', 'networkPolygon', 'networkArbitrum', 'networkSolana', 'networkBase'] as const;

interface TokenForm {
  name: string;
  symbol: string;
  supply: string;
  decimals: string;
  network: string;
  mintable: boolean;
  burnable: boolean;
  antiWhale: boolean;
  maxTxPct: string;
  buyTax: string;
  sellTax: string;
  taxWallet: string;
}

const DEFAULT_FORM: TokenForm = {
  name: '',
  symbol: '',
  supply: '1000000000',
  decimals: '18',
  network: 'networkBsc',
  mintable: false,
  burnable: true,
  antiWhale: false,
  maxTxPct: '1',
  buyTax: '0',
  sellTax: '0',
  taxWallet: '',
};

export default function TokenCreatorPage() {
  const t = useTranslations('tokenCreator');
  const tc = useTranslations('common');
  const { wallet, openWalletModal } = useWallet();

  const [form, setForm] = useState<TokenForm>(DEFAULT_FORM);
  const [networkOpen, setNetworkOpen] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [deployed, setDeployed] = useState(false);

  const update = <K extends keyof TokenForm>(k: K, v: TokenForm[K]) =>
    setForm(f => ({ ...f, [k]: v }));

  const toggle = (k: 'mintable' | 'burnable' | 'antiWhale') =>
    setForm(f => ({ ...f, [k]: !f[k] }));

  const hasTax = parseFloat(form.buyTax) > 0 || parseFloat(form.sellTax) > 0;
  const isValidEthAddress = (addr: string) => /^0x[0-9a-fA-F]{40}$/.test(addr);

  const handleDeploy = () => {
    if (!wallet.connected) { openWalletModal(); return; }
    if (!form.name.trim() || !form.symbol.trim() || !form.supply) {
      toast.error('Fill in all required fields'); return;
    }
    if (form.symbol.length < 2 || form.symbol.length > 8) {
      toast.error('Symbol must be 2–8 characters'); return;
    }
    if (Number(form.supply) <= 0 || !Number.isFinite(Number(form.supply))) {
      toast.error('Supply must be a positive number'); return;
    }
    if (hasTax && !form.taxWallet) {
      toast.error('Tax wallet address is required when tax > 0'); return;
    }
    if (hasTax && !isValidEthAddress(form.taxWallet)) {
      toast.error('Tax wallet must be a valid Ethereum address (0x…)'); return;
    }
    setDeploying(true);
    toast.loading('Compiling contract…', { id: 'deploy' });
    setTimeout(() => {
      toast.loading('Deploying to network…', { id: 'deploy' });
      setTimeout(() => {
        toast.success(t('deploySuccess'), { id: 'deploy' });
        setDeploying(false);
        setDeployed(true);
      }, 1800);
    }, 1200);
  };

  const inputCls = 'w-full px-4 py-3 rounded-[10px] border border-white/10 bg-white/[0.02] text-white outline-none focus:border-cyan-500 focus:bg-cyan-500/[0.02] transition-colors text-[0.9rem]';
  const labelCls = 'block text-[0.74rem] font-semibold text-white/70 uppercase tracking-wider mb-2';

  const features = [
    form.mintable && 'Mintable',
    form.burnable && 'Burnable',
    form.antiWhale && `Anti-Whale (max ${form.maxTxPct}%)`,
    hasTax && `Tax ${form.buyTax}%/${form.sellTax}%`,
  ].filter(Boolean);

  if (deployed) {
    return (
      <div className="pt-[100px]">
        <div className="max-w-[520px] mx-auto px-6 py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-[2rem] font-extrabold tracking-[-0.03em] mb-3">
            {t('deploySuccess')}
          </h1>
          <p className="text-white/60 mb-2 font-[family-name:var(--font-mono)] text-[0.9rem]">
            {form.symbol} · {form.name}
          </p>
          <p className="text-white/40 text-[0.82rem] mb-8">
            Contract: <span className="text-cyan-400 font-[family-name:var(--font-mono)]">0x7f4e...3aB2</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => { setDeployed(false); setForm(DEFAULT_FORM); }}>
              Create Another Token
            </Button>
            <Link href="/locker">
              <Button variant="secondary">Lock Tokens</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
          <p className="text-white/70 mt-2 max-w-[600px]">{t('desc')}</p>
        </div>
      </section>

      {/* Form + Preview */}
      <section className="py-8">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-[1fr_320px] gap-6">

            {/* Left: form */}
            <div className="space-y-5">

              {/* Network selector */}
              <div className="bg-bg-075 border border-white/10 rounded-[14px] p-5">
                <label className={labelCls}>{t('network')}</label>
                <div className="relative">
                  <button
                    onClick={() => setNetworkOpen(s => !s)}
                    className={inputCls + ' flex items-center justify-between text-left'}
                    type="button"
                  >
                    <span>{t(form.network as any)}</span>
                    <ChevronDown className={cn('w-4 h-4 text-white/50 transition-transform', networkOpen && 'rotate-180')} />
                  </button>
                  {networkOpen && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-bg-100 border border-white/14 rounded-[10px] shadow-xl overflow-hidden z-20">
                      {NETWORKS.map(n => (
                        <button
                          key={n}
                          onClick={() => { update('network', n); setNetworkOpen(false); }}
                          className={cn(
                            'w-full text-left px-4 py-2.5 text-[0.88rem] transition-colors',
                            form.network === n ? 'text-cyan-400 bg-cyan-500/10' : 'text-white/80 hover:bg-white/5'
                          )}
                          type="button"
                        >
                          {t(n as any)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Basic info */}
              <div className="bg-bg-075 border border-white/10 rounded-[14px] p-5">
                <h3 className="font-[family-name:var(--font-display)] font-bold text-[1rem] mb-4 flex items-center gap-2">
                  <Coins className="w-4 h-4 text-cyan-400" /> {t('sectionBasic')}
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className={labelCls}>{t('tokenName')} *</label>
                    <input className={inputCls} placeholder={t('tokenNamePlaceholder')} value={form.name} onChange={e => update('name', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>{t('tokenSymbol')} *</label>
                    <input className={inputCls + ' uppercase'} placeholder={t('tokenSymbolPlaceholder')} value={form.symbol} onChange={e => update('symbol', e.target.value.toUpperCase())} maxLength={8} />
                  </div>
                  <div>
                    <label className={labelCls}>{t('decimals')}</label>
                    <input type="number" className={inputCls} value={form.decimals} min={0} max={18} onChange={e => update('decimals', e.target.value)} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>{t('totalSupply')} *</label>
                    <input type="number" className={inputCls + ' font-[family-name:var(--font-mono)]'} placeholder={t('totalSupplyPlaceholder')} value={form.supply} onChange={e => update('supply', e.target.value)} />
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="bg-bg-075 border border-white/10 rounded-[14px] p-5">
                <h3 className="font-[family-name:var(--font-display)] font-bold text-[1rem] mb-4 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-400" /> {t('sectionFeatures')}
                </h3>
                <div className="space-y-3">
                  {([
                    { key: 'mintable', titleKey: 'mintable', descKey: 'mintableDesc' },
                    { key: 'burnable', titleKey: 'burnable', descKey: 'burnableDesc' },
                    { key: 'antiWhale', titleKey: 'antiWhale', descKey: 'antiWhaleDesc' },
                  ] as const).map(({ key, titleKey, descKey }) => (
                    <div key={key} className="flex items-start justify-between gap-4 p-3.5 rounded-[10px] bg-white/[0.02] border border-white/8">
                      <div>
                        <div className="font-semibold text-[0.9rem]">{t(titleKey)}</div>
                        <p className="text-white/50 text-[0.8rem] mt-0.5">{t(descKey)}</p>
                      </div>
                      <button
                        onClick={() => toggle(key)}
                        className={cn(
                          'relative w-11 h-6 rounded-full shrink-0 transition-colors',
                          form[key] ? 'bg-cyan-500' : 'bg-white/10'
                        )}
                        type="button"
                        role="switch"
                        aria-checked={form[key]}
                        aria-label={t(titleKey)}
                      >
                        <span className={cn('absolute top-1 w-4 h-4 rounded-full bg-white transition-all', form[key] ? 'left-6' : 'left-1')} />
                      </button>
                    </div>
                  ))}

                  {form.antiWhale && (
                    <div className="pl-4 border-l-2 border-cyan-500/30">
                      <label className={labelCls}>{t('maxTxPct')}</label>
                      <input type="number" className={inputCls} placeholder={t('maxTxPlaceholder')} value={form.maxTxPct} min={0.1} max={100} step={0.1} onChange={e => update('maxTxPct', e.target.value)} />
                    </div>
                  )}
                </div>
              </div>

              {/* Tax */}
              <div className="bg-bg-075 border border-white/10 rounded-[14px] p-5">
                <h3 className="font-[family-name:var(--font-display)] font-bold text-[1rem] mb-1">{t('sectionTax')}</h3>
                <p className="text-white/40 text-[0.8rem] mb-4">{t('taxNote')}</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>{t('buyTax')}</label>
                    <input type="number" className={inputCls} value={form.buyTax} min={0} max={25} step={0.5} onChange={e => update('buyTax', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>{t('sellTax')}</label>
                    <input type="number" className={inputCls} value={form.sellTax} min={0} max={25} step={0.5} onChange={e => update('sellTax', e.target.value)} />
                  </div>
                  {hasTax && (
                    <div className="sm:col-span-2">
                      <label className={labelCls}>{t('taxWallet')} *</label>
                      <input className={inputCls + ' font-[family-name:var(--font-mono)]'} placeholder={t('taxWalletPlaceholder')} value={form.taxWallet} onChange={e => update('taxWallet', e.target.value)} />
                    </div>
                  )}
                </div>
              </div>

              {/* Fee tip */}
              <div className="p-3.5 rounded-[10px] bg-cyan-500/[0.04] border border-cyan-500/20 text-[0.82rem] text-cyan-400">
                {t('feeTip')}
              </div>
            </div>

            {/* Right: preview */}
            <div className="lg:sticky lg:top-[110px] lg:self-start">
              <div className="bg-bg-075 border border-white/10 rounded-[14px] p-5">
                <h3 className="font-[family-name:var(--font-display)] font-bold text-[1rem] mb-4">{t('preview')}</h3>

                {/* Token avatar */}
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mx-auto mb-4 text-[#021628] font-extrabold text-[1.3rem] font-[family-name:var(--font-display)]">
                  {form.symbol ? form.symbol.slice(0, 2) : '?'}
                </div>

                <div className="text-center mb-5">
                  <div className="font-bold text-[1.1rem]">{form.name || '—'}</div>
                  <div className="text-white/50 text-[0.85rem] font-[family-name:var(--font-mono)]">{form.symbol || '—'}</div>
                </div>

                <div className="space-y-2.5 text-[0.85rem]">
                  {[
                    { label: t('previewSupply'), value: form.supply ? Number(form.supply).toLocaleString() : '—' },
                    { label: t('previewDecimals'), value: form.decimals || '18' },
                    { label: t('previewNetwork'), value: t(form.network as any) },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between gap-2 py-2 border-b border-white/5 last:border-0">
                      <span className="text-white/50">{label}</span>
                      <span className="font-semibold text-right text-[0.83rem]">{value}</span>
                    </div>
                  ))}

                  <div className="py-2">
                    <div className="text-white/50 mb-2">{t('previewFeatures')}</div>
                    {features.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {features.map(f => (
                          <span key={f as string} className="text-[0.72rem] px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-semibold">
                            {f}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-white/30 text-[0.82rem]">Standard ERC-20</span>
                    )}
                  </div>
                </div>

                <div className="mt-5">
                  <Button className="w-full" onClick={handleDeploy} disabled={deploying}>
                    {deploying ? t('deploying') : (wallet.connected ? t('deployBtn') : tc('confirm'))}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
