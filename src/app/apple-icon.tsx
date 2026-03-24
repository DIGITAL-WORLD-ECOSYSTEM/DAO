import { ImageResponse } from 'next/og';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

// Edge runtime para geração instantânea e baixo custo de latência
export const runtime = 'edge';

// Resolução padrão Apple para telas Retina (iPhone/iPad)
export const size = {
  width: 180,
  height: 180,
};

export const contentType = 'image/png';

// ----------------------------------------------------------------------

/**
 * APPLE TOUCH ICON - PRODUÇÃO 2026
 * Ícone dinâmico otimizado para a tela de início do iOS.
 * Design focado em autoridade visual e consistência de ecossistema.
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0A192F', // Azul Marinho Tech (Consistência com Manifest e OG)
          backgroundImage: 'radial-gradient(circle at 50% 50%, #00A15D 0%, transparent 100%)', // Brilho central verde
          borderRadius: '40px', // Aproximação do Squircle da Apple
        }}
      >
        <div
          style={{
            fontSize: 110,
            fontWeight: 900,
            color: '#FFFFFF',
            display: 'flex',
            fontFamily: 'sans-serif',
            textShadow: '0px 4px 12px rgba(0,0,0,0.4)', // Sombra para destacar a inicial no ícone pequeno
          }}
        >
          {CONFIG.appName.substring(0, 1)}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}