import type { RouteObject } from 'react-router';

import { Outlet } from 'react-router';
import { lazy, Suspense } from 'react';

import { CONFIG } from 'src/global-config';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

import { AccountLayout } from 'src/sections/account/account-layout';

import { AuthGuard, RoleBasedGuard } from 'src/auth/guard';

import { usePathname } from '../hooks';

// Overview
const IndexPage = lazy(() => import('src/pages/dashboard'));
const OverviewEcommercePage = lazy(() => import('src/pages/dashboard/ecommerce'));
const OverviewBankingPage = lazy(() => import('src/pages/dashboard/banking'));
const OverviewBankingContaPage = lazy(() => import('src/pages/dashboard/banking/conta'));
const OverviewBankingRedePage = lazy(() => import('src/pages/dashboard/banking/rede'));
const OverviewBankingCartoesPage = lazy(() => import('src/pages/dashboard/banking/cartoes'));
const OverviewBankingReceberPage = lazy(() => import('src/pages/dashboard/banking/receber'));
const OverviewBankingTransferenciasPage = lazy(() => import('src/pages/dashboard/banking/transferencias'));
const OverviewBankingTransacoesPage = lazy(() => import('src/pages/dashboard/banking/transacoes'));
const OverviewFilePage = lazy(() => import('src/pages/dashboard/file'));
// Analytics
const AnalyticsGlobalPage = lazy(() => import('src/pages/dashboard/analytics/global'));
const AnalyticsContractPage = lazy(() => import('src/pages/dashboard/analytics/contract'));
const BankingFinancialHistoryPage = lazy(() => import('src/pages/dashboard/banking/financial-history'));
const BankingTreasuryPage = lazy(() => import('src/pages/dashboard/banking/treasury'));
const BankingPaymentsPage = lazy(() => import('src/pages/dashboard/banking/payments'));
const AnalyticsUserListPage = lazy(() => import('src/pages/dashboard/analytics/user-list'));
const AnalyticsUserMembersPage = lazy(() => import('src/pages/dashboard/analytics/user-members'));
// Product
const ProductDetailsPage = lazy(() => import('src/pages/dashboard/product/details'));
const ProductListPage = lazy(() => import('src/pages/dashboard/product/list'));
const ProductCreatePage = lazy(() => import('src/pages/dashboard/product/new'));
const ProductEditPage = lazy(() => import('src/pages/dashboard/product/edit'));
// Order
const OrderListPage = lazy(() => import('src/pages/dashboard/order/list'));
const OrderDetailsPage = lazy(() => import('src/pages/dashboard/order/details'));
// Invoice
const InvoiceListPage = lazy(() => import('src/pages/dashboard/invoice/list'));
const InvoiceDetailsPage = lazy(() => import('src/pages/dashboard/invoice/details'));
const InvoiceCreatePage = lazy(() => import('src/pages/dashboard/invoice/new'));
const InvoiceEditPage = lazy(() => import('src/pages/dashboard/invoice/edit'));
// User
const UserProfilePage = lazy(() => import('src/pages/dashboard/user/profile'));
const UserCreatePage = lazy(() => import('src/pages/dashboard/user/new'));
// Account
const AccountGeneralPage = lazy(() => import('src/pages/dashboard/user/account/general'));
const AccountBillingPage = lazy(() => import('src/pages/dashboard/user/account/billing'));
const AccountSocialsPage = lazy(() => import('src/pages/dashboard/user/account/socials'));
const AccountNotificationsPage = lazy(
  () => import('src/pages/dashboard/user/account/notifications')
);
const AccountChangePasswordPage = lazy(
  () => import('src/pages/dashboard/user/account/change-password')
);
const AccountTwoFAPage = lazy(() => import('src/pages/dashboard/user/account/2fa'));
// Blog
const BlogPostsPage = lazy(() => import('src/pages/dashboard/post/list'));
const BlogPostPage = lazy(() => import('src/pages/dashboard/post/details'));
const BlogNewPostPage = lazy(() => import('src/pages/dashboard/post/new'));
const BlogEditPostPage = lazy(() => import('src/pages/dashboard/post/edit'));
// File manager
const FileManagerPage = lazy(() => import('src/pages/dashboard/file-manager'));
// App
const ChatPage = lazy(() => import('src/pages/dashboard/chat'));
const MailPage = lazy(() => import('src/pages/dashboard/mail'));
const CalendarPage = lazy(() => import('src/pages/dashboard/calendar'));

