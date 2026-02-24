import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://odinbikes.ch';
  const lastModified = new Date();

  const categories = ['roadbikes', 'gravelbikes'];
  const models = ['flow', 'gravity', 'reaction', 'slide'];

  const bikePages = categories.flatMap((cat) => [
    `/bikes/${cat}`,
    ...models.map((model) => `/bikes/${cat}/${model}`),
  ]);

  const staticPages = ['', '/configurator', '/parts', ...bikePages];

  return staticPages.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: lastModified,
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : route.includes('/bikes/') ? 0.8 : 0.5,
  }));
}
