import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { Twitter, Send, Github } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { siteConfig } from '@/config/site';

const FOOTER_LINKS = {
  Platform: [
    { label: 'Home', href: '/' },
    { label: 'Projects', href: '/projects' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Create', href: '/create' },
  ],
  Ecosystem: [
    { label: 'Staking', href: '/staking' },
    { label: 'Governance', href: '/governance' },
    { label: 'Rewards', href: '/rewards' },
    { label: 'ZETTA WORD', href: 'https://zettaword.com', external: true },
  ],
  Products: [
    { label: 'Z-BANCK', href: '#' },
    { label: 'Z-PAY', href: '#' },
    { label: 'Z-SWAP', href: '#' },
    { label: 'Obelisk-Z', href: '#' },
  ],
  Resources: [
    { label: 'Documentation', href: siteConfig.links.docs, external: true },
    { label: 'Security', href: '/.well-known/security.txt', external: true },
    { label: 'Terms', href: '/terms' },
    { label: 'Privacy', href: '/privacy' },
  ],
};

export async function Footer() {
  const t = await getTranslations('footer');
  return (
    <footer className="relative z-[1] pt-16 pb-8 border-t border-white/10 bg-bg-000/60 mt-20">
      <div className="max-w-[1360px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2.2fr_1fr_1fr_1fr_1fr] gap-10 mb-10">
          <div>
            <Image
              src="/assets/logo-z.png"
              alt="Z-PAD"
              width={42}
              height={42}
              className="rounded-full mb-4 drop-shadow-[0_0_8px_rgba(0,212,255,0.3)]"
            />
            <div className="font-[family-name:var(--font-display)] font-extrabold text-2xl mb-3 tracking-[-0.02em] bg-gradient-to-br from-cyan-500 to-blue-500 bg-clip-text text-transparent">
              Z-PAD
            </div>
            <p className="text-white/70 text-[0.88rem] leading-relaxed max-w-sm mb-5">
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

          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h4 className="font-[family-name:var(--font-display)] text-[0.8rem] font-bold uppercase tracking-[0.1em] mb-4">
                {section}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    {'external' in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[0.86rem] text-white/50 hover:text-cyan-400 transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-[0.86rem] text-white/50 hover:text-cyan-400 transition-colors"
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

        <div className="pt-6 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-[0.78rem] text-white/50">
          <div>© 2026 ZETTA WORD · All rights reserved</div>
          <div className="flex gap-5">
            <span className="inline-flex items-center gap-1.5 text-green-400">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_6px_#00e676] animate-pulse-dot" />
              {t('systemsOk')}
            </span>
            <span className="font-[family-name:var(--font-mono)]">v1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
