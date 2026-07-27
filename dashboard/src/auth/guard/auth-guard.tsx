import { useState, useEffect } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';

import { SplashScreen } from 'src/components/loading-screen';

import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------

type AuthGuardProps = {
  children: React.ReactNode;
};

export function AuthGuard({ children }: AuthGuardProps) {
  const { authenticated, loading } = useAuthContext();

  const [isChecking, setIsChecking] = useState(true);

  const router = useRouter();

  const checkPermissions = async (): Promise<void> => {
    if (loading) {
      return;
    }

    if (!authenticated) {
      const { method } = CONFIG.auth;
      const signInPath = paths.auth[method].signIn;

      // Prevent race conditions where window.location.pathname is already signInPath
      if (window.location.pathname === signInPath) {
        return;
      }

      let href = signInPath;

      // Only append returnTo if it's a deep link (not the root path) to keep the login URL clean
      if (window.location.pathname !== '/') {
        const searchParams = new URLSearchParams({
          returnTo: window.location.pathname,
        }).toString();
        href = `${signInPath}?${searchParams}`;
      }

      router.replace(href);

      return;
    }

    setIsChecking(false);
  };

  useEffect(() => {
    checkPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated, loading]);

  if (isChecking) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}
