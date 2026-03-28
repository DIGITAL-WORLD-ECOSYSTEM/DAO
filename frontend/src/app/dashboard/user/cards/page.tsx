import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { UserCardsView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

// ✅ CORREÇÃO FINAL DA PASTA USER:
// Mudamos para 'nodejs' para garantir o limite de 50MB.
export const runtime = 'nodejs';

export const metadata: Metadata = { title: `User cards | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <UserCardsView />;
}