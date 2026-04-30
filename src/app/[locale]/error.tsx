'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertOctagon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/Button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('errors');

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      // Only log the digest — never expose error.message to the browser console
      // in production (may contain internal stack traces / path info).
      console.error('[z-pad] error', error.digest ?? 'no-digest');
    }
  }, [error]);

  return (
    <div className="pt-[140px] pb-20">
      <div className="max-w-[640px] mx-auto px-6 text-center">
        <div className="w-[100px] h-[100px] mx-auto rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-6">
          <AlertOctagon className="w-12 h-12 text-red-400" />
        </div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-extrabold tracking-[-0.025em]">
          {t('errorTitle')}
        </h1>
        <p className="text-white/70 mt-3 leading-relaxed max-w-[480px] mx-auto">
          {t('errorDesc')}
        </p>
        {error.digest && (
          <div className="mt-4 inline-block px-3 py-1.5 rounded-md bg-white/[0.03] border border-white/10 font-[family-name:var(--font-mono)] text-[0.78rem] text-white/50">
            {t('errorId')}: {error.digest}
          </div>
        )}
        <div className="flex gap-3 justify-center mt-8 flex-wrap">
          <Button onClick={reset}>{t('tryAgain')}</Button>
          <Button variant="secondary" asChild>
            <Link href="/">{t('backHome')}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
