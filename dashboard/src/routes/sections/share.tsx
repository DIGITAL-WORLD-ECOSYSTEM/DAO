import type { RouteObject } from 'react-router';

import { lazy, Suspense } from 'react';

import Box from '@mui/material/Box';

import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

const OverviewAnalyticsPage = lazy(() => import('src/pages/dashboard/banking/financial-history'));

// ----------------------------------------------------------------------

/**
 * Layout ultra-minimalista para compartilhamento público
 * Totalmente isolado para evitar redirecionamentos de autenticação
 */
const shareLayout = () => (
  <Box
    sx={{
      py: 5,
      px: { xs: 2, md: 5 },
      width: 1,
      minHeight: '100vh',
      bgcolor: 'background.default',
    }}
  >
    <Suspense fallback={<LoadingScreen />}>
      <OverviewAnalyticsPage />
    </Suspense>
  </Box>
);

export const shareRoutes: RouteObject[] = [
  {
    path: 'share',
    children: [{ path: 'analytics', element: shareLayout() }],
  },
];
