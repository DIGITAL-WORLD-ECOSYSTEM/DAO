import { CONFIG } from 'src/global-config';

import { AnalyticsTreasuryView } from 'src/sections/overview/analytics/view';

const metadata = { title: `Tesouraria | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>
      <AnalyticsTreasuryView />
    </>
  );
}
