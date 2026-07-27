import { CONFIG } from 'src/global-config';

import { BankingRedeView } from 'src/sections/overview/banking/view/banking-rede-view';

// ----------------------------------------------------------------------

const metadata = { title: `Rede e Afiliados | Banco - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <BankingRedeView />
    </>
  );
}
