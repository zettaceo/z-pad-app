'use client';

import { useEffect, useState } from 'react';
import { fmt } from '@/lib/format';

interface TimeLeftInlineProps {
  targetMs: number;
  prefix?: string;
  className?: string;
}

// Stable zero value for SSR: avoids hydration mismatch when Date.now() differs
// between server render and client hydration. Real value set in useEffect.
const ZERO = { d: 0, h: 0, m: 0, s: 0, expired: false };

/**
 * Client-side inline countdown — keeps "Ends in 2d 04h" live in SSG/ISR pages.
 */
export function TimeLeftInline({ targetMs, prefix = 'Ends in', className = '' }: TimeLeftInlineProps) {
  const [t, setT] = useState(ZERO);

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
