import type { RouteObject } from 'react-router';

import { Outlet } from 'react-router';
import { lazy, Suspense } from 'react';

import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

import { AuthGuard, RoleBasedGuard } from 'src/auth/guard';

import { usePathname } from '../hooks';

// Módulos DevOS
const DashboardPage = lazy(() => import('src/pages/devos/page'));
const IdentityPage = lazy(() => import('src/pages/devos/identity-page'));
const ImpersonationPage = lazy(() => import('src/pages/devos/impersonation-page'));
const DatabasePage = lazy(() => import('src/pages/devos/database-page'));
const APIsPage = lazy(() => import('src/pages/devos/apis-page'));
const AuditPage = lazy(() => import('src/pages/devos/audit-page'));
const SecurityPage = lazy(() => import('src/pages/devos/security-page'));
const FlagsPage = lazy(() => import('src/pages/devos/flags-page'));
const InfrastructurePage = lazy(() => import('src/pages/devos/infrastructure-page'));
const EnvironmentPage = lazy(() => import('src/pages/devos/environment-page'));
const TestingPage = lazy(() => import('src/pages/devos/testing-page'));
const DAOPage = lazy(() => import('src/pages/devos/dao-page'));
const ReleasesPage = lazy(() => import('src/pages/devos/releases-page'));
const JobsPage = lazy(() => import('src/pages/devos/jobs-page'));
const RegistryPage = lazy(() => import('src/pages/devos/registry-page'));
const AboutPage = lazy(() => import('src/pages/devos/about-page'));

const StrategicPage = lazy(() => import('src/pages/devos/founder/strategic-page'));
const OperationsPage = lazy(() => import('src/pages/devos/founder/operations-page'));
const EmergencyPage = lazy(() => import('src/pages/devos/founder/emergency-page'));

function SuspenseOutlet() {
  const pathname = usePathname();
  return (
    <Suspense key={pathname} fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  );
}

const devosLayout = () => (
  <DashboardLayout>
    <SuspenseOutlet />
  </DashboardLayout>
);

export const devosRoutes: RouteObject[] = [
  {
    path: 'dev',
    element: (
      <AuthGuard>
        <RoleBasedGuard allowedRoles={['dev']} hasContent>
          {devosLayout()}
        </RoleBasedGuard>
      </AuthGuard>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'identity', element: <IdentityPage /> },
      { path: 'impersonation', element: <ImpersonationPage /> },
      { path: 'database', element: <DatabasePage /> },
      { path: 'apis', element: <APIsPage /> },
      { path: 'audit', element: <AuditPage /> },
      { path: 'security', element: <SecurityPage /> },
      { path: 'flags', element: <FlagsPage /> },
      { path: 'infrastructure', element: <InfrastructurePage /> },
      { path: 'environment', element: <EnvironmentPage /> },
      { path: 'testing', element: <TestingPage /> },
      { path: 'dao', element: <DAOPage /> },
      { path: 'releases', element: <ReleasesPage /> },
      { path: 'jobs', element: <JobsPage /> },
      { path: 'registry', element: <RegistryPage /> },
      { path: 'about', element: <AboutPage /> },
      {
        path: 'founder',
        children: [
          { index: true, element: <StrategicPage /> },
          { path: 'strategic', element: <StrategicPage /> },
          { path: 'operations', element: <OperationsPage /> },
          { path: 'emergency', element: <EmergencyPage /> },
        ],
      },
    ],
  },
];