// Communication (Notifications)
const CommNotificationsPage = lazy(() => import('src/pages/dashboard/communication/notifications'));
const CommEmailPage = lazy(() => import('src/pages/dashboard/communication/email'));
const CommWhatsAppPage = lazy(() => import('src/pages/dashboard/communication/whatsapp'));
const CommSmsPage = lazy(() => import('src/pages/dashboard/communication/sms'));
const CommSocialPage = lazy(() => import('src/pages/dashboard/communication/social'));
const CommChatPage = lazy(() => import('src/pages/dashboard/communication/chat'));
const CommSettingsPage = lazy(() => import('src/pages/dashboard/communication/settings'));


// ----------------------------------------------------------------------

function SuspenseOutlet() {
  const pathname = usePathname();
  return (
    <Suspense key={pathname} fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  );
}

const dashboardLayout = () => (
  <DashboardLayout>
    <SuspenseOutlet />
  </DashboardLayout>
);

const accountLayout = () => (
  <AccountLayout>
    <SuspenseOutlet />
  </AccountLayout>
);

const AdminGuardOutlet = () => (
  <RoleBasedGuard allowedRoles={['admin', 'dev']} hasContent>
    <SuspenseOutlet />
  </RoleBasedGuard>
);

export const dashboardRoutes: RouteObject[] = [
  {
    element: CONFIG.auth.skip ? dashboardLayout() : <AuthGuard>{dashboardLayout()}</AuthGuard>,
    children: [
      { index: true, element: <IndexPage /> },
      { 
        path: 'ecommerce', 
        element: (
          <RoleBasedGuard allowedRoles={['admin', 'dev']} hasContent>
            <OverviewEcommercePage />
          </RoleBasedGuard>
        ) 
      },
      {
        path: 'analytics',
        element: <AdminGuardOutlet />,
        children: [
          { index: true, element: <AnalyticsGlobalPage /> },
          { path: 'global', element: <AnalyticsGlobalPage /> },
          { path: 'contract', element: <AnalyticsContractPage /> },

          {
            path: 'user',
            children: [
              { path: 'list', element: <AnalyticsUserListPage /> },
              { path: 'members', element: <AnalyticsUserMembersPage /> },
            ],
          },
        ],
      },
      {
        path: 'banking',
        children: [
          { element: <OverviewBankingPage />, index: true },
          { path: 'conta', element: <OverviewBankingContaPage /> },
          { path: 'rede', element: <OverviewBankingRedePage /> },
          { path: 'cartoes', element: <OverviewBankingCartoesPage /> },
          { path: 'receber', element: <OverviewBankingReceberPage /> },
          { path: 'transferencias', element: <OverviewBankingTransferenciasPage /> },
          { path: 'transacoes', element: <OverviewBankingTransacoesPage /> },
          { 
            path: 'financial-history', 
            element: (
              <RoleBasedGuard allowedRoles={['admin', 'dev']} hasContent>
                <BankingFinancialHistoryPage />
              </RoleBasedGuard>
            ) 
          },
          { 
            path: 'treasury', 
            element: (
              <RoleBasedGuard allowedRoles={['admin', 'dev']} hasContent>
                <BankingTreasuryPage />
              </RoleBasedGuard>
            ) 
          },
          { 
            path: 'payments', 
            element: (
              <RoleBasedGuard allowedRoles={['admin', 'dev']} hasContent>
                <BankingPaymentsPage />
              </RoleBasedGuard>
            ) 
          },
        ]
      },
      { path: 'file', element: <OverviewFilePage /> },
      {
        path: 'user',
        children: [
          { index: true, element: <UserProfilePage /> },
          { path: 'profile', element: <UserProfilePage /> },
          { path: 'new', element: <UserCreatePage /> },
          {
            path: 'account',
            element: accountLayout(),
            children: [
              { index: true, element: <AccountGeneralPage /> },
              { path: 'billing', element: <AccountBillingPage /> },
              { path: 'notifications', element: <AccountNotificationsPage /> },
              { path: 'socials', element: <AccountSocialsPage /> },
              { path: 'change-password', element: <AccountChangePasswordPage /> },
              { path: '2fa', element: <AccountTwoFAPage /> },
            ],
          },
        ],
      },
      {
        path: 'product',
        element: <AdminGuardOutlet />,
        children: [
          { index: true, element: <ProductListPage /> },
          { path: 'list', element: <ProductListPage /> },
          { path: ':id', element: <ProductDetailsPage /> },
          { path: 'new', element: <ProductCreatePage /> },
          { path: ':id/edit', element: <ProductEditPage /> },
        ],
      },
      {
        path: 'order',
        element: <AdminGuardOutlet />,
        children: [
          { index: true, element: <OrderListPage /> },
          { path: 'list', element: <OrderListPage /> },
          { path: ':id', element: <OrderDetailsPage /> },
        ],
      },
      {
        path: 'invoice',
        element: <AdminGuardOutlet />,
        children: [
          { index: true, element: <InvoiceListPage /> },
          { path: 'list', element: <InvoiceListPage /> },
          { path: ':id', element: <InvoiceDetailsPage /> },
          { path: ':id/edit', element: <InvoiceEditPage /> },
          { path: 'new', element: <InvoiceCreatePage /> },
        ],
      },
      {
        path: 'post',
        element: <AdminGuardOutlet />,
        children: [
          { index: true, element: <BlogPostsPage /> },
          { path: 'list', element: <BlogPostsPage /> },
          { path: ':title', element: <BlogPostPage /> },
          { path: ':title/edit', element: <BlogEditPostPage /> },
          { path: 'new', element: <BlogNewPostPage /> },
        ],
      },
      {
        path: 'file-manager',
        children: [
          { index: true, element: <FileManagerPage /> },
          { path: 'image', element: <FileManagerPage /> },
          { path: 'video', element: <FileManagerPage /> },
          { path: 'document', element: <FileManagerPage /> },
        ],
      },
      { 
        path: 'calendar', 
        element: (
          <RoleBasedGuard allowedRoles={['admin', 'dev']} hasContent>
            <CalendarPage />
          </RoleBasedGuard>
        ) 
      },
      {
        path: 'communication',
        children: [
          { index: true, element: <CommNotificationsPage /> },
          { path: 'notifications', element: <CommNotificationsPage /> },
          { 
            path: 'email', 
            element: (
              <RoleBasedGuard allowedRoles={['admin', 'dev']} hasContent>
                <MailPage />
              </RoleBasedGuard>
            )
          },
          { 
            path: 'whatsapp', 
            element: (
              <RoleBasedGuard allowedRoles={['admin', 'dev']} hasContent>
                <CommWhatsAppPage />
              </RoleBasedGuard>
            )
          },
          { 
            path: 'sms', 
            element: (
              <RoleBasedGuard allowedRoles={['admin', 'dev']} hasContent>
                <CommSmsPage />
              </RoleBasedGuard>
            )
          },
          { 
            path: 'social', 
            element: (
              <RoleBasedGuard allowedRoles={['admin', 'dev']} hasContent>
                <CommSocialPage />
              </RoleBasedGuard>
            )
          },
          { path: 'chat', element: <CommChatPage /> },
          { path: 'settings', element: <CommSettingsPage /> },
        ]
      },
    ],
  },
];
