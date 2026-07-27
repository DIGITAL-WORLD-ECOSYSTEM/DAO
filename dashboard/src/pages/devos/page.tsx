import { CONFIG } from 'src/global-config';

import { DevPanelView } from 'src/sections/overview/dev-panel/view';

// ----------------------------------------------------------------------

const metadata = { title: `DevOS Command Center - ${CONFIG.appName}` };

export default function DevOSDashboardPage() {
  return (
    <>
      <title>{metadata.title}</title>
      <DevPanelView />
    </>
  );
}
