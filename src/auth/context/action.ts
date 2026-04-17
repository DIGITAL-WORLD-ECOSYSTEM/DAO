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
    const res = await axios.post(endpoints.auth.signIn, params);
    const { accessToken } = res.data;

    if (!accessToken) {
      throw new Error('Falha na autenticação: Token não recebido.');
    }

    await setSession(accessToken);
  } catch (error: any) {
    console.error('Erro no Login:', error);
    // Extract the API-level message from the response body (e.g., 409 Conflict, 401 Unauthorized)
    const apiMessage = error?.response?.data?.message;
    throw new Error(apiMessage || error.message || 'Erro ao entrar. Tente novamente.');
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
  const params = { email, password, firstName, lastName };

  try {
    const res = await axios.post(endpoints.auth.signUp, params);
    const { accessToken } = res.data;

    if (!accessToken) {
      throw new Error('Erro ao registrar: Token não gerado.');
    }

    await setSession(accessToken);
  } catch (error: any) {
    console.error('Erro no Registro:', error);
    // Extract the API-level message from the response body (e.g., 409 email already exists)
    const apiMessage = error?.response?.data?.message;
    throw new Error(apiMessage || error.message || 'Erro ao criar conta. Tente novamente.');
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
