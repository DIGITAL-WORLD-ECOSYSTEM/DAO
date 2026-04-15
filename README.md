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

## 🗺️ Documentação Completa do Sistema de Blog: Fase Final

Este documento será o seu guia completo para finalizar o sistema de blog.

O sistema de blog foi construído com uma filosofia de **desenvolvimento progressivo**. Ele começa com uma implementação simples e autocontida (usando dados "mockados") que permite o desenvolvimento rápido da interface do usuário (UI), mas já possui toda a estrutura e as abstrações necessárias para escalar para uma solução de produção robusta, com renderização no servidor (SSR) e conectada a uma API real.

Esta documentação descreve o estado atual e detalha as peças faltantes necessárias para completar a transição para a arquitetura final.

### Árvore de Arquitetura e Peças Faltantes

```
/src/
├── _mock/
│   └── _blog.ts
│       ├── ESTADO ATUAL: Fonte de dados temporária (placeholder). Funciona como um "banco de dados" falso
│       │   para o desenvolvimento da UI.
│       └── └──> PEÇA FALTANTE FINAL: Este arquivo se tornará obsoleto. Após a conexão com a API, ele
│                  poderá ser completamente DELETADO ou mantido apenas como referência para testes.
│
├── actions/
│   ├── blog-ssr.ts
│   │   ├── ESTADO ATUAL: Contém Server Actions (`getPosts()`) que buscam dados do `_mock` file.
│   │   │   Está no local perfeito para a lógica de back-end do front-end.
│   │   └── └──> PEÇAS FALTANTES PARA FINALIZAÇÃO:
│   │       │   1.  [LÓGICA DE API] Modificar `getPosts()` para fazer uma requisição `fetch` ao
│   │       │       endpoint `GET /api/posts` da sua API real.
│   │       │   2.  [LÓGICA DE API] Criar e exportar novas Server Actions:
│   │       │       - `getPostBySlug(slug: string)` (chamará `GET /api/posts/{slug}`).
│   │       │       - `getPostsByCategory(category: string)` (chamará `GET /api/posts?category={category}`).
│   │
│   └── mappers/
│       └── blog-mapper.ts
│           ├── ESTADO ATUAL: Transforma os dados do `_mock` para o formato que a UI precisa.
│           │   É uma camada de anti-corrupção que protege sua UI de mudanças no back-end.
│           └── └──> PEÇA FALTANTE PARA FINALIZAÇÃO:
│               │   1.  [AJUSTE DE DADOS] Atualizar a lógica do mapper para que ele saiba como
│               │       transformar a resposta JSON da sua API real (que virá do `fetch` nas
│               │       `actions`) para o formato que os componentes esperam.
│
├── app/
│   ├── (public)/post/
│   │   ├── page.tsx
│   │   │   ├── ESTADO ATUAL: Lista de posts (`/post`) renderizada no cliente.
│   │   │   └── └──> PEÇAS FALTANTES PARA FINALIZAÇÃO:
│   │   │       │   1.  [REATORAÇÃO PARA SSR] Remover a diretiva `'''use client'''`.
│   │   │       │   2.  [REATORAÇÃO PARA SSR] Transformar a função da página em `async`.
│   │   │       │   3.  [REATORAÇÃO PARA SSR] Chamar `await getPosts()` (a Server Action atualizada).
│   │   │       │   4.  [REATORAÇÃO PARA SSR] Passar os posts recebidos para o componente de view.
│   │   │
│   │   ├── [title]/page.tsx
│   │   │   ├── ESTADO ATUAL: Página de um post individual (`/post/[slug]`) renderizada no cliente.
│   │   │   └── └──> PEÇAS FALTANTES PARA FINALIZAÇÃO:
│   │   │       │   1.  [REATORAÇÃO PARA SSR] Remover `'''use client'''`, tornar a função `async`.
│   │   │       │   2.  [REATORAÇÃO PARA SSR] Usar o `slug` dos parâmetros da página para chamar
│   │   │       │       `await getPostBySlug(slug)`.
│   │   │       │   3.  [REATORAÇÃO PARA SSR] Passar o post recebido para o componente de detalhes.
│   │   │
│   │   └── category/[slug]/page.tsx
│   │       └── └──> PEÇAS FALTANTES PARA FINALIZAÇÃO:
│   │           │   1.  [REATORAÇÃO PARA SSR] Seguir os mesmos passos das páginas anteriores,
│   │           │       usando a Server Action `getPostsByCategory(slug)`.
│   │
│   └── dashboard/
│       └── post/
│           ├── new/page.tsx e [title]/edit/page.tsx
│           │   ├── ESTADO ATUAL: Formulários de criação e edição. A UI está pronta.
│           │   └── └──> PEÇAS FALTANTES PARA FINALIZAÇÃO:
│           │       │   1.  [LÓGICA DE API] Implementar a função `onSubmit` do formulário. Ela deve:
│           │       │       - Chamar uma Server Action (ex: `createPost` ou `updatePost`).
│           │       │       - Essa Server Action fará um `fetch` para `POST /api/posts` ou `PUT /api/posts/{id}`.
│           │       │   2.  [VALIDAÇÃO DE FORMULÁRIO] Usar uma biblioteca como `react-hook-form` com
│           │       │       `zodResolver` para dar feedback instantâneo ao usuário (ex: "O título
│           │       │       é obrigatório") antes de enviar os dados.
│           │       │   3.  [FEEDBACK DE UI] Implementar estados de carregamento (ex: desabilitar o
│           │       │       botão "Salvar" e mostrar um spinner) e notificações/toasts
│           │       │       (ex: "Post salvo com sucesso!") após a resposta da API.
│           │
│           └── page.tsx (Listagem no Dashboard)
│               └── └──> PEÇAS FALTANTES PARA FINALIZAÇÃO:
│                   │   1.  [LÓGICA DE API] Implementar a lógica para o botão "Deletar", que chamará
│                   │       uma Server Action `deletePost(id)` que, por sua vez, fará um `fetch`
│                   │       para `DELETE /api/posts/{id}`.
│                   │   2.  [FEEDBACK DE UI] Adicionar um modal de confirmação ("Você tem certeza?")
│                   │       antes de deletar um post.
│
└── __tests__/ (Diretório Inexistente)
    └── └──> PEÇA FALTANTE PARA FINALIZAÇÃO:
        │   1.  [GARANTIA DE QUALIDADE] Criar um diretório de testes.
        │   2.  [TESTES UNITÁRIOS] Escrever testes para o `blog-mapper.ts` para garantir que a
        │       transformação dos dados da API sempre funcione como esperado.
        │   3.  [TESTES DE INTEGRAÇÃO] Escrever testes para as `Server Actions` em `blog-ssr.ts`
        │       para garantir que elas conseguem se comunicar com a API (usando um mock da API).
```

