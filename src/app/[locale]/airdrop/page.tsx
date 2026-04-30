'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { Send, Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

import { useWallet } from '@/lib/wallet-store';
import { fmt } from '@/lib/format';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';

interface Recipient {
  address: string;
  amount: string;
  valid: boolean;
}

interface TokenInfo {
  name: string;
  symbol: string;
  decimals: number;
  balance: string;
}

const MOCK_TOKEN: TokenInfo = { name: 'My Token', symbol: 'MTK', decimals: 18, balance: '10000000' };

function parseRecipients(raw: string): Recipient[] {
  return raw
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => {
      const parts = line.split(',');
      const address = parts[0]?.trim() ?? '';
      const amount = parts[1]?.trim() ?? '';
      const validAddr = /^0x[0-9a-fA-F]{40}$/.test(address);
      const validAmt = !isNaN(parseFloat(amount)) && parseFloat(amount) > 0;
      return { address, amount, valid: validAddr && validAmt };
    });
}

export default function AirdropPage() {
  const t = useTranslations('airdrop');
  const tc = useTranslations('common');
  const { wallet, openWalletModal } = useWallet();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [tokenAddr, setTokenAddr] = useState('');
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [loadingToken, setLoadingToken] = useState(false);
  const [rawRecipients, setRawRecipients] = useState('');
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleLoadToken = () => {
    if (!tokenAddr) return;
    setLoadingToken(true);
    toast.loading(t('loading'), { id: 'token' });
    setTimeout(() => {
      setTokenInfo(MOCK_TOKEN);
      toast.success(t('tokenLoaded'), { id: 'token' });
      setLoadingToken(false);
      setStep(2);
    }, 1000);
  };

  const handleParseRecipients = () => {
    const parsed = parseRecipients(rawRecipients);
    if (parsed.length === 0) { toast.error(t('errorNoRecipients')); return; }
    setRecipients(parsed);
    setStep(3);
  };

  const handleCsv = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Limit CSV size to 500 KB to prevent memory issues from giant files
    if (file.size > 512_000) { toast.error('CSV file too large (max 500 KB)'); return; }
    const reader = new FileReader();
    reader.onload = ev => {
      const text = ev.target?.result as string;
      setRawRecipients(text.replace(/\r/g, '').slice(0, 100_000));
    };
    reader.readAsText(file);
  };

  const removeRecipient = (i: number) =>
    setRecipients(r => r.filter((_, idx) => idx !== i));

  const totalAmount = recipients.reduce((s, r) => s + (parseFloat(r.amount) || 0), 0);
  const validCount = recipients.filter(r => r.valid).length;

  const handleSend = () => {
    if (!wallet.connected) { openWalletModal(); return; }
    if (!tokenInfo) { toast.error(t('errorNoToken')); return; }
    if (recipients.length === 0) { toast.error(t('errorNoRecipients')); return; }
    setSending(true);
    toast.loading('Approving token spend…', { id: 'airdrop' });
    setTimeout(() => {
      toast.loading('Broadcasting transaction…', { id: 'airdrop' });
      setTimeout(() => {
        toast.success(t('sendSuccess'), { id: 'airdrop' });
        setSending(false);
        setSent(true);
      }, 1800);
    }, 1200);
  };

  const inputCls = 'w-full px-4 py-3 rounded-[10px] border border-white/10 bg-white/[0.02] text-white outline-none focus:border-cyan-500 focus:bg-cyan-500/[0.02] transition-colors text-[0.9rem]';
  const labelCls = 'block text-[0.74rem] font-semibold text-white/70 uppercase tracking-wider mb-2';

  const STEPS = [t('step1Title'), t('step2Title'), t('step3Title')];

  if (sent) {
    return (
      <div className="pt-[100px]">
        <div className="max-w-[520px] mx-auto px-6 py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-[2rem] font-extrabold tracking-[-0.03em] mb-3">
            {t('sendSuccess')}
          </h1>
          <p className="text-white/60 mb-2">
            {recipients.length} wallets · {totalAmount.toLocaleString()} {tokenInfo?.symbol}
          </p>
          <p className="text-white/40 text-[0.82rem] mb-8">
            TX: <span className="text-cyan-400 font-[family-name:var(--font-mono)]">0xab3f...9c12</span>
          </p>
          <Button onClick={() => { setSent(false); setStep(1); setTokenAddr(''); setTokenInfo(null); setRawRecipients(''); setRecipients([]); }}>
            New Airdrop
          </Button>
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

      <section className="py-8">
        <div className="max-w-[860px] mx-auto px-4 sm:px-6">

          {/* Step indicators */}
          <div className="flex items-center gap-0 mb-8">
            {STEPS.map((label, i) => {
              const n = i + 1;
              const done = step > n;
              const active = step === n;
              return (
                <div key={n} className="flex items-center flex-1 last:flex-none">
                  <div className="flex items-center gap-2.5 shrink-0">
                    <div className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center font-bold text-[0.8rem] border transition-all',
                      done ? 'bg-green-500/20 border-green-500/40 text-green-400' :
                      active ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400' :
                      'bg-white/5 border-white/15 text-white/30'
                    )}>
                      {done ? <CheckCircle className="w-4 h-4" /> : n}
                    </div>
                    <span className={cn('text-[0.82rem] font-medium hidden sm:block', active ? 'text-white' : 'text-white/40')}>{label}</span>
                  </div>
                  {i < STEPS.length - 1 && <div className={cn('flex-1 h-px mx-3', step > n ? 'bg-green-500/40' : 'bg-white/10')} />}
                </div>
              );
            })}
          </div>

          {/* Step 1: Select Token */}
          {step === 1 && (
            <div className="bg-bg-075 border border-white/10 rounded-[14px] p-6">
              <h2 className="font-[family-name:var(--font-display)] font-bold text-[1.1rem] mb-5">{t('step1Title')}</h2>
              {!wallet.connected ? (
                <div className="text-center py-8">
                  <Send className="w-10 h-10 mx-auto mb-3 text-white/20" />
                  <p className="text-white/50 mb-4">{t('connectPrompt')}</p>
                  <Button onClick={openWalletModal}>{tc('confirm')}</Button>
                </div>
              ) : (
                <div>
                  <label className={labelCls}>{t('tokenAddr')}</label>
                  <div className="flex gap-3">
                    <input
                      className={inputCls + ' font-[family-name:var(--font-mono)]'}
                      placeholder={t('tokenAddrPlaceholder')}
                      value={tokenAddr}
                      onChange={e => setTokenAddr(e.target.value)}
                    />
                    <Button onClick={handleLoadToken} disabled={loadingToken || !tokenAddr}>
                      {loadingToken ? tc('loading') : t('loadTokenBtn')}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Recipients */}
          {step === 2 && tokenInfo && (
            <div className="space-y-4">
              {/* Token info bar */}
              <div className="bg-bg-075 border border-cyan-500/20 rounded-[14px] p-4 flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-[#021628] font-extrabold text-[0.75rem]">
                    {tokenInfo.symbol.slice(0, 2)}
                  </div>
                  <div>
                    <div className="font-semibold text-[0.9rem]">{tokenInfo.name}</div>
                    <div className="text-white/40 text-[0.75rem] font-[family-name:var(--font-mono)]">{tokenAddr.slice(0, 12)}…</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[0.72rem] text-white/40 uppercase tracking-wider">{t('tokenBalance')}</div>
                  <div className="font-[family-name:var(--font-mono)] font-semibold text-cyan-400">{Number(tokenInfo.balance).toLocaleString()} {tokenInfo.symbol}</div>
                </div>
              </div>

              <div className="bg-bg-075 border border-white/10 rounded-[14px] p-6">
                <div className="flex items-center justify-between mb-3">
                  <label className={labelCls + ' !mb-0'}>{t('recipientsLabel')}</label>
                  <div className="flex gap-2">
                    <input ref={fileRef} type="file" accept=".csv,.txt" className="hidden" onChange={handleCsv} />
                    <button
                      onClick={() => fileRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] border border-white/15 bg-white/[0.02] text-white/60 hover:text-white hover:border-white/30 text-[0.78rem] transition-all"
                      type="button"
                    >
                      <Upload className="w-3.5 h-3.5" /> {t('uploadCsv')}
                    </button>
                  </div>
                </div>
                <textarea
                  className={inputCls + ' font-[family-name:var(--font-mono)] min-h-[200px] resize-y'}
                  placeholder={t('recipientsPlaceholder')}
                  value={rawRecipients}
                  onChange={e => setRawRecipients(e.target.value)}
                />
                <p className="text-white/40 text-[0.76rem] mt-2">{t('recipientsHint')}</p>
                <p className="text-white/30 text-[0.72rem]">{t('csvFormat')}</p>
                <div className="mt-4 flex gap-3">
                  <Button onClick={handleParseRecipients} disabled={!rawRecipients.trim()}>
                    {tc('next')} →
                  </Button>
                  <Button variant="secondary" onClick={() => setStep(1)}>{tc('back')}</Button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Preview & Send */}
          {step === 3 && (
            <div className="space-y-4">
              {/* Summary stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: t('recipientCount'), value: recipients.length.toString() },
                  { label: t('totalAmount'), value: `${totalAmount.toLocaleString()} ${tokenInfo?.symbol}` },
                  { label: t('estimatedGas'), value: '~0.003 BNB' },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-bg-075 border border-white/10 rounded-[14px] p-4 text-center">
                    <div className="font-bold text-[1.1rem] text-cyan-400">{value}</div>
                    <div className="text-[0.72rem] text-white/40 uppercase tracking-wider mt-0.5">{label}</div>
                  </div>
                ))}
              </div>

              {/* Invalid rows warning */}
              {validCount < recipients.length && (
                <div className="flex items-center gap-2 p-3.5 rounded-[10px] bg-amber-500/[0.06] border border-amber-500/25 text-[0.82rem] text-amber-400">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {recipients.length - validCount} invalid rows will be skipped
                </div>
              )}

              {/* Recipient table */}
              <div className="bg-bg-075 border border-white/10 rounded-[14px] overflow-hidden">
                <div className="p-4 border-b border-white/8">
                  <h3 className="font-semibold text-[0.95rem]">{t('previewTitle')}</h3>
                </div>
                <div className="overflow-x-auto max-h-[360px] overflow-y-auto">
                  <table className="w-full text-[0.86rem] min-w-[480px]">
                    <thead className="sticky top-0 bg-bg-075">
                      <tr className="bg-white/[0.02] border-b border-white/8">
                        <th className="text-left p-3 text-[0.7rem] text-white/40 font-semibold uppercase tracking-wider">#</th>
                        <th className="text-left p-3 text-[0.7rem] text-white/40 font-semibold uppercase tracking-wider">{t('tableAddr')}</th>
                        <th className="text-right p-3 text-[0.7rem] text-white/40 font-semibold uppercase tracking-wider">{t('tableAmount')}</th>
                        <th className="p-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {recipients.map((r, i) => (
                        <tr key={i} className={cn('border-b border-white/5 last:border-0', !r.valid && 'opacity-40')}>
                          <td className="p-3 text-white/30">{i + 1}</td>
                          <td className="p-3 font-[family-name:var(--font-mono)] text-[0.82rem]">
                            <div className="flex items-center gap-2">
                              {!r.valid && <AlertCircle className="w-3 h-3 text-amber-400 shrink-0" />}
                              <span className="truncate max-w-[200px]">{r.address}</span>
                            </div>
                          </td>
                          <td className="p-3 text-right font-[family-name:var(--font-mono)] font-semibold">
                            {r.amount} <span className="text-white/40 font-normal">{tokenInfo?.symbol}</span>
                          </td>
                          <td className="p-3">
                            <button onClick={() => removeRecipient(i)} className="text-white/30 hover:text-red-400 transition-colors" type="button" aria-label={`Remove recipient ${r.address}`}>
                              <X className="w-3.5 h-3.5" aria-hidden="true" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="p-3.5 rounded-[10px] bg-cyan-500/[0.04] border border-cyan-500/20 text-[0.82rem] text-cyan-400">
                {t('feeTip')}
              </div>

              <div className="flex gap-3">
                <Button onClick={handleSend} disabled={sending || validCount === 0}>
                  <Send className="w-4 h-4 mr-1.5" />
                  {sending ? t('sending') : t('sendBtn')}
                </Button>
                <Button variant="secondary" onClick={() => setStep(2)}>{tc('back')}</Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
