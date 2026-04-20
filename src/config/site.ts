/**
 * Z-PAD — Site configuration
 */

export const siteConfig = {
  name: 'Z-PAD',
  title: 'Z-PAD — The Only Launchpad You\'ll Ever Need',
  description:
    'AI-vetted, multi-chain decentralized launchpad with native fiat rails. Part of the ZETTA ecosystem.',
  url: process.env.NEXT_PUBLIC_APP_URL ?? 'https://zpad.io',
  ogImage: '/assets/og-image.png',
  links: {
    twitter: 'https://twitter.com/ZettaWord',
    telegram: 'https://t.me/ZettaWorldOfficial',
    github: 'https://github.com/zettaworld',
    docs: 'https://docs.zettaword.com',
  },
  meta: {
    author: 'ZETTA WORD',
    keywords: [
      'launchpad',
      'IDO',
      'presale',
      'fair launch',
      'DeFi',
      'crypto',
      'web3',
      'ZETTA',
      'AI vetting',
      'tokenomics',
    ],
  },
} as const;

export type SiteConfig = typeof siteConfig;
