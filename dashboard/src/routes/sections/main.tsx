import type { RouteObject } from 'react-router';

import { Outlet } from 'react-router';
import { lazy, Suspense } from 'react';

import { MainLayout } from 'src/layouts/main';
import { SimpleLayout } from 'src/layouts/simple';

import { SplashScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

const MaintenancePage = lazy(() => import('src/pages/maintenance'));
const Page500 = lazy(() => import('src/pages/error/500'));
const Page404 = lazy(() => import('src/pages/error/404'));
const Page403 = lazy(() => import('src/pages/error/403'));

// ----------------------------------------------------------------------

export const mainRoutes: RouteObject[] = [
  {
    element: (
      <Suspense fallback={<SplashScreen />}>
        <Outlet />
      </Suspense>
    ),
    children: [
      {
        element: (
          <MainLayout>
            <Outlet />
          </MainLayout>
        ),
        children: [
          {
            path: 'maintenance',
            element: (
              <SimpleLayout slotProps={{ content: { compact: true } }}>
                <MaintenancePage />
              </SimpleLayout>
            ),
          },
          {
            path: 'error',
            children: [
              { path: '500', element: <Page500 /> },
              { path: '404', element: <Page404 /> },
              { path: '403', element: <Page403 /> },
            ],
          },
        ],
      },
    ],
  },
];