### Roadmap de Finalização

Para concluir o sistema, siga estas fases em ordem:

1.  **Fase 1: Construir ou Definir a API (O Back-end)**
    *   **Tarefa:** Decida e configure sua fonte de dados (Headless CMS, API customizada).
    *   **Resultado Esperado:** Você deve ter uma URL base de API e endpoints funcionais para `GET`, `POST`, `PUT` e `DELETE` de posts.

2.  **Fase 2: Conectar o Front-end ao Back-end (Camada de Dados)**
    *   **Tarefa:** Implementar todas as `PEÇAS FALTANTES` nos diretórios `actions/` e `mappers/`.
    *   **Resultado Esperado:** Suas Server Actions agora se comunicam com a API real, e o mapper traduz os dados corretamente. O _mock file pode ser deletado.

3.  **Fase 3: Ativar a Renderização no Servidor (Otimização)**
    *   **Tarefa:** Implementar as `PEÇAS FALTANTES` nas páginas públicas (`app/(public)/post/`).
    *   **Resultado Esperado:** O blog público agora é renderizado no servidor, resultando em SEO e performance máximos.

4.  **Fase 4: Finalizar o Dashboard (Funcionalidade de Admin)**
    *   **Tarefa:** Implementar as `PEÇAS FALTANTES` nas páginas do `dashboard/post/`.
    *   **Resultado Esperado:** Administradores podem agora criar, editar e deletar posts de verdade, com validação de formulário e feedback claro da interface.

