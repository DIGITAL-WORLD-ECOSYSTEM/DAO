// src/app/sofi/page.tsx

import { getSoFis } from 'src/actions/blog-ssr';

import { Economia } from 'src/sections/sofi/item/economia';
import { Tecnologia } from 'src/sections/sofi/item/tecnologia';
import { Geopolitica } from 'src/sections/sofi/item/geopolitica';
import { MeioAmbiente } from 'src/sections/sofi/item/meio-ambiente';
import { SoFiListHomeView } from 'src/sections/sofi/view/post-list-home-view';

// ✅ CORREÇÃO DO ERRO DA VERCEL: Força a renderização dinâmica no servidor (SSR)
// Isso resolve o erro "Route /post couldn't be rendered statically"
export const dynamic = 'force-dynamic';

export const runtime = 'nodejs';

export const metadata = {
  title: 'Digital World: Monitorização e Notícias Cripto',
  description: 'Acompanhe as principais comunidades, vídeos e tendências do mercado blockchain em tempo real.',
};

export default async function SoFiListPage() {
  const data = await getSoFis();

  // 1. Extração segura
  const rawSoFis = Array.isArray(data) ? data : (data?.sofi || []);

  // 2. 🛡️ SANITIZAÇÃO
  // Garante que apenas dados puros sejam passados para os Client Components
  const sofi = JSON.parse(JSON.stringify(rawSoFis));

  return (
    <SoFiListHomeView
      sofi={sofi}
      economiaSection={<Economia />}
      tecnologiaSection={<Tecnologia />}
      meioAmbienteSection={<MeioAmbiente />}
      geopoliticaSection={<Geopolitica />}
    />
  );
}