# 🌐 Mundo Digital: O Ecossistema Interplanetário

> **A ponte definitiva entre o mundo físico e o digital.** > Infraestrutura baseada em blockchain que conecta **RWA** (Real World Assets) ao **DeFi** com **IA**, operando sobre uma rede descentralizada de governança **DAO** sem fronteiras.

---

### 🚀 Stack de Vanguarda (Bleeding Edge)

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![MUI](https://img.shields.io/badge/MUI-7.3.7-007FFF?style=for-the-badge&logo=mui&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-4.3.6-3E67B1?style=for-the-badge&logo=zod&logoColor=white)
![React Hook Form](https://img.shields.io/badge/React_Hook_Form-7.71.1-EC5990?style=for-the-badge&logo=react-hook-form&logoColor=white)
![SWR](https://img.shields.io/badge/SWR-2.3.8-000000?style=for-the-badge&logo=swr&logoColor=white)
![i18next](https://img.shields.io/badge/i18next-25.8.0-26A69A?style=for-the-badge&logo=i18next&logoColor=white)

> Esta seção demonstra o uso de tecnologias **Bleeding Edge** (vanguarda), garantindo que o ecossistema Mundo Digital utilize as versões mais estáveis e modernas disponíveis no `node_modules`.

---
## Prerequisites

- Node.js >=20 (Recommended)

## Installation

**Using pnpm (Recommended)**

```sh
pnpm install
pnpm dev
```

# Using Npm
npm i
npm run dev
```

## Build

```sh
# Using pnpm
pnpm build

# Using Yarn
yarn build

# Using Npm
npm run build
```

## Arquitetura do Módulo de Blog (Versão Híbrida)

A arquitetura do blog foi projetada para alta escalabilidade, combinando a robustez do Next.js com uma clara separação de responsabilidades. **Atualmente, a listagem principal de posts (`/post`) utiliza uma abordagem de renderização no cliente (`'use client'`) para agilidade, enquanto a infraestrutura para um fluxo de dados server-side completo já está implementada e pronta para ser ativada.**

### Fluxo de Dados Atual (Client-Side na Listagem de Posts)

1.  **Requisição e Carregamento Inicial**: O usuário acessa a página `/post`. O Next.js exibe imediatamente o componente `src/app/post/loading.tsx` (*Skeleton Screens*), melhorando a percepção de performance.

2.  **Renderização no Cliente**: A página `src/app/post/page.tsx`, marcada como `'use client'`, é carregada no navegador do usuário.

3.  **Acesso Direto aos Dados Mockados**: O componente importa diretamente a lista de posts do arquivo de mock: `import { _posts } from 'src/_mock/_blog';`.

4.  **Lógica no Cliente**: Toda a lógica de paginação, busca e filtros é executada diretamente no navegador, manipulando o array de posts importado.

5.  **Injeção de Props**: Os dados processados são passados via `props` para o componente de apresentação `<PostListHomeView />`.

6.  **Tratamento de Erros**: Caso ocorra um erro durante a renderização no cliente, o Next.js captura e exibe o componente `src/app/post/error.tsx`.

### Infraestrutura Server-Side (Pronta para Ativação)

Embora a listagem de posts opere no cliente, a arquitetura para um fluxo de dados resiliente e executado no servidor já existe, ideal para quando a aplicação se conectar a uma API real:

*   **Ações de Dados (`actions/blog-ssr.ts`)**: Contém a lógica para buscar dados no servidor (Server Actions), como a função `getPosts()`.
*   **Validação de Dados (`schemas/blog-zod.ts`)**: Esquemas Zod para validar a integridade dos dados recebidos de uma API.
*   **Mapeamento de Dados (`actions/mappers/blog-mapper.ts`)**: Transforma os dados da API para o formato esperado pela UI, desacoplando o front-end do back-end.

**Nota para Desenvolvedores:** Para migrar a listagem de posts para server-side, basta refatorar `src/app/post/page.tsx` para remover o `'use client'`, chamar a Server Action `getPosts()` e passar os dados recebidos como props.

### Árvore de Arquivos e Componentes Otimizada

A estrutura de diretórios foi desenhada para máxima organização, modularidade e escalabilidade.

```bash
src
├── 📁 _mock/                   # ✅ Confirmado: Fonte de dados Mock
│   └── 📄 _blog.ts
│
├── 📁 actions/                 # ✅ Confirmado: Lógica de negócio e acesso a dados
│   ├── 📄 blog-ssr.ts          # Ações específicas para Server-Side Rendering
│   ├── 📄 blog.ts
│   ├── ... (outras actions)
│   └── 📁 mappers/
│       └── 📄 blog-mapper.ts    # Transforma dados da API para o domínio da UI
│
├── 📁 app/                     # ✅ Confirmado: Rotas e páginas (Next.js App Router)
│   └── 📁 post/
│       ├── 📁 [title]/         # Rota dinâmica para um post específico
│       │   ├── 📄 error.tsx    # UI de erro para a rota do post
│       │   ├── 📄 loading.tsx  # UI de carregamento para a rota do post
│       │   └── 📄 page.tsx      # View do post específico
│       ├── 📁 category/
│       │   └── 📁 [slug]/       # Rota para categorias (vazio, mas estrutura existe)
│       ├── 📄 error.tsx        # UI de erro para a listagem
│       ├── 📄 layout.tsx       # Layout compartilhado para as páginas de post
│       ├── 📄 loading.tsx     # UI de carregamento para a listagem
│       └── 📄 page.tsx          # View da listagem de posts
│
├── 📁 layouts/                 # ✅ Confirmado: Componentes de layout globais
│   └── 📁 blog/
│       ├── 📄 index.ts
│       └── 📄 layout.tsx
│
├── 📁 routes/                  # ✅ Confirmado: Gestão de rotas
│   └── 📄 paths.ts             # Gerador de URLs centralizado
│
├── 📁 schemas/                 # ✅ Confirmado: Validação de contratos de dados
│   └── 📄 blog-zod.ts          # Esquemas Zod para validar Mock/API
│
├── 📁 sections/                # ✅ Confirmado: Seções da UI por feature
│   └── 📁 blog/
│       ├── 📁 components/       # Componentes de UI genéricos do blog (widgets, etc)
│       │   ├── 📄 authors.tsx
│       │   ├── 📄 banner.tsx
│       │   ├── 📄 community.tsx
│       │   ├── 📄 featured.tsx
│       │   ├── 📄 index.ts
│       │   ├── 📄 post-search.tsx
│       │   ├── 📄 post-sort.tsx
│       │   └── 📄 video.tsx
│       │
│       ├── 📁 details/          # Componentes para a página de detalhes de um post
│       │   ├── 📄 post-comment-item.tsx
│       │   ├── 📄 post-comment-list.tsx
│       │   ├── 📄 post-details-hero.tsx
│       │   └── 📄 post-details-toolbar.tsx
│       │
│       ├── 📁 forms/            # Formulários específicos do blog
│       │   ├── 📄 newsletter.tsx
│       │   └── 📄 post-comment-form.tsx
│       │
│       ├── 📁 item/             # Componentes de item de post e suas variações
│       │   ├── 📄 index.ts
│       │   ├── 📄 item-horizontal.tsx
│       │   ├── 📄 item.tsx
│       │   ├── 📄 list-horizontal.tsx
│       │   ├── 📄 list.tsx
│       │   ├── 📄 recent.tsx
│       │   ├── 📄 skeleton.tsx
│       │   └── 📄 trending.tsx
│       │
│       ├── 📁 management/       # Views e formulários para o painel de admin (CRUD)
│       │   ├── 📄 post-create-edit-form.tsx
│       │   ├── 📄 post-create-view.tsx
│       │   ├── 📄 post-details-preview.tsx
│       │   └── 📄 post-edit-view.tsx
│       │
│       ├── 📁 view/             # Views principais que montam as páginas do blog
│       │   ├── 📄 index.ts
│       │   ├── 📄 post-details-home-view.tsx
│       │   ├── 📄 post-details-view.tsx
│       │   ├── 📄 post-list-home-view.tsx
│       │   └── 📄 post-list-view.tsx
│       │
│       └── 📄 constants.ts      # Constantes do módulo de blog
│
└── 📁 types/                   # ✅ Confirmado: Tipos e interfaces
    └── 📄 blog.ts              # Definições de tipos TypeScript para o blog

```

---

## 🛠 Arquitetura de SEO & Performance (Padrão 2026)

> **STATUS DA IMPLEMENTAÇÃO:** 🟢 **100% CONCLUÍDA E AUDITADA** 
> *Todas as Fases (1: Governança Estática, 2: Cérebro Lógico & Satori, e 3: Escudo YMYL) foram plenamente executadas em rigorosa conformidade arquitetural.*

Este projeto utiliza uma infraestrutura de SEO dinâmico baseada nas capacidades mais recentes do Next.js 16, focada em automação de metadados, dados estruturados semânticos e geração programática de imagens sociais.

### 🌳 Estrutura do Diretório de SEO
```
SocialFi/
└── packages/
    └── front/
        ├── public/                              # Assets Estáticos e Governança
        │   ├── favicon.ico                      # ✅ OK
        │   ├── logo/                            # ✅ OK (icons Android/Chrome)
        │   │
        │   ├── llms.txt                         # ✅ OK (Diretrizes IA)
        │   ├── ai-policy.txt                    # ✅ OK (Políticas IA/Scraping)
        │   ├── humans.txt                       # ✅ OK (Autoria técnica)
        │   ├── security.txt                     # ✅ OK (Segurança/RFC 9116)
        │   ├── ads.txt                          # ✅ OK (Transparência/Ads)
        │   │
        │   ├── .well-known/                     # ✅ OK (Padronização web moderna)
        │   │   ├── ai-plugin.json               # ✅ OK (Integração de agentes)
        │   │   └── assetlinks.json              # ✅ OK (Associação mobile)
        │   │
        │   ├── schemas/                         # ✅ OK (JSON-LD estáticos)
        │   │   ├── organization.json            # ✅ OK (Institucional)
        │   │   ├── website.json                 # ✅ OK (Busca/SearchAction)
        │   │   ├── product.json                 # ✅ OK (Base de tokens)
        │   │   └── breadcrumb.json              # ✅ OK (Navegação estruturada)
        │   │
        │   └── (removido)                       # ❌ Migrado para RSS Server Route (src/app/rss/route.ts)
        │
        │
        ├── src/
        │   ├── _mock/                           # ✅ fonte da verdade (conteúdo)
        │   │   ├── _blog.ts                     # ✅ posts
        │   │   ├── _authors.ts                  # ✅ OK (lista de autores do DAO)
        │   │   └── _categories.ts               # ✅ OK (taxonomia principal)
        │
        │   ├── lib/
        │   │   └── seo/                         # ✅ OK (lógica reutilizável)
        │   │       ├── metadata.ts              # ✅ OK (generateMetadata helpers)
        │   │       ├── schema.ts                # ✅ OK (geradores JSON-LD)
        │   │       ├── openGraph.ts             # ✅ OK (configs OG base)
        │   │       └── robots.ts                # ✅ OK (regras centralizadas)
        │
        │   ├── actions/                         # ✅ SSR / prerender
        │
        │   ├── components/
        │   │   ├── seo/
        │   │   │   ├── analytics.tsx            # ✅ Core Web Vitals
        │   │   │   ├── json-ld.tsx              # ✅ Hub de structured data
        │   │   │   ├── breadcrumb.tsx           # ✅ OK (navegação semântica)
        │   │   │   └── canonical.tsx            # ✅ OK (canonical override)
        │   │
        │   │   └── image/                       # ✅ OK (otimização de mídia)
        │   │       ├── index.tsx
        │   │       └── og-image.tsx             # ✅ OK (Satori engine)
        │
        │
        │   └── app/
        │       ├── layout.tsx                   # ✅ metadataBase + canonical root
        │
        │       ├── robots.ts                    # ✅ gerador dinâmico
        │       ├── sitemap.ts                   # ✅ sitemap principal centralizado
        │
        │       ├── manifest.ts                  # ✅ PWA identity
        │       ├── apple-icon.tsx               # ✅ favicon apple
        │
        │       ├── opengraph-image.tsx          # ✅ OG global
        │       ├── twitter-image.tsx            # ✅ OK (fallback social)
        │
        │
        │       ################################################
        │       ## ROTAS DE AUTORIDADE (E-E-A-T)
        │       ################################################
        │
        │       ├── about/page.tsx               # ✅ OK (institucional)
        │       ├── contact/page.tsx             # ✅ OK (contato oficial)
        │
        │       ├── authors/                     # ✅ OK (autoridade editorial unificada)
        │       │   ├── page.tsx                 # ✅ OK (lista autores)
        │       │   └── [slug]/page.tsx          # ✅ OK (perfil autor com Schema Person)
        │
        │       ├── methodology/page.tsx         # ✅ OK (metodologia editorial)
        │       ├── editorial-policy/page.tsx    # ✅ OK (política editorial)
        │       ├── fact-checking/page.tsx       # ✅ OK (verificação de fatos)
        │
        │       ├── (legal)/
        │       │   ├── privacy/page.tsx         # ✅ OK (LGPD / Privacidade)
        │       │   ├── terms/page.tsx           # ✅ OK (Termos de Serviço)
        │       │   ├── cookies/page.tsx         # ✅ OK (Sessões e Cookies)
        │
        │
        │       ################################################
        │       ## SEO PROGRAMÁTICO
        │       ################################################
        │
        │       ├── post/[title]/
        │       │   ├── page.tsx                 # ✅ metadata dinâmico
        │       │   ├── opengraph-image.tsx      # ✅ Satori dynamic
        │       │   ├── twitter-image.tsx        # ✅ social variant
        │       │
        │       ├── category/[slug]/
        │       │   └── page.tsx                 # ✅ silo semântico
        │
        │       ├── tag/[slug]/                  # ✅ OK (cluster semântico)
        │       │   └── page.tsx
        │
        │       ├── author/[slug]/               # ❌ [REMOVIDO: Rotas agrupadas em /authors/[slug] p/ evitar duplicidade]
        │
        │
        │       ################################################
        │       ## BUSCA SEMÂNTICA
        │       ################################################
        │
        │       ├── search/page.tsx              # ✅ OK (SearchAction schema)
        │
        │
        └── next.config.ts                      # ✅ headers + redirects

```

# 🚀 Pilares Estratégicos da Arquitetura Enterprise 2026

## 1. Automação Total de Infraestrutura (Robots & Sitemaps)

Diferente de métodos legados que exigem manutenção manual, os arquivos `robots.ts` e `sitemap.ts` dentro de `src/app/` funcionam como **geradores dinâmicos**.

Ao atualizar o arquivo de dados `_blog.ts`, o Google descobre as novas URLs e as permissões de rastreio automaticamente, garantindo **indexação em tempo real** sem intervenção humana.

---

## 2. Metadados Programáticos e ZPE (Zero Point Entry)

Utilizamos a API `generateMetadata` nas rotas dinâmicas (`[title]`, `[slug]`).

Isso assegura que cada página possua:

- `canonical link`
- `title`
- `description`

gerados via código.

Essa abordagem elimina **conteúdo duplicado (canibalização)** e aumenta a **relevância semântica** para os algoritmos de busca.

---

## 3. Social Engagement (Image-as-Code via Satori)

Implementamos a engine **Satori** nos arquivos `opengraph-image.tsx`, permitindo renderizar componentes React como **imagens PNG dinâmicas**.

### Resultado
Cada post compartilhado gera automaticamente um **card visual rico** contendo:

- título do conteúdo
- identidade visual da **ASPPIBRA-DAO**

Isso aumenta significativamente o **CTR (taxa de cliques)** em redes sociais.

---

## 4. Governança e Compliance de IA (Padrão 2026)

O projeto está preparado para a nova era das buscas generativas (**SGE**).

Com os arquivos:

- `llms.txt`
- `ai-policy.txt`

na raiz (`/public`), fornecemos instruções explícitas para modelos como:

- Gemini
- GPT-5

Isso garante que o projeto **SocialFi** seja citado corretamente como fonte oficial, reduzindo riscos de **alucinação de IA** sobre dados do ecossistema.

---

## 5. E-E-A-T & Autoridade Institucional

Para atender aos critérios rigorosos de **Your Money, Your Life (YMYL)**, a arquitetura inclui rotas obrigatórias de transparência:

- `/about`
- `/contact`
- `/(legal)/`

Essas páginas estabelecem **legitimidade institucional**, aumentando a confiança de:

- buscadores
- plataformas financeiras
- reguladores

---

## 6. Busca Semântica Avançada (JSON-LD & Schemas)

Através do componente `json-ld.tsx` e arquivos estáticos em `public/schemas/`, injetamos dados estruturados baseados no padrão **Schema.org**.

Benefícios:

- habilita **Rich Snippets**
- melhora interpretação semântica por crawlers
- prioriza dados estruturados sobre texto puro

Exemplos de rich results:

- avaliações com estrelas
- FAQs expandidas
- cards com imagens

---

## 7. Core Web Vitals e Otimização de Ativos

Todas as imagens e ícones seguem um pipeline de otimização via componente centralizado em: src/components/image/

### Garantias de performance

- conversão automática para **WebP/AVIF**
- prevenção de **CLS (Cumulative Layout Shift)** com reserva de espaço
- **Lazy Loading** nativo
- manutenção do **LCP (Largest Contentful Paint)** abaixo de **2.5s**

---

> Arquitetura preparada para SEO técnico avançado, indexação em tempo real e compatibilidade com a nova geração de mecanismos de busca baseados em IA. 

### Como Adicionar um Novo Post
Graças à arquitetura de SEO dinâmico, adicionar um novo post é um processo simples e centralizado. Basta atualizar o arquivo `src/_mock/_blog.ts`.

1.  **Abra `src/_mock/_blog.ts`**: Este arquivo atua como a "fonte única da verdade" (Single Source of Truth) para todo o conteúdo do blog.
2.  **Adicione um novo objeto** ao array `_posts`.

O sistema fará o resto automaticamente:
- O **Sitemap Dinâmico** (`sitemap.ts`) incluirá a nova URL.
- A **Página do Post** será gerada dinamicamente.
- Os **Metadados e Imagens Sociais** (`opengraph-image.tsx`) serão criados com o título e a descrição do novo post.

### 🔍 Ferramentas de Validação e Diagnóstico (Padrão 2026)

Para garantir que a infraestrutura de SEO, a saúde técnica e a experiência do usuário (UX) estejam operando em nível de elite, utilize estas ferramentas oficiais:

* **[PageSpeed Insights](https://pagespeed.web.dev/)**: O validador definitivo dos **Core Web Vitals**. Essencial para garantir que o carregamento (**LCP**) e a estabilidade visual (**CLS**) do app **SocialFi** estejam abaixo dos limites críticos de **2.5s**.
* **[Google Search Console](https://search.google.com/search-console)**: O centro de comando para monitorar a indexação, detectar erros de rastreio e visualizar como a **ASPPIBRA-DAO** aparece nos resultados reais de busca.
* **[Google Rich Results Test](https://search.google.com/test/rich-results)**: Verifica se os seus geradores dinâmicos de **JSON-LD** estão criando dados estruturados válidos, tornando as páginas elegíveis para **Rich Snippets** (estrelas, preços de tokens, FAQs).
* **[Schema Markup Validator](https://validator.schema.org/)**: Ferramenta da **Schema.org** para uma validação técnica mais profunda de todas as entidades semânticas injetadas no código, garantindo que a hierarquia de dados esteja impecável.

