import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { CenteredUpdatePasswordView } from 'src/auth/view';

// ----------------------------------------------------------------------

// ✅ CORREÇÃO MANDATÓRIA:
// Mudamos para 'nodejs' para usar o limite de 50MB da Vercel.
export const runtime = 'nodejs';

export const metadata: Metadata = {
  title: `Update password | Layout centered - ${CONFIG.appName}`,
};

export default function Page() {
  return <CenteredUpdatePasswordView />;
}