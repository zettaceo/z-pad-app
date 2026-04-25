'use client';

import { useId } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/cn';

interface AiScoreProps {
  score: number;
  size?: 'default' | 'lg' | 'xl';
  className?: string;
}

const sizeMap = {
  default: { r: 24, c: 28, svg: 56, fs: '1rem', ls: '0.55rem' },
  lg: { r: 52, c: 60, svg: 120, fs: '1.9rem', ls: '0.65rem' },
  xl: { r: 70, c: 80, svg: 160, fs: '2.4rem', ls: '0.7rem' },
};

function getScoreColor(score: number): string {
  if (score >= 90) return 'text-green-400';
  if (score >= 75) return 'text-cyan-400';
  if (score >= 60) return 'text-gold-400';
  return 'text-red-400';
}

/**
 * AI Score Ring Widget — Z-PAD's signature UI element.
 * Server-rendered SVG with progressive enhancement for animation.
 */
export function AiScore({ score, size = 'default', className }: AiScoreProps) {
  const uid = useId();
  const t = useTranslations('common');
  const s = sizeMap[size];
  const circumference = 2 * Math.PI * s.r;
  const offset = circumference - (score / 100) * circumference;
  // uid is stable across SSR/hydration and unique per component instance,
  // preventing SVG gradient ID collisions when multiple AiScore rings appear
  // on the same page with identical scores.
  const gradId = `aiScore-${uid.replace(/:/g, '')}`;

  return (
    <div
      className={cn('relative inline-flex items-center justify-center shrink-0', className)}
      style={{ width: s.svg, height: s.svg }}
      role="meter"
      aria-valuenow={score}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`AI Score: ${score} out of 100`}
    >
      <svg className="absolute inset-0 -rotate-90" width={s.svg} height={s.svg} viewBox={`0 0 ${s.svg} ${s.svg}`}>
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00d4ff" />
            <stop offset="100%" stopColor="#0066ff" />
          </linearGradient>
        </defs>
        <circle cx={s.c} cy={s.c} r={s.r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
        <circle
          cx={s.c}
          cy={s.c}
          r={s.r}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            filter: 'drop-shadow(0 0 6px rgba(0, 212, 255, 0.6))',
            transition: 'stroke-dashoffset 1.4s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
      </svg>
      <div className="relative z-10 flex flex-col items-center">
        <span
          className={cn('font-[family-name:var(--font-display)] font-extrabold', getScoreColor(score))}
          style={{ fontSize: s.fs, lineHeight: 1 }}
        >
          {score}
        </span>
        <span
          className="text-white/40 uppercase tracking-[0.08em] font-bold mt-0.5"
          style={{ fontSize: s.ls }}
        >
          {t('aiScore')}
        </span>
      </div>
    </div>
  );
}
