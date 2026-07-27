import { useEffect } from 'react';

import { useRouter, useSearchParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';

import { SplashScreen } from 'src/components/loading-screen';

import { setSession } from 'src/auth/context/jwt/utils';

// ----------------------------------------------------------------------

export default function OAuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (token) {
      setSession(token);
      window.location.href = CONFIG.auth.redirectPath;
    } else if (error) {
      console.error('OAuth Error:', error);
      router.replace('/login');
    } else {
      router.replace('/login');
    }
  }, [router, searchParams]);

  return <SplashScreen />;
}
