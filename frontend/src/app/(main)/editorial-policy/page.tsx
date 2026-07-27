import { constructMetadata } from 'src/lib/seo/metadata';
import { PolicyView } from 'src/sections/legal/_view';

// ----------------------------------------------------------------------

export const metadata = constructMetadata({
  title: 'Política Editorial | ASPPIBRA DAO',
  description: 'Conheça nossos padrões de integridade, transparência e governança de conteúdo.',
});

const CONTENT = `
  <h2>1. Nossa Missão Editorial</h2>
  <p>O compromisso da ASPPIBRA DAO é fornecer informações precisas, imparciais e baseadas em dados sobre o ecossistema RWA e governança digital.</p>
  
  <h2>2. Independência e Imparcialidade</h2>
  <p>Todo o nosso conteúdo é produzido de forma independente. Membros da DAO que contribuem com artigos devem declarar qualquer conflito de interesse on-chain.</p>
  
  <h2>3. Correção e Transparência</h2>
  <p>Erros identificados em nossos artigos são corrigidos imediatamente com uma nota de transparência indicando o que foi alterado.</p>
`;

export default function EditorialPolicyPage() {
  return (
    <PolicyView 
      title="Política Editorial" 
      subtitle="O padrão de excelência e transparência da ASPPIBRA DAO." 
      content={CONTENT} 
    />
  );
}
