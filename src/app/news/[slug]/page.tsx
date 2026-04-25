/**
 * Copyright 2026 ASPPIBRA – Associação dos Proprietários e Possuidores de Imóveis no Brasil.
 * Project: Governance System (ASPPIBRA DAO)
 * Role: Public Blog Post Detail Page
 * Version: 2.0 - Full OpenGraph & SEO Enterprise Implementation
 */

import type { Metadata } from 'next';

import { kebabCase } from 'es-toolkit';
import { notFound } from 'next/navigation';

import { CONFIG } from 'src/global-config';
import { getPost, getLatestPosts } from 'src/actions/blog-ssr';

import { PostDetailsHomeView } from 'src/sections/blog/view/public/post-details-home-view';

// ----------------------------------------------------------------------

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type Props = {
  params: Promise<{ slug: string }>;
};

// ----------------------------------------------------------------------

/**
 * 🌐 GERADOR DE METADADOS (SEO Enterprise):
 * Tags completas para Facebook, Twitter/X, LinkedIn, WhatsApp e Google.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { post } = await getPost(slug);

  if (!post) {
    return { title: `Post não encontrado | ${CONFIG.appName}` };
  }

  const postSlug = post.slug || kebabCase(post.title);
  const postUrl = `${CONFIG.siteUrl}/news/${postSlug}`;
  const ogImageUrl = `${CONFIG.siteUrl}/news/${postSlug}/opengraph-image`;

  return {
    title: `${post.title} | ${CONFIG.appName}`,
    description: post.description,

    // ✅ URL Canônica (evita penalização por conteúdo duplicado)
    alternates: {
      canonical: postUrl,
    },

    // ✅ OpenGraph Completo (Facebook, LinkedIn, WhatsApp, Telegram)
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      url: postUrl,
      siteName: CONFIG.appName,
      locale: 'pt_BR',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
          type: 'image/png',
        },
      ],
      publishedTime: post.createdAt ? new Date(post.createdAt).toISOString() : undefined,
      modifiedTime: post.createdAt ? new Date(post.createdAt).toISOString() : undefined,
      authors: post.author?.name ? [post.author.name] : ['ASPPIBRA Editorial'],
      section: post.category || 'Notícias',
      tags: Array.isArray(post.tags) ? post.tags : [],
    },

    // ✅ Twitter/X Card Completo
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      site: '@asppibra',
      creator: '@asppibra',
      images: [
        {
          url: ogImageUrl,
          alt: post.title,
        },
      ],
    },

    // ✅ Robots
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  };
}

// ----------------------------------------------------------------------

/**
 * 🏛️ COMPONENTE DE PÁGINA (SERVER COMPONENT):
 */
export default async function Page({ params }: Props) {
  const { slug } = await params;

  const { post } = await getPost(slug);
  const { latestPosts } = await getLatestPosts(slug);

  if (!post) {
    notFound();
  }

  /**
   * 🛠️ HIGIENIZAÇÃO DE DADOS:
   * Garante que apenas dados puros sejam passados para o Client Component.
   */
  const sanitizedPost = JSON.parse(JSON.stringify(post));
  const sanitizedLatest = JSON.parse(JSON.stringify(latestPosts));

  return <PostDetailsHomeView post={sanitizedPost} latestPosts={sanitizedLatest} />;
}
