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

export type Web3SignInParams = {
  address: string;
};

// ----------------------------------------------------------------------

declare global {
  interface Window {
    ethereum?: any;
  }
}

/** **************************************
 * Sign in
 *************************************** */
export const signInWithPassword = async ({ email, password }: SignInParams): Promise<void> => {
  try {
    const params = { email, password };

    const res = await axios.post(endpoints.auth.signIn, params);

    const { accessToken } = res.data;

    if (!accessToken) {
      throw new Error('Access token not found in response');
    }

    setSession(accessToken);
  } catch (error) {
    console.error('Error during sign in:', error);
    throw error;
  }
};

/** **************************************
 * Sign up
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
    const res = await axios.post(endpoints.auth.signUp, params);

    const { accessToken } = res.data;

    if (!accessToken) {
      throw new Error('Access token not found in response');
    }

    setSession(accessToken);
  } catch (error) {
    console.error('Error during sign up:', error);
    throw error;
  }
};

/** **************************************
 * Sign out
 *************************************** */
export const signOut = async (): Promise<void> => {
  try {
    try {
      await axios.post('/api/core/identity/logout');
    } catch (e) {
      console.warn('Backend logout failed, proceeding with local clean:', e);
    }
    await setSession(null);
  } catch (error) {
    console.error('Error during sign out:', error);
    throw error;
  }
};

/** **************************************
 * Web3 Sign in (SIWE)
 * *************************************** */
export const signInWithWeb3 = async (address: string): Promise<void> => {
  try {
    const nonceRes = await axios.get(endpoints.auth.web3Nonce, { params: { address } });
    const { nonce, message } = nonceRes.data;

    console.log('Web3 Nonce received:', { nonce, message, address });

    if (!message) {
      throw new Error('Falha ao obter a mensagem de autenticação do servidor.');
    }

    if (!window.ethereum) {
      throw new Error('MetaMask is not installed');
    }

    const signature = await window.ethereum.request({
      method: 'personal_sign',
      params: [message, address],
    });

    const verifyRes = await axios.post(endpoints.auth.web3Verify, {
      address,
      message,
      signature,
    });

    const { accessToken } = verifyRes.data;

    if (!accessToken) {
      throw new Error('Access token not found in response');
    }

    setSession(accessToken);
  } catch (error) {
    console.error('Error during Web3 sign in:', error);
    throw error;
  }
};
