import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { AccountNotificationsView } from 'src/sections/account/view';

// ----------------------------------------------------------------------

// ✅ CORREÇÃO PREVENTIVA:
// Definimos 'nodejs' para garantir que esta página use o limite de 50MB.
// Isso evita que o deploy falhe nesta etapa.
export const runtime = 'nodejs';

export const metadata: Metadata = {
  title: `Account notifications settings | Dashboard - ${CONFIG.appName}`,
};

export default function Page() {
  return <AccountNotificationsView />;
}