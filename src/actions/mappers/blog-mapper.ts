import type { IPostItem } from 'src/types/blog';

import { kebabCase } from 'es-toolkit';

// ----------------------------------------------------------------------

/**
 * MAPPER: Transforma dados brutos (API/D1/YouTube) no formato IPostItem.
 * Esta função protege a UI de mudanças no Backend.
 */
export function mapToPostItem(apiData: any): IPostItem {
  return {
    id: String(apiData.id || ''),
    title: apiData.title || 'Sem título',
    slug: apiData.slug || kebabCase(apiData.title || ''),
    description: apiData.description || apiData.excerpt || '',
    content: apiData.content || '',
    coverUrl: apiData.coverUrl || apiData.cover_image || apiData.thumbnail || '',

    // Lógica de Categoria com fallback
    category: apiData.category || 'Notícias',

    status: (apiData.status || (typeof apiData.publish === 'boolean' ? (apiData.publish ? 'published' : 'draft') : apiData.publish)) || 'draft',
    createdAt: new Date(apiData.createdAt || apiData.published_at).toISOString(),

    // Estatísticas (Garante que sempre sejam números)
    totalViews: Number(apiData.totalViews || apiData.views || 0),
    totalShares: Number(apiData.totalShares || apiData.shares || 0),
    totalComments: Number(apiData.totalComments || apiData.comments_count || 0),
    totalFavorites: Number(apiData.totalFavorites || apiData.likes || 0),

    // SEO
    metaTitle: apiData.metaTitle || apiData.title || '',
    metaDescription: apiData.metaDescription || apiData.description || '',
    metaKeywords: Array.isArray(apiData.metaKeywords) ? apiData.metaKeywords : [],

    tags: Array.isArray(apiData.tags) ? apiData.tags : ['Cripto'],

    // Mapeamento de Autor
    author: {
      name: apiData.author?.name || apiData.user?.name || 'Sistema',
      avatarUrl: apiData.author?.avatarUrl || apiData.user?.profile_image || '',
    },

    // Comentários (Mapeamento recursivo simples)
    comments: Array.isArray(apiData.comments)
      ? apiData.comments.map((comment: any) => ({
          id: String(comment.id),
          name: comment.name || comment.user?.name || 'Anônimo',
          message: comment.message || comment.content || '',
          avatarUrl: comment.avatarUrl || comment.user?.profile_image || '',
          postedAt: new Date(comment.postedAt || comment.created_at || comment.createdAt).toISOString(),
          users: comment.users || [],
          replyComment: comment.replyComment || [],
        }))
      : [],

    favoritePerson: Array.isArray(apiData.favoritePerson) ? apiData.favoritePerson : [],
  };
}

/**
 * MAPPER DE LISTA: Facilita a conversão de arrays vindos do banco de dados.
 */
export function mapToPostList(apiList: any[]): IPostItem[] {
  if (!Array.isArray(apiList)) return [];
  return apiList.map(mapToPostItem);
}

export function mapToCommentItem(comment: any): any {
  return {
    id: String(comment.id),
    name: comment.user?.name || comment.name || 'Anônimo',
    message: comment.content || comment.message || '',
    avatarUrl: comment.user?.avatarUrl || comment.avatarUrl || '',
    postedAt: new Date(comment.createdAt || comment.postedAt).toISOString(),
    users: comment.users || [],
    replyComment: comment.replyComment || [],
  };
}

export function mapToCommentList(apiList: any[]): any[] {
  if (!Array.isArray(apiList)) return [];
  return apiList.map(mapToCommentItem);
}
