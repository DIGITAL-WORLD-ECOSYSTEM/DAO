import { constructMetadata } from 'src/lib/seo/metadata';
import { AboutView } from 'src/sections/about/_view';

// ----------------------------------------------------------------------

export const metadata = constructMetadata({
  title: 'Sobre Nós | ASPPIBRA DAO',
  description:
    'Conheça a história, a missão e a equipe por trás da ASPPIBRA-DAO e do Ecossistema Mundo Digital.',
});

export default function AboutPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ASPPIBRA-DAO',
    url: 'https://asppibra-dao.org/about',
    logo: 'https://asppibra-dao.org/logo/logo-512x512.png',
    sameAs: [
      'https://twitter.com/asppibra',
      'https://linkedin.com/company/asppibra'
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AboutView />
    </>
  );
}
