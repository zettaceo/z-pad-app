import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { getLocale } from 'next-intl/server';
import { Syne, DM_Sans, JetBrains_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

import { siteConfig } from '@/config/site';
import './globals.css';

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['500', '600', '700', '800'],
  display: 'swap',
  preload: true,
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  preload: true,
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500', '600'],
  display: 'swap',
});

// Build the canonical base URL for og:image and metadataBase.
// Priority: VERCEL_PROJECT_PRODUCTION_URL (stable, e.g. z-pad-app.vercel.app)
//         → VERCEL_URL (per-deployment, changes every deploy — avoid for og:image)
//         → NEXT_PUBLIC_APP_URL (custom domain, may not be live yet)
//         → localhost fallback
const baseUrl =
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : null) ??
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : null) ??
  process.env.NEXT_PUBLIC_APP_URL ??
  'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: siteConfig.title,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.meta.keywords],
  authors: [{ name: siteConfig.meta.author }],
  creator: siteConfig.meta.author,
  publisher: siteConfig.meta.author,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    creator: '@ZettaWord',
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: '/assets/logo-z.png',
    apple: '/assets/logo-z.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#030615',
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'dark',
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${syne.variable} ${dmSans.variable} ${jetBrainsMono.variable}`}
    >
      <body className="antialiased overflow-x-hidden">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
