'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeftRight, Plus, X, Search, ChevronDown, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

import { useWallet } from '@/lib/wallet-store';
import { fmt } from '@/lib/format';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';

const now = Date.now();
const d = 86400000;

interface Listing {
  id: string;
  token: string;
  symbol: string;
  network: string;
  amount: number;
  filled: number;
  pricePerToken: number;
  minBuy: number;
  maxBuy: number;
  seller: string;
  expiresAt: number;
  status: 'active' | 'filled' | 'expired';
}

const MOCK_LISTINGS: Listing[] = [
  { id: '1', token: 'ZETTA',   symbol: 'ZETTA', network: 'BSC',      amount: 2000000,  filled: 450000,  pricePerToken: 0.000042, minBuy: 10000,  maxBuy: 500000,  seller: '0x3A4c...f82E', expiresAt: now + 5 * d,  status: 'active' },
  { id: '2', token: 'AIO',     symbol: 'AIO',   network: 'BSC',      amount: 500000,   filled: 500000,  pricePerToken: 0.00021,  minBuy: 5000,   maxBuy: 100000,  seller: '0xAA2b...7F1C', expiresAt: now - d,      status: 'filled' },
  { id: '3', token: 'PIXV',    symbol: 'PIXV',  network: 'ETH',      amount: 1000000,  filled: 120000,  pricePerToken: 0.0000088,minBuy: 50000,  maxBuy: 300000,  seller: '0x5F9a...1C8E', expiresAt: now + 2 * d,  status: 'active' },
  { id: '4', token: 'MANGO',   symbol: 'MANGO', network: 'Polygon',  amount: 5000000,  filled: 1800000, pricePerToken: 0.0000031,minBuy: 100000, maxBuy: 1000000, seller: '0x8D3b...22AF', expiresAt: now + 12 * d, status: 'active' },
  { id: '5', token: 'NOVA',    symbol: 'NOVA',  network: 'BSC',      amount: 300000,   filled: 0,       pricePerToken: 0.00095,  minBuy: 1000,   maxBuy: 50000,   seller: '0x1F2c...9BE1', expiresAt: now + 8 * d,  status: 'active' },
  { id: '6', token: 'FLUX',    symbol: 'FLUX',  network: 'Arbitrum', amount: 800000,   filled: 200000,  pricePerToken: 0.00018,  minBuy: 5000,   maxBuy: 200000,  seller: '0x6C4d...3DA9', expiresAt: now + 3 * d,  status: 'active' },
];

const NETWORK_COLORS: Record<string, string> = {
  BSC: 'text-[#f3ba2f] bg-[#f3ba2f]/10',
  ETH: 'text-blue-400 bg-blue-400/10',
  Polygon: 'text-violet-400 bg-violet-400/10',
  Arbitrum: 'text-cyan-400 bg-cyan-400/10',
  Solana: 'text-green-400 bg-green-400/10',
  Base: 'text-blue-300 bg-blue-300/10',
};

interface CreateForm {
  tokenAddr: string;
  tokenSymbol: string;
  amount: string;
  price: string;
  minBuy: string;
  maxBuy: string;
  expiry: string;
}

