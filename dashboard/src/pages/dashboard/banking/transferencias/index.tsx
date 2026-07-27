import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

const metadata = { title: `Transferências | Banco - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>
      <div style={{ padding: 40, textAlign: 'center' }}>
        <h2>Módulo de Pagamentos e Transferências (Outbound)</h2>
        <p>Placeholder para Envio de PIX, TED, SWIFT e Web3 Transfers.</p>
      </div>
    </>
  );
}
