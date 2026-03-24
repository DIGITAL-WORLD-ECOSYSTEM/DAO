import { paths } from 'src/routes/paths';

import packageJson from '../package.json';

// ----------------------------------------------------------------------

export type ConfigValue = {
  appName: string;
  appVersion: string;
  serverUrl: string;    // Backend API (Dados RWA e Governança)
  siteUrl: string;      // Frontend (Base para SEO 2026)
  assetsDir: string;    // Diretório base para assets (Local ou Cloud)
  r2PublicUrl: string;  // URL Pública do Cloudflare R2 para Imagens/Docs
  isStaticExport: boolean;
  auth: {
    method: 'jwt';
    skip: boolean;
    redirectPath: string;
  };
};

// ----------------------------------------------------------------------

export const CONFIG: ConfigValue = {
  /**
   * NOME DA APLICAÇÃO
   */
  appName: 'ASPPIBRA',
  
  appVersion: packageJson.version,

  /**
   * BACKEND API URL
   * Local de onde os dados de produção e usuários são consumidos.
   */
  serverUrl: (process.env.NEXT_PUBLIC_HOST_API ?? 'https://api.asppibra.com').replace(/\/$/, ''), 

  /**
   * FRONTEND SITE URL
   * SSOT para Metadados, Sitemaps e Links Canônicos.
   */
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.asppibra.com').replace(/\/$/, ''),

  /**
   * CLOUDFLARE R2 PUBLIC URL
   * Esta é a URL do seu bucket 'governance-system-assets'.
   * Se você configurou um subdomínio no Cloudflare, use ele aqui.
   */
  r2PublicUrl: (process.env.NEXT_PUBLIC_R2_URL ?? 'https://assets.asppibra.com').replace(/\/$/, ''),
  
  /**
   * ASSETS DIRECTORY
   * Lógica Inteligente: Em produção, o app busca imagens no R2 automaticamente.
   * Em desenvolvimento, ele olha para o seu diretório local ou .env.
   */
  assetsDir: process.env.NODE_ENV === 'production'
    ? (process.env.NEXT_PUBLIC_R2_URL ?? '')
    : (process.env.NEXT_PUBLIC_ASSETS_DIR ?? ''),
  
  isStaticExport: JSON.parse(process.env.BUILD_STATIC_EXPORT ?? 'false'),

  /**
   * CONFIGURAÇÕES DE AUTENTICAÇÃO
   */
  auth: {
    method: 'jwt',
    skip: false,
    redirectPath: paths.dashboard.root,
  },
};