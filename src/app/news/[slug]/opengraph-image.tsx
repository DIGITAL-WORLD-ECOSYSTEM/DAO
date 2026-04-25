/**
 * OpenGraph Image Generator — ASPPIBRA Portal
 * Gera a imagem social (1200x630) para cada post.
 *
 * NOTA TÉCNICA: O next/og (Satori) não suporta <img> com URL remota diretamente.
 * É necessário pré-buscar a imagem como ArrayBuffer e passá-la como base64 data URL.
 */

import { ImageResponse } from 'next/og';

import { CONFIG } from 'src/global-config';
import { getPost } from 'src/actions/blog-ssr';

// ----------------------------------------------------------------------

export const runtime = 'nodejs';
export const revalidate = 3600; // Cache de 1 hora

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// ----------------------------------------------------------------------

/** Busca uma imagem remota e converte para data URL base64 */
async function fetchImageAsDataUrl(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return null;
    const buffer = await res.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const contentType = res.headers.get('content-type') || 'image/png';
    return `data:${contentType};base64,${base64}`;
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

  // ✅ Busca dados reais do D1 via Worker API
  const { post } = await getPost(slug);

  const title = post?.title || 'ASPPIBRA DAO';
  const category = post?.category || 'Portal';
  const description = post?.description || 'Governança, Tokenização e Web3 no Brasil.';
  const coverUrl = post?.coverUrl || null;
  const siteDomain = CONFIG.siteUrl.replace('https://www.', '').replace('https://', '');
  const primaryColor = '#65C4A8';
  const darkBg = '#040D1A';

  // ✅ Pré-busca a capa como base64 (necessário para Satori)
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
      {/* LAYER: Imagem de Capa com Overlay */}
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
              opacity: 0.35,
            }}
          />
          {/* Gradiente para legibilidade */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(135deg, ${darkBg} 40%, rgba(4,13,26,0) 100%)`,
              display: 'flex',
            }}
          />
        </div>
      )}

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
          <div
            style={{
              width: 10,
              height: 48,
              backgroundColor: primaryColor,
              borderRadius: 4,
              display: 'flex',
            }}
          />
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

        {/* Título */}
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
            <div style={{ fontSize: 22, color: 'rgba(255,255,255,0.6)', lineHeight: 1.4, display: 'flex' }}>
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
