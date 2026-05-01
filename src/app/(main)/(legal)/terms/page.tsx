import { constructMetadata } from 'src/lib/seo/metadata';
import { LegalView } from 'src/sections/legal/_view';

// ----------------------------------------------------------------------

export const metadata = constructMetadata({
  title: 'Termos de Uso | ASPPIBRA DAO',
  description: 'Leia os termos e condições de uso da plataforma ASPPIBRA DAO.',
});

const CONTENT = `
  <h2>1. Aceitação dos Termos</h2>
  <p>Ao acessar e utilizar a plataforma ASPPIBRA DAO, você concorda em cumprir estes Termos de Uso e todas as leis aplicáveis à governança digital e ativos reais.</p>
  
  <h2>2. Elegibilidade</h2>
  <p>Para participar da governança e interagir com tokens RWA, o usuário deve possuir uma identidade soberana válida (DID) e cumprir os requisitos de compliance da organização.</p>
  
  <h2>3. Propriedade Intelectual</h2>
  <p>Todo o conteúdo, marcas e tecnologias presentes nesta plataforma são de propriedade da ASPPIBRA DAO ou de seus parceiros licenciados.</p>
`;

export default function TermsPage() {
  return <LegalView title="Termos de Uso" content={CONTENT} lastUpdated="30 de Abril de 2026" />;
}
