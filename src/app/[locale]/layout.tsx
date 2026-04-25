import type { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Toaster } from 'sonner';

import { routing } from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
import { WalletProvider } from '@/lib/wallet-store';
import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';
import { Ticker } from '@/components/layout/Ticker';
import { ZionFab } from '@/components/zion/ZionFab';
import { Starfield } from '@/components/layout/Starfield';
import { ScrollProgress } from '@/components/layout/ScrollProgress';

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <WalletProvider>
        {/* WCAG 2.4.1 — skip link */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[999] focus:px-4 focus:py-2 focus:rounded-md focus:bg-cyan-500 focus:text-[#021628] focus:font-semibold"
        >
          Skip to main content
        </a>
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
    </NextIntlClientProvider>
  );
}
