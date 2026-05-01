import { constructMetadata } from 'src/lib/seo/metadata';
import { ContactView } from 'src/sections/contact/_view';

// ----------------------------------------------------------------------

export const metadata = constructMetadata({
  title: 'Contato | ASPPIBRA DAO',
  description:
    'Fale com a nossa equipe de governança e suporte técnico. Estamos prontos para ajudar produtores e investidores RWA.',
});

export default function ContactPage() {
  return <ContactView />;
}
