import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { RegisterGenesisView } from 'src/identity/view/register-genesis-view';

// ----------------------------------------------------------------------

export const runtime = 'nodejs';

export const metadata: Metadata = { title: `Genesis do Cidadão - ${CONFIG.appName}` };

export default function Page() {
  return <RegisterGenesisView />;
}