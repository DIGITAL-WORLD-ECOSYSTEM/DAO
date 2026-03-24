import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { UserListView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

// ✅ CORREÇÃO PREVENTIVA:
// Mudamos para 'nodejs' para garantir o limite de 50MB.
// Isso evita que o deploy falhe na listagem de usuários.
export const runtime = 'nodejs';

export const metadata: Metadata = { title: `User list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <UserListView />;
}