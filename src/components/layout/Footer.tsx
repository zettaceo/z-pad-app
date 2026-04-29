import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { Twitter, Send, Github, ExternalLink } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { siteConfig } from '@/config/site';

export async function Footer() {
  const t = await getTranslations('footer');

  const FOOTER_LINKS = [
    {
      title: t('sectionPlatform'),
      links: [
        { label: t('linkHome'), href: '/' },
        { label: t('linkProjects'), href: '/projects' },
        { label: t('linkDashboard'), href: '/dashboard' },
        { label: t('linkCreate'), href: '/create' },
      ],
    },
    {
      title: t('sectionEcosystem'),
      links: [
        { label: t('linkStaking'), href: '/staking' },
        { label: t('linkGovernance'), href: '/governance' },
        { label: t('linkRewards'), href: '/rewards' },
        { label: 'ZETTA WORD', href: siteConfig.links.docs, external: true },
      ],
    },
    {
      title: t('sectionProducts'),
      links: [
        { label: t('linkLocker'), href: '/locker' },
        { label: 'Z-FINANCE', href: '#' },
        { label: 'Z-PAY', href: '#' },
        { label: 'Z-SWAP', href: '#' },
        { label: 'Obelisk-Z', href: '#' },
      ],
    },
    {
      title: t('sectionResources'),
      links: [
        { label: t('linkDocs'), href: siteConfig.links.docs, external: true },
        { label: t('linkSecurity'), href: '/.well-known/security.txt', external: true },
        { label: t('linkTerms'), href: '/terms' },
        { label: t('linkPrivacy'), href: '/privacy' },
      ],
    },
  ];

  return (
    <footer className="relative z-[1] border-t border-white/10 bg-bg-000/60 mt-20">
      {/* Main footer content */}
      <div className="max-w-[1360px] mx-auto px-6 pt-12 pb-8">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">

          {/* Brand column */}
          <div className="lg:w-[260px] shrink-0">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/assets/logo-z.png"
                alt="Z-PAD"
                width={38}
                height={38}
                className="rounded-full drop-shadow-[0_0_8px_rgba(0,212,255,0.3)]"
              />
              <span className="font-[family-name:var(--font-display)] font-extrabold text-xl tracking-[-0.02em] bg-gradient-to-br from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                Z-PAD
              </span>
            </div>
            <p className="text-white/55 text-[0.86rem] leading-[1.65] mb-5">
              {t('tagline')}
            </p>
            <div className="flex gap-2">
              {[
                { icon: Twitter, href: siteConfig.links.twitter, label: 'Twitter' },
                { icon: Send, href: siteConfig.links.telegram, label: 'Telegram' },
                { icon: Github, href: siteConfig.links.github, label: 'GitHub' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-[10px] bg-white/[0.03] border border-white/10 flex items-center justify-center text-white/50 hover:text-cyan-400 hover:border-cyan-500/35 hover:bg-cyan-500/5 hover:-translate-y-0.5 transition-all"
                  aria-label={label}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links grid — 2×2 on mobile, 4 cols on lg */}
          <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-8">
            {FOOTER_LINKS.map(({ title, links }) => (
              <div key={title}>
                <h4 className="text-[0.72rem] font-bold uppercase tracking-[0.12em] text-white/30 mb-3.5">
                  {title}
                </h4>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link.label}>
                      {'external' in link && link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center gap-1.5 text-[0.84rem] text-white/50 hover:text-cyan-400 transition-colors"
                        >
                          {link.label}
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity" />
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-[0.84rem] text-white/50 hover:text-cyan-400 transition-colors"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-5 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-3 text-[0.76rem] text-white/40">
          <div>© 2026 ZETTA WORD · {t('allRights')}</div>
          <div className="flex items-center gap-5">
            <span className="inline-flex items-center gap-1.5 text-green-400">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_6px_#00e676] animate-pulse-dot" />
              {t('systemsOk')}
            </span>
            <span className="font-[family-name:var(--font-mono)] text-white/30">v1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
