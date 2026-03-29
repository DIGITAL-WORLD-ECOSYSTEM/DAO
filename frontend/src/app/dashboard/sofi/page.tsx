import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { SoFiListView } from 'src/sections/sofi/view/post-list-view';

// ----------------------------------------------------------------------

// ✅ CORREÇÃO PREVENTIVA:
// Listas de blog são pesadas. Mudamos para 'nodejs' para usar o limite de 50MB.
export const runtime = 'nodejs';

export const metadata: Metadata = { title: `SoFi list | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <SoFiListView />;
}