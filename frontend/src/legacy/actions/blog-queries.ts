import { CONFIG } from 'src/global-config';

import { BLOG_MOCK } from 'src/_mock/blog.mock';

import { mapToPostItem, mapToPostList } from './mappers/blog-mapper';

const API_URL = CONFIG.serverUrl;

// ----------------------------------------------------------------------

/**
 * BUSCA PRINCIPAL: Retorna posts com suporte a filtros da API.
 * Se a API falhar, retorna os dados de Mock (Fallback).
 */
export async function getPosts(params?: { category?: string; limit?: number; page?: number; status?: string }) {
  try {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.limit) query.append('limit', String(params.limit));
    if (params?.page) query.append('page', String(params.page));
    if (params?.status) query.append('status', params.status);

    const url = `${API_URL}/api/posts${query.toString() ? `?${query.toString()}` : ''}`;

    if (!API_URL) {
      console.warn('⚠️ Server URL não configurado. Usando Fallback.');
      return { posts: BLOG_MOCK };
    }

    const res = await fetch(url, { cache: 'no-store' });
    
    if (!res.ok) {
       console.warn('⚠️ API de Blog Offline ou Erro. Usando Fallback de Design.');
       return { posts: BLOG_MOCK }; 
    }

    const json = await res.json();
    const rawData = Array.isArray(json.data) ? json.data : [];

    // Se a API retornar vazio, usamos o Mock como Fallback de design
    if (rawData.length === 0) {
      console.log('ℹ️ API retornou lista vazia. Usando Mock para preencher o design.');
      return { posts: BLOG_MOCK };
    }

    return { posts: mapToPostList(rawData) };
  } catch (error) {
    console.error('❌ Erro ao buscar posts, ativando fallback:', error);
    return { posts: BLOG_MOCK };
  }
}

// ----------------------------------------------------------------------

/**
 * BUSCA INDIVIDUAL: Pega um post específico pelo Slug.
 */
export async function getPost(paramSlug: string) {
  if (!paramSlug) return { post: null };

  try {
    const url = `${API_URL}/api/posts/${paramSlug}`;

    const res = await fetch(url, { cache: 'no-store' });
    
    if (!res.ok) {
        // Tenta encontrar no mock se a API falhar
        const mockPost = BLOG_MOCK.find(p => p.slug === paramSlug);
        return { post: mockPost || null };
    }

    const json = await res.json();
    return { post: json.success ? mapToPostItem(json.data) : null };
  } catch (error) {
    console.error('❌ Erro ao buscar post individual:', error);
    const mockPost = BLOG_MOCK.find(p => p.slug === paramSlug);
    return { post: mockPost || null };
  }
}

// ----------------------------------------------------------------------

/**
 * BUSCA RELACIONADOS: Retorna os últimos posts via API (ou fallback).
 */
export async function getLatestPosts(paramSlug: string) {
  try {
    // Agora delegamos o limite para a API em vez de filtrar em memória
    const { posts } = await getPosts({ limit: 4 });

    const latestPosts = posts.filter((p: any) => p.slug !== paramSlug);

    return { latestPosts };
  } catch (error) {
    return { latestPosts: BLOG_MOCK.slice(0, 4) };
  }
}

/**
 * BUSCA POR CATEGORIA: Filtra posts por slug da categoria via API.
 */
export async function getPostsByCategory(categoryName: string) {
  try {
    // Delegamos o filtro de categoria para a API
    const { posts } = await getPosts({ category: categoryName });
    
    return { posts };
  } catch (error) {
    return { posts: BLOG_MOCK.filter(p => p.category === categoryName) };
  }
}
