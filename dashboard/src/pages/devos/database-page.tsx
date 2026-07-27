import { CONFIG } from 'src/global-config';

import { DatabaseView } from 'src/sections/devos/database/view';

// ----------------------------------------------------------------------

export default function DatabasePage() {
  return (
    <>
      <title> {`Database D1 Studio - ${CONFIG.appName}`}</title>
      <DatabaseView />
    </>
  );
}
