import { CONFIG } from 'src/global-config';

import { ApisView } from 'src/sections/devos/apis/view/apis-view';

// ----------------------------------------------------------------------

const metadata = { title: `DevOS: API & Secrets Vault - ${CONFIG.appName}` };

export default function ApisPage() {
  return (
    <>
      <title>{metadata.title}</title>

      <ApisView />
    </>
  );
}
