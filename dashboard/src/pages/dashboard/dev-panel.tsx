import { CONFIG } from 'src/global-config';

import { DevPanelView } from 'src/sections/overview/dev-panel/view';

// ----------------------------------------------------------------------

const metadata = { title: `Painel Dev - ${CONFIG.appName}` };

export default function DevPanelPage() {
  return (
    <>
      <title>{metadata.title}</title>

      <DevPanelView />
    </>
  );
}
