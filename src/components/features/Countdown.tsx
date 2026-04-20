'use client';

import { useEffect, useState } from 'react';
import { fmt } from '@/lib/format';

interface CountdownProps {
  targetMs: number;
  variant?: 'inline' | 'boxes';
  className?: string;
}

// Stable zero value used for SSR so server and client initial renders match,
// avoiding React hydration mismatch. The real value is set in useEffect.
const ZERO = { d: 0, h: 0, m: 0, s: 0, expired: false };

export function Countdown({ targetMs, variant = 'boxes', className = '' }: CountdownProps) {
  const [time, setTime] = useState(ZERO);

  useEffect(() => {
    const tick = () => setTime(fmt.timeLeft(targetMs));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetMs]);

  if (variant === 'inline') {
    return (
      <span className={`font-[family-name:var(--font-mono)] tabular-nums ${className}`}>
        {time.d}d {String(time.h).padStart(2, '0')}h {String(time.m).padStart(2, '0')}m{' '}
        {String(time.s).padStart(2, '0')}s
      </span>
    );
  }

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className={`flex gap-2 ${className}`}>
      {[
        { label: 'Days', value: pad(time.d) },
        { label: 'Hours', value: pad(time.h) },
        { label: 'Min', value: pad(time.m) },
        { label: 'Sec', value: pad(time.s) },
      ].map((b) => (
        <div
          key={b.label}
          className="flex-1 min-w-[58px] bg-white/[0.03] border border-white/10 rounded-[10px] px-3.5 py-2.5 text-center"
        >
          <div className="font-[family-name:var(--font-mono)] text-[1.6rem] leading-none bg-gradient-to-br from-cyan-500 to-blue-500 bg-clip-text text-transparent font-medium tabular-nums">
            {b.value}
          </div>
          <div className="text-[0.6rem] text-white/50 uppercase tracking-[0.08em] mt-1.5 font-semibold">
            {b.label}
          </div>
        </div>
      ))}
    </div>
  );
}
