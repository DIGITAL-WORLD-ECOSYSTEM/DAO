import { kebabCase } from 'es-toolkit';
import { ImageResponse } from 'next/og';

import { _sofi } from 'src/_mock/_blog';
import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

export const runtime = 'nodejs';

export const size = { width: 1200, height: 630 };

export const contentType = 'image/png';

// ----------------------------------------------------------------------

type Props = {
  params: { title: string };
};

export default async function Image({ params }: Props) {
  // 🟢 CORREÇÃO: Busca usando kebabCase para bater com a URL
  const post = _sofi.find((p) => kebabCase(p.title) === params.title);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#000',
          backgroundImage: 'radial-gradient(circle at 25% 25%, #1a1a1a 0%, #000 100%)',
          padding: '80px',
          fontFamily: '"Inter"',
        }}
      >
        {/* Header: Nome da Associação e Cor Primária */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
          <div style={{ 
            width: '12px', 
            height: '40px', 
            backgroundColor: '#65C4A8', 
            marginRight: '20px',
            borderRadius: '4px' 
          }} />
          <span style={{ color: '#65C4A8', fontSize: '32px', fontWeight: 'bold', letterSpacing: '2px' }}>
            {CONFIG.appName}
          </span>
        </div>

        {/* Categoria do SoFi */}
        <div style={{ 
          color: '#fff', 
          fontSize: '24px', 
          opacity: 0.5, 
          textTransform: 'uppercase',
          marginBottom: '20px'
        }}>
          {post?.category || 'Notícias'}
        </div>

        {/* Título Dinâmico */}
        <div
          style={{
            fontSize: '72px',
            fontWeight: 'bold',
            color: 'white',
            lineHeight: 1.1,
            display: 'flex',
            flexWrap: 'wrap',
          }}
        >
          {post?.title || 'Conteúdo ASPPIBRA'}
        </div>

        {/* Footer: URL Oficial */}
        <div style={{ marginTop: 'auto', display: 'flex', opacity: 0.4, color: '#fff', fontSize: '28px' }}>
          {CONFIG.siteUrl.replace('https://', '')}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
