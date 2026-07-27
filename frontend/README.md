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
*   **Arquitetura Diamante:** Estrutura modular escalável com separação estrita de camadas.
*   **Rotas Dinâmicas:** `/news`, `/news/[slug]`, `/news/category/[slug]`.
*   **SEO Dinâmico:** Geração automática de Metadados, RSS Feed, Sitemap e OG Images.
*   **Performance:** Renderização Híbrida (SSR/ISR) com suporte a Turbopack.

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

### 🎨 Ecossistema Tecnológico do Blog (Padrão Diamante)

Este projeto utiliza o **Padrão Diamante de Organização Modular (Elite 2026)**, garantindo que o motor de notícias seja isolado, performático e fácil de manter.

```text
frontend/
├── public/
│   └── assets/
│       └── icons/
│           └── navbar/
│               └── ic-blog.svg             # Ícone visual do menu de navegação
├── src/
│   ├── _mock/
│   │   └── blog.mock.ts                    # Dados fakes isolados (Padrão .mock.ts)
│   ├── actions/
│   │   ├── mappers/
│   │   │   └── blog-mapper.ts              # Transformação de dados brutos da API
│   │   ├── blog-queries.ts                 # Leitura Server-Side (Queries/SEO)
│   │   └── blog-actions.ts                 # Escrita/Interações (Mutations/Forms)
│   ├── app/
│   │   ├── (main)/
│   │   │   ├── authors/                    # Páginas de E-E-A-T (Autores)
│   │   │   │   ├── [slug]/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   └── tag/                        # Taxonomias dinâmicas
│   │   │       └── [slug]/
│   │   │           └── page.tsx
│   │   ├── news/                           # CORE do Blog (App Router)
│   │   │   ├── [slug]/                     # Página Interna do Artigo
│   │   │   │   ├── error.tsx
│   │   │   │   ├── loading.tsx
│   │   │   │   ├── opengraph-image.tsx     # OG Image Dinâmica
│   │   │   │   ├── page.tsx
│   │   │   │   └── twitter-image.tsx       # Twitter Card Dinâmico
│   │   │   ├── category/                   # Verticais de Conteúdo
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx
│   │   │   ├── error.tsx
│   │   │   ├── layout.tsx
│   │   │   ├── loading.tsx
│   │   │   └── page.tsx                    # Orquestrador Home (Usa BlogHomeView)
│   │   └── rss/
│   │       └── route.ts                    # Feed RSS para Indexação IA
│   ├── hooks/
│   │   └── use-blog.ts                     # Hooks de estado e filtros do blog
│   ├── layouts/
│   │   ├── blog/                           # Wrappers de Layout
│   │   │   ├── index.ts
│   │   │   └── layout.tsx
│   │   ├── nav-config-blog.tsx             # Navegação específica
│   │   └── nav-config-main.tsx             # Registro no Menu Global
│   ├── schemas/
│   │   └── blog-zod.ts                     # Validação Zod (Comentários/News)
│   ├── sections/
│   │   └── blog/                           # MOTOR VISUAL (Private Modular)
│   │       ├── _components/                # Sub-componentes (Privados)
│   │       │   ├── PostAdvertisement.tsx
│   │       │   ├── PostAuthors.tsx
│   │       │   ├── PostCommunity.tsx
│   │       │   ├── PostFeatured.tsx
│   │       │   ├── PostSearch.tsx
│   │       │   ├── PostSort.tsx
│   │       │   └── PostVideo.tsx
│   │       ├── _details/                   # Seções Internas do Post
│   │       │   ├── PostCommentItem.tsx
│   │       │   ├── PostCommentList.tsx
│   │       │   └── PostDetailsHero.tsx
│   │       ├── _forms/                     # Formulários de Conversão
│   │       │   ├── PostNewsletter.tsx
│   │       │   └── PostCommentForm.tsx
│   │       ├── _item/                      # Cards e Listas Atômicas
│   │       │   ├── PostCategoryItem.tsx
│   │       │   ├── PostCardHorizontal.tsx
│   │       │   ├── PostCard.tsx            # Card principal (antigo item.tsx)
│   │       │   ├── PostListHorizontal.tsx
│   │       │   ├── PostList.tsx
│   │       │   ├── PostRecent.tsx          # Seção cronológica
│   │       │   ├── PostSkeleton.tsx
│   │       │   └── PostTrending.tsx        # Seção de tendências
│   │       ├── _view/                      # Orquestradores de Página
│   │       │   ├── public/                 
│   │       │   │   ├── PostDetailsHomeView.tsx
│   │       │   │   └── BlogHomeView.tsx    # Orquestrador da Home do Blog
│   │       │   └── index.ts
│   │       ├── ARCHITECTURE.md             # Docs da Infraestrutura
│   │       └── constants.ts                # Configurações globais do blog
│   └── types/
│       └── blog.ts                         # Interfaces e Contratos TS
```

