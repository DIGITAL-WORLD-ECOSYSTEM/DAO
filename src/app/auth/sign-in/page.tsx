import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { CenteredSignInView } from 'src/auth/view';

// ----------------------------------------------------------------------

// ✅ CORREÇÃO MANDATÓRIA:
// Definimos explicitamente como 'nodejs' para acessar o limite de 50MB da Vercel.
// Sem isso, ele tenta rodar como Edge (limite 1MB) e falha.
export const runtime = 'nodejs';

export const metadata: Metadata = { title: `Sign in | Layout centered - ${CONFIG.appName}` };

export default function Page() {
  return <CenteredSignInView />;
}