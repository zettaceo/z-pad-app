import { getTranslations } from 'next-intl/server';

export default async function Loading() {
  const t = await getTranslations('errors');
  return (
    <div className="pt-[140px] pb-20">
      <div className="max-w-[1360px] mx-auto px-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-cyan-500/30 border-t-cyan-500 animate-spin" />
          <span className="text-white/50 font-[family-name:var(--font-mono)] text-[0.88rem]">
            {t('loading')}
          </span>
        </div>
      </div>
    </div>
  );
}
