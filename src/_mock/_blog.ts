import { kebabCase } from 'es-toolkit';

export const POST_PUBLISH_OPTIONS = [
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
];

export const POST_SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'popular', label: 'Popular' },
  { value: 'oldest', label: 'Oldest' },
];

const TITLE = 'Bem-vindo ao ASPPIBRA DAO';

// Mock robusto para garantir que o build passe em todas as rotas de SEO/News
export const _posts = [
  {
    id: '1',
    title: TITLE,
    slug: kebabCase(TITLE),
    description: 'A revolução da governança descentralizada e ativos reais.',
    coverUrl: 'https://api-dev-minimal-v6.vercel.app/assets/images/cover/cover-1.webp',
    createdAt: new Date(),
    totalViews: 100,
    totalComments: 10,
    totalShares: 5,
    totalFavorites: 2,
    author: { name: 'Admin', avatarUrl: '' },
    tags: ['DAO', 'Blockchain'],
    category: 'Portal',
    content: '<p>Conteúdo em breve...</p>',
    publish: 'published',
    metaTitle: TITLE,
    metaDescription: 'A revolução da governança descentralizada e ativos reais.',
    metaKeywords: ['DAO', 'ASPPIBRA', 'Blockchain']
  }
];
