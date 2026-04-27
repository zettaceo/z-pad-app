import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { Button } from '@/components/ui/Button';

export default async function NotFound() {
  const t = await getTranslations('errors');
  return (
    <div className="pt-[140px] pb-20">
      <div className="max-w-[640px] mx-auto px-6 text-center">
        <div className="font-[family-name:var(--font-display)] text-[6rem] md:text-[8rem] font-extrabold tracking-[-0.04em] leading-none bg-gradient-to-br from-cyan-500 to-blue-500 bg-clip-text text-transparent">
          404
        </div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-extrabold tracking-[-0.025em] mt-4">
          {t('notFoundTitle')}
        </h1>
        <p className="text-white/70 mt-3 leading-relaxed">
          {t('notFoundDesc')}
        </p>
        <div className="flex gap-3 justify-center mt-8 flex-wrap">
          <Button asChild>
            <Link href="/">{t('backHome')}</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/projects">{t('exploreProjects')}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
