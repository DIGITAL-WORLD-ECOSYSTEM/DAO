/**
 * Copyright 2026 ASPPIBRA – Associação dos Proprietários e Possuidores de Imóveis no Brasil.
 * Project: Governance System (ASPPIBRA DAO)
 * Role: Post Edit View (Admin Container)
 * Version: 1.5.1 - Refactored: Data Serialization & UX Stability
 */

'use client';

import type { IPostItem } from 'src/types/blog';

import { useMemo } from 'react';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { PostCreateEditForm } from './post-create-edit-form';

// ----------------------------------------------------------------------

type Props = {
  post?: IPostItem;
};

// ----------------------------------------------------------------------

export function PostEditView({ post }: Props) {
  
  /**
   * 🛡️ SANITIZAÇÃO DE DADOS (SERIALIZAÇÃO):
   * O erro "Functions cannot be passed directly to Client Components" ocorre quando
   * o objeto 'post' carrega métodos internos ou metadados de Server Actions.
   * Utilizamos JSON stringify/parse para garantir que apenas Propriedades Simples (POJO)
   * sejam injetadas no formulário de edição.
   */
  const sanitizedPost = useMemo(() => {
    if (!post) return undefined;

    try {
      // Deep copy para remover referências de funções e instâncias complexas
      return JSON.parse(JSON.stringify(post)) as IPostItem;
    } catch (error) {
      console.error('Falha na sanitização do objeto Post:', error);
      return post;
    }
  }, [post]);

  /**
   * 🏗️ ESTRUTURA VISUAL:
   * DashboardContent define o espaçamento padrão do painel administrativo.
   */
  return (
    <DashboardContent>
      {/* 📍 NAVEGAÇÃO (BREADCRUMBS): Melhora a orientação do administrador na DAO */}
      <CustomBreadcrumbs
        heading="Editar Postagem"
        backHref={paths.dashboard.post.root}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Blog', href: paths.dashboard.post.root },
          { 
            name: post?.title || 'Carregando Postagem...', 
            href: paths.dashboard.post.details(`${post?.title}`) 
          },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {/* 📝 FORMULÁRIO DE EDIÇÃO: Recebe o post sanitizado para edição segura */}
      <PostCreateEditForm currentPost={sanitizedPost} />
    </DashboardContent>
  );
}