import type { MetadataRoute } from 'next';

import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/global-config';
import { getPosts } from 'src/actions/blog-queries';

// ----------------------------------------------------------------------

// ✅ Força renderização dinâmica (a API é consultada em cada request do Google Bot)
export const dynamic = 'force-dynamic';

/**
 * SITEMAP DINÂMICO - PRODUÇÃO 2026
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const URL = CONFIG.siteUrl;

  const { posts } = await getPosts();

  // 1. Rotas Estáticas Principais
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${URL}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${URL}${paths.post.root}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ];

  // 2. Rotas Dinâmicas: Posts
  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${URL}${paths.post.details(post.slug)}`,
    lastModified: post.createdAt ? new Date(post.createdAt).toISOString() : new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // 3. Rotas de Categorias
  const categories = [...new Set(posts.map((post) => post.category))];

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${URL}${paths.post.category(category.toLowerCase())}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly',
    priority: 0.5,
  }));

  return [...staticRoutes, ...postRoutes, ...categoryRoutes];
}