export default function OtcPage() {
  const t = useTranslations('otc');
  const tc = useTranslations('common');
  const { wallet, openWalletModal } = useWallet();

  const [tab, setTab] = useState<'browse' | 'mine' | 'create'>('browse');
  const [search, setSearch] = useState('');
  const [networkFilter, setNetworkFilter] = useState('all');
  const [sort, setSort] = useState('newest');
  const [sortOpen, setSortOpen] = useState(false);
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const [listings, setListings] = useState<Listing[]>(MOCK_LISTINGS);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<CreateForm>({
    tokenAddr: '', tokenSymbol: '', amount: '', price: '', minBuy: '', maxBuy: '', expiry: '',
  });

  const update = <K extends keyof CreateForm>(k: K, v: CreateForm[K]) =>
    setForm(f => ({ ...f, [k]: v }));

  const handleBuy = (listing: Listing) => {
    if (!wallet.connected) { openWalletModal(); return; }
    setBuyingId(listing.id);
    toast.loading(`Buying ${listing.symbol}…`, { id: 'buy' });
    setTimeout(() => {
      toast.success(t('buySuccess'), { id: 'buy' });
      setBuyingId(null);
    }, 1600);
  };

  const handleCancel = (id: string) => {
    setListings(l => l.filter(x => x.id !== id));
    toast.success(t('cancelConfirm'));
  };

  const handleCreate = () => {
    if (!wallet.connected) { openWalletModal(); return; }
    if (!form.tokenAddr || !form.amount || !form.price || !form.expiry) {
      toast.error('Fill in all required fields'); return;
    }
    setCreating(true);
    toast.loading('Creating listing…', { id: 'create' });
    setTimeout(() => {
      toast.success(t('listSuccess'), { id: 'create' });
      setCreating(false);
      setForm({ tokenAddr: '', tokenSymbol: '', amount: '', price: '', minBuy: '', maxBuy: '', expiry: '' });
      setTab('mine');
    }, 1600);
  };

  const activeListings = listings.filter(l => l.status === 'active');
  const myListings = listings.filter(l => l.seller === '0x3A4c...f82E');

  const filtered = activeListings
    .filter(l => !search || l.token.toLowerCase().includes(search.toLowerCase()) || l.symbol.toLowerCase().includes(search.toLowerCase()))
    .filter(l => networkFilter === 'all' || l.network === networkFilter)
    .sort((a, b) => {
      if (sort === 'price') return a.pricePerToken - b.pricePerToken;
      if (sort === 'expiry') return a.expiresAt - b.expiresAt;
      return b.id.localeCompare(a.id);
    });

  const inputCls = 'w-full px-4 py-3 rounded-[10px] border border-white/10 bg-white/[0.02] text-white outline-none focus:border-cyan-500 focus:bg-cyan-500/[0.02] transition-colors text-[0.9rem]';
  const labelCls = 'block text-[0.74rem] font-semibold text-white/70 uppercase tracking-wider mb-2';

  const SORT_OPTIONS = [
    { value: 'newest', label: t('sortNewest') },
    { value: 'price',  label: t('sortPrice') },
    { value: 'expiry', label: t('sortExpiry') },
  ];

  const NETWORKS = ['all', 'BSC', 'ETH', 'Polygon', 'Arbitrum'];

  const StatusBadge = ({ status }: { status: Listing['status'] }) => (
    <span className={cn('text-[0.68rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border',
      status === 'active'  ? 'text-green-400 bg-green-400/10 border-green-400/25' :
      status === 'filled'  ? 'text-cyan-400 bg-cyan-400/10 border-cyan-400/25' :
      'text-white/40 bg-white/5 border-white/15'
    )}>
      {t(`status${status.charAt(0).toUpperCase() + status.slice(1)}` as any)}
    </span>
  );

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

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              { label: t('statVolume'),   value: '$2.4M' },
              { label: t('statListings'), value: activeListings.length.toString() },
              { label: t('statDeals'),    value: '312' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-bg-075 border border-white/10 rounded-[14px] p-4 sm:p-5 text-center">
                <div className="font-[family-name:var(--font-display)] text-[1.4rem] sm:text-[2rem] font-extrabold tracking-[-0.025em] text-cyan-400 mb-1 leading-tight">{value}</div>
                <div className="text-[0.62rem] sm:text-[0.76rem] text-white/50 uppercase tracking-wider font-semibold">{label}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 mb-6 bg-white/[0.02] border border-white/8 rounded-[10px] p-1 w-fit">
            {(['browse', 'mine', 'create'] as const).map(tabKey => (
              <button
                key={tabKey}
                onClick={() => setTab(tabKey)}
                className={cn(
                  'px-4 py-2 rounded-[8px] text-[0.84rem] font-semibold transition-all flex items-center gap-2',
                  tab === tabKey ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30' : 'text-white/50 hover:text-white/80'
                )}
                type="button"
              >
                {tabKey === 'create' && <Plus className="w-3.5 h-3.5" />}
                {tabKey === 'browse' ? t('tabBrowse') : tabKey === 'mine' ? t('tabMine') : t('tabCreate')}
              </button>
            ))}
          </div>

          {/* Browse tab */}
          {tab === 'browse' && (
            <>
              {/* Filters */}
              <div className="flex flex-wrap gap-3 mb-5">
                <div className="relative flex-1 min-w-[200px] max-w-[300px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    className="w-full pl-9 pr-4 py-2.5 rounded-[10px] border border-white/10 bg-white/[0.02] text-white text-[0.88rem] outline-none focus:border-cyan-500 transition-colors"
                    placeholder={t('filterSearch')}
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>

                <div className="flex gap-2">
                  {NETWORKS.map(n => (
                    <button
                      key={n}
                      onClick={() => setNetworkFilter(n)}
                      className={cn(
                        'px-3 py-2 rounded-[8px] text-[0.8rem] font-medium border transition-all',
                        networkFilter === n
                          ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30'
                          : 'border-white/10 text-white/50 hover:text-white/80 hover:border-white/20'
                      )}
                      type="button"
                    >
                      {n === 'all' ? t('filterNetwork') : n}
                    </button>
                  ))}
                </div>

                <div className="relative ml-auto">
                  <button
                    onClick={() => setSortOpen(s => !s)}
                    className="inline-flex items-center gap-2 px-3 py-2.5 rounded-[10px] border border-white/10 bg-white/[0.02] text-[0.84rem] text-white/60 hover:text-white transition-all"
                    type="button"
                  >
                    {SORT_OPTIONS.find(o => o.value === sort)?.label}
                    <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', sortOpen && 'rotate-180')} />
                  </button>
                  {sortOpen && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-bg-100 border border-white/14 rounded-[10px] shadow-xl overflow-hidden z-20">
                      {SORT_OPTIONS.map(o => (
                        <button
                          key={o.value}
                          onClick={() => { setSort(o.value); setSortOpen(false); }}
                          className={cn('w-full text-left px-4 py-2.5 text-[0.86rem] transition-colors', sort === o.value ? 'text-cyan-400 bg-cyan-500/10' : 'text-white/70 hover:bg-white/5')}
                          type="button"
                        >
                          {o.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Listings */}
              {!wallet.connected ? (
                <div className="bg-bg-075 border border-white/10 rounded-[14px] p-12 text-center">
                  <ArrowLeftRight className="w-10 h-10 mx-auto mb-3 text-white/20" />
                  <p className="text-white/50 mb-4">{t('connectToBrowse')}</p>
                  <Button onClick={openWalletModal}>{tc('confirm')}</Button>
                </div>
              ) : filtered.length === 0 ? (
                <div className="bg-bg-075 border border-white/10 rounded-[14px] p-12 text-center text-white/40">
                  {t('noListings')}
                </div>
              ) : (
                <div className="bg-bg-075 border border-white/10 rounded-[14px] overflow-x-auto">
                  <table className="w-full min-w-[760px] text-[0.88rem]">
                    <thead>
                      <tr className="bg-white/[0.02] border-b border-white/10">
                        {[t('colToken'), t('colAmount'), t('colPrice'), t('colSeller'), t('colExpiry'), t('colAction')].map(h => (
                          <th key={h} className="text-left p-4 text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-white/50">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map(listing => {
                        const remaining = listing.amount - listing.filled;
                        const fillPct = (listing.filled / listing.amount) * 100;
                        const daysLeft = Math.max(0, Math.ceil((listing.expiresAt - now) / d));
                        return (
                          <tr key={listing.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.015] transition-colors">
                            <td className="p-4">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-[#021628] font-extrabold text-[0.7rem] shrink-0">
                                  {listing.symbol.slice(0, 2)}
                                </div>
                                <div>
                                  <div className="font-semibold">{listing.symbol}</div>
                                  <span className={cn('text-[0.68rem] font-semibold px-1.5 py-0.5 rounded', NETWORK_COLORS[listing.network] ?? 'text-white/40 bg-white/5')}>
                                    {listing.network}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="font-[family-name:var(--font-mono)] font-semibold">{fmt.number(remaining)}</div>
                              <div className="w-full h-1 bg-white/5 rounded-full mt-1.5 max-w-[80px]">
                                <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" style={{ width: `${100 - fillPct}%` }} />
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="font-[family-name:var(--font-mono)] text-cyan-400 font-semibold">
                                {listing.pricePerToken.toFixed(8)} BNB
                              </div>
                              <div className="text-[0.72rem] text-white/35 mt-0.5">per token</div>
                            </td>
                            <td className="p-4 font-[family-name:var(--font-mono)] text-[0.8rem] text-white/50">
                              {listing.seller}
                            </td>
                            <td className="p-4">
                              <span className={cn('text-[0.82rem]', daysLeft <= 2 ? 'text-amber-400' : 'text-white/60')}>
                                {daysLeft}d
                              </span>
                            </td>
                            <td className="p-4">
                              <Button
                                size="sm"
                                disabled={buyingId === listing.id}
                                onClick={() => handleBuy(listing)}
                              >
                                {buyingId === listing.id ? t('buying') : t('buyBtn')}
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {/* My Listings tab */}
          {tab === 'mine' && (
            <>
              {!wallet.connected ? (
                <div className="bg-bg-075 border border-white/10 rounded-[14px] p-12 text-center">
                  <ArrowLeftRight className="w-10 h-10 mx-auto mb-3 text-white/20" />
                  <p className="text-white/50 mb-4">{t('connectToBrowse')}</p>
                  <Button onClick={openWalletModal}>{tc('confirm')}</Button>
                </div>
              ) : myListings.length === 0 ? (
                <div className="bg-bg-075 border border-white/10 rounded-[14px] p-12 text-center">
                  <p className="text-white/40 mb-4">{t('noListings')}</p>
                  <Button onClick={() => setTab('create')}>
                    <Plus className="w-4 h-4 mr-1.5" /> {t('tabCreate')}
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {myListings.map(listing => {
                    const remaining = listing.amount - listing.filled;
                    const fillPct = (listing.filled / listing.amount) * 100;
                    const daysLeft = Math.max(0, Math.ceil((listing.expiresAt - now) / d));
                    return (
                      <div key={listing.id} className="bg-bg-075 border border-white/10 rounded-[14px] p-5">
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-[#021628] font-extrabold text-[0.8rem]">
                              {listing.symbol.slice(0, 2)}
                            </div>
                            <div>
                              <div className="font-bold text-[1rem]">{listing.symbol}</div>
                              <span className={cn('text-[0.68rem] font-semibold px-1.5 py-0.5 rounded', NETWORK_COLORS[listing.network] ?? 'text-white/40 bg-white/5')}>
                                {listing.network}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <StatusBadge status={listing.status} />
                            {listing.status === 'active' && (
                              <button
                                onClick={() => handleCancel(listing.id)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] border border-red-500/25 text-red-400 text-[0.8rem] hover:bg-red-500/10 transition-colors"
                                type="button"
                              >
                                <X className="w-3.5 h-3.5" /> {t('cancelListing')}
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-white/8">
                          {[
                            { label: 'Total', value: fmt.number(listing.amount) + ' ' + listing.symbol },
                            { label: 'Remaining', value: fmt.number(remaining) + ' ' + listing.symbol },
                            { label: 'Price', value: listing.pricePerToken.toFixed(8) + ' BNB' },
                            { label: 'Expires', value: daysLeft > 0 ? `${daysLeft}d` : 'Expired' },
                          ].map(({ label, value }) => (
                            <div key={label}>
                              <div className="text-[0.7rem] text-white/40 uppercase tracking-wider mb-0.5">{label}</div>
                              <div className="font-[family-name:var(--font-mono)] font-semibold text-[0.88rem]">{value}</div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-3">
                          <div className="flex justify-between text-[0.72rem] text-white/40 mb-1">
                            <span>Fill progress</span>
                            <span>{fillPct.toFixed(1)}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" style={{ width: `${fillPct}%` }} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* Create Listing tab */}
          {tab === 'create' && (
            <div className="max-w-[680px]">
              {!wallet.connected ? (
                <div className="bg-bg-075 border border-white/10 rounded-[14px] p-12 text-center">
                  <ArrowLeftRight className="w-10 h-10 mx-auto mb-3 text-white/20" />
                  <p className="text-white/50 mb-4">{t('connectToBrowse')}</p>
                  <Button onClick={openWalletModal}>{tc('confirm')}</Button>
                </div>
              ) : (
                <div className="bg-bg-075 border border-white/10 rounded-[14px] p-6">
                  <h2 className="font-[family-name:var(--font-display)] font-bold text-[1.15rem] mb-1">{t('createTitle')}</h2>
                  <p className="text-white/50 text-[0.84rem] mb-6">{t('createDesc')}</p>

                  <div className="space-y-4">
                    <div>
                      <label className={labelCls}>{t('tokenAddr')} *</label>
                      <div className="flex gap-2">
                        <input
                          className={inputCls + ' font-[family-name:var(--font-mono)] flex-1'}
                          placeholder={t('tokenAddrPlaceholder')}
                          value={form.tokenAddr}
                          onChange={e => update('tokenAddr', e.target.value)}
                        />
                        <Button
                          variant="secondary"
                          onClick={() => {
                            if (!form.tokenAddr) return;
                            update('tokenSymbol', 'MTK');
                            toast.success('Token loaded');
                          }}
                        >
                          {t('loadToken')}
                        </Button>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>{t('sellAmount')} *</label>
                        <input type="number" className={inputCls + ' font-[family-name:var(--font-mono)]'}
                          placeholder={t('sellAmountPlaceholder')} value={form.amount}
                          onChange={e => update('amount', e.target.value)} />
                      </div>
                      <div>
                        <label className={labelCls}>{t('pricePerToken')} *</label>
                        <div className="relative">
                          <input type="number" className={inputCls + ' font-[family-name:var(--font-mono)] pr-28'}
                            placeholder="0.000042" value={form.price}
                            onChange={e => update('price', e.target.value)} />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[0.76rem] text-white/35 font-[family-name:var(--font-mono)]">
                            {t('priceUnit')}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className={labelCls}>{t('minBuy')}</label>
                        <input type="number" className={inputCls + ' font-[family-name:var(--font-mono)]'}
                          placeholder="1000" value={form.minBuy}
                          onChange={e => update('minBuy', e.target.value)} />
                      </div>
                      <div>
                        <label className={labelCls}>{t('maxBuy')}</label>
                        <input type="number" className={inputCls + ' font-[family-name:var(--font-mono)]'}
                          placeholder="100000" value={form.maxBuy}
                          onChange={e => update('maxBuy', e.target.value)} />
                      </div>
                      <div className="sm:col-span-2">
                        <label className={labelCls}>{t('expiryDate')} *</label>
                        <input type="datetime-local" className={inputCls}
                          value={form.expiry} onChange={e => update('expiry', e.target.value)} />
                      </div>
                    </div>

                    {/* Live preview */}
                    {form.amount && form.price && (
                      <div className="p-4 rounded-[10px] bg-white/[0.02] border border-white/8 text-[0.86rem]">
                        <div className="text-[0.7rem] text-white/40 uppercase tracking-wider mb-2">Preview</div>
                        <div className="flex justify-between py-1">
                          <span className="text-white/50">Total value</span>
                          <span className="font-[family-name:var(--font-mono)] font-semibold text-cyan-400">
                            {(parseFloat(form.amount || '0') * parseFloat(form.price || '0')).toFixed(4)} BNB
                          </span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-white/50">Platform fee (1%)</span>
                          <span className="font-[family-name:var(--font-mono)] text-white/50">
                            {(parseFloat(form.amount || '0') * parseFloat(form.price || '0') * 0.01).toFixed(4)} BNB
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="p-3.5 rounded-[10px] bg-cyan-500/[0.04] border border-cyan-500/20 text-[0.82rem] text-cyan-400">
                      {t('feeTip')}
                    </div>

                    <Button onClick={handleCreate} disabled={creating}>
                      <CheckCircle className="w-4 h-4 mr-1.5" />
                      {creating ? t('listing') : t('listBtn')}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </section>
    </div>
  );
}
