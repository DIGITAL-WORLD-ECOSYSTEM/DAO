import type { MetadataRoute } from 'next';

import { paths } from 'src/routes/paths'; 

// Importação da fonte única de verdade (Mock)
import { _posts } from 'src/_mock/_blog';
import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

/**
 * SITEMAP DINÂMICO - PRODUÇÃO 2026
 * Responsável por informar aos buscadores a estrutura de ativos e conteúdo.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const URL = CONFIG.siteUrl;

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
      changeFrequency: 'daily', // Aumentado para diário para acelerar indexação de novos posts
      priority: 0.8,
    },
  ];

  // 2. Rotas Dinâmicas: Posts e Ativos RWA
  const postRoutes: MetadataRoute.Sitemap = _posts.map((post) => ({
    url: `${URL}${paths.post.details(post.title)}`,
    lastModified: new Date(post.createdAt).toISOString(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // 3. Rotas de Categorias (SEO de Siloing)
  // Extrai categorias únicas do seu mock de blog
  const categories = [...new Set(_posts.map((post) => post.category))];
  
  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${URL}${paths.post.category(category.toLowerCase())}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly',
    priority: 0.5,
  }));

  return [...staticRoutes, ...postRoutes, ...categoryRoutes];
}