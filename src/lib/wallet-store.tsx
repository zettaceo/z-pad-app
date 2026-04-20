'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Wallet } from '@/types';

interface WalletContextValue {
  wallet: Wallet;
  connect: (walletName: string) => Promise<void>;
  disconnect: () => void;
  updateBalance: (key: keyof Wallet['balance'], delta: number) => void;
  stake: (amount: number) => void;
  // Global modal state — avoids querySelector hacks from other pages
  walletModalOpen: boolean;
  openWalletModal: () => void;
  closeWalletModal: () => void;
}

const defaultWallet: Wallet = {
  connected: false,
  address: null,
  walletName: null,
  balance: { bnb: 0, usdt: 0, z: 0, eth: 0, sol: 0 },
  kyc: false,
  reputation: 0,
  level: 1,
  xp: 0,
  stakedZ: 0,
};

const WalletContext = createContext<WalletContextValue | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<Wallet>(defaultWallet);
  const [walletModalOpen, setWalletModalOpen] = useState(false);

  const connect = useCallback(async (walletName: string) => {
    // Simulate wallet connection
    await new Promise((r) => setTimeout(r, 500));
    setWallet({
      connected: true,
      address: '0x072c4A1b3D8F2e5C9A7d3B4e6F5a8C1b9D2E1668a',
      walletName,
      balance: { bnb: 2.485, usdt: 1250.5, z: 12500, eth: 0.82, sol: 45.2 },
      kyc: false,
      reputation: 72,
      level: 4,
      xp: 2840,
      stakedZ: 5000,
    });
  }, []);

  const disconnect = useCallback(() => {
    setWallet(defaultWallet);
  }, []);

  const updateBalance = useCallback((key: keyof Wallet['balance'], delta: number) => {
    setWallet((prev) => ({
      ...prev,
      balance: { ...prev.balance, [key]: prev.balance[key] + delta },
    }));
  }, []);

  const stake = useCallback((amount: number) => {
    setWallet((prev) => ({
      ...prev,
      balance: { ...prev.balance, z: prev.balance.z - amount },
      stakedZ: prev.stakedZ + amount,
    }));
  }, []);

  const openWalletModal = useCallback(() => setWalletModalOpen(true), []);
  const closeWalletModal = useCallback(() => setWalletModalOpen(false), []);

  return (
    <WalletContext.Provider
      value={{
        wallet,
        connect,
        disconnect,
        updateBalance,
        stake,
        walletModalOpen,
        openWalletModal,
        closeWalletModal,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWallet must be used within WalletProvider');
  return ctx;
}
