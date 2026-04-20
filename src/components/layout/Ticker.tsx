import { TICKER_ITEMS } from '@/lib/mock-data';

export function Ticker() {
  // Duplicate items for seamless infinite scroll
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="fixed top-0 left-0 right-0 h-8 z-[51] bg-gradient-to-r from-bg-000 via-bg-050 to-bg-000 border-b border-white/10 overflow-hidden flex items-center text-[0.75rem] font-[family-name:var(--font-mono)]">
      <div className="px-3 py-0 h-full flex items-center gap-1.5 font-bold text-[0.65rem] uppercase tracking-[0.1em] text-cyan-400 border-r border-white/10 whitespace-nowrap bg-cyan-500/5 shrink-0">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_6px_#00e676] animate-pulse-dot" />
        Live
      </div>
      <div
        className="flex gap-8 whitespace-nowrap pl-8"
        style={{ animation: 'ticker 90s linear infinite' }}
      >
        {items.map((it, i) => (
          <span key={i} className="inline-flex items-center gap-2 text-white/70">
            {it.icon} <strong className="text-white font-semibold">{it.label}</strong> {it.value}{' '}
            <span
              className={
                it.up === true
                  ? 'text-green-400'
                  : it.up === false
                    ? 'text-red-400'
                    : 'text-white/50'
              }
            >
              {it.up === true ? '↑' : it.up === false ? '↓' : '•'} {it.change}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
