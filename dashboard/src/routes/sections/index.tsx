import type { RouteObject } from 'react-router';

import { lazy } from 'react';

import { authRoutes } from './auth';
import { shareRoutes } from './share';
import { devosRoutes } from './devos';
import { dashboardRoutes } from './dashboard';

// ----------------------------------------------------------------------

const Page404 = lazy(() => import('src/pages/error/404'));

export const routesSection: RouteObject[] = [
  // Share
  ...shareRoutes,

  // Auth
  ...authRoutes,

  // Dashboard
  ...dashboardRoutes,

  // DevOS
  ...devosRoutes,

  /**
   * Main routes (Disabled for single-page-public login)
   * ...mainRoutes,
   */

  // No match
  { path: '*', element: <Page404 /> },
];
