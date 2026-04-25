/**
 * OpenGraph Image Generator — ASPPIBRA Portal
 * Gera a imagem social (1200x630) para cada post.
 *
 * NOTA: Usa Promise.race() para timeout compatível com todas as versões Node.js no Vercel.
 * O coverUrl é pré-buscado como base64 para compatibilidade com Satori.
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

/** Timeout compatível com todas as versões do Node.js */
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T | null> {
  return Promise.race([
    promise,
    new Promise<null>((resolve) => setTimeout(() => resolve(null), ms)),
  ]);
}

/** Busca imagem remota como base64 data URL para uso no Satori */
async function fetchCoverAsDataUrl(url: string): Promise<string | null> {
  try {
    const result = await withTimeout(
      fetch(url, { cache: 'no-store' }).then(async (res) => {
        if (!res.ok) return null;
        const buffer = await res.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        const ct = res.headers.get('content-type') || 'image/png';
        return `data:${ct};base64,${base64}`;
      }),
      8000 // 8 segundos de timeout
    );
    return result;
  } catch (err) {
    console.error('[OG] Cover fetch failed:', err);
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
  const description = post?.description || 'Governança, Tokenização e Web3 no Brasil.';
  const coverUrl = post?.coverUrl || null;
  const siteDomain = CONFIG.siteUrl.replace('https://www.', '').replace('https://', '');
  const primaryColor = '#65C4A8';
  const darkBg = '#040D1A';

  // ✅ Pré-busca como base64 com timeout robusto
  const coverDataUrl = coverUrl ? await fetchCoverAsDataUrl(coverUrl) : null;

  console.log('[OG] slug:', slug, '| coverUrl:', coverUrl, '| hasData:', !!coverDataUrl);

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
      {/* LAYER: Imagem de Capa + Overlay */}
      {coverDataUrl ? (
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
              opacity: 0.45,
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(135deg, ${darkBg} 35%, rgba(4,13,26,0.5) 100%)`,
              display: 'flex',
            }}
          />
        </div>
      ) : null}

      {/* LAYER: Conteúdo */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px',
          width: '100%',
          height: '100%',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 10, height: 48, backgroundColor: primaryColor, borderRadius: 4, display: 'flex' }} />
          <span style={{ color: primaryColor, fontSize: 28, fontWeight: 800, letterSpacing: 3 }}>
            {CONFIG.appName}
          </span>
          <div
            style={{
              display: 'flex',
              backgroundColor: 'rgba(101,196,168,0.15)',
              border: `1px solid ${primaryColor}`,
              borderRadius: 8,
              padding: '6px 18px',
              color: primaryColor,
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: 2,
              marginLeft: 16,
            }}
          >
            {category.toUpperCase()}
          </div>
        </div>

        {/* Título + Descrição */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: '75%' }}>
          <div
            style={{
              fontSize: title.length > 60 ? 52 : 66,
              fontWeight: 900,
              color: '#FFFFFF',
              lineHeight: 1.1,
              letterSpacing: -1,
              display: 'flex',
              flexWrap: 'wrap',
            }}
          >
            {title}
          </div>
          {description && (
            <div style={{ fontSize: 22, color: 'rgba(255,255,255,0.65)', lineHeight: 1.4, display: 'flex' }}>
              {description.length > 120 ? `${description.slice(0, 120)}...` : description}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 48, height: 3, backgroundColor: primaryColor, borderRadius: 2, display: 'flex' }} />
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 24, letterSpacing: 1 }}>
            {siteDomain}
          </span>
        </div>
      </div>

      {/* Borda esquerda premium */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 6,
          background: `linear-gradient(180deg, ${primaryColor} 0%, rgba(101,196,168,0) 50%, ${primaryColor} 100%)`,
          display: 'flex',
        }}
      />
    </div>,
    { ...size }
  );
}
