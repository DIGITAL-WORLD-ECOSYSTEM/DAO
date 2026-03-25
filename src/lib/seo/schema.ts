export function generateArticleSchema({
  title,
  url,
  image,
  datePublished,
  dateModified,
  authorName,
}: {
  title: string;
  url: string;
  image: string;
  datePublished: string;
  dateModified: string;
  authorName: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    image: [image],
    datePublished: datePublished,
    dateModified: dateModified,
    author: [{
      '@type': 'Person',
      name: authorName,
      url: `https://asppibra-dao.org/authors/${authorName.toLowerCase().replace(/ /g, '-')}`,
    }],
    publisher: {
      '@type': 'Organization',
      name: 'ASPPIBRA-DAO',
      logo: {
        '@type': 'ImageObject',
        url: 'https://asppibra-dao.org/logo/logo-512x512.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };
}
