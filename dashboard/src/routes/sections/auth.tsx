import type { RouteObject } from 'react-router';

import { Outlet } from 'react-router';
import { lazy, Suspense } from 'react';

import { AuthCenteredLayout } from 'src/layouts/auth-centered';

import { SplashScreen } from 'src/components/loading-screen';

import { GuestGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

/** **************************************
 * Jwt
 * *************************************** */
const Jwt = {
  SignInPage: lazy(() => import('src/pages/auth/jwt/sign-in')),
  SignUpPage: lazy(() => import('src/pages/auth/jwt/sign-up')),
  ResetPasswordPage: lazy(() => import('src/pages/auth/jwt/reset-password')),
  UpdatePasswordPage: lazy(() => import('src/pages/auth/jwt/update-password')),
  VerifyPage: lazy(() => import('src/pages/auth/jwt/verify')),
};

const OAuth = {
  CallbackPage: lazy(() => import('src/pages/auth/oauth/callback')),
};

// ----------------------------------------------------------------------

export const authRoutes: RouteObject[] = [
  {
    element: (
      <Suspense fallback={<SplashScreen />}>
        <Outlet />
      </Suspense>
    ),
    children: [
      {
        path: 'login',
        element: (
          <GuestGuard>
            <AuthCenteredLayout>
              <Jwt.SignInPage />
            </AuthCenteredLayout>
          </GuestGuard>
        ),
      },
      {
        path: 'register',
        element: (
          <GuestGuard>
            <AuthCenteredLayout>
              <Jwt.SignUpPage />
            </AuthCenteredLayout>
          </GuestGuard>
        ),
      },
      {
        path: 'forgot-password',
        element: (
          <AuthCenteredLayout>
            <Jwt.ResetPasswordPage />
          </AuthCenteredLayout>
        ),
      },
      {
        path: 'reset-password',
        element: (
          <AuthCenteredLayout>
            <Jwt.UpdatePasswordPage />
          </AuthCenteredLayout>
        ),
      },
      {
        path: 'verify',
        element: (
          <AuthCenteredLayout>
            <Jwt.VerifyPage />
          </AuthCenteredLayout>
        ),
      },
      {
        path: 'auth/oauth/callback',
        element: <OAuth.CallbackPage />,
      },
    ],
  },
];
