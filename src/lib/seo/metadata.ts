import type { Metadata } from 'next';

import { sharedOpenGraph } from './openGraph';

interface MetadataProps {
  title: string;
  description: string;
  image?: string;
  noIndex?: boolean;
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.asppibra.com';

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
    alternates: {
      canonical: '/',
      languages: {
        'pt-BR': '/?lang=pt',
        'en-US': '/?lang=en',
        'es-ES': '/?lang=es',
        'fr-FR': '/?lang=fr',
        'ar-SA': '/?lang=ar',
        'zh-CN': '/?lang=cn',
        'ru-RU': '/?lang=ru',
      },
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}
