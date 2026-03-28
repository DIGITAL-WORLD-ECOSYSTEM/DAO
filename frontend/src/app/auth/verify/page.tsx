import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { CenteredVerifyView } from 'src/auth/view';

// ----------------------------------------------------------------------

// ✅ CORREÇÃO MANDATÓRIA:
// Mudamos para 'nodejs' para usar o limite de 50MB da Vercel.
// Isso evita que a verificação de e-mail trave o deploy.
export const runtime = 'nodejs';

export const metadata: Metadata = { title: `Verify | Layout centered - ${CONFIG.appName}` };

export default function Page() {
  return <CenteredVerifyView />;
}