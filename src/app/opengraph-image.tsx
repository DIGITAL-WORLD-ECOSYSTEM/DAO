import { ImageResponse } from 'next/og';

import { _posts } from 'src/_mock/_blog';
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

type Props = {
  params: {
    title: string;
  };
};

export default async function GET(props: Props) {
  const { title } = props.params;

  // Busca o post específico no mock ou usa dados padrão do ecossistema
  const post = _posts.find((p: any) => p.title === title);

  // Carregamento de fontes via CDN para garantir consistência visual no Edge
  const [getFont, getFontBold] = await Promise.all([
    fetch(new URL('https://fonts.cdnfonts.com/s/15068/Inter-Regular.woff')).then((res) => res.arrayBuffer()),
    fetch(new URL('https://fonts.cdnfonts.com/s/15068/Inter-Bold.woff')).then((res) => res.arrayBuffer()),
  ]);

  const shared = {
    title: post?.title ?? CONFIG.appName,
    description: post?.description ?? 'Infraestrutura de Governança Digital, DeFi e Ativos Reais (RWA).',
  };

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          padding: '80px',
          color: '#fff',
          backgroundColor: '#0A192F', // Azul "Deep Tech" alinhado ao Manifest
          backgroundImage: 'radial-gradient(circle at 25% 25%, #00A15D 0%, transparent 55%)', // Gradiente Verde Agro-Tech
        }}
      >
        {/* LOGO ASPPIBRA / DEX WORLD */}
        <svg width="120" height="40" viewBox="0 0 105 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M3.08862 2.76632C1.70887 1.25983 0 2.21953 0 4.29821V25.7018C0 27.7805 1.70887 28.7402 3.08862 27.2337L10.3239 19.349C11.6631 17.8863 11.6631 12.1137 10.3239 10.651L3.08862 2.76632Z" fill="#00A15D"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M26.7937 19.349C28.1329 17.8863 28.1329 12.1137 26.7937 10.651L19.5585 2.76632C18.1787 1.25983 16.4699 2.21953 16.4699 4.29821V25.7018C16.4699 27.7805 18.1787 28.7402 19.5585 27.2337L26.7937 19.349Z" fill="#00A15D"/>
          <path d="M32.0622 29V1H39.8135V29H32.0622Z" fill="#fff" opacity="0.8"/>
          <path d="M44.4259 29V1H52.1772V29H44.4259Z" fill="#fff" opacity="0.8"/>
          <path d="M56.7896 29V1H64.5409V29H56.7896Z" fill="#fff" opacity="0.8"/>
        </svg>

        <h1
          style={{
            margin: 0,
            paddingTop: 80,
            maxWidth: 1040,
            fontSize: 72,
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            fontFamily: '"Inter-Bold"',
          }}
        >
          {shared.title}
        </h1>

        <p
          style={{
            margin: 0,
            paddingTop: 32,
            maxWidth: 900,
            opacity: 0.8,
            fontSize: 34,
            lineHeight: 1.4,
            fontFamily: '"Inter-Regular"',
          }}
        >
          {shared.description}
        </p>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginTop: 'auto',
            width: '100%',
            fontFamily: '"Inter-Regular"',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}
        >
          <p
            style={{
              margin: 0,
              opacity: 0.5,
              fontSize: 22,
              fontWeight: 600,
            }}
          >
            {CONFIG.siteUrl.replace('https://', '')} — GOVERNANCE PORTAL v1.0
          </p>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Inter-Regular', data: getFont, weight: 400, style: 'normal' },
        { name: 'Inter-Bold', data: getFontBold, weight: 700, style: 'normal' },
      ],
    }
  );
}