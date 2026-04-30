import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { BookOpen, Users, Rocket, Lock, Brain, TrendingUp, Vote, Users2, DollarSign, ChevronRight } from 'lucide-react';

export default async function DocsPage() {
  const t = await getTranslations('docs');
  const tc = await getTranslations('common');

  const sections = [
    { id: 'intro',      icon: BookOpen,    label: t('intro') },
    { id: 'features',   icon: Rocket,      label: t('features') },
    { id: 'investors',  icon: Users,       label: t('investors') },
    { id: 'creators',   icon: Rocket,      label: t('creators') },
    { id: 'locker',     icon: Lock,        label: t('lockerGuide') },
    { id: 'zion',       icon: Brain,       label: t('zionAi') },
    { id: 'staking',    icon: TrendingUp,  label: t('stakingGuide') },
    { id: 'governance', icon: Vote,        label: t('governanceGuide') },
    { id: 'pods',       icon: Users2,      label: t('podsGuide') },
    { id: 'fees',       icon: DollarSign,  label: t('feesGuide') },
  ];

  const Row = ({ label, value }: { label: string; value: string }) => (
    <div className="flex justify-between gap-4 py-2.5 border-b border-white/5 last:border-0 text-[0.88rem]">
      <span className="text-white/50">{label}</span>
      <span className="font-[family-name:var(--font-mono)] font-semibold text-right">{value}</span>
    </div>
  );

  const SectionTitle = ({ id, icon: Icon, title }: { id: string; icon: React.ElementType; title: string }) => (
    <div id={id} className="flex items-center gap-3 mb-4 scroll-mt-[120px]">
      <div className="w-9 h-9 rounded-[10px] bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-cyan-400" />
      </div>
      <h2 className="font-[family-name:var(--font-display)] text-[1.3rem] font-extrabold tracking-[-0.02em]">{title}</h2>
    </div>
  );

  const SubSection = ({ title, body }: { title: string; body: string }) => (
    <div className="mb-4">
      <h4 className="font-semibold text-[0.95rem] text-cyan-400 mb-1">{title}</h4>
      <p className="text-white/70 text-[0.9rem] leading-relaxed">{body}</p>
    </div>
  );

  const Card = ({ children }: { children: React.ReactNode }) => (
    <div className="bg-bg-075 border border-white/10 rounded-[14px] p-6 mb-6">{children}</div>
  );

  return (
    <div className="pt-[100px]">
      <section className="pt-8 pb-6 border-b border-white/5">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 text-[0.82rem] text-white/50 mb-4">
            <Link href="/" className="hover:text-cyan-400">{tc('home')}</Link>
            <span className="text-white/30">/</span>
            <span>{t('nav')}</span>
          </div>
          <span className="inline-flex items-center gap-2 text-[0.72rem] font-semibold text-cyan-400 uppercase tracking-[0.12em] font-[family-name:var(--font-mono)] before:content-[''] before:w-6 before:h-px before:bg-cyan-500">
            {t('nav')}
          </span>
          <h1 className="font-[family-name:var(--font-display)] text-[clamp(1.8rem,4vw,2.8rem)] font-extrabold tracking-[-0.03em] mt-2.5">
            {t('title')}
          </h1>
          <p className="text-white/70 mt-2 max-w-[600px]">{t('subtitle')}</p>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-[240px_1fr] gap-8">

            {/* Sidebar */}
            <nav className="lg:sticky lg:top-[110px] lg:self-start">
              <div className="bg-bg-075 border border-white/10 rounded-[14px] p-3">
                <div className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-white/30 px-2 mb-2">Contents</div>
                {sections.map(({ id, icon: Icon, label }) => (
                  <a
                    key={id}
                    href={`#${id}`}
                    className="flex items-center gap-2.5 px-2.5 py-2 rounded-[8px] text-[0.84rem] text-white/60 hover:text-cyan-400 hover:bg-cyan-500/[0.05] transition-all group"
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0 group-hover:text-cyan-400" />
                    {label}
                    <ChevronRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-60" />
                  </a>
                ))}
                <div className="mt-3 pt-3 border-t border-white/8 px-2">
                  <div className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-white/30 mb-2">{t('links')}</div>
                  {[
                    { label: 'Telegram', href: 'https://t.me/zettachain' },
                    { label: 'Twitter', href: 'https://twitter.com/zpad_io' },
                    { label: 'Website', href: '/' },
                  ].map(({ label, href }) => (
                    <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 py-1.5 text-[0.82rem] text-white/50 hover:text-cyan-400 transition-colors">
                      {label}
                      <ChevronRight className="w-3 h-3 ml-auto rotate-[-45deg] opacity-50" />
                    </a>
                  ))}
                </div>
              </div>
            </nav>

            {/* Content */}
            <div className="min-w-0">

              {/* INTRO */}
              <Card>
                <SectionTitle id="intro" icon={BookOpen} title={t('introTitle')} />
                <p className="text-white/70 leading-relaxed mb-3">{t('introBody1')}</p>
                <p className="text-white/70 leading-relaxed mb-3">{t('introBody2')}</p>
                <p className="text-white/70 leading-relaxed">{t('introBody3')}</p>
              </Card>

              {/* FEATURES */}
              <Card>
                <SectionTitle id="features" icon={Rocket} title={t('featuresTitle')} />
                <p className="text-white/70 leading-relaxed mb-5">{t('featuresBody1')}</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {(['f1','f2','f3','f4','f5','f6'] as const).map(k => (
                    <div key={k} className="p-4 rounded-[10px] bg-white/[0.02] border border-white/8">
                      <div className="font-semibold text-[0.9rem] text-cyan-400 mb-1">{t(`${k}Title`)}</div>
                      <p className="text-white/60 text-[0.84rem] leading-relaxed">{t(`${k}Body`)}</p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* INVESTORS */}
              <Card>
                <SectionTitle id="investors" icon={Users} title={t('investorsTitle')} />
                <p className="text-white/70 leading-relaxed mb-3">{t('investorsBody1')}</p>
                <p className="text-white/70 leading-relaxed mb-5">{t('investorsBody2')}</p>
                <SubSection title={t('i1Title')} body={t('i1Body')} />
                <SubSection title={t('i2Title')} body={t('i2Body')} />
                <SubSection title={t('i3Title')} body={t('i3Body')} />
                <SubSection title={t('i4Title')} body={t('i4Body')} />
              </Card>

              {/* CREATORS */}
              <Card>
                <SectionTitle id="creators" icon={Rocket} title={t('creatorsTitle')} />
                <p className="text-white/70 leading-relaxed mb-3">{t('creatorsBody1')}</p>
                <p className="text-white/70 leading-relaxed mb-5">{t('creatorsBody2')}</p>
                <div className="flex flex-col gap-3 mb-5">
                  {(['c1','c2','c3','c4','c5'] as const).map((k, i) => (
                    <div key={k} className="flex gap-3 p-4 rounded-[10px] bg-white/[0.02] border border-white/8">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 text-[#021628] font-extrabold text-[0.78rem] flex items-center justify-center shrink-0">
                        {i + 1}
                      </div>
                      <div>
                        <div className="font-semibold text-[0.9rem] mb-0.5">{t(`${k}Title`)}</div>
                        <p className="text-white/60 text-[0.84rem] leading-relaxed">{t(`${k}Body`)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 rounded-[10px] bg-cyan-500/[0.04] border border-cyan-500/20 text-[0.82rem] text-cyan-400">
                  {t('cFeeNote')}
                </div>
              </Card>

              {/* LOCKER */}
              <Card>
                <SectionTitle id="locker" icon={Lock} title={t('lockerTitle')} />
                <p className="text-white/70 leading-relaxed mb-3">{t('lockerBody1')}</p>
                <p className="text-white/70 leading-relaxed mb-5">{t('lockerBody2')}</p>
                <SubSection title={t('l1Title')} body={t('l1Body')} />
                <SubSection title={t('l2Title')} body={t('l2Body')} />
                <SubSection title={t('l3Title')} body={t('l3Body')} />
                <SubSection title={t('l4Title')} body={t('l4Body')} />
              </Card>

              {/* ZION AI */}
              <Card>
                <SectionTitle id="zion" icon={Brain} title={t('zionTitle')} />
                <p className="text-white/70 leading-relaxed mb-3">{t('zionBody1')}</p>
                <p className="text-white/70 leading-relaxed mb-5">{t('zionBody2')}</p>
                <div className="grid sm:grid-cols-2 gap-3 mb-4">
                  {(['z1','z2','z3','z4','z5','z6'] as const).map(k => (
                    <div key={k} className="p-3.5 rounded-[10px] bg-white/[0.02] border border-white/8">
                      <div className="font-semibold text-[0.84rem] mb-1">{t(`${k}Title`)}</div>
                      <p className="text-white/55 text-[0.8rem] leading-snug">{t(`${k}Body`)}</p>
                    </div>
                  ))}
                </div>
                <div className="p-3 rounded-[10px] bg-gradient-to-r from-cyan-500/[0.06] to-violet-500/[0.04] border border-cyan-500/20 text-[0.82rem] text-cyan-400 font-[family-name:var(--font-mono)]">
                  {t('zScoreGuide')}
                </div>
              </Card>

              {/* STAKING */}
              <Card>
                <SectionTitle id="staking" icon={TrendingUp} title={t('stakingTitle')} />
                <p className="text-white/70 leading-relaxed mb-3">{t('stakingBody1')}</p>
                <p className="text-white/70 leading-relaxed mb-5">{t('stakingBody2')}</p>
                {[
                  { k: 's1', color: 'text-white/60 border-white/15' },
                  { k: 's2', color: 'text-gold-400 border-gold-500/30' },
                  { k: 's3', color: 'text-[#b9f2ff] border-[#b9f2ff]/30' },
                  { k: 's4', color: 'text-[#c084fc] border-[#c084fc]/30' },
                ].map(({ k, color }) => (
                  <div key={k} className={`flex gap-3 p-4 rounded-[10px] bg-white/[0.02] border mb-3 ${color}`}>
                    <div className="flex-1">
                      <div className={`font-bold text-[0.9rem] mb-0.5 ${color.split(' ')[0]}`}>{t(`${k}Title` as any)}</div>
                      <p className="text-white/60 text-[0.84rem] leading-relaxed">{t(`${k}Body` as any)}</p>
                    </div>
                  </div>
                ))}
              </Card>

              {/* GOVERNANCE */}
              <Card>
                <SectionTitle id="governance" icon={Vote} title={t('governanceTitle')} />
                <p className="text-white/70 leading-relaxed mb-3">{t('governanceBody1')}</p>
                <p className="text-white/70 leading-relaxed mb-5">{t('governanceBody2')}</p>
                <SubSection title={t('g1Title')} body={t('g1Body')} />
                <SubSection title={t('g2Title')} body={t('g2Body')} />
                <SubSection title={t('g3Title')} body={t('g3Body')} />
              </Card>

              {/* PODS */}
              <Card>
                <SectionTitle id="pods" icon={Users2} title={t('podsTitle')} />
                <p className="text-white/70 leading-relaxed mb-3">{t('podsBody1')}</p>
                <p className="text-white/70 leading-relaxed mb-5">{t('podsBody2')}</p>
                <SubSection title={t('p1Title')} body={t('p1Body')} />
                <SubSection title={t('p2Title')} body={t('p2Body')} />
                <SubSection title={t('p3Title')} body={t('p3Body')} />
                <SubSection title={t('p4Title')} body={t('p4Body')} />
              </Card>

              {/* FEES */}
              <Card>
                <SectionTitle id="fees" icon={DollarSign} title={t('feesTitle')} />
                <p className="text-white/70 leading-relaxed mb-5">{t('feesBody1')}</p>
                {(['fee1','fee2','fee3','fee4'] as const).map(k => (
                  <div key={k} className="mb-3">
                    <Row label={t(`${k}Title`)} value={t(`${k}Body`)} />
                  </div>
                ))}
                <div className="mt-4 p-3 rounded-[10px] bg-cyan-500/[0.04] border border-cyan-500/20 text-[0.82rem] text-cyan-400">
                  {t('feeNote')}
                </div>
              </Card>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
