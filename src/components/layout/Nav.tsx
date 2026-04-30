'use client';

import { useEffect, useRef, useState } from 'react';
import { Link, usePathname } from '@/i18n/navigation';
import Image from 'next/image';
import { Wallet, Menu, X, ChevronDown, Globe } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import { cn } from '@/lib/cn';
import { fmt } from '@/lib/format';
import { useWallet } from '@/lib/wallet-store';
import { useFocusTrap } from '@/lib/use-focus-trap';
import { WalletModal } from '@/components/features/WalletModal';
import { NotificationCenter } from '@/components/features/NotificationCenter';
import { routing } from '@/i18n/routing';

const LOCALE_LABELS: Record<string, string> = {
  en: 'EN',
  pt: 'PT',
  zh: 'ZH',
  es: 'ES',
};

export function Nav() {
  const pathname = usePathname();
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations('nav');
  const tc = useTranslations('common');
  const { wallet, disconnect, openWalletModal } = useWallet();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  const NAV_LINKS = [
    { href: '/dashboard', label: t('dashboard') },
    { href: '/projects', label: t('projects') },
    { href: '/create', label: t('create'), pill: t('new') },
    { href: '/pods', label: t('pods'), pill: t('new') },
    { href: '/locker', label: t('locker') },
    { href: '/token-creator', label: t('tokenCreator') },
    { href: '/airdrop', label: t('airdrop') },
    { href: '/staking', label: t('staking') },
    { href: '/governance', label: t('governance') },
    { href: '/rewards', label: t('rewards') },
    { href: '/backtest', label: t('backtest') },
    { href: '/docs', label: t('docs') },
  ] as const;

  useFocusTrap(mobileMenuRef, mobileOpen);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!langOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLangOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [langOpen]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  const switchLocale = (newLocale: string) => {
    setLangOpen(false);
    router.push(`/${newLocale}${pathname}`);
  };

  return (
    <>
      <nav
        className={cn(
          'fixed top-8 left-0 right-0 h-[68px] z-50',
          'bg-bg-000/70 backdrop-blur-[24px] backdrop-saturate-[1.6]',
          'border-b transition-all duration-[250ms]',
          scrolled
            ? 'border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.4)] bg-bg-000/90'
            : 'border-white/5'
        )}
        aria-label="Primary navigation"
      >
        <div className="flex items-center h-full gap-2 max-w-[1360px] mx-auto px-6">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 mr-5" aria-label="Z-PAD Home">
            <Image
              src="/assets/logo-z.png"
              alt=""
              width={32}
              height={32}
              className="rounded-full drop-shadow-[0_0_8px_rgba(0,212,255,0.3)]"
              priority
            />
            <span className="font-[family-name:var(--font-display)] font-extrabold text-[1.3rem] tracking-[-0.03em] bg-gradient-to-br from-cyan-500 to-blue-500 bg-clip-text text-transparent">
              Z-PAD
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex gap-0.5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? 'page' : undefined}
                className={cn(
                  'px-3 py-2 rounded-md text-[0.86rem] font-medium flex items-center gap-1.5',
                  'transition-colors whitespace-nowrap',
                  isActive(link.href)
                    ? 'text-cyan-400 bg-cyan-500/10'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                )}
              >
                {link.label}
                {'pill' in link && link.pill && (
                  <span className="text-[0.62rem] px-1.5 py-0.5 rounded bg-gradient-to-br from-cyan-500 to-blue-500 text-[#021628] font-bold tracking-[0.05em]">
                    {link.pill}
                  </span>
                )}
              </Link>
            ))}
          </div>

          <div className="flex-1" />

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              className="hidden md:inline-flex items-center gap-2 px-3 py-[7px] rounded-[10px] bg-white/[0.02] border border-white/10 text-[0.8rem] text-white/70 font-medium hover:border-cyan-500/35 hover:text-white hover:bg-cyan-500/5 transition-all"
              type="button"
              aria-label={`Switch network (currently ${t('network')})`}
            >
              <span className="w-2 h-2 rounded-full bg-[#f3ba2f] shadow-[0_0_6px_rgba(243,186,47,0.5)]" aria-hidden="true" />
              <span>{t('network')}</span>
              <ChevronDown className="w-3 h-3 opacity-60" aria-hidden="true" />
            </button>

            {/* Notifications */}
            <NotificationCenter />

            {/* Language switcher */}
            <div ref={langRef} className="relative hidden md:block">
              <button
                onClick={() => setLangOpen((s) => !s)}
                className="inline-flex items-center gap-1.5 px-3 py-[7px] rounded-[10px] bg-white/[0.02] border border-white/10 text-[0.8rem] text-white/70 font-medium hover:border-cyan-500/35 hover:text-white hover:bg-cyan-500/5 transition-all"
                type="button"
                aria-label="Switch language"
                aria-expanded={langOpen}
              >
                <Globe className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{LOCALE_LABELS[locale] ?? locale.toUpperCase()}</span>
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-2 w-28 bg-bg-100 border border-white/14 rounded-[10px] shadow-xl overflow-hidden z-50">
                  {routing.locales.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => switchLocale(loc)}
                      className={cn(
                        'w-full text-left px-3 py-2 text-[0.86rem] transition-colors',
                        loc === locale
                          ? 'text-cyan-400 bg-cyan-500/10'
                          : 'text-white/80 hover:bg-white/5'
                      )}
                      type="button"
                    >
                      {LOCALE_LABELS[loc] ?? loc.toUpperCase()}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {wallet.connected ? (
              <div className="relative group">
                <button
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-[10px] bg-green-500/10 border border-green-500/30 text-green-400 font-[family-name:var(--font-mono)] text-[0.78rem] font-semibold hover:bg-green-500/15 transition-all"
                  type="button"
                  aria-label={`Wallet connected: ${fmt.address(wallet.address)}`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_6px_#00e676]" aria-hidden="true" />
                  {fmt.address(wallet.address)}
                </button>
                <div className="absolute right-0 top-full mt-2 w-56 bg-bg-100 border border-white/14 rounded-[10px] shadow-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible focus-within:opacity-100 focus-within:visible transition-all">
                  <div className="p-3 border-b border-white/10">
                    <div className="text-[0.7rem] text-white/60 uppercase tracking-wider font-semibold mb-1">
                      {wallet.walletName}
                    </div>
                    <div className="text-[0.82rem] text-cyan-400 font-[family-name:var(--font-mono)] break-all">
                      {wallet.address}
                    </div>
                  </div>
                  <div className="p-1.5">
                    <button
                      onClick={disconnect}
                      className="w-full text-left px-3 py-2 rounded text-[0.86rem] text-red-400 hover:bg-red-500/10 transition-colors"
                      type="button"
                    >
                      {tc('disconnect')}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={openWalletModal}
                className="inline-flex items-center gap-2 px-4 py-[9px] rounded-[10px] bg-cyan-500/5 border border-cyan-500/35 text-cyan-400 font-semibold text-[0.85rem] hover:bg-gradient-to-br hover:from-cyan-500 hover:to-blue-500 hover:text-[#021628] hover:border-transparent hover:shadow-[0_0_32px_rgba(0,212,255,0.28)] hover:-translate-y-px transition-all"
                type="button"
              >
                <Wallet className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">{t('connectWallet')}</span>
                <span className="sm:hidden">{t('connect')}</span>
              </button>
            )}

            <button
              onClick={() => setMobileOpen((s) => !s)}
              className="lg:hidden w-10 h-10 rounded-md bg-white/[0.03] border border-white/10 flex items-center justify-center text-white"
              type="button"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          ref={mobileMenuRef}
          id="mobile-menu"
          className="fixed inset-0 top-[100px] z-[49] bg-bg-000/98 backdrop-blur-xl p-6 overflow-y-auto lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? 'page' : undefined}
                className={cn(
                  'px-4 py-3.5 rounded-md text-base font-medium transition-colors flex items-center gap-2',
                  isActive(link.href) ? 'text-cyan-400 bg-cyan-500/10' : 'text-white/80 hover:bg-white/5'
                )}
              >
                {link.label}
                {'pill' in link && link.pill && (
                  <span className="text-[0.62rem] px-1.5 py-0.5 rounded bg-gradient-to-br from-cyan-500 to-blue-500 text-[#021628] font-bold">
                    {link.pill}
                  </span>
                )}
              </Link>
            ))}

            {/* Mobile language switcher */}
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-[0.7rem] text-white/40 uppercase tracking-wider mb-2 px-1">{t('langLabel')}</p>
              <div className="flex gap-2">
                {routing.locales.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => switchLocale(loc)}
                    className={cn(
                      'px-3 py-1.5 rounded text-[0.8rem] font-medium transition-colors',
                      loc === locale
                        ? 'bg-cyan-500/20 text-cyan-400'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    )}
                    type="button"
                  >
                    {LOCALE_LABELS[loc] ?? loc.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <WalletModal />
    </>
  );
}
