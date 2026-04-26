'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { TrendingUp, TrendingDown, Twitter, MessageCircle, Waves, Eye, Activity } from 'lucide-react';
import { cn } from '@/lib/cn';

interface WhaleMove {
  wallet: string;
  type: 'buy' | 'sell';
  amount: string;
  timeAgo: string;
  size: 'small' | 'medium' | 'large'; // < $10K, $10K-$100K, > $100K
}

interface Props {
  projectId: string;
  aiScore: number;
  status: 'live' | 'upcoming' | 'ended';
}

const SENTIMENTS: Record<string, { score: number; twitter: number; telegram: number; discord: number; trending: string[]; whales: WhaleMove[] }> = {
  'zetta-chain': {
    score: 87, twitter: 91, telegram: 84, discord: 86,
    trending: ['#ZETTAchain', 'Layer1', 'ZETTA ecosystem', 'Fair Launch', 'BNB'],
    whales: [
      { wallet: '0x8f2a…4e1c', type: 'buy', amount: '$48,200', timeAgo: '4m ago', size: 'medium' },
      { wallet: '0x3c7d…9b2a', type: 'buy', amount: '$122,000', timeAgo: '17m ago', size: 'large' },
      { wallet: '0x1e5f…7d3c', type: 'buy', amount: '$8,400', timeAgo: '31m ago', size: 'small' },
      { wallet: '0x9a2b…3f8e', type: 'sell', amount: '$15,700', timeAgo: '52m ago', size: 'small' },
      { wallet: '0x4d6c…1a9f', type: 'buy', amount: '$280,000', timeAgo: '1h ago', size: 'large' },
    ],
  },
  'ai-oracle': {
    score: 93, twitter: 95, telegram: 90, discord: 94,
    trending: ['AI Oracle', '#AIO', 'on-chain AI', 'GPT contracts', 'Ethereum'],
    whales: [
      { wallet: '0x7e3b…2c4d', type: 'buy', amount: '$340,000', timeAgo: '2m ago', size: 'large' },
      { wallet: '0x5a1f…8e2c', type: 'buy', amount: '$67,500', timeAgo: '11m ago', size: 'medium' },
      { wallet: '0x2d4a…6b1e', type: 'buy', amount: '$19,200', timeAgo: '28m ago', size: 'medium' },
    ],
  },
  'pixelverse': {
    score: 78, twitter: 82, telegram: 76, discord: 74,
    trending: ['#PIXV', 'Web3 gaming', 'MMORPG', 'Polygon', 'LBP'],
    whales: [
      { wallet: '0x6c8d…4a2f', type: 'sell', amount: '$42,100', timeAgo: '8m ago', size: 'medium' },
      { wallet: '0x3f5b…1e9c', type: 'buy', amount: '$28,800', timeAgo: '22m ago', size: 'medium' },
    ],
  },
};

const DEFAULT_SENTIMENT = {
  score: 72, twitter: 70, telegram: 74, discord: 68,
  trending: ['crypto', 'presale', 'DeFi'],
  whales: [
    { wallet: '0x4b2c…7e1d', type: 'buy' as const, amount: '$12,500', timeAgo: '15m ago', size: 'small' as const },
    { wallet: '0x8f3a…2c6b', type: 'buy' as const, amount: '$31,000', timeAgo: '42m ago', size: 'medium' as const },
  ],
};

function SentimentBar({ label, score, icon: Icon }: { label: string; score: number; icon: typeof Twitter }) {
  const color = score >= 80 ? 'text-green-400' : score >= 60 ? 'text-cyan-400' : 'text-yellow-400';
  const barColor = score >= 80 ? 'from-green-500 to-green-400' : score >= 60 ? 'from-cyan-500 to-blue-400' : 'from-yellow-500 to-yellow-400';
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5 w-24 shrink-0">
        <Icon className={cn('w-3.5 h-3.5', color)} />
        <span className="text-[0.76rem] text-white/60">{label}</span>
      </div>
      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div className={cn('h-full rounded-full bg-gradient-to-r transition-all duration-700', barColor)} style={{ width: `${score}%` }} />
      </div>
      <span className={cn('font-[family-name:var(--font-mono)] font-bold text-[0.8rem] w-8 text-right', color)}>{score}</span>
    </div>
  );
}

