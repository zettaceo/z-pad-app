import { getTranslations } from 'next-intl/server';
import { TICKER_ITEMS } from '@/lib/mock-data';

export async function Ticker() {
  const t = await getTranslations('ticker');
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="fixed top-0 left-0 right-0 h-8 z-[51] bg-bg-000/95 backdrop-blur-sm border-b border-white/[0.07] overflow-hidden flex items-center text-[0.74rem] font-[family-name:var(--font-mono)]">
      {/* LIVE label */}
      <div className="h-full flex items-center gap-1.5 px-4 font-bold text-[0.62rem] uppercase tracking-[0.12em] text-cyan-400 border-r border-white/[0.08] whitespace-nowrap bg-cyan-500/[0.06] shrink-0">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_6px_#00e676] animate-pulse-dot" />
        {t('live')}
      </div>

      {/* Scrolling strip */}
      <div className="relative flex-1 overflow-hidden h-full flex items-center">
        {/* Edge fades */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-bg-000 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-bg-000 to-transparent z-10 pointer-events-none" />

        <div className="flex whitespace-nowrap pl-4" style={{ animation: 'ticker 90s linear infinite' }}>
          {items.map((it, i) => (
            <span key={i} className="inline-flex items-center gap-1.5 mr-10 text-white/55">
              <span className="text-white/15 text-[0.6rem] mr-1">◆</span>
              <span className="text-[0.68rem]">{it.icon}</span>
              <strong className="text-white/85 font-semibold tracking-tight">{it.label}</strong>
              <span className="text-white/50">{it.value}</span>
              <span className={
                it.up === true ? 'text-green-400 font-semibold' :
                it.up === false ? 'text-red-400 font-semibold' :
                'text-white/35'
              }>
                {it.up === true ? '▲' : it.up === false ? '▼' : '·'}{it.change ? ` ${it.change}` : ''}
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
