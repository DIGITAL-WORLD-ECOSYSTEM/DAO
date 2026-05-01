import { constructMetadata } from 'src/lib/seo/metadata';
import { PolicyView } from 'src/sections/legal/_view';

// ----------------------------------------------------------------------

export const metadata = constructMetadata({
  title: 'Metodologia | ASPPIBRA DAO',
  description: 'Conheça os métodos científicos e técnicos que fundamentam nossas análises de RWA.',
});

const CONTENT = `
  <h2>1. Análise de Ativos (RWA)</h2>
  <p>Nossa metodologia de avaliação de ativos reais combina sensoriamento remoto, análise de solo e modelos econométricos avançados.</p>
  
  <h2>2. Algoritmos de Governança</h2>
  <p>Utilizamos teoria dos jogos e mecanismos de consenso distribuído para modelar a eficiência da nossa DAO.</p>
  
  <h2>3. Transparência de Dados</h2>
  <p>Todos os modelos matemáticos utilizados em nossas projeções são documentados e disponibilizados em nosso GitHub para verificação pública.</p>
`;

export default function MethodologyPage() {
  return (
    <PolicyView 
      title="Metodologia" 
      subtitle="A base técnica e científica do ecossistema Mundo Digital." 
      content={CONTENT} 
    />
  );
}
