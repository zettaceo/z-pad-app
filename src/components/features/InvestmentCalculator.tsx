'use client';

import { useState, useMemo } from 'react';
import { Calculator, Info } from 'lucide-react';
import { cn } from '@/lib/cn';
import { FEES } from '@/config/fees';

interface Props {
  ratePerBase: number;
  minBuy: number;
  maxBuy: number;
  currency: string;
  symbol: string;
  vesting?: string;
  status: 'live' | 'upcoming' | 'ended';
}

const PRESETS = [0.1, 0.5, 1, 5];

export function InvestmentCalculator({ ratePerBase, minBuy, maxBuy, currency, symbol, vesting, status }: Props) {
  const [amount, setAmount] = useState('');
  const [isStaker] = useState(false); // future: pull from wallet store

  const feeRate = isStaker ? FEES.stakerPlatformPct : FEES.platformPct;

  const calc = useMemo(() => {
    const a = parseFloat(amount);
    if (!a || a <= 0 || !ratePerBase) return null;
    const fee = a * (feeRate / 100);
    const net = a - fee;
    const tokens = net * ratePerBase;
    // Vesting: parse TGE %
    const tgeMatch = vesting?.match(/TGE:\s*(\d+)%/i);
    const tgePct = tgeMatch ? parseInt(tgeMatch[1]!) / 100 : 1;
    const tgeTokens = tokens * tgePct;
    const vestingTokens = tokens - tgeTokens;
    return { fee, net, tokens, tgeTokens, vestingTokens };
  }, [amount, feeRate, ratePerBase, vesting]);

  const inputNum = parseFloat(amount);
  const overMax = inputNum > maxBuy;
  const underMin = inputNum > 0 && inputNum < minBuy;
  const isValid = calc && !overMax && !underMin;

  if (status !== 'live' || !ratePerBase) return null;

  return (
    <div className="bg-bg-075 border border-white/10 rounded-[14px] p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-full bg-cyan-500/10 flex items-center justify-center shrink-0">
          <Calculator className="w-3.5 h-3.5 text-cyan-400" />
        </div>
        <span className="font-[family-name:var(--font-display)] font-bold text-[0.95rem]">
          Investment Calculator
        </span>
      </div>

      {/* Quick presets */}
      <div className="flex gap-1.5 mb-3">
        {PRESETS.filter(p => p >= minBuy && p <= maxBuy).map(p => (
          <button
            key={p}
            onClick={() => setAmount(String(p))}
            type="button"
            className={cn(
              'flex-1 py-1.5 rounded-lg text-[0.74rem] font-semibold border transition-all',
              amount === String(p)
                ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-400'
                : 'bg-white/[0.02] border-white/10 text-white/60 hover:border-white/20 hover:text-white/80'
            )}
          >
            {p} {currency}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="relative mb-1.5">
        <input
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          min={minBuy}
          max={maxBuy}
          step={0.01}
          placeholder={`${minBuy}–${maxBuy} ${currency}`}
          className={cn(
            'w-full px-4 py-3 rounded-[10px] bg-white/[0.03] border text-white text-[0.92rem] font-[family-name:var(--font-mono)] outline-none transition-all pr-16',
            overMax || underMin
              ? 'border-red-400/50 focus:border-red-400'
              : 'border-white/10 focus:border-cyan-500 focus:bg-cyan-500/[0.03]'
          )}
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[0.8rem] text-white/40 font-semibold pointer-events-none">
          {currency}
        </span>
      </div>

      {(overMax || underMin) && (
        <p className="text-[0.76rem] text-red-400 mb-2">
          {overMax ? `Max ${maxBuy} ${currency} per wallet` : `Min ${minBuy} ${currency}`}
        </p>
      )}

      {/* Results */}
      {isValid && (
        <div className="mt-3 rounded-[10px] bg-gradient-to-br from-cyan-500/8 to-blue-500/5 border border-cyan-500/20 p-4 space-y-3">
          {/* Token amount — hero */}
          <div className="text-center pb-3 border-b border-white/8">
            <div className="text-[0.7rem] text-white/50 uppercase tracking-wider mb-1">You receive</div>
            <div className="font-[family-name:var(--font-display)] text-[1.8rem] font-extrabold tracking-[-0.03em] text-cyan-300">
              {Math.floor(calc.tokens).toLocaleString()}
            </div>
            <div className="text-[0.78rem] text-white/60 font-semibold">{symbol}</div>
          </div>

          {/* Fee breakdown */}
          <div className="space-y-1.5 text-[0.8rem]">
            <div className="flex justify-between">
              <span className="text-white/50">Investment</span>
              <span className="font-[family-name:var(--font-mono)]">{parseFloat(amount).toFixed(3)} {currency}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50 flex items-center gap-1">
                Platform fee ({feeRate}%)
                {isStaker && <span className="text-cyan-400 text-[0.7rem]">★ staker</span>}
              </span>
              <span className="font-[family-name:var(--font-mono)] text-red-400/80">−{calc.fee.toFixed(4)} {currency}</span>
            </div>
            <div className="flex justify-between font-semibold border-t border-white/8 pt-1.5">
              <span className="text-white/70">Net invested</span>
              <span className="font-[family-name:var(--font-mono)] text-green-400">{calc.net.toFixed(4)} {currency}</span>
            </div>
          </div>

          {/* Vesting breakdown */}
          {vesting && calc.tgeTokens < calc.tokens && (
            <div className="pt-2 border-t border-white/8 space-y-1 text-[0.78rem]">
              <div className="flex items-center gap-1 text-white/40 uppercase tracking-wider text-[0.68rem] mb-1.5">
                <Info className="w-3 h-3" /> Vesting schedule
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">At TGE (unlock)</span>
                <span className="font-[family-name:var(--font-mono)] text-cyan-400">{Math.floor(calc.tgeTokens).toLocaleString()} {symbol}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Linear vesting</span>
                <span className="font-[family-name:var(--font-mono)]">{Math.floor(calc.vestingTokens).toLocaleString()} {symbol}</span>
              </div>
              <div className="text-white/40 text-[0.72rem] mt-1">{vesting}</div>
            </div>
          )}
        </div>
      )}

      {!isStaker && (
        <p className="mt-2.5 text-[0.73rem] text-white/40 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/40 shrink-0"/>
          Stake 10,000+ Z to reduce fee to {FEES.stakerPlatformPct}%
        </p>
      )}
    </div>
  );
}
