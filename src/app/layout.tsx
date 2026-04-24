import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { headers } from 'next/headers';
import { Urbanist, Inter, JetBrains_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Toaster } from 'sonner';

import { WalletProvider } from '@/lib/wallet-store';
import { siteConfig } from '@/config/site';
import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';
import { Ticker } from '@/components/layout/Ticker';
import { ZionFab } from '@/components/zion/ZionFab';
import { Starfield } from '@/components/layout/Starfield';
import { ScrollProgress } from '@/components/layout/ScrollProgress';

import './globals.css';

// Self-hosted via next/font — no layout shift, no third-party request
const urbanist = Urbanist({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['500', '600', '700', '800'],
  display: 'swap',
  preload: true,
});

const inter = Inter({
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

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.meta.keywords],
  authors: [{ name: siteConfig.meta.author }],
  creator: siteConfig.meta.author,
  publisher: siteConfig.meta.author,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: '@ZettaWord',
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
  // NO maximumScale — accessibility: let users zoom (WCAG 1.4.4)
  colorScheme: 'dark',
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  // Touch headers() so Next.js marks this layout dynamic and the middleware
  // CSP nonce is reliably applied. Child route segments opt into static via
  // `generateStaticParams` at their own level, unaffected by this.
  await headers();

  return (
    <html
      lang="en"
      className={`${urbanist.variable} ${inter.variable} ${jetBrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased overflow-x-hidden">
        {/* WCAG 2.4.1 — skip link */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[999] focus:px-4 focus:py-2 focus:rounded-md focus:bg-cyan-500 focus:text-[#021628] focus:font-semibold"
        >
          Skip to main content
        </a>

        <WalletProvider>
          <Starfield />
          <ScrollProgress />
          <Ticker />
          <Nav />
          <main id="main" className="relative z-[1]">
            {children}
          </main>
          <Footer />
          <ZionFab />
          <Toaster
            position="top-right"
            theme="dark"
            closeButton
            toastOptions={{
              style: {
                background: 'rgba(13, 22, 56, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.14)',
                color: 'rgba(255, 255, 255, 0.96)',
                backdropFilter: 'blur(20px)',
              },
            }}
          />
        </WalletProvider>

        {/* Vercel Analytics — privacy-friendly, GDPR-compliant */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
