import { constructMetadata } from 'src/lib/seo/metadata';
import { EcosystemView } from 'src/sections/ecosystem/_view';

// ----------------------------------------------------------------------

export const metadata = constructMetadata({
  title: 'Ecossistema | ASPPIBRA DAO',
  description: 'Conheça a infraestrutura que conecta ativos reais do agronegócio à liquidez global da Web3.',
});

export default function EcosystemPage() {
  return <EcosystemView />;
}
