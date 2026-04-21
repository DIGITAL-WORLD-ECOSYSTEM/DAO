import type { IPostItem, IPostComment } from 'src/types/blog';

import { _mock } from './_mock';

// ----------------------------------------------------------------------

export const POST_PUBLISH_OPTIONS = [
  { value: 'published', label: 'Publicado' },
  { value: 'draft', label: 'Rascunho' },
];

export const POST_SORT_OPTIONS = [
  { value: 'latest', label: 'Mais recentes' },
  { value: 'popular', label: 'Populares' },
  { value: 'oldest', label: 'Antigos' },
];

export const POST_CATEGORIES = [
  'Economia',
  'Tecnologia',
  'Meio Ambiente',
  'Geopolítica',
  'Economia',
  'Tecnologia',
];

const POST_TITLES = [
  'Bitcoin rompe barreira histórica: O que esperar para o próximo trimestre?',
  'Tokenização de Ativos Reais (RWA): O futuro da economia global',
  'O impacto ambiental dos NFTs: Mitos e verdades em 2026',
  'O papel das criptomoedas em zonas de conflito geopolítico',
];

// ----------------------------------------------------------------------

// CORREÇÃO: Tipagem explícita para evitar a explosão de tipos de união literais.
const _favoritePeople: { name: string; avatarUrl: string }[] = [...Array(5)].map((_, i) => ({
  name: _mock.fullName(i),
  avatarUrl: _mock.image.avatar(i),
}));

const _comments: IPostComment[] = [...Array(3)].map((_, i) => ({
  id: _mock.id(i),
  name: _mock.fullName(i),
  avatarUrl: _mock.image.avatar(i),
  message: 'This is a mock sentence.',
  postedAt: _mock.time(i),
  users: [{ id: _mock.id(i), name: _mock.fullName(i), avatarUrl: _mock.image.avatar(i) }],
  replyComment: [],
}));

export const _posts: IPostItem[] = POST_TITLES.map((title, index) => {
  const categoryIndex = index % 4;
  const categoriesMap = ['Economia', 'Tecnologia', 'Meio Ambiente', 'Geopolítica'];
  const category = categoriesMap[categoryIndex];

  return {
    id: _mock.id(index),
    title,
    slug: title.toLowerCase().replace(/ /g, '-'),
    category,
    description: 'This is a mock description.',
    content: 'This is mock content.',
    coverUrl: _mock.image.cover(index),
    publish: index % 10 !== 0,
    createdAt: _mock.time(index),
    totalViews: _mock.number.nativeL(index),
    totalShares: _mock.number.nativeL(index + 1),
    totalComments: _mock.number.nativeL(index + 2),
    totalFavorites: _mock.number.nativeL(index + 3),
    tags: ['BTC', 'Crypto', 'Trading', 'Web3', 'DeFi'].slice(0, (index % 4) + 2),
    metaTitle: title,
    metaDescription: 'This is a mock meta description.',
    metaKeywords: ['crypto', 'news', 'analysis'],
    author: {
      name: _mock.fullName(index),
      avatarUrl: _mock.image.avatar(index),
    },
    favoritePerson: _favoritePeople,
    comments: _comments,
  };
});