export function SentimentOracle({ projectId, aiScore: _aiScore, status }: Props) {
  const t = useTranslations('sentiment');
  const data = SENTIMENTS[projectId] ?? DEFAULT_SENTIMENT;
  const [liveWhales, setLiveWhales] = useState(data.whales);
  const [pulse, setPulse] = useState(false);

  // Simulate occasional new whale move
  useEffect(() => {
    if (status !== 'live') return;
    const timer = setInterval(() => {
      const coins = ['$8,400', '$14,200', '$67,000', '$210,000', '$3,800'];
      const newMove: WhaleMove = {
        wallet: `0x${Math.random().toString(16).slice(2, 6)}…${Math.random().toString(16).slice(2, 6)}`,
        type: Math.random() > 0.35 ? 'buy' : 'sell',
        amount: coins[Math.floor(Math.random() * coins.length)]!,
        timeAgo: 'just now',
        size: Math.random() > 0.7 ? 'large' : Math.random() > 0.4 ? 'medium' : 'small',
      };
      setPulse(true);
      setTimeout(() => setPulse(false), 1200);
      setLiveWhales(prev => [newMove, ...prev.slice(0, 4)]);
    }, 18000 + Math.random() * 12000);
    return () => clearInterval(timer);
  }, [status]);

  const sentimentLabel = data.score >= 85 ? t('veryBullish') : data.score >= 70 ? t('bullish') : data.score >= 55 ? t('neutral') : t('bearish');
  const sentimentColor = data.score >= 85 ? 'text-green-400' : data.score >= 70 ? 'text-cyan-400' : data.score >= 55 ? 'text-yellow-400' : 'text-red-400';
  const netBuys = liveWhales.filter(w => w.type === 'buy').length;
  const netSells = liveWhales.length - netBuys;

  return (
    <div className="bg-bg-075 border border-white/10 rounded-[14px] p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-violet-500/10 flex items-center justify-center">
            <Activity className="w-4 h-4 text-violet-400" />
          </div>
          <div>
            <span className="font-[family-name:var(--font-display)] font-bold text-[1rem]">{t('title')}</span>
            <div className="text-[0.72rem] text-white/40">{t('subtitle')} · {status === 'live' ? t('live') : t('static')}</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={cn(
            'w-1.5 h-1.5 rounded-full',
            status === 'live' ? 'bg-green-400 animate-pulse-dot' : 'bg-white/20'
          )} />
          <span className="text-[0.72rem] text-white/40">{status === 'live' ? t('live') : t('static')}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        {/* Sentiment score */}
        <div className="rounded-[12px] bg-white/[0.02] border border-white/8 p-4">
          <div className="text-[0.7rem] text-white/40 uppercase tracking-wider mb-2">{t('socialSentiment')}</div>
          <div className={cn('font-[family-name:var(--font-display)] text-[2.2rem] font-extrabold tracking-tight leading-[1]', sentimentColor)}>
            {data.score}
          </div>
          <div className={cn('text-[0.78rem] font-semibold mt-1', sentimentColor)}>{sentimentLabel}</div>
          <div className="mt-3 space-y-2">
            <SentimentBar label="Twitter" score={data.twitter} icon={Twitter} />
            <SentimentBar label="Telegram" score={data.telegram} icon={MessageCircle} />
            <SentimentBar label="Discord" score={data.discord} icon={MessageCircle} />
          </div>
        </div>

        {/* Whale activity */}
        <div className="rounded-[12px] bg-white/[0.02] border border-white/8 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[0.7rem] text-white/40 uppercase tracking-wider">{t('whaleActivity')}</div>
            <div className={cn(
              'flex items-center gap-1 text-[0.68rem] font-bold px-1.5 py-0.5 rounded transition-all',
              pulse ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 text-white/30'
            )}>
              <Waves className="w-2.5 h-2.5" /> {t('live')}
            </div>
          </div>

          {/* Buy/sell ratio */}
          <div className="flex gap-2 mb-3">
            <div className="flex-1 text-center rounded-[8px] py-2 bg-green-400/8 border border-green-400/20">
              <div className="text-[1.2rem] font-extrabold text-green-400">{netBuys}</div>
              <div className="text-[0.65rem] text-green-400/70">{t('buys')}</div>
            </div>
            <div className="flex-1 text-center rounded-[8px] py-2 bg-red-400/8 border border-red-400/20">
              <div className="text-[1.2rem] font-extrabold text-red-400">{netSells}</div>
              <div className="text-[0.65rem] text-red-400/70">{t('sells')}</div>
            </div>
          </div>

          {/* Recent whale moves */}
          <div className="space-y-1.5 overflow-hidden" style={{ maxHeight: 150 }}>
            {liveWhales.map((w, i) => (
              <div
                key={i}
                className={cn(
                  'flex items-center gap-2 text-[0.72rem] rounded-[6px] px-2 py-1.5 transition-all duration-500',
                  i === 0 && pulse ? 'bg-cyan-500/10 border border-cyan-500/20' : 'bg-white/[0.02]'
                )}
              >
                <span className={cn('shrink-0', w.type === 'buy' ? 'text-green-400' : 'text-red-400')}>
                  {w.type === 'buy' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                </span>
                <span className="font-[family-name:var(--font-mono)] text-white/50 text-[0.68rem]">{w.wallet}</span>
                <span className={cn('font-bold ml-auto shrink-0', w.type === 'buy' ? 'text-green-400' : 'text-red-400')}>
                  {w.type === 'buy' ? '+' : '−'}{w.amount}
                </span>
                <span className="text-white/25 shrink-0">{w.timeAgo}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trending keywords */}
      <div>
        <div className="text-[0.7rem] text-white/40 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Eye className="w-3 h-3" /> {t('trending')}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {data.trending.map(t => (
            <span key={t} className="px-2.5 py-1 rounded-full bg-violet-500/8 border border-violet-500/15 text-violet-300/80 text-[0.74rem] font-medium">
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
