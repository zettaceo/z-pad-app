import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { FEES } from '@/config/fees';

export async function generateMetadata() {
  const t = await getTranslations('terms');
  return { title: `${t('pageTitle')} — Z-PAD` };
}

export default async function TermsPage() {
  const t = await getTranslations('terms');
  const tc = await getTranslations('common');

  const sections = [
    { title: t('s1Title'), body: t('s1Body') },
    { title: t('s2Title'), body: t('s2Body') },
    { title: t('s3Title'), body: t('s3Body') },
    { title: t('s4Title'), body: t('s4Body') },
    {
      title: t('s5Title'),
      body: t('s5Body', {
        platformPct: FEES.platformPct,
        stakerPct: FEES.stakerPlatformPct,
        minZ: FEES.stakerMinZ.toLocaleString(),
        listingBnb: FEES.listingBnb,
      }),
    },
    { title: t('s6Title'), body: t('s6Body') },
    { title: t('s7Title'), body: t('s7Body') },
  ];

  return (
    <div className="pt-[100px]">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-center gap-2 text-[0.82rem] text-white/50 mb-8">
          <Link href="/" className="hover:text-cyan-400">{tc('home')}</Link>
          <span className="text-white/30">/</span>
          <span>{t('breadcrumb')}</span>
        </div>
        <h1 className="font-[family-name:var(--font-display)] text-[2.2rem] font-extrabold tracking-[-0.03em] mb-4">
          {t('pageTitle')}
        </h1>
        <p className="text-white/50 text-[0.88rem] mb-10">{t('updated')}</p>
        <div className="space-y-8 text-white/80 leading-relaxed">
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="font-[family-name:var(--font-display)] text-[1.2rem] font-bold text-white mb-3">
                {s.title}
              </h2>
              <p>{s.body}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
