import type { Metadata } from 'next';

import { notFound } from 'next/navigation';

import { _mock } from 'src/_mock';
import { CONFIG } from 'src/global-config'; 

import { PostEditView } from 'src/sections/blog/management/post-edit-view';

// ----------------------------------------------------------------------

// ✅ CORREÇÃO CRUCIAL:
// Mudamos de 'edge' (limite 1MB) para 'nodejs' (limite 50MB).
// Agora o deploy na Vercel terá espaço de sobra para rodar essa página.
export const runtime = 'nodejs';

export const metadata: Metadata = { title: `Edit post | Dashboard - ${CONFIG.appName}` };

type Props = {
  params: Promise<{ title: string }>;
};

export default async function Page({ params }: Props) {
  const { title } = await params;

  const post = {
    id: _mock.id(1),
    title: _mock.postTitle(1),
    description: _mock.description(1),
    content: _mock.description(1),
    coverUrl: _mock.image.cover(1),
    tags: ['The Thrill of Traveling'],
    publish: 'published',
    metaTitle: _mock.postTitle(1),
    metaDescription: _mock.description(1),
    metaKeywords: ['Travel', 'Adventure'],
    createdAt: new Date().toISOString(),
  };

  if (!post) {
    return notFound();
  }

  return <PostEditView post={post as any} />;
}