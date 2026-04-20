import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';
import { PROJECTS } from '@/lib/mock-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const now = new Date();

  const routes: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/projects`, lastModified: now, changeFrequency: 'hourly', priority: 0.9 },
    { url: `${base}/dashboard`, lastModified: now, changeFrequency: 'hourly', priority: 0.7 },
    { url: `${base}/create`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/staking`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/governance`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${base}/rewards`, lastModified: now, changeFrequency: 'daily', priority: 0.7 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = PROJECTS.map((p) => ({
    url: `${base}/projects/${p.id}`,
    lastModified: now,
    changeFrequency: 'hourly',
    priority: 0.8,
  }));

  return [...routes, ...projectRoutes];
}
