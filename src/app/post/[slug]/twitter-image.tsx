/**
 * OpenGraph Image Generator — ASPPIBRA Portal
 *
 * Optimization: Uses Vercel Image Optimizer (/_next/image) to compress
 * large cover images before embedding them into the OG image.
 * This prevents timeouts and 500 errors caused by multi-megabyte source images.
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

/**
 * Fetches an image and converts it to a base64 data URL.
 * Uses a race to implement a timeout.
 */
async function fetchImageAsDataUrl(url: string, timeoutMs: number = 8000): Promise<string | null> {
  const fetchPromise = (async () => {
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) return null;
      const buffer = await res.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');
      const contentType = res.headers.get('content-type') || 'image/png';
      return `data:${contentType};base64,${base64}`;
    } catch (error) {
      console.error('[OG] Fetch error:', error);
      return null;
    }
  })();

  const timeoutPromise = new Promise<null>((resolve) => {
    setTimeout(() => resolve(null), timeoutMs);
  });

  return Promise.race([fetchPromise, timeoutPromise]);
}

/**
 * Strategy:
 * 1. Try fetching via Vercel Image Optimizer (optimized to 1200px width).
 * 2. Fallback to original URL if optimized fetch fails or hangs.
 */
async function getOptimizedCover(originalUrl: string): Promise<string | null> {
  const optimizedUrl = `${CONFIG.siteUrl}/_next/image?url=${encodeURIComponent(originalUrl)}&w=1200&q=80`;

  // Attempt 1: Optimized
  const optimized = await fetchImageAsDataUrl(optimizedUrl, 6000);
  if (optimized) return optimized;

  // Attempt 2: Original (fallback)
  return fetchImageAsDataUrl(originalUrl, 8000);
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

  const coverDataUrl = coverUrl ? await getOptimizedCover(coverUrl) : null;

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
      {/* Background Cover Image with Overlay */}
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

      {/* Main Content Layout */}
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
        {/* Top Branding Section */}
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

        {/* Center Text Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: '75%' }}>
          <div
            style={{
              fontSize: title.length > 50 ? 52 : 66,
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
              {description.length > 140 ? `${description.slice(0, 140)}...` : description}
            </div>
          )}
        </div>

        {/* Bottom Footer Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 48, height: 3, backgroundColor: primaryColor, borderRadius: 2, display: 'flex' }} />
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 24, letterSpacing: 1 }}>
            {siteDomain}
          </span>
        </div>
      </div>

      {/* Decorative Accent Border */}
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
