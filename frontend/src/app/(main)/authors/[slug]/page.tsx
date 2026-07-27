import { constructMetadata } from 'src/lib/seo/metadata';

import { ComingSoonView } from 'src/sections/coming-soon/view';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return constructMetadata({
    title: `Perfil do Autor: ${slug.replace(/-/g, ' ').toUpperCase()}`,
    description: `Descubra as propostas on-chain, análises e publicações de ${slug.replace(/-/g, ' ')} no ecossistema Mundo Digital.`,
  });
}

export default function AuthorProfilePage() {
  return <ComingSoonView />;
}
