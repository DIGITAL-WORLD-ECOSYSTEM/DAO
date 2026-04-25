/**
 * Twitter/X Card Image Generator — ASPPIBRA Portal
 * Usa pré-fetch de ArrayBuffer para compatibilidade com Satori.
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

async function fetchImageAsDataUrl(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return null;
    const buffer = await res.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const ct = res.headers.get('content-type') || 'image/png';
    return `data:${ct};base64,${base64}`;
  } catch {
    return null;
  }
}

// ----------------------------------------------------------------------

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function Image({ params }: Props) {
  const { slug } = await params;

  const { post } = await getPost(slug);

  const title = post?.title || 'ASPPIBRA DAO';
  const category = post?.category || 'Portal';
  const coverUrl = post?.coverUrl || null;
  const primaryColor = '#65C4A8';
  const darkBg = '#040D1A';

  const coverDataUrl = coverUrl ? await fetchImageAsDataUrl(coverUrl) : null;

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        position: 'relative',
        fontFamily: 'sans-serif',
        backgroundColor: darkBg,
        overflow: 'hidden',
      }}
    >
      {/* Imagem de capa com overlay */}
      {coverDataUrl && (
        <div style={{ display: 'flex', position: 'absolute', inset: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverDataUrl}
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
              background: `linear-gradient(to right, ${darkBg} 50%, rgba(4,13,26,0) 100%)`,
              display: 'flex',
            }}
          />
        </div>
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
          }}
        >
          {category.toUpperCase()}
        </div>

        {/* Título */}
        <div
          style={{
            display: 'flex',
            fontSize: title.length > 60 ? 52 : 64,
            fontWeight: 900,
            color: '#FFFFFF',
            lineHeight: 1.1,
            letterSpacing: -1,
            flexWrap: 'wrap',
          }}
        >
          {title}
        </div>

        {/* Rodapé */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 16 }}>
          <div style={{ width: 40, height: 4, background: primaryColor, borderRadius: 2, display: 'flex' }} />
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
          display: 'flex',
        }}
      />
    </div>,
    { ...size }
  );
}
