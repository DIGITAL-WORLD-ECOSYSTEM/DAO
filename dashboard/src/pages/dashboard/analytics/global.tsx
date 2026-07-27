import { CONFIG } from 'src/global-config';

import { AnalyticsGlobalView } from 'src/sections/overview/analytics/view';

// ----------------------------------------------------------------------

const metadata = { title: `Analytics: Global | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title> {metadata.title}</title>

      <AnalyticsGlobalView />
    </>
  );
}
