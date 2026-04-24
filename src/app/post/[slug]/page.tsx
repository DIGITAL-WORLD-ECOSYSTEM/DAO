/**
 * Copyright 2026 ASPPIBRA – Associação dos Proprietários e Possuidores de Imóveis no Brasil.
 * Project: Governance System (ASPPIBRA DAO)
 * Role: Public Blog Post Detail Page
 * Version: 1.4.2 - Fix: Prerender & Serialization Error Resolution
 */

import type { Metadata } from 'next';

import { kebabCase } from 'es-toolkit';
import { notFound } from 'next/navigation';

import { CONFIG } from 'src/global-config';
import { getPost, getLatestPosts } from 'src/actions/blog-ssr';

import { PostDetailsHomeView } from 'src/sections/blog/view/public/post-details-home-view';

// ----------------------------------------------------------------------

/**
 * ✅ ESTABILIDADE DE BUILD (SOLUÇÃO DEFINITIVA):
 * Forçamos a renderização dinâmica para evitar que o Next.js tente serializar
 * funções de Server Actions durante o build estático. Isso resolve o erro:
 * "Functions cannot be passed directly to Client Components".
 */
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type Props = {
  params: Promise<{ slug: string }>;
};

// ----------------------------------------------------------------------

/**
 * 🌐 GERADOR DE METADADOS (SEO):
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  // Busca real na API para manter SEO consistente (com fallback interno no getPost)
  const { post } = await getPost(slug);

  if (!post) {
    return { title: `Post não encontrado | ${CONFIG.appName}` };
  }

  const postSlug = post.slug || kebabCase(post.title);

  return {
    title: `${post.title} | ${CONFIG.appName}`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      url: `${CONFIG.siteUrl}/post/${postSlug}`,
      images: [
        {
          url: `/post/${postSlug}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  };
}

// ----------------------------------------------------------------------

/**
 * 🏛️ COMPONENTE DE PÁGINA (SERVER COMPONENT):
 */
export default async function Page({ params }: Props) {
  const { slug } = await params;

  // Busca dos dados no servidor via SSR Action
  const { post } = await getPost(slug);
  const { latestPosts } = await getLatestPosts(slug);

  if (!post) {
    notFound();
  }

  /**
   * 🛠️ HIGIENIZAÇÃO DE DADOS (DATA SANITIZATION):
   * O erro de Prerender ocorre porque objetos vindos de Server Actions podem carregar
   * funções de revalidação ou mappers. O processo abaixo garante que apenas
   * dados puros (strings, numbers, arrays) sejam passados para o Client Component (PostDetailsHomeView).
   */
  const sanitizedPost = JSON.parse(JSON.stringify(post));
  const sanitizedLatest = JSON.parse(JSON.stringify(latestPosts));

  return <PostDetailsHomeView post={sanitizedPost} latestPosts={sanitizedLatest} />;
}
