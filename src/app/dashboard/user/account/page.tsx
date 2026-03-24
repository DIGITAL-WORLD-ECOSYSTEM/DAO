import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { AccountGeneralView } from 'src/sections/account/view';

// ----------------------------------------------------------------------

// ✅ CORREÇÃO FINAL:
// Mudamos para 'nodejs' para garantir o limite de 50MB.
// Isso finaliza a correção de toda a pasta 'account'.
export const runtime = 'nodejs';

export const metadata: Metadata = {
  title: `Account general settings | Dashboard - ${CONFIG.appName}`,
};

export default function Page() {
  return <AccountGeneralView />;
}