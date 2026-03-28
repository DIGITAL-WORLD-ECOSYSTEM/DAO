import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { UserCreateView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

// ✅ CORREÇÃO MANDATÓRIA:
// Definimos 'nodejs' para garantir o limite de 50MB e evitar o erro "Edge Function size limit".
export const runtime = 'nodejs';

export const metadata: Metadata = { title: `Create a new user | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <UserCreateView />;
}