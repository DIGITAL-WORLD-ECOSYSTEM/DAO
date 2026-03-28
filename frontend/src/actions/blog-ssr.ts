// src/actions/blog-ssr.ts
import { kebabCase } from 'es-toolkit';

import { _posts } from 'src/_mock/_blog'; // Fonte estática de verdade
import { CONFIG } from 'src/global-config';

const API_URL = CONFIG.serverUrl;

// ----------------------------------------------------------------------

/**
 * BUSCA PRINCIPAL: Retorna todos os posts.
 * Prioriza a API, mas usa o MOCK como fallback durante o desenvolvimento.
 */
export async function getPosts() {
  try {
    const url = `${API_URL}/api/posts`;
    
    // Se estivermos em dev ou banco vazio, podemos forçar o mock aqui
    if (!API_URL || API_URL.includes('localhost')) {
       return { posts: _posts };
    }

    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return { posts: _posts }; // Fallback para Mock se a API falhar

    const data = await res.json();
    const posts = Array.isArray(data) ? data : (data.posts || []);

    return { posts: posts.length > 0 ? posts : _posts };
  } catch (error) {
    return { posts: _posts };
  }
}

// ----------------------------------------------------------------------

/**
 * BUSCA INDIVIDUAL: Pega um post específico pelo Título (Slug).
 */
export async function getPost(paramTitle: string) {
  if (!paramTitle) return { post: null };

  try {
    // 🟢 Lógica de busca no Mock (Padrão 2026 com Slug)
    const post = _posts.find((p) => kebabCase(p.title) === paramTitle);

    return { post: post || null };
  } catch (error) {
    return { post: null };
  }
}

// ----------------------------------------------------------------------

/**
 * BUSCA RELACIONADOS: Retorna os últimos posts.
 */
export async function getLatestPosts(paramTitle: string) {
  try {
    const { posts } = await getPosts();
    
    const latestPosts = posts
      .filter((p: any) => kebabCase(p.title) !== paramTitle)
      .slice(0, 4);

    return { latestPosts }; // 🟢 Corresponde ao que a Page.tsx desestrutura
  } catch (error) {
    return { latestPosts: [] };
  }
}
