'use client';

import axios, { endpoints } from 'src/lib/axios';

import { setSession } from './utils';

// ----------------------------------------------------------------------

export type SignInParams = {
  email: string;
  password: string;
};

export type SignUpParams = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

/** **************************************
 * Sign in (Entrada Real no Sistema)
 *************************************** */
export const signInWithPassword = async ({ email, password }: SignInParams): Promise<void> => {
  try {
    const params = { email, password };

    // Chama o seu Worker na Cloudflare: /api/core/auth/login
    const res = await axios.post(endpoints.auth.signIn, params);

    const { accessToken } = res.data;

    if (!accessToken) {
      throw new Error('Falha na autenticação: Token não recebido.');
    }

    // Configura o localStorage, os timers de expiração e os headers do Axios
    await setSession(accessToken);
    
  } catch (error: any) {
    console.error('Erro no Login:', error);
    // Repassa o erro para o componente de UI tratar (ex: senha incorreta)
    throw error;
  }
};

/** **************************************
 * Sign up (Registro de Novo Usuário)
 *************************************** */
export const signUp = async ({
  email,
  password,
  firstName,
  lastName,
}: SignUpParams): Promise<void> => {
  const params = {
    email,
    password,
    firstName,
    lastName,
  };

  try {
    // Chama o seu Worker na Cloudflare: /api/core/auth/register
    const res = await axios.post(endpoints.auth.signUp, params);

    const { accessToken } = res.data;

    if (!accessToken) {
      throw new Error('Erro ao registrar: Token não gerado.');
    }

    // ✅ CORREÇÃO: Usamos setSession aqui também para manter a consistência
    // e já deixar o usuário logado após o registro.
    await setSession(accessToken);

  } catch (error: any) {
    console.error('Erro no Registro:', error);
    throw error;
  }
};

/** **************************************
 * Sign out (Encerramento de Sessão)
 *************************************** */
export const signOut = async (): Promise<void> => {
  try {
    // Limpa tudo: localStorage, headers do Axios e timers
    await setSession(null);
  } catch (error) {
    console.error('Erro no Logout:', error);
    throw error;
  }
};