5.  **Fase 5: Adicionar Testes (Garantia de Qualidade)**
    *   **Tarefa:** Criar o diretório de testes e escrever testes unitários e de integração.
    *   **Resultado Esperado:** O sistema está robusto, e futuras alterações podem ser feitas com a segurança de que as funcionalidades principais não serão quebradas.

---

## 🔐 Documentação Auditada: Sistema de Autenticação, Dashboard & RBAC

### Filosofia de Arquitetura (Revisada)

O sistema utiliza **Context API** para gerenciamento de estado e **JWT** para sessão. A arquitetura está preparada para um sistema de **Controle de Acesso Baseado em Função (RBAC)**, onde as funcionalidades do dashboard são segregadas entre usuários padrão e administradores. A proteção de rotas deve ser granular, permitindo acesso com base na função (`role`) do usuário, que deve ser parte do seu objeto de dados no `AuthContext`.

### Árvore de Arquitetura, Estado Real e Peças Faltantes Detalhadas

```
/src/
├── auth/
│   ├── context/jwt/
│   │   ├── auth-context.ts
│   │   │   └── └──> PEÇA FALTANTE: A interface `AuthContextType` precisa ser enriquecida. O objeto
│   │   │              `user` deve obrigatoriamente conter uma propriedade `role: 'admin' | 'user'`.
│   │   │
│   │   └── auth-provider.tsx
│   │       └── └──> PEÇAS FALTANTES CRÍTICAS:
│   │           │   1.  [LÓGICA DE API] Implementar `login`, `register`, `logout` com chamadas `fetch`.
│   │           │   2.  [VALIDAÇÃO DE SESSÃO] No `useEffect` inicial, validar o token JWT
│   │           │       com o endpoint `GET /api/auth/me`. A resposta deste endpoint DEVE incluir
│   │           │       os dados do usuário, incluindo sua `role`.
│   │           │   3.  [ATUALIZAÇÃO DE ESTADO] Adicionar um novo método ao contexto,
│   │           │       `revalidateUser()`, que refaça a chamada `GET /api/auth/me` para
│   │           │       atualizar os dados do usuário na UI após uma edição de perfil, sem
│   │           │       exigir um novo login.
│   │
│   └── guard/
│       └── auth-guard.tsx
│           └── └──> PEÇA FALTANTE CRÍTICA: O `AuthGuard` atual é insuficiente. Ele precisa
│                      ser refatorado ou complementado por um `RoleBasedGuard` que:
│                      1. Receba as `roles` permitidas como prop (ex: `<RoleBasedGuard roles={['admin']}>`).
│                      2. Verifique se a `role` do usuário no `AuthContext` corresponde à permitida.
│                      3. Redirecione para uma página de "Acesso Negado" (403 Forbidden) caso contrário.
│
├── app/
│   ├── auth/  (Login e Registro - Sem mudanças na análise)
│   │
│   └── dashboard/
│       ├── layout.tsx
│       │   └── └──> PEÇA FALTANTE: Envolver este layout com o `<AuthGuard>` básico para garantir que
│       │              *qualquer* acesso a `/dashboard` exija login.
│       │
│       ├── page.tsx
│       │   ├── ESTADO ATUAL: Página principal de overview do Dashboard.
│       │   └── └──> PEÇA FALTANTE: Conectar os cards e estatísticas a endpoints da API
│       │              (ex: `GET /api/stats/dashboard`).
│       │
│       ├── user/
│       │   ├── list/page.tsx
│       │   │   ├── ESTADO ATUAL: Tabela para listar todos os usuários. **(Função de Admin)**
│       │   │   └── └──> PEÇA FALTANTE:
│       │   │       │   1. Proteger esta rota com `<RoleBasedGuard roles={['admin']}>`.
│       │   │       │   2. Conectar à API com `GET /api/users` para popular a lista.
│       │   │
│       │   ├── new/page.tsx
│       │   │   ├── ESTADO ATUAL: Formulário para criar um novo usuário. **(Função de Admin)**
│       │   │   └── └──> PEÇA FALTANTE:
│       │   │       │   1. Proteger com `<RoleBasedGuard roles={['admin']}>`.
│       │   │       │   2. Conectar o `onSubmit` a `POST /api/users`.
│       │   │
│       │   ├── [id]/edit/page.tsx
│       │   │   ├── ESTADO ATUAL: Formulário para editar um usuário existente. **(Função de Admin)**
│       │   │   └── └──> PEÇA FALTANTE:
│       │   │       │   1. Proteger com `<RoleBasedGuard roles={['admin']}>`.
│       │   │       │   2. Conectar a `GET /api/users/{id}` para preencher os dados e a `PUT /api/users/{id}` para salvar.
│       │   │
│       │   └── account/
│       │       ├── layout.tsx
│       │       │   └── ESTADO ATUAL: Layout para a seção de conta do usuário. **(Função de Usuário Logado)**
│       │       │
│       │       ├── page.tsx (Perfil Geral)
│       │       │   └── └──> PEÇA FALTANTE: Conectar o formulário a `PUT /api/users/me` para que o usuário
│       │       │              edite seus próprios dados (nome, email, etc.).
│       │       │
│       │       ├── change-password/page.tsx
│       │       │   └── └──> PEÇA FALTANTE: Conectar a `POST /api/users/me/change-password`.
│       │       │
│       │       ├── notifications/page.tsx
│       │       │   └── └──> PEÇA FALTANTE: Conectar a um endpoint `PUT /api/users/me/settings/notifications`.
│       │       │
│       │       └── socials/page.tsx
│       │           └── └──> PEÇA FALTANTE: Conectar a `PUT /api/users/me/settings/socials`.
```

