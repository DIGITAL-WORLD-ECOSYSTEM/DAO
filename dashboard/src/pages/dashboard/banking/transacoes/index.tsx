import { CONFIG } from 'src/global-config';

import { BankingTransacoesView } from 'src/sections/overview/banking/view/banking-transacoes-view';

// ----------------------------------------------------------------------

const metadata = { title: `Transações (Ledger) | Banco - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <BankingTransacoesView />
    </>
  );
}
