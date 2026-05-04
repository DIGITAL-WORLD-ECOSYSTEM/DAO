import { getPosts } from 'src/actions/blog-queries';

import { BLOG_MOCK, COMMUNITIES_MOCK, VIDEOS_MOCK } from 'src/_mock/blog.mock';
import { BlogHomeView } from 'src/sections/blog/_view/public/BlogHomeView';

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
    <BlogHomeView 
        posts={posts} 
        communities={COMMUNITIES_MOCK} 
        videos={VIDEOS_MOCK} 
    />
  );
}
