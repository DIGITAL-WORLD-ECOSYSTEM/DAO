import type { IPostItem } from 'src/types/blog';

// ----------------------------------------------------------------------

/**
 * MAPPER: Transforma dados brutos (API/D1/YouTube) no formato IPostItem.
 * Esta função protege a UI de mudanças no Backend.
 */
export function mapToPostItem(apiData: any): IPostItem {
  return {
    id: String(apiData.id || ''),
    title: apiData.title || 'Sem título',
    description: apiData.description || apiData.excerpt || '',
    content: apiData.content || '',
    coverUrl: apiData.coverUrl || apiData.cover_image || apiData.thumbnail || '',
    
    // Lógica de Categoria com fallback
    category: apiData.category || 'Notícias', 
    
    publish: apiData.publish || 'published',
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
          id: comment.id,
          name: comment.name || comment.user?.name,
          message: comment.message || comment.content,
          avatarUrl: comment.avatarUrl || comment.user?.profile_image,
          postedAt: new Date(comment.postedAt || comment.created_at).toISOString(), // Correção aqui também
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
