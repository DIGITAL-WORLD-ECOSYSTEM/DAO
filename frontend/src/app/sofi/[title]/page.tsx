/**
 * Copyright 2026 ASPPIBRA – Associação dos Proprietários e Possuidores de Imóveis no Brasil.
 * Project: Governance System (ASPPIBRA DAO)
 * Role: Public Blog SoFi Detail Page
 * Version: 1.4.2 - Fix: Prerender & Serialization Error Resolution
 */

import type { Metadata } from 'next';

import { kebabCase } from 'es-toolkit';
import { notFound } from 'next/navigation';

import { _sofi } from 'src/_mock/_blog'; 
import { CONFIG } from 'src/global-config';
import { getSoFi, getLatestSoFis } from 'src/actions/blog-ssr';

import { SoFiDetailsHomeView } from 'src/sections/sofi/view/home/post-details-home-view';

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
  params: Promise<{ title: string }>;
};

// ----------------------------------------------------------------------

/**
 * 🌐 GERADOR DE METADADOS (SEO):
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { title } = await params;
  
  // Busca no mock para manter SEO consistente mesmo em modo dinâmico
  const post = _sofi.find((p) => kebabCase(p.title) === title);

  if (!post) {
    return { title: `SoFi não encontrado | ${CONFIG.appName}` };
  }

  return {
    title: `${post.title} | ${CONFIG.appName}`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      url: `${CONFIG.siteUrl}/sofi/${kebabCase(post.title)}`,
      images: [
        {
          url: `/sofi/${kebabCase(post.title)}/opengraph-image`,
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
  const { title } = await params;

  // Busca dos dados no servidor via SSR Action
  const { post } = await getSoFi(title);
  const { latestSoFis } = await getLatestSoFis(title);

  if (!post) {
    notFound();
  }

  /**
   * 🛠️ HIGIENIZAÇÃO DE DADOS (DATA SANITIZATION):
   * O erro de Prerender ocorre porque objetos vindos de Server Actions podem carregar
   * funções de revalidação ou mappers. O processo abaixo garante que apenas
   * dados puros (strings, numbers, arrays) sejam passados para o Client Component (SoFiDetailsHomeView).
   */
  const sanitizedSoFi = JSON.parse(JSON.stringify(post));
  const sanitizedLatest = JSON.parse(JSON.stringify(latestSoFis));

  return (
    <SoFiDetailsHomeView 
      post={sanitizedSoFi} 
      latestSoFis={sanitizedLatest} 
    />
  );
}