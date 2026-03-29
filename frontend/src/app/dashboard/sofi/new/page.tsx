import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { SoFiCreateView } from 'src/sections/sofi/management/post-create-view';

// ----------------------------------------------------------------------

// ✅ CORREÇÃO CRUCIAL:
// Editores de texto são muito pesados (>1MB).
// Mudamos para 'nodejs' para garantir o limite de 50MB.
export const runtime = 'nodejs';

export const metadata: Metadata = { title: `Create a new post | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <SoFiCreateView />;
}