/**
 * Z-PAD — Formatters
 */

export const fmt = {
  currency(n: number | null | undefined, opts: { compact?: boolean; decimals?: number } = {}): string {
    const { compact = false, decimals = 0 } = opts;
    if (n === null || n === undefined || isNaN(n)) return '—';
    const abs = Math.abs(n);
    if (compact) {
      if (abs >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
      if (abs >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
      if (abs >= 1e3) return `$${(n / 1e3).toFixed(1)}K`;
    }
    return `$${n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
  },

  number(n: number | null | undefined, decimals = 0): string {
    if (n === null || n === undefined) return '—';
    return n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  },

  token(n: number | null | undefined, decimals = 2): string {
    if (n === null || n === undefined) return '—';
    const abs = Math.abs(n);
    if (abs >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
    if (abs >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
    if (abs >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
    return n.toFixed(decimals);
  },

  percent(n: number | null | undefined, decimals = 1): string {
    if (n === null || n === undefined) return '—';
    return `${n.toFixed(decimals)}%`;
  },

  address(addr: string | null, len = 4): string {
    if (!addr) return '';
    return `${addr.slice(0, len + 2)}...${addr.slice(-len)}`;
  },

  timeLeft(targetMs: number): { d: number; h: number; m: number; s: number; expired: boolean } {
    const diff = Math.max(0, targetMs - Date.now());
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return { d, h, m, s, expired: diff === 0 };
  },

  timeAgo(ms: number): string {
    const diff = Date.now() - ms;
    if (diff < 60000) return 'just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    if (diff < 7 * 86400000) return `${Math.floor(diff / 86400000)}d ago`;
    return new Date(ms).toLocaleDateString();
  },
};
