import { constructMetadata } from 'src/lib/seo/metadata';
import { ComingSoonView } from 'src/sections/coming-soon/view';

export const metadata = constructMetadata({
  title: 'Termos de Serviço',
  description: 'Termos e Condições oficiais para utilização da infraestrutura web e contratos inteligentes Mundo Digital.',
});

export default function TermsOfServicePage() {
  return <ComingSoonView />;
}
