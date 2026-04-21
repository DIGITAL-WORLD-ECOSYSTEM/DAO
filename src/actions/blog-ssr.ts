// src/actions/blog-ssr.ts
import { _posts } from 'src/_mock/_blog'; 
import { CONFIG } from 'src/global-config';
import { mapToPostItem, mapToPostList } from './mappers/blog-mapper';

const API_URL = CONFIG.serverUrl;

// ----------------------------------------------------------------------

/**
 * BUSCA PRINCIPAL: Retorna todos os posts.
 */
export async function getPosts() {
  try {
    const url = `${API_URL}/api/posts`;

    if (!API_URL) {
      return { posts: _posts };
    }

    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
       console.warn('API de Blog Offline. Usando Mocks.');
       return { posts: _posts }; 
    }

    const json = await res.json();
    const rawData = Array.isArray(json.data) ? json.data : [];

    return { posts: rawData.length > 0 ? mapToPostList(rawData) : _posts };
  } catch (error) {
    console.error('Erro ao buscar posts:', error);
    return { posts: _posts };
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
        // Fallback para mock se não encontrar na API (para facilitar testes)
        const mockPost = _posts.find((p: any) => p.slug === paramSlug || p.title.toLowerCase().replace(/ /g, '-') === paramSlug);
        return { post: mockPost || null };
    }

    const json = await res.json();
    return { post: json.success ? mapToPostItem(json.data) : null };
  } catch (error) {
    console.error('Erro ao buscar post individual:', error);
    return { post: null };
  }
}

// ----------------------------------------------------------------------

/**
 * BUSCA RELACIONADOS: Retorna os últimos posts.
 */
export async function getLatestPosts(paramSlug: string) {
  try {
    const { posts } = await getPosts();

    const latestPosts = posts.filter((p: any) => p.slug !== paramSlug).slice(0, 4);

    return { latestPosts };
  } catch (error) {
    return { latestPosts: [] };
  }
}
