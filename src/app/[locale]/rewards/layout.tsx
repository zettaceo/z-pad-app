import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Rewards — Z-PAD' };

export default function RewardsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
