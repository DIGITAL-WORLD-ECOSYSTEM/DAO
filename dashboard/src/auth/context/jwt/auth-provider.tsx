import type { AuthState } from '../../types';

import { useSetState } from 'minimal-shared/hooks';
import { useMemo, useEffect, useCallback } from 'react';

import axios, { endpoints } from 'src/lib/axios';

import { JWT_STORAGE_KEY } from './constant';
import { AuthContext } from '../auth-context';
import { setSession, isValidToken } from './utils';

// ----------------------------------------------------------------------

/**
 * NOTE:
 * We only build demo at basic level.
 * Customer will need to do some extra handling yourself if you want to extend the logic and other features...
 */

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const { state, setState } = useSetState<AuthState>({ user: null, loading: true });
  useEffect(() => {
    // Resgata o usuário de possíveis bugs de simulação anteriores
    localStorage.removeItem('simulated_role');
  }, []);

  const checkUserSession = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem(JWT_STORAGE_KEY);

      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);

        const res = await axios.get(endpoints.auth.me);

        const { user } = res.data;

        setState({ user: { ...user, accessToken }, loading: false });
        return { ...user, accessToken };
      } else {
        // Tenta recuperar a sessão usando Cookies HttpOnly
        try {
          const res = await axios.get(endpoints.auth.me);
          const { user } = res.data;
          const token = res.data.accessToken || '';
          if (token) {
            setSession(token);
          }
          setState({ user: { ...user, accessToken: token }, loading: false });
          return { ...user, accessToken: token };
        } catch (e) {
          setState({ user: null, loading: false });
          return null;
        }
      }
    } catch (error) {
      console.error(error);
      setState({ user: null, loading: false });
      return null;
    }
  }, [setState]);

  useEffect(() => {
    checkUserSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Listen for axios interceptor signal that session is unrecoverable
  useEffect(() => {
    const handleSessionExpired = () => {
      setSession(null);
      setState({ user: null, loading: false });
    };
    window.addEventListener('auth:session-expired', handleSessionExpired);
    return () => window.removeEventListener('auth:session-expired', handleSessionExpired);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(() => {
    const backendRole = state.user?.role;
    let mappedRole = backendRole === 'citizen' ? 'user' : (backendRole ?? 'admin');

    // Força a role 'dev' para o usuário root do DevOS
    if (state.user?.email === 'dev@asppibra.com') {
      mappedRole = 'dev';
    }

    return {
      user: state.user ? { ...state.user, role: mappedRole } : null,
      checkUserSession,
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
    };
  }, [checkUserSession, state.user, status]);

  return <AuthContext value={memoizedValue}>{children}</AuthContext>;
}
