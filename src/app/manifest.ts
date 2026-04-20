import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.title,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#030615',
    theme_color: '#030615',
    orientation: 'portrait-primary',
    icons: [
      { src: '/assets/logo-z.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/assets/logo-z.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    categories: ['finance', 'business', 'productivity'],
    lang: 'en',
    dir: 'ltr',
  };
}
