import { CONFIG } from 'src/global-config';

import { AnalyticsUserMembersView } from 'src/sections/overview/analytics/view';

const metadata = { title: `User Hub: Membros | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>
      <AnalyticsUserMembersView />
    </>
  );
}
