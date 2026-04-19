/**
 * Copyright 2026 ASPPIBRA – Associação dos Proprietários e Possuidores de Imóveis no Brasil.
 * Project: Governance System (ASPPIBRA DAO)
 * Role: Root Layout (Main Entry Point)
 * Version: 1.3.4 - Production Ready: Strict Types & Clean Lint
 */

import 'src/global.css';

import type { Metadata, Viewport } from 'next';

import { Barlow, Orbitron, Public_Sans } from 'next/font/google';

const publicSans = Public_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-public-sans',
  display: 'swap',
});

const barlow = Barlow({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-barlow',
  display: 'swap',
});

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-orbitron',
  display: 'swap',
});



import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

import { CONFIG } from 'src/global-config';
import { LocalizationProvider } from 'src/locales';
import { detectLanguage } from 'src/locales/server';
import { I18nProvider } from 'src/locales/i18n-provider';
import { themeConfig, primary as primaryColor } from 'src/theme';

import { JsonLd } from 'src/components/seo/json-ld';
import { detectSettings } from 'src/components/settings/server';
import { defaultSettings, SettingsProvider } from 'src/components/settings';

import { AuthProvider as JwtAuthProvider } from 'src/auth/context';

import App from './app';

// ----------------------------------------------------------------------

/**
 * 🛠️ TIPAGEM DE IDIOMA (FIX TS2322):
 * Define explicitamente os códigos de idioma aceitos pelo I18nProvider.
 */
type LanguageCode = 'en' | 'pt' | 'es' | 'ar' | 'cn' | 'fr' | 'ru';

/**
 * ✅ ESTABILIDADE DE DEPLOY:
 * Node.js runtime obrigatório para suportar a árvore densa de Providers e i18n.
 */
export const runtime = 'nodejs';

const AuthProvider = JwtAuthProvider;

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: primaryColor.main,
};

/**
 * 🌐 ESTRATÉGIA DE METADADOS (SEO FORENSICS):
 */
export const metadata: Metadata = {
  metadataBase: new URL(CONFIG.siteUrl),
  title: {
    default: 'ASPPIBRA - Governança Digital e Infraestrutura RWA',
    template: `%s | ASPPIBRA`,
  },
  description:
    'Portal de Governança Digital ASPPIBRA: Infraestrutura para ativos reais (RWA), integração nativa DeFi e inteligência de dados aplicada ao agronegócio sustentável.',
  keywords: [
    'ASPPIBRA',
    'RWA',
    'Real World Assets',
    'DeFi',
    'Blockchain Agro',
    'Governança Digital',
    'DAO',
    'IPFS Storage',
    'Smart Contracts',
  ],
  authors: [{ name: 'Sandro', url: CONFIG.siteUrl }],
  icons: [
    { rel: 'icon', url: `/favicon.ico` },
    { rel: 'apple-touch-icon', url: `/apple-touch-icon.png` },
  ],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: CONFIG.siteUrl,
    siteName: 'ASPPIBRA DAO',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'ASPPIBRA Governance Portal - Deep Tech RWA',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ASPPIBRA - Infraestrutura RWA & DeFi',
    description: 'Conectando o agronegócio brasileiro à economia digital descentralizada.',
    images: ['/opengraph-image.png'],
  },
  alternates: {
    canonical: '/',
  },
};

// ----------------------------------------------------------------------

/**
 * ⚙️ GESTÃO DE CONFIGURAÇÃO DO APP (SERVER-SIDE):
 * Captura idioma e configurações de forma assíncrona com Casting de Tipo rigoroso.
 */
async function getAppConfig() {
  try {
    const detectedLang = await detectLanguage();
    const settings = await detectSettings();

    // Casting para LanguageCode para satisfazer o I18nProvider
    const lang = (detectedLang || 'pt') as LanguageCode;

    return {
      lang,
      dir: lang === 'ar' ? 'rtl' : 'ltr',
      i18nLang: lang,
      cookieSettings: settings || defaultSettings,
    };
  } catch (_error) {
    /**
     * ✅ FIX LINT: Uso do prefixo '_' para indicar variável intencionalmente não utilizada.
     */
    return {
      lang: 'pt' as LanguageCode,
      dir: 'ltr',
      i18nLang: 'pt' as LanguageCode,
      cookieSettings: defaultSettings,
    };
  }
}

/**
 * 🏛️ COMPONENTE RAIZ (ROOT LAYOUT):
 */
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const appConfig = await getAppConfig();

  return (
    <html lang={appConfig.lang} dir={appConfig.dir} suppressHydrationWarning>
      <head>
        <JsonLd
          schema={{
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'WebSite',
                name: 'ASPPIBRA Governance Portal',
                alternateName: 'ASPPIBRA DAO',
                url: CONFIG.siteUrl,
                description:
                  'Plataforma de governança digital e tokenização de ativos reais (RWA).',
              },
              {
                '@type': 'Organization',
                name: 'ASPPIBRA',
                url: CONFIG.siteUrl,
                logo: `${CONFIG.siteUrl}/logo/logo-512x512.png`,
                sameAs: ['https://t.me/asppibra_official', 'https://discord.gg/asppibra'],
                knowsAbout: [
                  'Blockchain',
                  'Agribusiness Tokenization',
                  'Real World Assets (RWA)',
                  'DeFi',
                ],
              },
            ],
          }}
        />
      </head>
      <body className={`${publicSans.variable} ${barlow.variable} ${orbitron.variable}`}>
        <InitColorSchemeScript
          modeStorageKey={themeConfig.modeStorageKey}
          attribute={themeConfig.cssVariables.colorSchemeSelector}
          defaultMode={themeConfig.defaultMode}
        />

        {/* ✅ I18nProvider tipado corretamente para evitar erros de build */}
        <I18nProvider lang={appConfig.i18nLang}>
          <AuthProvider>
            <SettingsProvider
              defaultSettings={defaultSettings}
              cookieSettings={appConfig.cookieSettings}
            >
              <LocalizationProvider>
                <AppRouterCacheProvider options={{ key: 'css' }}>
                  <App>{children}</App>
                </AppRouterCacheProvider>
              </LocalizationProvider>
            </SettingsProvider>
          </AuthProvider>
        </I18nProvider>


      </body>
    </html>
  );
}