### Roadmap de Finalização Detalhado (Auditado)

1.  **Fase 1: Expandir a API de Identidade**
    *   **Tarefas:** Além do login/registro, criar os endpoints para:
        *   **(Admin)** `GET /api/users`, `POST /api/users`, `GET /api/users/{id}`, `PUT /api/users/{id}`.
        *   **(Usuário)** `PUT /api/users/me` e endpoints específicos para senha, notificações, etc.
    *   **Resultado:** Uma API completa que suporta tanto o gerenciamento de conta pessoal quanto a administração de usuários.

2.  **Fase 2: Implementar o Controle de Acesso (RBAC)**
    *   **Tarefas:**
        *   Adicionar a propriedade `role` ao objeto `user` no `AuthContext`.
        *   Garantir que a API retorne a `role` do usuário nos endpoints `/login` e `/me`.
        *   Implementar o `RoleBasedGuard` que verifica a `role` do usuário.
    *   **Resultado:** A aplicação agora tem a capacidade de diferenciar `admin` de `user`.

3.  **Fase 3: Conectar e Proteger o Dashboard de ADMIN**
    *   **Tarefas:**
        *   Proteger as rotas em `dashboard/user/list/`, `new/`, e `[id]/edit/` com o `RoleBasedGuard`.
        *   Conectar as páginas aos seus respectivos endpoints da API de administração de usuários.
    *   **Resultado:** Apenas administradores podem visualizar, criar e editar outros usuários.

4.  **Fase 4: Conectar o Dashboard de CONTA PESSOAL**
    *   **Tarefas:**
        *   Conectar as páginas em `dashboard/user/account/` (perfil, senha, sociais) aos endpoints `.../me/...`.
        *   Após uma atualização de perfil, chamar o método `revalidateUser()` do contexto para atualizar a UI.
    *   **Resultado:** Usuários logados podem gerenciar com segurança suas próprias informações.

5.  **Fase 5: Conectar a UI de Autenticação (Login/Registro)**
    *   **Tarefa:** Implementar os formulários de `login` e `register` para chamar os métodos do `AuthContext`, com feedback de UI (erros, loading).
    *   **Resultado:** O fluxo de entrada na aplicação está completo e funcional.

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
