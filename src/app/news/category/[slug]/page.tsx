/**
 * Copyright 2026 ASPPIBRA – Associação dos Proprietários e Possuidores de Imóveis no Brasil.
 * Project: Governance System (ASPPIBRA DAO)
 * Role: Blog Category Page (Server Component)
 * Version: 2.0.0 - Elite Infrastructure Upgrade
 */

import type { Metadata } from 'next';

import { kebabCase } from 'es-toolkit';
import { notFound } from 'next/navigation';

import { CONFIG } from 'src/global-config';
import { _posts } from 'src/_mock/blog.mock';

import { BlogHomeView } from 'src/sections/blog/_view/public/BlogHomeView';

// ----------------------------------------------------------------------

/**
 * ✅ ESTABILIDADE DE BUILD (DYNAMISM):
 * Forçamos 'force-dynamic' para evitar que o Next.js tente pré-gerar as categorias
 * no build time. Isso previne o erro de serialização de funções em Client Components.
 */
export const dynamic = 'force-dynamic';

/**
 * ✅ CONFIGURAÇÃO DE RUNTIME:
 * Utilizamos 'nodejs' para garantir compatibilidade total com as bibliotecas
 * de processamento de dados e manipulação de strings.
 */
export const runtime = 'nodejs';

type Props = {
  params: Promise<{ slug: string }>;
};

// ----------------------------------------------------------------------

/**
 * 🟢 SEO DINÂMICO PARA CATEGORIAS:
 * Gera metadados personalizados baseados no slug da URL para otimizar
 * a indexação nos motores de busca (Google).
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  // Localiza o nome original da categoria para exibição no título (ex: 'tecnologia' -> 'Tecnologia')
  const categoryName = _posts.find((p) => kebabCase(p.category) === slug)?.category || slug;

  return {
    title: `${categoryName} | Notícias ASPPIBRA`,
    description: `Explore as últimas novidades e artigos sobre ${categoryName} na ASPPIBRA.`,
    openGraph: {
      title: `Categoria: ${categoryName}`,
      description: `Conteúdo focado em ${categoryName} para o produtor rural e governança RWA.`,
      url: `${CONFIG.siteUrl}/post/category/${slug}`,
    },
  };
}

// ----------------------------------------------------------------------

/**
 * 🏛️ COMPONENTE PRINCIPAL (PAGE):
 * Filtra e renderiza a lista de posts pertencentes a uma categoria específica.
 */
export default async function Page({ params }: Props) {
  const { slug } = await params;

  // 🔍 FILTRAGEM: Busca posts cujo kebabCase da categoria coincida com o slug da URL
  const filteredPosts = _posts.filter((post) => kebabCase(post.category) === slug);

  // Caso não existam posts para o slug fornecido, dispara a página 404
  if (filteredPosts.length === 0) {
    notFound();
  }

  /**
   * 🛡️ SANITIZAÇÃO DE DADOS (SERIALIZAÇÃO):
   * O Next.js proíbe passar funções para Client Components.
   * O 'JSON.stringify/parse' limpa o objeto filteredPosts de qualquer método
   * ou propriedade não-serializável que venha do arquivo de Mocks.
   */
  const sanitizedPosts = JSON.parse(JSON.stringify(filteredPosts));

  return <BlogHomeView posts={sanitizedPosts} />;
}
