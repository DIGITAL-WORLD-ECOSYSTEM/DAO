import { constructMetadata } from 'src/lib/seo/metadata';
import { LegalView } from 'src/sections/legal/_view';

// ----------------------------------------------------------------------

export const metadata = constructMetadata({
  title: 'Política de Privacidade | ASPPIBRA DAO',
  description: 'Saiba como a ASPPIBRA DAO protege e gerencia seus dados e sua identidade digital.',
});

const CONTENT = `
  <h2>1. Coleta de Dados</h2>
  <p>Coletamos apenas as informações essenciais para a validação da sua identidade digital e participação na governança on-chain.</p>
  
  <h2>2. Segurança</h2>
  <p>Utilizamos criptografia de ponta a ponta e armazenamento descentralizado para garantir que seus dados soberanos permaneçam sob seu controle.</p>
  
  <h2>3. Compartilhamento</h2>
  <p>A ASPPIBRA DAO não comercializa dados de seus cidadãos com terceiros. O compartilhamento ocorre apenas para fins de auditoria on-chain quando autorizado pelo usuário.</p>
`;

export default function PrivacyPage() {
  return <LegalView title="Política de Privacidade" content={CONTENT} lastUpdated="30 de Abril de 2026" />;
}
