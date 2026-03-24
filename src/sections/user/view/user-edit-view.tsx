/**
 * Copyright 2026 ASPPIBRA – Associação dos Proprietários e Possuidores de Imóveis no Brasil.
 * Project: Governance System (ASPPIBRA DAO)
 * Role: User Edit View (Admin Container)
 * Version: 1.5.2 - Refactored: Data Serialization & UX Breadcrumb Stability
 */

'use client';

import type { IUserItem } from 'src/types/user';

import { useMemo } from 'react';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { UserCreateEditForm } from '../user-create-edit-form';

// ----------------------------------------------------------------------

type Props = {
  user?: IUserItem;
};

// ----------------------------------------------------------------------

export function UserEditView({ user: currentUser }: Props) {
  
  /**
   * 🛡️ SANITIZAÇÃO DE DADOS (SERIALIZAÇÃO):
   * O erro "Functions cannot be passed directly to Client Components" ocorre quando
   * o objeto 'user' traz metadados ou funções de revalidação de Server Actions.
   * Utilizamos useMemo + JSON stringify/parse para converter o dado em um objeto
   * literal puro (POJO), garantindo estabilidade no formulário.
   */
  const sanitizedUser = useMemo(() => {
    if (!currentUser) return undefined;

    try {
      // Cria uma cópia profunda para isolar o estado do formulário de referências externas
      return JSON.parse(JSON.stringify(currentUser)) as IUserItem;
    } catch (error) {
      console.error('Falha crítica na sanitização do perfil de usuário:', error);
      return currentUser;
    }
  }, [currentUser]);

  /**
   * 🏗️ ESTRUTURA VISUAL:
   * DashboardContent: Contêiner padronizado que herda as margens do layout admin.
   */
  return (
    <DashboardContent>
      
      {/* 📍 NAVEGAÇÃO (BREADCRUMBS): 
          Facilita o rastreio do administrador e fornece fallbacks visuais para 
          evitar textos vazios durante a carga dos dados. 
      */}
      <CustomBreadcrumbs
        heading="Editar Usuário"
        backHref={paths.dashboard.user.list}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Usuários', href: paths.dashboard.user.list },
          { 
            name: currentUser?.name || 'Carregando Perfil...', 
          },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {/* 👤 FORMULÁRIO DE EDIÇÃO: 
          Injetamos o usuário sanitizado. O formulário agora opera de forma 
          isolada e segura contra mutações inesperadas.
      */}
      <UserCreateEditForm currentUser={sanitizedUser} />
      
    </DashboardContent>
  );
}