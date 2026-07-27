import { CONFIG } from 'src/global-config';

import { AccountTwoFAView } from 'src/sections/account/view/account-2fa-view';

// ----------------------------------------------------------------------

const metadata = { title: `Autenticador 2FA | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <AccountTwoFAView />
    </>
  );
}
