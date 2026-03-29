/**
 * Copyright 2026 ASPPIBRA – Associação dos Proprietários e Possuidores de Imóveis no Brasil.
 * Project: Governance System (ASPPIBRA DAO)
 * Role: Vinext Ambient Shims (Next.js Polyfills)
 * 
 * Descrição: Resolve as centenas de erros de TS (Cannot find module 'next/...') 
 * que surgiram no VS Code após substituirmos a biblioteca nativa Vercel pelo Cloudflare Vinext.
 * O Vinext envelopa esses módulos em tempo de build (Vite), então preenchemos os tipos genéricos aqui
 * para calar o compilador TS do IDE.
 */

declare module 'next/navigation' {
  export const useRouter: any;
  export const usePathname: any;
  export const useSearchParams: any;
  export const useParams: any;
  export const notFound: any;
  export const redirect: any;
}

declare module 'next/link' {
  const Link: any;
  export default Link;
}

declare module 'next/image' {
  const Image: any;
  export default Image;
}

declare module 'next/font/google' {
  export const primaryFont: any;
  export const secondaryFont: any;
  export const Inter: any;
  export const Roboto: any;
}

declare module 'next/dynamic' {
  const dynamic: any;
  export default dynamic;
}

declare module 'next/headers' {
  export const cookies: any;
  export const headers: any;
}

declare module 'next/app' {
  export const AppProps: any;
}

declare module 'next/document' {
  export const DocumentContext: any;
  export const DocumentInitialProps: any;
}
