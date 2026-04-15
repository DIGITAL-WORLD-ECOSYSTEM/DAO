// src/app/post/page.tsx

import { getPosts } from 'src/actions/blog-ssr';

import { Economia } from 'src/sections/blog/item/economia';
import { Tecnologia } from 'src/sections/blog/item/tecnologia';
import { Geopolitica } from 'src/sections/blog/item/geopolitica';
import { MeioAmbiente } from 'src/sections/blog/item/meio-ambiente';
import { PostListHomeView } from 'src/sections/blog/view/post-list-home-view';

// ✅ CORREÇÃO DO ERRO DA VERCEL: Força a renderização dinâmica no servidor (SSR)
// Isso resolve o erro "Route /post couldn't be rendered statically"
export const dynamic = 'force-dynamic';

export const runtime = 'nodejs';

export const metadata = {
  title: 'Digital World: Monitorização e Notícias Cripto',
  description:
    'Acompanhe as principais comunidades, vídeos e tendências do mercado blockchain em tempo real.',
};

export default async function PostListPage() {
  const data = await getPosts();

  // 1. Extração segura
  const rawPosts = Array.isArray(data) ? data : data?.posts || [];

  // 2. 🛡️ SANITIZAÇÃO
  // Garante que apenas dados puros sejam passados para os Client Components
  const posts = JSON.parse(JSON.stringify(rawPosts));

  return (
    <PostListHomeView
      posts={posts}
      economiaSection={<Economia />}
      tecnologiaSection={<Tecnologia />}
      meioAmbienteSection={<MeioAmbiente />}
      geopoliticaSection={<Geopolitica />}
    />
  );
}
