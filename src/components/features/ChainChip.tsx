import { cn } from '@/lib/cn';
import type { ChainId } from '@/types';

const chainColors: Record<ChainId, string> = {
  bsc: 'bg-[#f3ba2f] shadow-[0_0_6px_rgba(243,186,47,0.5)]',
  eth: 'bg-[#627eea] shadow-[0_0_6px_rgba(98,126,234,0.5)]',
  polygon: 'bg-[#8247e5] shadow-[0_0_6px_rgba(130,71,229,0.5)]',
  arbitrum: 'bg-[#28a0f0] shadow-[0_0_6px_rgba(40,160,240,0.5)]',
  zetta: 'bg-cyan-500 shadow-[0_0_8px_rgba(0,212,255,0.6)]',
  solana: 'bg-gradient-to-br from-[#9945ff] to-[#14f195]',
  base: 'bg-[#0052ff] shadow-[0_0_6px_rgba(0,82,255,0.5)]',
};

interface ChainChipProps {
  chain: ChainId;
  chainName?: string;
  className?: string;
}

export function ChainChip({ chain, chainName, className }: ChainChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full',
        'bg-white/5 border border-white/10 text-white/70 text-[0.7rem] font-medium whitespace-nowrap',
        className
      )}
    >
      <span className={cn('w-2 h-2 rounded-full shrink-0', chainColors[chain])} />
      {chainName ?? chain.toUpperCase()}
    </span>
  );
}
