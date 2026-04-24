import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type BadgeVariant =
  | 'live'
  | 'upcoming'
  | 'ended'
  | 'passed'
  | 'hot'
  | 'trending'
  | 'kyc'
  | 'audit'
  | 'refundable'
  | 'ai'
  | 'fairlaunch'
  | 'presale'
  | 'private'
  | 'lbp'
  | 'bondingcurve';

interface BadgeProps {
  variant: BadgeVariant;
  children?: ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  live: 'bg-green-500/15 text-green-400 border-green-500/30',
  upcoming: 'bg-gold-500/10 text-gold-400 border-gold-500/30',
  ended: 'bg-white/5 text-white/50 border-white/10',
  passed: 'bg-green-500/10 text-green-400 border-green-500/20',
  hot: 'bg-gradient-to-r from-orange-500 to-red-500 text-[#2a0f00] border-transparent font-bold',
  trending: 'bg-orange-500/15 text-orange-500 border-orange-500/30',
  kyc: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
  audit: 'bg-violet-500/10 text-[#c4b5fd] border-violet-500/30',
  refundable: 'bg-green-500/10 text-green-400 border-green-400/30',
  ai: 'bg-gradient-to-br from-cyan-500/15 to-violet-500/15 text-[#c4b5fd] border-violet-500/30',
  fairlaunch: 'bg-green-500/10 text-green-400 border-green-500/20',
  presale: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  private: 'bg-violet-500/10 text-[#c4b5fd] border-violet-500/20',
  lbp: 'bg-pink-500/10 text-pink-500 border-pink-500/30',
  bondingcurve: 'bg-orange-500/10 text-orange-500 border-orange-500/30',
};

const defaultLabels: Partial<Record<BadgeVariant, string>> = {
  live: 'Live',
  kyc: '✓ KYC',
  audit: '⚡ Audited',
  hot: '🔥 Hot',
  trending: '📈 Trending',
  fairlaunch: 'Fair Launch',
  presale: 'Presale',
  private: 'Private',
  lbp: 'LBP',
  bondingcurve: 'Bonding Curve',
  refundable: '↩ Refundable',
  ai: '✨ AI Verified',
  upcoming: 'Upcoming',
  ended: 'Ended',
  passed: '✓ Passed',
};

export function Badge({ variant, children, className }: BadgeProps) {
  const label = children ?? defaultLabels[variant];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-[9px] py-[3px] rounded-full border',
        'text-[0.68rem] font-semibold uppercase tracking-[0.07em] leading-[1.3] whitespace-nowrap',
        variantStyles[variant],
        className
      )}
    >
      {variant === 'live' && (
        <span className="w-[5px] h-[5px] rounded-full bg-green-500 shadow-[0_0_8px_#00e676] animate-pulse-dot" />
      )}
      {label}
    </span>
  );
}
