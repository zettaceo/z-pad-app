'use client';

import { useEffect, useState } from 'react';
import { fmt } from '@/lib/format';

interface TimeLeftInlineProps {
  targetMs: number;
  prefix?: string;
  className?: string;
}

/**
 * Client-side inline countdown — keeps "Ends in 2d 04h" live in SSG/ISR pages.
 * If rendered inside a Server Component, the initial SSR HTML is computed
 * at build time; this component takes over on hydration and ticks every second.
 */
export function TimeLeftInline({ targetMs, prefix = 'Ends in', className = '' }: TimeLeftInlineProps) {
  const [t, setT] = useState(() => fmt.timeLeft(targetMs));

  useEffect(() => {
    const tick = () => setT(fmt.timeLeft(targetMs));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetMs]);

  if (t.expired) {
    return <span className={className}>Ended</span>;
  }

  return (
    <span className={className}>
      {prefix} {t.d}d {String(t.h).padStart(2, '0')}h {String(t.m).padStart(2, '0')}m
    </span>
  );
}
