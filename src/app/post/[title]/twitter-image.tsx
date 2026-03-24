import { kebabCase } from 'es-toolkit';
import { ImageResponse } from 'next/og';

import { _posts } from 'src/_mock/_blog';
import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

export const runtime = 'edge'; // Vital para o preview do Twitter carregar rápido

export const size = { width: 1200, height: 630 };

export const contentType = 'image/png';

// ----------------------------------------------------------------------

type Props = {
  params: { title: string };
};

export default async function Image({ params }: Props) {
  // 🟢 CORREÇÃO: Busca resiliente por slug
  const post = _posts.find((p) => kebabCase(p.title) === params.title);

  // Fonte Inter Bold para o padrão visual do X
  const fontData = await fetch(
    new URL('https://fonts.cdnfonts.com/s/15068/Inter-Bold.woff')
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#000',
          padding: '70px',
          justifyContent: 'center',
          fontFamily: '"Inter"',
        }}
      >
        {/* Badge de Categoria Estilo Twitter News */}
        <div style={{
          display: 'flex',
          backgroundColor: '#65C4A8',
          color: '#000',
          padding: '8px 20px',
          borderRadius: '8px',
          fontSize: '24px',
          fontWeight: 'bold',
          marginBottom: '30px',
          width: 'fit-content',
        }}>
          {post?.category || 'ASPPIBRA'}
        </div>

        {/* Título do Artigo */}
        <div
          style={{
            fontSize: '78px',
            fontWeight: 'bold',
            color: 'white',
            lineHeight: 1.1,
            letterSpacing: '-2px',
          }}
        >
          {post?.title || 'Conteúdo Oficial'}
        </div>

        {/* Rodapé com domínio e branding */}
        <div style={{ 
          display: 'flex', 
          marginTop: '60px', 
          alignItems: 'center', 
          opacity: 0.6 
        }}>
          <div style={{ width: 40, height: 4, background: '#65C4A8', marginRight: 15 }} />
          <span style={{ color: '#fff', fontSize: '32px' }}>
            {CONFIG.siteUrl.replace('https://www.', '')}
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: 'Inter', data: fontData, style: 'normal', weight: 700 }],
    }
  );
}
