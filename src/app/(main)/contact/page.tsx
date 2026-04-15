import { constructMetadata } from 'src/lib/seo/metadata';

import { ComingSoonView } from 'src/sections/coming-soon/view';

export const metadata = constructMetadata({
  title: 'Contato Institucional',
  description: 'Canais oficiais de contato, suporte e relações públicas da ASPPIBRA-DAO.',
});

export default function ContactPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contato',
    description: 'Página de contato oficial',
    mainEntity: {
      '@type': 'ContactPoint',
      email: 'contact@asppibra-dao.org',
      contactType: 'customer service',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ComingSoonView />
    </>
  );
}
