import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { AccountChangePasswordView } from 'src/sections/account/view';

// ----------------------------------------------------------------------

// ✅ CORREÇÃO MANDATÓRIA:
// Forçamos o runtime 'nodejs' para ter acesso a 50MB de tamanho.
// Isso resolve o erro "Edge Function size limit" deste arquivo.
export const runtime = 'nodejs';

export const metadata: Metadata = {
  title: `Account change password settings | Dashboard - ${CONFIG.appName}`,
};

export default function Page() {
  return <AccountChangePasswordView />;
}