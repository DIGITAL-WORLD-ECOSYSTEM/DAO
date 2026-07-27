import { CONFIG } from 'src/global-config';

import { AnalyticsPaymentsView } from 'src/sections/overview/analytics/view';

const metadata = { title: `Cobranças & Boletos | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>
      <AnalyticsPaymentsView />
    </>
  );
}
