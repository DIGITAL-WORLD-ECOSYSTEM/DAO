import { constructMetadata } from 'src/lib/seo/metadata';
import { LegalView } from 'src/sections/legal/_view';

// ----------------------------------------------------------------------

export const metadata = constructMetadata({
  title: 'Política de Cookies | ASPPIBRA DAO',
  description: 'Entenda como utilizamos cookies para melhorar sua experiência no ecossistema ASPPIBRA.',
});

const CONTENT = `
  <h2>1. O que são Cookies?</h2>
  <p>Cookies são pequenos arquivos de texto usados para reconhecer sessões e manter preferências de navegação e idioma.</p>
  
  <h2>2. Cookies Essenciais</h2>
  <p>Estes cookies são necessários para o funcionamento básico da plataforma e para a segurança da sua carteira Web3 conectada.</p>
  
  <h2>3. Controle de Cookies</h2>
  <p>Você pode gerenciar ou desativar cookies através das configurações do seu navegador, mas isso pode impactar a experiência de uso da DAO.</p>
`;

export default function CookiesPage() {
  return <LegalView title="Política de Cookies" content={CONTENT} lastUpdated="30 de Abril de 2026" />;
}
