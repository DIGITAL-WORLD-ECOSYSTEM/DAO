import { constructMetadata } from 'src/lib/seo/metadata';
import { PolicyView } from 'src/sections/legal/_view';

// ----------------------------------------------------------------------

export const metadata = constructMetadata({
  title: 'Whitepaper | ASPPIBRA DAO',
  description: 'A tese técnica por trás da tokenização de ativos reais e governança descentralizada da ASPPIBRA.',
});

const CONTENT = `
  <h2>1. Resumo Executivo</h2>
  <p>Este documento descreve a arquitetura técnica da ASPPIBRA DAO, focada na resolução do gap de crédito para o agronegócio através da tokenização RWA.</p>
  
  <h2>2. Arquitetura On-Chain</h2>
  <p>Utilizamos a rede Arbitrum para escalabilidade, com contratos inteligentes auditados que garantem a custódia e fracionamento dos ativos tokenizados.</p>
  
  <h2>3. Mecanismo de Estabilidade</h2>
  <p>A tese de estabilidade da DAO baseia-se no colateral físico dos ativos reais, mitigando a volatilidade comum em ativos puramente digitais.</p>
`;

export default function WhitepaperPage() {
  return (
    <PolicyView 
      title="Whitepaper" 
      subtitle="Fundamentos técnicos e econômicos da Revolução RWA." 
      content={CONTENT} 
    />
  );
}
