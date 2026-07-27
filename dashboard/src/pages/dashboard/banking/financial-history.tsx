import { CONFIG } from 'src/global-config';

import { FinancialHistoryView } from 'src/sections/banking/financial-history/view';

// ----------------------------------------------------------------------

const metadata = { title: `Financeiro: Histórico Financeiro | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title> {metadata.title}</title>

      <FinancialHistoryView />
    </>
  );
}
