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
![viem](https://img.shields.io/badge/viem-2.48.1-7C3AED?style=for-the-badge&logo=ethereum&logoColor=white)

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

## 🗺️ Documentação do Sistema de Blog: Arquitetura de Produção

O sistema de blog da ASPPIBRA DAO opera em uma arquitetura de alta performance e escalabilidade, totalmente integrada ao ecossistema Cloudflare (Workers, D1, R2). Esta documentação descreve o estado final de produção e o fluxo de dados entre o frontend e a infraestrutura descentralizada.

### Árvore de Arquitetura e Peças Faltantes

```
/src/
├── _mock/
│   └── _blog.ts
│       └── ESTADO ATUAL: LEGACY / FALLBACK. Serve como fonte de dados de segurança caso a
│           API esteja offline ou para prototipagem rápida de UI local.
│
├── actions/
│   ├── blog-ssr.ts
│   │   └── ESTADO ATUAL: ✅ CONCLUÍDO. Server Actions integradas que consomem a API de Produção
│   │       (api.asppibra.com) com suporte a paginação e filtragem por categoria.
│   │
│   └── mappers/
│       └── blog-mapper.ts
│           └── ESTADO ATUAL: ✅ CONCLUÍDO. Camada de Anti-Corrupção que traduz os modelos do D1/Backend
│               para os tipos TypeScript da UI, garantindo estabilidade e tipagem forte.
│
├── app/
│   ├── post/
│   │   ├── page.tsx (Home do Blog)
│   │   │   └── ESTADO ATUAL: ✅ CONCLUÍDO. Renderização Híbrida (SSR) com force-dynamic para SEO instantâneo.
│   │   │
│   │   └── [title]/page.tsx (Detalhes)
│   │       └── ESTADO ATUAL: ✅ CONCLUÍDO. SSR com geração dinâmica de Metadados e JSON-LD.
│   │
│   └── dashboard/
│       └── post/
│           └── edit/new/list
│               └── ESTADO ATUAL: ✅ CONCLUÍDO. Gestão completa (CRUD) integrada ao D1 (DB) e R2 (Storage),
│                   incluindo Auditoria Forense para todas as ações.
│
└── Infraestrutura (Cloudflare)
    ├── Banco de Dados: D1 (SQLite Distribuído)
    ├── Media Storage: R2 (S3-Compatible) para covers e assets.
    └── Security: JWT-Signed Workers com limpeza automática de assets órfãos.
```
```

## 🛠️ Guia de Operação e Manutenção

O sistema está em estado de Produção. Siga estas diretrizes para manutenção:

1.  **Gestão de Conteúdo**: Utilize exclusivamente o Dashboard administrativo para Criar/Editar posts. Isso garante que as auditorias sejam geradas e o armazenamento R2 seja otimizado (limpeza de imagens antigas).
2.  **Escalabilidade**: A paginação é controlada pelo backend. Para ajustar o limite de itens por página, modifique os parâmetros na `useGetPosts` (Frontend) e o router no Backend.
3.  **Logs e Auditoria**: Em caso de inconsistência de dados, consulte a tabela `auditLogs` no D1 para rastrear quem realizou cada alteração.

---

## 🔐 Sistema de Autenticação — Estado Atual & Roadmap

### Filosofia de Arquitetura

O sistema utiliza **Context API** + **JWT (HS256, 24h)** para sessão persistente. O `AuthProvider` suporta três métodos de login integrados ao backend `api.asppibra.com` (Cloudflare Workers + D1 + KV).

---

### ✅ Implementado & Em Produção

#### 1. AuthProvider (`src/auth/context/auth-provider.tsx`)
| Método | Endpoint | Status |
|---|---|---|
| `signIn(email, password)` | `POST /api/core/identity/local/login` | ✅ |
| `signUp(data)` | `POST /api/core/identity/local/register` | ✅ |
| `signOut()` | Limpa localStorage + cookie | ✅ |
| `checkUserSession()` | `GET /api/core/identity/me` | ✅ |

O JWT é persistido em `localStorage` + cookie via `setSession()`. Em cada refresh, o `AuthProvider` valida o token em `/me` e restaura a sessão automaticamente sem novo login.

---

#### 2. OAuth Social Login
Fluxo completo via `api.asppibra.com`:
```
Clica "Google" ou "GitHub"
  → GET api.asppibra.com/api/core/identity/oauth/{provider}/login
  → Redireciona para o provedor OAuth
  → Callback: api.asppibra.com/api/core/identity/oauth/{provider}/callback
  → Backend: upsert usuário D1 → gera JWT
  → Redirect: www.asppibra.com/auth/oauth/callback?token=JWT
  → Frontend: setSession(token) + window.location.href → Dashboard ✅
```

| Provedor | Status | Observação |
|---|---|---|
| **GitHub** | ✅ Em produção | OAuth App ID: `ASPPIBRA DAO` |
| **Google** | ✅ Em produção | OAuth App Name: `Cliente Web 1` |

> **Nota técnica:** `src/app/auth/oauth/callback/page.tsx` usa `window.location.href` (full reload) em vez de `router.replace()` para evitar race condition com o `AuthProvider`. Envolto em `<Suspense>` (obrigatório no App Router).

---

#### 3. Web3 SIWE — Sign-In With Ethereum
Fluxo completo sem dependências pesadas (`viem` + `window.ethereum`):
```
Clica "Web3 Wallet (SIWE)"
  → Detecta window.ethereum (MetaMask / Brave Wallet)
  → eth_requestAccounts → endereço com checksum EIP-55
  → GET /api/core/identity/web3/nonce?address=0x...
  → personal_sign da mensagem na carteira
  → POST /api/core/identity/web3/verify {message, signature, address}
  → Backend: viem.verifyMessage → upsert shadow user → JWT
  → setSession(token) + window.location.href → Dashboard ✅
```

| Arquivo | Função |
|---|---|
| `src/auth/hooks/use-siwe.ts` | Hook com máquina de estados (idle/connecting/signing/verifying/error) |
| `src/auth/view/sign-in-web3-button.tsx` | Botão com spinner e Alert de erro inline |

**Carteiras suportadas:** MetaMask, Brave Wallet, qualquer `window.ethereum` injetado.

---

### ⏳ Próximas Fases (Roadmap)

| Item | Prioridade | Descrição |
|---|---|---|
| RBAC `RoleBasedGuard` | Alta | Guard que verifica `role` do usuário para rotas de admin |
| Dashboard `user/account` | Média | Conectar perfil, senha e sociais a endpoints `/me` |
| Dashboard `user/list` (admin) | Média | Listar/editar usuários via `GET/PUT /api/users` |

---

1. **Fase 2 — RBAC**: Implementar `RoleBasedGuard` e proteger rotas de administrador com base no JWT.
2. **Fase 3 — Dashboard de conta**: Conectar perfil pessoal, troca de senha e configurações sociais.
3. **Fase 4 — Dashboard de admin**: Listar, criar e editar usuários com proteção de role.

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

O `sitemap.ts` agora consome diretamente a API de posts do Backend, garantindo que novos conteúdos publicados via Dashboard apareçam instantaneamente para os crawlers (Google/Bing) sem necessidade de re-build do frontend.

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

### 🖋️ Como Publicar Conteúdo
O fluxo de publicação é 100% automatizado através do Dashboard:

1.  **Acesse o Dashboard**: Vá para `Dashboard > Blog > Novo Post`.
2.  **Crie seu Post**: O upload da imagem de capa vai direto para o Cloudflare R2 e os dados para o D1.
3.  **Deploy Automático de SEO**: O sistema fará o resto automaticamente:
    - O **Sitemap Dinâmico** (`sitemap.ts`) incluirá a nova URL na próxima varredura.
    - A **Página do Post** estará disponível imediatamente com SEO otimizado.

### 🔍 Ferramentas de Validação e Diagnóstico (Padrão 2026)

Para garantir que a infraestrutura de SEO, a saúde técnica e a experiência do usuário (UX) estejam operando em nível de elite, utilize estas ferramentas oficiais:

* **[PageSpeed Insights](https://pagespeed.web.dev/)**: O validador definitivo dos **Core Web Vitals**. Essencial para garantir que o carregamento (**LCP**) e a estabilidade visual (**CLS**) do app **SocialFi** estejam abaixo dos limites críticos de **2.5s**.
* **[Google Search Console](https://search.google.com/search-console)**: O centro de comando para monitorar a indexação, detectar erros de rastreio e visualizar como a **ASPPIBRA-DAO** aparece nos resultados reais de busca.
* **[Google Rich Results Test](https://search.google.com/test/rich-results)**: Verifica se os seus geradores dinâmicos de **JSON-LD** estão criando dados estruturados válidos, tornando as páginas elegíveis para **Rich Snippets** (estrelas, preços de tokens, FAQs).
* **[Schema Markup Validator](https://validator.schema.org/)**: Ferramenta da **Schema.org** para uma validação técnica mais profunda de todas as entidades semânticas injetadas no código, garantindo que a hierarquia de dados esteja impecável.
