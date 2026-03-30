import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { CenteredSignUpView } from 'src/auth/view';

// ----------------------------------------------------------------------

// ✅ CORREÇÃO MANDATÓRIA:
// Mudamos para 'nodejs' para garantir o limite de 50MB.
// Isso evita o erro "Edge Function size limit" durante o deploy na Vercel.
export const runtime = 'nodejs';

export const metadata: Metadata = { title: `Sign up | Layout centered - ${CONFIG.appName}` };

export default function Page() {
  return <CenteredSignUpView />;
}