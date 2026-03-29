/**
 * Copyright 2026 ASPPIBRA – Associação dos Proprietários e Possuidores de Imóveis no Brasil.
 * Project: Governance System (ASPPIBRA DAO)
 * Role: SoFi Edit View (Admin Container)
 * Version: 1.5.1 - Refactored: Data Serialization & UX Stability
 */

'use client';

import type { ISoFiItem } from 'src/types/blog';

import { useMemo } from 'react';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { SoFiCreateEditForm } from './post-create-edit-form';

// ----------------------------------------------------------------------

type Props = {
  post?: ISoFiItem;
};

// ----------------------------------------------------------------------

export function SoFiEditView({ post }: Props) {
  
  /**
   * 🛡️ SANITIZAÇÃO DE DADOS (SERIALIZAÇÃO):
   * O erro "Functions cannot be passed directly to Client Components" ocorre quando
   * o objeto 'post' carrega métodos internos ou metadados de Server Actions.
   * Utilizamos JSON stringify/parse para garantir que apenas Propriedades Simples (POJO)
   * sejam injetadas no formulário de edição.
   */
  const sanitizedSoFi = useMemo(() => {
    if (!post) return undefined;

    try {
      // Deep copy para remover referências de funções e instâncias complexas
      return JSON.parse(JSON.stringify(post)) as ISoFiItem;
    } catch (error) {
      console.error('Falha na sanitização do objeto SoFi:', error);
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
        heading="Editar SoFiagem"
        backHref={paths.dashboard.sofi.root}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Blog', href: paths.dashboard.sofi.root },
          { 
            name: post?.title || 'Carregando SoFiagem...', 
            href: paths.dashboard.sofi.details(`${post?.title}`) 
          },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {/* 📝 FORMULÁRIO DE EDIÇÃO: Recebe o post sanitizado para edição segura */}
      <SoFiCreateEditForm currentSoFi={sanitizedSoFi} />
    </DashboardContent>
  );
}