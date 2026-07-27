import { CONFIG } from 'src/global-config';

import { AnalyticsContractView } from 'src/sections/overview/analytics/view';

// ----------------------------------------------------------------------

const metadata = { title: `Analytics: Gestão de Contrato | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title> {metadata.title}</title>

      <AnalyticsContractView />
    </>
  );
}
