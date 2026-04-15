import { ImageResponse } from 'next/og';

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export function OGImage({
  title,
  description = 'A ponte definitiva entre RWA e DeFi.',
}: {
  title: string;
  description?: string;
}) {
  return new ImageResponse(
    <div
      style={{
        background: 'linear-gradient(to bottom right, #0a0a0a, #1a1a1a)',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        padding: '80px',
        fontFamily: 'sans-serif',
        border: '12px solid #00f2fe',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1
          style={{
            fontSize: '72px',
            fontWeight: '900',
            textAlign: 'center',
            marginBottom: '24px',
            color: '#ffffff',
            letterSpacing: '-2px',
            lineHeight: 1.1,
          }}
        >
          {title}
        </h1>
        <p
          style={{
            fontSize: '36px',
            color: '#a1a1aa',
            textAlign: 'center',
            maxWidth: '900px',
            lineHeight: 1.4,
          }}
        >
          {description}
        </p>
        <div
          style={{
            position: 'absolute',
            bottom: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            color: '#00f2fe',
            fontWeight: 'bold',
            letterSpacing: '4px',
          }}
        >
          ASPPIBRA-DAO
        </div>
      </div>
    </div>,
    {
      ...size,
    }
  );
}
