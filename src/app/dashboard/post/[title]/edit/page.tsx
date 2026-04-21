import type { Metadata } from 'next';

import { notFound } from 'next/navigation';

import { _mock } from 'src/_mock';
import { CONFIG } from 'src/global-config';

import { getPost } from 'src/actions/blog-ssr';

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

  const { post } = await getPost(title);

  if (!post) {
    return notFound();
  }

  const sanitizedPost = JSON.parse(JSON.stringify(post));

  return <PostEditView post={sanitizedPost} />;
}
