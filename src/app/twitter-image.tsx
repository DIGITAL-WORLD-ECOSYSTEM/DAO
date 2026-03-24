import { ImageResponse } from 'next/og';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

export const runtime = 'edge';

export const alt = `DEX World - ${CONFIG.appName} Governance & RWA`;

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

// ----------------------------------------------------------------------

export default async function Image() {
  // Busca de fonte otimizada para o Edge Runtime
  const fontData = await fetch(
    new URL('https://fonts.cdnfonts.com/s/15068/Inter-Bold.woff')
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0A192F', // Azul Marinho Tech (Consistência com Manifest)
          backgroundImage: 'radial-gradient(circle at 50% 50%, #00A15D 0%, transparent 80%)', // Brilho central Verde Agro
          color: '#ffffff',
          fontFamily: '"Inter"',
          padding: '60px',
        }}
      >
        {/* Badge de Governança - Sinaliza maturidade para investidores */}
        <div
          style={{
            fontSize: '20px',
            textTransform: 'uppercase',
            letterSpacing: '0.25em',
            backgroundColor: 'rgba(0, 161, 93, 0.15)',
            padding: '12px 32px',
            borderRadius: '100px',
            border: '1px solid #00A15D',
            marginBottom: '48px',
            color: '#00A15D',
            fontWeight: 'bold',
          }}
        >
          Governance Portal v1.0
        </div>

        {/* Nome da Marca com peso visual máximo */}
        <h1 
          style={{ 
            fontSize: '110px', 
            margin: 0, 
            fontWeight: 800, 
            letterSpacing: '-0.03em' 
          }}
        >
          {CONFIG.appName}
        </h1>
        
        {/* Proposta de Valor Técnica (Keywords de VC) */}
        <p 
          style={{ 
            fontSize: '34px', 
            opacity: 0.9, 
            marginTop: '28px', 
            maxWidth: '900px', 
            textAlign: 'center',
            lineHeight: 1.4,
            fontFamily: '"Inter"',
          }}
        >
          Decentralized Infrastructure for RWA Tokenization, DeFi and AI-Driven Agribusiness.
        </p>

        {/* Identificação de Domínio Limpa */}
        <div 
          style={{ 
            marginTop: '64px', 
            fontSize: '24px', 
            opacity: 0.4,
            letterSpacing: '0.15em',
            textTransform: 'uppercase'
          }}
        >
          {CONFIG.siteUrl.replace('https://', '')}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Inter',
          data: fontData,
          style: 'normal',
          weight: 700,
        },
      ],
    }
  );
}