### 🏛️ Ecossistema Institucional & Landing Page (Padrão Diamante)

A estrutura institucional foi reconstruída para garantir máxima autoridade de marca e transparência governamental (E-E-A-T).

```text
frontend/
├── src/
│   ├── _mock/
│   │   └── institutional.mock.ts           # Dados dinâmicos (Time, Missão, FAQs)
│   ├── app/
│   │   ├── (home)/
│   │   │   └── page.tsx                    # HOME: Landing Page (Entry Point)
│   │   ├── (main)/
│   │   │   ├── about/                      # Página Quem Somos (Ativa)
│   │   │   ├── contact/                    # Página de Atendimento (Ativa)
│   │   │   ├── ecosystem/                  # Explicação RWA/DAO (Ativa)
│   │   │   ├── team/                       # Vitrine de Governança (Ativa)
│   │   │   ├── whitepaper/                 # Tese Técnica (Ativa)
│   │   │   ├── editorial-policy/           # Sinal E-E-A-T (Ativa)
│   │   │   ├── fact-checking/              # Sinal E-E-A-T (Ativa)
│   │   │   ├── methodology/                # Sinal E-E-A-T (Ativa)
│   │   │   └── (legal)/                    # Compliance Jurídico (Ativa)
│   ├── sections/
│   │   ├── home/                           # MÓDULO: LANDING PAGE (DIAMANTE)
│   │   │   ├── _components/                # Blocos PascalCase & Privados
│   │   │   │   ├── HomeHero.tsx
│   │   │   │   ├── HomeCommunity.tsx
│   │   │   │   ├── HomeEcosystem.tsx
│   │   │   │   ├── HomeFaqs.tsx
│   │   │   │   ├── HomeRoadmap.tsx
│   │   │   │   ├── HomeTeam.tsx
│   │   │   │   ├── HomeLatestNews.tsx
│   │   │   │   └── HomeCtaBanner.tsx
│   │   │   └── _view/
│   │   │       └── HomeView.tsx            # Orquestrador da Landing Page
│   │   ├── about/                          # MÓDULO: SOBRE A INSTITUIÇÃO
│   │   │   └── _view/AboutView.tsx
│   │   ├── contact/                        # MÓDULO: ATENDIMENTO
│   │   │   └── _view/ContactView.tsx
│   │   ├── team/                           # MÓDULO: GOVERNANÇA & TIME
│   │   │   └── _view/TeamView.tsx
│   │   ├── ecosystem/                      # MÓDULO: RWA & DAO
│   │   │   └── _view/EcosystemView.tsx
│   │   └── legal/                          # MÓDULO: COMPLIANCE & POLICIES
│   │       └── _view/
│   │           ├── LegalView.tsx           # Reutilizável (Termos/Privacidade)
│   │           └── PolicyView.tsx          # Reutilizável (E-E-A-T)
```

### 4. 🔐 Ponte de Identidade (Auth Bridge)
Integração transparente com o ecossistema administrativo:
*   **Session Sync:** O `AuthProvider` lê o cookie compartilhado (`daoAccessToken`) para reconhecer o cidadão logado.
*   **Web3 Access:** Suporte a carteiras (Wagmi/Viem) para reconhecimento de permissões on-chain.

---

## 🏗️ Estrutura de Diretórios (Otimizada)

```text
/src/
├── app/               # Rotas Públicas, SEO e App Router CORE
├── auth/              # Lógica de Reconhecimento de Sessão e JWT Bridge
├── components/        # UI Kit Global (Animações, Backgrounds, Iconify)
├── layouts/           # Orquestradores de Frame (Header/Footer/Nav)
├── locales/           # Dicionários de Tradução Multi-idioma (i18n)
├── actions/           # Camada de Dados (Queries e Server Actions)
└── sections/          # Features Modulares (Padrão Diamante: Blog, Home, Institucional)
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
