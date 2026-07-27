/**
 * Twitter/X Card Image Generator — ASPPIBRA Portal
 * Usa pré-fetch de ArrayBuffer para compatibilidade com Satori.
 */

import { ImageResponse } from 'next/og';

import { CONFIG } from 'src/global-config';
import { getPost } from 'src/actions/blog-queries';

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
    const ct = res.headers.get('content-type') || 'image/jpeg';
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
  const coverUrl = post?.coverUrl || CONFIG.assets.fallback.banner;
  const siteDomain = CONFIG.siteUrl.replace('https://www.', '').replace('https://', '');
  const primaryColor = '#65C4A8';
  const darkBg = '#010409';

  const coverDataUrl = coverUrl ? await fetchImageAsDataUrl(coverUrl) : null;

  return new ImageResponse(
    (
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
                opacity: 0.5,
              }}
            />
            {/* Gradient Overlay */}
            <div
              style={{
                display: 'flex',
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(to right, ${darkBg} 40%, transparent 100%)`,
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
            padding: '60px',
            width: '100%',
            height: '100%',
            zIndex: 10,
          }}
        >
          {/* Badge de categoria */}
          <div
            style={{
              display: 'flex',
              width: 'fit-content',
              backgroundColor: primaryColor,
              color: '#000',
              padding: '8px 20px',
              borderRadius: '6px',
              fontSize: '20px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '40px',
            }}
          >
            {category}
          </div>

          {/* Título */}
          <div
            style={{
              display: 'flex',
              fontSize: title.length > 50 ? '54px' : '72px',
              fontWeight: 900,
              color: '#FFFFFF',
              lineHeight: 1.1,
              maxWidth: '80%',
              marginBottom: '20px',
            }}
          >
            {title}
          </div>

          {/* Rodapé */}
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '40px' }}>
            <div
              style={{ width: '4px', height: '24px', backgroundColor: primaryColor, marginRight: '12px', display: 'flex' }}
            />
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '24px', fontWeight: 500 }}>
              asppibra.com
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
            width: 8,
            backgroundColor: primaryColor,
            display: 'flex',
          }}
        />
      </div>
    ),
    { ...size }
  );
}
