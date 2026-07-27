import { CONFIG } from 'src/global-config';

import { JwtVerifyView } from 'src/auth/view/jwt';

// ----------------------------------------------------------------------

const metadata = { title: `Verify | Jwt - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <JwtVerifyView />
    </>
  );
}
