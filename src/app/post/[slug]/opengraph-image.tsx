/**
 * OpenGraph Image Generator — ASPPIBRA Portal
 * Gera a imagem social (1200x630) para cada post usando dados reais do D1.
 * Inclui: imagem de capa do R2, título, categoria e branding ASPPIBRA.
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

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function Image({ params }: Props) {
  const { slug } = await params;

  // ✅ Busca na API real (D1)
  const { post } = await getPost(slug);

  const title = post?.title || 'ASPPIBRA DAO';
  const category = post?.category || 'Portal';
  const description = post?.description || 'Governança, Tokenização e Web3 no Brasil.';
  const coverUrl = post?.coverUrl || null;
  const siteDomain = CONFIG.siteUrl.replace('https://www.', '').replace('https://', '');
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
      {/* LAYER: Imagem de Capa com Overlay */}
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
              opacity: 0.35,
            }}
          />
          {/* Gradiente para legibilidade */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(135deg, ${darkBg} 40%, transparent 100%)`,
            }}
          />
        </>
      )}

      {/* LAYER: Conteúdo Principal */}
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
        {/* Header: Logo + Categoria */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div
            style={{
              width: 10,
              height: 48,
              backgroundColor: primaryColor,
              borderRadius: 4,
            }}
          />
          <span style={{ color: primaryColor, fontSize: 28, fontWeight: 800, letterSpacing: 3 }}>
            {CONFIG.appName}
          </span>
          <div
            style={{
              backgroundColor: 'rgba(101, 196, 168, 0.15)',
              border: `1px solid ${primaryColor}`,
              borderRadius: 8,
              padding: '6px 18px',
              color: primaryColor,
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: 'uppercase',
              marginLeft: 16,
            }}
          >
            {category}
          </div>
        </div>

        {/* Corpo: Título */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            maxWidth: '75%',
          }}
        >
          <div
            style={{
              fontSize: title.length > 60 ? 54 : 68,
              fontWeight: 900,
              color: '#FFFFFF',
              lineHeight: 1.1,
              textShadow: `0 0 40px rgba(101, 196, 168, 0.3)`,
              letterSpacing: -1,
            }}
          >
            {title}
          </div>

          {description && (
            <div
              style={{
                fontSize: 24,
                color: 'rgba(255,255,255,0.6)',
                lineHeight: 1.4,
                display: '-webkit-box',
                overflow: 'hidden',
              }}
            >
              {description.slice(0, 120)}{description.length > 120 ? '...' : ''}
            </div>
          )}
        </div>

        {/* Footer: Domínio */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div style={{ width: 48, height: 3, backgroundColor: primaryColor, borderRadius: 2 }} />
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 24, letterSpacing: 1 }}>
            {siteDomain}
          </span>
        </div>
      </div>

      {/* BORDA PREMIUM: Linha esquerda */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 6,
          background: `linear-gradient(180deg, ${primaryColor} 0%, transparent 50%, ${primaryColor} 100%)`,
        }}
      />
    </div>,
    { ...size }
  );
}
