/**
 * OpenGraph Image Generator — ASPPIBRA Portal
 *
 * This version is designed for maximum robustness.
 * 1. Uses 'nodejs' runtime to allow Satori to handle remote images directly.
 * 2. Implements a global try/catch to prevent 500 errors.
 * 3. Uses a simple, clean layout with the cover image as a background.
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

export default async function Image({ params }: Props) {
  try {
    const resolvedParams = await params;
    const { slug } = resolvedParams;

    if (!slug) throw new Error('No slug provided');

    const { post } = await getPost(slug);

    const title = post?.title || 'ASPPIBRA - Notícias e Governança';
    const category = post?.category || 'Geral';
    const coverUrl = post?.coverUrl || CONFIG.assets.fallback.banner;
    const primaryColor = '#65C4A8';
    const darkBg = '#010409'; // Coerente com o tema dark da DAO

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: darkBg,
            position: 'relative',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Background Image Layer */}
          <div style={{ display: 'flex', position: 'absolute', inset: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverUrl}
              alt=""
              style={{
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

          {/* Content Layer */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              height: '100%',
              padding: '60px',
              justifyContent: 'center',
              position: 'relative',
              zIndex: 10,
            }}
          >
            {/* Tag */}
            <div
              style={{
                display: 'flex',
                backgroundColor: primaryColor,
                color: '#000',
                padding: '8px 20px',
                borderRadius: '6px',
                fontSize: '20px',
                fontWeight: 800,
                width: 'fit-content',
                marginBottom: '40px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              {category}
            </div>

            {/* Title */}
            <div
              style={{
                display: 'flex',
                fontSize: title.length > 50 ? '54px' : '72px',
                fontWeight: 900,
                color: '#fff',
                lineHeight: 1.1,
                maxWidth: '80%',
                marginBottom: '20px',
              }}
            >
              {title}
            </div>

            {/* Brand/URL */}
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '40px' }}>
              <div
                style={{
                  width: '4px',
                  height: '24px',
                  backgroundColor: primaryColor,
                  marginRight: '12px',
                }}
              />
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '24px', fontWeight: 500 }}>
                asppibra.com
              </div>
            </div>
          </div>

          {/* Decorative Edge */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '8px',
              backgroundColor: primaryColor,
            }}
          />
        </div>
      ),
      { ...size }
    );
  } catch (error) {
    console.error('[OG_IMAGE_ERROR]', error);
    // Fallback safe Image
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#010409',
            color: '#fff',
            fontSize: '64px',
            fontWeight: 900,
          }}
        >
          ASPPIBRA DAO
        </div>
      ),
      { ...size }
    );
  }
}

type Props = {
  params: Promise<{ slug: string }>;
};
