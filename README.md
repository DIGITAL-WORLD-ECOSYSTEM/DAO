# 🌐 Mundo Digital: ASPPIBRA DAO Ecosystem
## 🏛️ A Ponte Definitiva entre Ativos Reais e Governança Descentralizada

> **Infraestrutura de Elite focada em SEO e Experiência do Usuário, conectando o público ao ecossistema ASPPIBRA DAO com máxima performance e autoridade digital.**

---

### 🚀 Stack Tecnológica (Frontend Público 2026)

| Layer | Technology | Status | Badge |
| :--- | :--- | :--- | :--- |
| **Framework** | Next.js 16.2.1 (Turbopack) | ✅ Stable | ![Next.js](https://img.shields.io/badge/Next.js-16.2.1-black?style=flat&logo=next.js) |
| **UI Library** | React 19.2.4 | ✅ Stable | ![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=flat&logo=react&logoColor=black) |
| **Styling** | Material UI 7.3.7 | ✅ Design System | ![MUI](https://img.shields.io/badge/MUI-7.3.7-007FFF?style=flat&logo=mui&logoColor=white) |
| **SEO Engine** | Dynamic Sitemap + Robots | ✅ Elite | ![SEO](https://img.shields.io/badge/SEO-Enterprise-green) |
| **Identity** | Shared Auth Bridge (JWT) | ✅ Integrated | ![Auth](https://img.shields.io/badge/Auth-Bridge-blueviolet) |

---

## 🏛️ Arquitetura de Consumo (Public Frontend)

> **Este repositório foi otimizado para atuar como o portal público da ASPPIBRA DAO. Toda a complexidade administrativa, gestão de Smart Contracts e Governança foi delegada ao [App Dashboard](https://app.asppibra.com).**

### 1. 📰 Portal de Notícias (Blog Engine)
Sistema de alto desempenho para entrega de conteúdo editorial:
*   **Rotas Dinâmicas:** `/news`, `/news/[slug]`, `/news/category/[slug]`.
*   **Performance:** Renderização Híbrida (ISR/SSR) para carregamento instantâneo.
*   **Componentes:** Feed de notícias, cards interativos e sistema de autoridade de colunistas.

### 2. 🌍 Ecossistema de Internacionalização (i18n)
Pronto para a expansão global da DAO:
*   **Engine:** `i18next` com detecção automática de região.
*   **Estrutura:** Dicionários JSON organizados por módulos para suporte Multi-idioma.

## 🧠 Ecossistema de SEO & AI (Sinais de Autoridade)

Este projeto foi projetado com uma arquitetura **AI-First**, garantindo que o conteúdo seja facilmente consumível por buscadores tradicionais (Google) e modelos de linguagem modernos (GPT, Claude, Perplexity).

### 📂 Mapa Técnico de SEO
Abaixo estão os arquivos e diretórios que compõem o motor de autoridade digital (E-E-A-T) da ASPPIBRA DAO:

```text
frontend/
├── public/
│   ├── .well-known/
│   │   └── ai-plugin.json           # SEO para buscadores de IA (ChatGPT, etc)
│   ├── schemas/                     # Definições estáticas de Structured Data
│   │   ├── breadcrumb.json
│   │   ├── organization.json
│   │   └── website.json
│   ├── ads.txt                      # Verificação para crawlers de anúncios
│   ├── favicon.ico                  # Identidade visual nos resultados de busca
│   └── humans.txt                   # Transparência e autoria (SEO indireto)
├── src/
│   ├── app/
│   │   ├── (main)/
│   │   │   ├── authors/             # Páginas de autor (Sinal de E-E-A-T)
│   │   │   ├── editorial-policy/    # Políticas editoriais (Sinal de confiança)
│   │   │   ├── fact-checking/       # Verificação de fatos (Sinal de autoridade)
│   │   │   └── methodology/         # Transparência metodológica (E-E-A-T)
│   │   ├── news/
│   │   │   └── [slug]/
│   │   │       ├── opengraph-image.tsx # OG Image dinâmica para notícias
│   │   │       └── twitter-image.tsx   # Twitter Card dinâmico para notícias
│   │   ├── rss/
│   │   │   └── route.ts             # Feed para indexação rápida em agregadores
│   │   ├── apple-icon.tsx           # SEO Mobile / Favicons
│   │   ├── manifest.ts              # Web App Manifest (SEO Mobile/PWA)
│   │   ├── opengraph-image.tsx      # Imagem de compartilhamento global
│   │   ├── robots.ts                # Geração dinâmica do robots.txt (AI Optimized)
│   │   ├── sitemap.ts               # Geração dinâmica do sitemap.xml
│   │   └── twitter-image.tsx        # Imagem do Twitter Card global
│   ├── components/
│   │   └── seo/                     # Componentes reutilizáveis de SEO
│   │       ├── analytics.tsx        # Rastreamento de performance
│   │       ├── breadcrumb.tsx       # Navegação estruturada para o Google
│   │       ├── canonical.tsx        # Tags para evitar conteúdo duplicado
│   │       └── json-ld.tsx          # Injeção de dados estruturados (Schema.org)
│   ├── lib/
│   │   └── seo/                     # Lógica e utilitários de SEO
│   │       ├── metadata.ts          # Gerador central de meta tags (AI Snippets)
│   │       ├── openGraph.ts         # Configurações de Open Graph
│   │       ├── robots.ts            # Lógica de permissões de crawlers
│   │       └── schema.ts            # Builders de JSON-LD
│   ├── next.config.ts               # Headers de Segurança (HSTS/XSS)
│   └── .lighthouserc.js             # Automação de auditoria de Performance
```

### 4. 🔐 Ponte de Identidade (Auth Bridge)
Integração transparente com o ecossistema administrativo:
*   **Session Sync:** O `AuthProvider` lê o cookie compartilhado (`daoAccessToken`) para reconhecer o cidadão logado.
*   **Web3 Access:** Suporte a carteiras (Wagmi/Viem) para reconhecimento de permissões on-chain.

---

## 🏗️ Estrutura de Diretórios (Otimizada)

```text
/src/
├── app/               # Rotas Públicas e SEO
├── auth/              # Lógica de Reconhecimento de Sessão
├── components/        # UI Kit Enxuto (Performance-First)
├── layouts/           # Design System (Header/Footer Públicos)
├── locales/           # Dicionários de Tradução Multi-idioma
└── sections/          # Blocos visuais (Home, Blog, About)
```

---

## 🛠️ Guia de Manutenção Técnica

1.  **Build & Performance**: Utilize sempre `pnpm build` para validar a árvore de dependências. O projeto está limpo de "peso morto" (charts, editors, etc).
2.  **Sincronização de Cookies**: A sessão depende do cookie `daoAccessToken` no domínio `.asppibra.com`.
3.  **Ambiente de Dev**: `pnpm dev` roda na porta 8082 com suporte a Turbopack.

---

## 🏁 Roadmap de Evolução (Frontend)

- [x] **Migração de Responsabilidade**: Administração movida para o App Dashboard.
- [x] **Limpeza Profunda**: Remoção de componentes de UI e pacotes não utilizados.
- [x] **SEO Enterprise**: Automação total de Sitemaps e Meta Tags.
- [ ] **Fase 4 - Comentários**: Sistema de interação social para cidadãos logados.
- [ ] **Fase 5 - Newsletter**: Conexão do formulário com o Backend Cloudflare.
- [ ] **Fase 6 - Analytics**: Tracking detalhado de comportamento do usuário.

---
> **ASPPIBRA DAO: A Revolução da Posse e Governança.** 🚀🛡️💎
