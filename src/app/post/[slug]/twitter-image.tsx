/**
 * Twitter/X Card Image Generator — ASPPIBRA Portal
 * Gera a imagem do card do Twitter (1200x630) com dados reais do D1.
 */

import { ImageResponse } from 'next/og';

import { CONFIG } from 'src/global-config';
import { getPost } from 'src/actions/blog-ssr';

// ----------------------------------------------------------------------

export const runtime = 'nodejs';
export const revalidate = 3600;

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// ----------------------------------------------------------------------

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function Image({ params }: Props) {
  const { slug } = await params;

  // ✅ Busca na API real (D1)
  const { post } = await getPost(slug);

  const title = post?.title || 'ASPPIBRA DAO';
  const category = post?.category || 'Portal';
  const coverUrl = post?.coverUrl || null;
  const primaryColor = '#65C4A8';
  const darkBg = '#040D1A';

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        position: 'relative',
        fontFamily: '"Inter", sans-serif',
        backgroundColor: darkBg,
        overflow: 'hidden',
      }}
    >
      {/* Imagem de capa com overlay */}
      {coverUrl && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverUrl}
            alt=""
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.3,
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(to right, ${darkBg} 50%, transparent 100%)`,
            }}
          />
        </>
      )}

      {/* Conteúdo */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '70px',
          gap: 24,
          width: '65%',
          height: '100%',
        }}
      >
        {/* Badge de categoria */}
        <div
          style={{
            display: 'flex',
            width: 'fit-content',
            backgroundColor: primaryColor,
            color: '#000',
            padding: '8px 22px',
            borderRadius: 8,
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: 2,
            textTransform: 'uppercase',
          }}
        >
          {category}
        </div>

        {/* Título */}
        <div
          style={{
            fontSize: title.length > 60 ? 52 : 64,
            fontWeight: 900,
            color: '#FFFFFF',
            lineHeight: 1.1,
            letterSpacing: -1,
          }}
        >
          {title}
        </div>

        {/* Rodapé */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 16 }}>
          <div style={{ width: 40, height: 4, background: primaryColor, borderRadius: 2 }} />
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 26 }}>
            {CONFIG.siteUrl.replace('https://www.', '').replace('https://', '')}
          </span>
        </div>
      </div>

      {/* Borda esquerda */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 6,
          background: primaryColor,
        }}
      />
    </div>,
    { ...size }
  );
}
