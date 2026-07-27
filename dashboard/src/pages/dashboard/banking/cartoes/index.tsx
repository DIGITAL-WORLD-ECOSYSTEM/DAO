import { CONFIG } from 'src/global-config';

import { BankingCartoesView } from 'src/sections/overview/banking/view/banking-cartoes-view';

// ----------------------------------------------------------------------

const metadata = { title: `Cartões | Banco - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <BankingCartoesView />
    </>
  );
}
