
// ----------------------------------------------------------------------

type Props = {
  schema: Record<string, any>;
};

export function JsonLd({ schema }: Props) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// 🟢 AUXILIAR: Gera Esquema de Breadcrumbs
export function generateBreadcrumbs(links: { name: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": links.map((link, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": link.name,
      "item": link.href.startsWith('http') ? link.href : `https://www.asppibra.com${link.href}`,
    })),
  };
}

// 🟢 AUXILIAR: Gera Esquema de Artigo
export function generateArticleSchema(data: {
  title: string;
  description: string;
  coverUrl: string;
  createdAt: string;
  authorName: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": data.title,
    "description": data.description,
    "image": [data.coverUrl],
    "datePublished": data.createdAt,
    "author": [{ "@type": "Person", "name": data.authorName }],
    "publisher": {
      "@type": "Organization",
      "name": "ASPPIBRA",
      "logo": { "@type": "ImageObject", "url": "https://www.asppibra.com/logo/logo_single.png" }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://www.asppibra.com${data.url}`
    }
  };
}