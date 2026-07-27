import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

const metadata = { title: `Receber | Banco - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>
      <div style={{ padding: 40, textAlign: 'center' }}>
        <h2>Módulo de Recebimento (Inbound)</h2>
        <p>Placeholder para as opções de depósito: Pix Copia e Cola, Boleto e Inbound Wire.</p>
      </div>
    </>
  );
}
