import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Z Staking — Z-PAD' };

export default function StakingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
