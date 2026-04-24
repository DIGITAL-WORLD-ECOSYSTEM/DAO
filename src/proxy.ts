/**
 * Copyright 2026 ASPPIBRA – Associação dos Proprietários e Possuidores de Imóveis no Brasil.
 * Project: Governance System (ASPPIBRA DAO)
 * Role: Enterprise Route Guard (Frontend Proxy)
 * Version: 1.2.1 - Next.js 16 Proxy Export Fix
 */

import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';
import { decodeJwt } from 'jose';

// --- CONFIGURAÇÃO DE ROTAS ---

/** * Rotas que exigem obrigatoriamente um Token JWT válido.
 * Inclui o Dashboard da DAO e configurações de conta do Cidadão.
 */
const PROTECTED_PATHS = ['/dashboard', '/user/account'];

/** * Rotas de acesso (Login/Registro).
 * Se o usuário já estiver logado, ele será impedido de acessar estas páginas.
 */
const AUTH_PATHS = ['/auth/sign-in', '/auth/sign-up'];

/** * Rotas restritas exclusivamente para administradores da DAO.
 */
const ADMIN_PATHS = ['/dashboard/post', '/dashboard/user/list', '/dashboard/user/new'];

/**
 * Lógica Principal do Proxy (Antigo Middleware)
 * ✅ Atualizado: O nome da função deve ser 'proxy' para o Next.js 16 (Turbopack).
 * Executada no Edge Runtime para latência ultra-baixa.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. EXTRAÇÃO DE CREDENCIAIS
  const token = request.cookies.get('accessToken')?.value;

  // 2. VALIDAÇÃO DE ACESSO PROTEGIDO
  const isAccessingProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path));

  if (isAccessingProtected && !token) {
    // Redireciona para o login preservando a rota pretendida para UX.
    const loginUrl = new URL('/auth/sign-in', request.url);
    loginUrl.searchParams.set('returnTo', pathname);

    return NextResponse.redirect(loginUrl);
  }

  // 3. PREVENÇÃO DE LOGIN DUPLICADO
  const isAccessingAuth = AUTH_PATHS.some((path) => pathname.startsWith(path));

  if (isAccessingAuth && token) {
    // Cidadão já autenticado: Redireciona para o core do sistema.
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 4. VALIDAÇÃO DE CARGO (RBAC DE BORDA)
  const isAccessingAdmin = ADMIN_PATHS.some((path) => pathname.startsWith(path));

  if (isAccessingAdmin && token) {
    try {
      const payload = decodeJwt(token);
      const role = payload.role as string;

      if (role !== 'admin') {
        // Redireciona Cidadãos que tentam burlar o menu lateral para a home do dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } catch (error) {
      // Token malformatado: força re-login
      const response = NextResponse.redirect(new URL('/auth/sign-in', request.url));
      response.cookies.delete('accessToken');
      return response;
    }
  }

  // 4. FLUXO PADRÃO
  return NextResponse.next();
}

/**
 * ✅ ESTRATÉGIA DE ENGENHARIA DE CUSTOS & COMPATIBILIDADE (MATCHER)
 * Configuração vital para evitar execuções desnecessárias em assets estáticos.
 */
export const config = {
  matcher: [
    {
      source:
        '/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|sitemap.xml|robots.txt).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
