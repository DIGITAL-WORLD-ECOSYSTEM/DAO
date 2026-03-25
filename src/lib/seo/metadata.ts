import type { Metadata } from 'next';
import { sharedOpenGraph } from './openGraph';

interface MetadataProps {
  title: string;
  description: string;
  image?: string;
  noIndex?: boolean;
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://asppibra-dao.org';

export function constructMetadata({
  title,
  description,
  image = '/logo/logo-512x512.png',
  noIndex = false,
}: MetadataProps): Metadata {
  const customTitle = `${title} | ASPPIBRA-DAO`;

  return {
    title: customTitle,
    description,
    openGraph: {
      ...sharedOpenGraph,
      title: customTitle,
      description,
      images: [
        {
          url: image.startsWith('http') ? image : `${APP_URL}${image}`,
          width: 1200,
          height: 630,
          alt: customTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: customTitle,
      description,
      images: [image.startsWith('http') ? image : `${APP_URL}${image}`],
      creator: '@asppibradao',
    },
    metadataBase: new URL(APP_URL),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
