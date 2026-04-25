import type { Metadata } from 'next';

const titles: Record<string, string> = {
  backtest: 'Backtest Engine — Z-PAD',
  dashboard: 'Dashboard — Z-PAD',
  pods: 'Investment Pods — Z-PAD',
  kyc: 'KYC Verification — Z-PAD',
  referral: 'Referral Program — Z-PAD',
};

export const metadata: Metadata = { title: titles['kyc'] };

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
