import { CONFIG } from 'src/global-config';

import { ContaView } from 'src/sections/banking/conta/view/conta-view';

const metadata = { title: `Conta | Banco - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>
      <ContaView />
    </>
  );
}
