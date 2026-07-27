import { constructMetadata } from 'src/lib/seo/metadata';
import { PolicyView } from 'src/sections/legal/_view';

// ----------------------------------------------------------------------

export const metadata = constructMetadata({
  title: 'Verificação de Fatos | ASPPIBRA DAO',
  description: 'Saiba como validamos informações on-chain e dados do mundo real (RWA).',
});

const CONTENT = `
  <h2>1. Verificação On-Chain</h2>
  <p>Dados financeiros e de governança são validados diretamente através de exploradores de bloco e oráculos descentralizados.</p>
  
  <h2>2. Fontes Primárias</h2>
  <p>Priorizamos o uso de documentos oficiais, dados de satélite para o agronegócio e relatórios de auditoria assinados digitalmente.</p>
  
  <h2>3. Processo de Revisão</h2>
  <p>Cada artigo técnico passa por uma revisão de pares (Peer-Review) realizada por especialistas seniores da DAO antes da publicação.</p>
`;

export default function FactCheckingPage() {
  return (
    <PolicyView 
      title="Verificação de Fatos" 
      subtitle="Como garantimos a veracidade absoluta dos nossos dados." 
      content={CONTENT} 
    />
  );
}
