import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { UserProfileView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

// ✅ CORREÇÃO FINAL:
// Perfis de usuário são complexos e pesados.
// Mudamos para 'nodejs' para garantir o limite de 50MB.
export const runtime = 'nodejs';

export const metadata: Metadata = { title: `User profile | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <UserProfileView />;
}