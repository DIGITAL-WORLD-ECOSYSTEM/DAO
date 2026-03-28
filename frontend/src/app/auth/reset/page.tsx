import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { CenteredResetPasswordView } from 'src/auth/view';

// ----------------------------------------------------------------------

// ✅ CORREÇÃO MANDATÓRIA:
// Definimos 'nodejs' para usar o limite de 50MB da Vercel (em vez de 1MB do Edge).
export const runtime = 'nodejs';

export const metadata: Metadata = {
  title: `Reset password | Layout centered - ${CONFIG.appName}`,
};

export default function Page() {
  return <CenteredResetPasswordView />;
}