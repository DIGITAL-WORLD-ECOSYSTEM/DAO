import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { AccountSocialsView } from 'src/sections/account/view';

// ----------------------------------------------------------------------

// ✅ CORREÇÃO PREVENTIVA:
// Definimos 'nodejs' para garantir o limite de 50MB.
export const runtime = 'nodejs';

export const metadata: Metadata = {
  title: `Account socials settings | Dashboard - ${CONFIG.appName}`,
};

export default function Page() {
  return <AccountSocialsView />;
}