import { constructMetadata } from 'src/lib/seo/metadata';

import { ComingSoonView } from 'src/sections/coming-soon/view';

export const metadata = constructMetadata({
  title: 'Sobre Nós',
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
