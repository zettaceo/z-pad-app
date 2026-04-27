'use client';

import { useEffect, useRef } from 'react';
import { ChevronRight, X } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

import { useWallet } from '@/lib/wallet-store';
import { useFocusTrap } from '@/lib/use-focus-trap';

export function WalletModal() {
  const t = useTranslations('wallet');
  const { walletModalOpen, closeWalletModal, connect } = useWallet();
  const firstButtonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useFocusTrap(containerRef, walletModalOpen);

  const WALLETS: { name: string; icon: string; desc: string; highlight?: boolean }[] = [
    { name: 'Obelisk-Z', icon: '⚡', desc: t('descObelisk'), highlight: true },
    { name: 'MetaMask', icon: '🦊', desc: t('descMetaMask') },
    { name: 'Trust Wallet', icon: '🛡️', desc: t('descTrustWallet') },
    { name: 'WalletConnect', icon: '🔗', desc: t('descWalletConnect') },
    { name: 'Coinbase Wallet', icon: '🔵', desc: t('descCoinbase') },
    { name: 'Phantom', icon: '👻', desc: t('descPhantom') },
  ];

  useEffect(() => {
    if (!walletModalOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeWalletModal(); };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const timer = setTimeout(() => firstButtonRef.current?.focus(), 50);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      clearTimeout(timer);
    };
  }, [walletModalOpen, closeWalletModal]);

  if (!walletModalOpen) return null;

  const handleConnect = async (name: string) => {
    closeWalletModal();
    toast.loading(t('connecting', { name }), { id: 'connect' });
    try {
      await connect(name);
      toast.success(t('connected', { name }), { id: 'connect' });
    } catch {
      toast.error(t('failed'), { id: 'connect' });
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-bg-000/85 backdrop-blur-xl flex items-center justify-center p-5 animate-[fadeIn_0.25s]"
      onClick={closeWalletModal}
      role="dialog"
      aria-modal="true"
      aria-labelledby="wallet-modal-title"
    >
      <div
        ref={containerRef}
        className="bg-bg-075 border border-white/14 rounded-[20px] w-full max-w-[480px] max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-[26px] pt-[22px] pb-4 border-b border-white/10">
          <h2
            id="wallet-modal-title"
            className="font-[family-name:var(--font-display)] text-[1.2rem] font-bold tracking-[-0.015em]"
          >
            {t('title')}
          </h2>
          <button
            onClick={closeWalletModal}
            className="w-8 h-8 rounded-md bg-white/[0.04] border border-white/10 text-white/70 flex items-center justify-center hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 transition-all"
            type="button"
            aria-label={t('close')}
          >
            <X className="w-[18px] h-[18px]" />
          </button>
        </div>

        <div className="px-[26px] py-[22px]">
          <div className="flex flex-col gap-2">
            {WALLETS.map((w, i) => (
              <button
                ref={i === 0 ? firstButtonRef : undefined}
                key={w.name}
                onClick={() => handleConnect(w.name)}
                className={`flex items-center gap-3.5 p-3.5 rounded-[10px] text-left w-full cursor-pointer transition-all focus-visible:outline-2 focus-visible:outline-cyan-500 focus-visible:outline-offset-2 ${
                  w.highlight
                    ? 'border border-cyan-500/35 bg-cyan-500/5 hover:border-cyan-500 hover:bg-cyan-500/10'
                    : 'border border-white/10 bg-white/[0.02] hover:border-cyan-500/35 hover:bg-cyan-500/5'
                }`}
                type="button"
              >
                <div className="w-[42px] h-[42px] rounded-md bg-white/5 flex items-center justify-center text-[1.4rem] shrink-0" aria-hidden="true">
                  {w.icon}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-[0.95rem] flex items-center gap-1.5">
                    {w.name}
                    {w.highlight && (
                      <span className="text-[0.58rem] px-1.5 py-0.5 rounded-full bg-gradient-to-br from-cyan-500/15 to-violet-500/15 text-[#c4b5fd] border border-violet-500/30 font-bold uppercase tracking-wider">
                        {t('recommended')}
                      </span>
                    )}
                  </div>
                  <div className="text-[0.76rem] text-white/60 mt-0.5">{w.desc}</div>
                </div>
                <ChevronRight className="w-[18px] h-[18px] text-white/50" aria-hidden="true" />
              </button>
            ))}
          </div>

          <div className="mt-[18px] p-3.5 rounded-[10px] bg-cyan-500/5 border border-cyan-500/15 text-[0.82rem] text-white/80 leading-[1.55]">
            <strong className="text-cyan-400">{t('newToCrypto')}</strong> {t('fiatDesc')}
          </div>
        </div>
      </div>
    </div>
  );
}
