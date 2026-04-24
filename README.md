# 🌐 Mundo Digital: ASPPIBRA DAO Ecosystem
## 🏛️ A Ponte Definitiva entre Ativos Reais e Governança Descentralizada

> **Infraestrutura de Elite baseada em Blockchain que conecta RWA (Real World Assets) ao DeFi com Inteligência Artificial, operando sobre uma rede descentralizada de governança sem fronteiras.**

---

### 🚀 Stack Tecnológica (Bleeding Edge 2026)

| Layer | Technology | Status | Badge |
| :--- | :--- | :--- | :--- |
| **Framework** | Next.js 16.1.6 (App Router) | ✅ Stable | ![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=flat&logo=next.js) |
| **Runtime** | Node.js 24.x / Edge Runtime | ✅ Stable | ![Node](https://img.shields.io/badge/Node.js-24-green?style=flat&logo=node.js) |
| **UI Library** | React 19.2.4 | ✅ Stable | ![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=flat&logo=react&logoColor=black) |
| **Styling** | Material UI 7.3.7 + HSL Tailored | ✅ Design System | ![MUI](https://img.shields.io/badge/MUI-7.3.7-007FFF?style=flat&logo=mui&logoColor=white) |
| **Blockchain** | Wagmi 3.6.4 + Viem 2.48.1 | ✅ Integrated | ![Wagmi](https://img.shields.io/badge/Wagmi-3.6.4-3E67B1?style=flat&logo=web3.js&logoColor=white) |
| **Query Engine** | TanStack Query 5.100 / SWR 2.3 | ✅ Enterprise | ![Query](https://img.shields.io/badge/TanStack-5.1-FF4154?style=flat&logo=react-query&logoColor=white) |
| **Identity** | SIWE + Jose (JWT) + Auth Guard | ✅ Hardened | ![Auth](https://img.shields.io/badge/Auth-SIWE-blueviolet?style=flat&logo=ethereum) |

---

## 🗺️ Mapa de Arquitetura & Governança (On-Chain/Off-Chain)

```text
/src/
├── app/ (Framework Principal)
│   ├── dashboard/ (Portal Privado DAO)
│   │   ├── governance/ (Votações & Propostas - Placeholder Sync)
│   │   ├── treasury/ (Ativos RWA & Vaults - Placeholder Sync)
│   │   ├── bounties/ (Recompensas por Contribuição)
│   │   ├── user/ (Gestão de Identidade & Perfil)
│   │   │   ├── [id]/edit (Gestão Admin de Membros)
│   │   │   ├── account (Configurações Pessoais)
│   │   │   ├── cards (Cartão de Cidadania DAO)
│   │   │   └── list (Diretório Público de Membros)
│   │   └── post/ (Gestão de Comunicação & Blog)
│   │
│   ├── auth/ (Fluxos de Acesso)
│   │   ├── sign-in/ (Login Híbrido: Local + Social + Web3)
│   │   └── oauth/callback (Sincronização de Provedores)
│   │
│   └── post/ (Frontend Público SEO-Focused)
│
├── auth/ (Core de Segurança)
│   ├── context/
│   │   ├── auth-provider.tsx (SSOT de Identidade JWT)
│   │   └── web3-provider.tsx (Configuração Wagmi Multi-Chain)
│   │
│   ├── guard/
│   │   ├── auth-guard.tsx (Barreira de Autenticação)
│   │   ├── role-based-guard.tsx (Barreira de Cargo Administrativo)
│   │   └── has-permission.tsx (Guard Híbrido: RBAC + Token-Gating)
│   │
│   └── hooks/
│       ├── use-siwe.ts (Assinatura EIP-4361 via Wagmi)
│       └── use-token-gating.ts (Verificação de Saldo On-Chain)
│
├── layouts/ (Design System & Navigation)
│   ├── dashboard/ (Layout com Sidebar Dinâmica)
│   └── nav-config-dashboard.tsx (Hook useNavData com Inteligência de Roles)
│
├── proxy.ts (Next.js Edge Middleware - Blinda rotas administrativas decodificando JWTs)
│
├── global-config.ts (Central de Configurações: R2, SEO, API, Roles)
│
└── Infraestrutura (Cloudflare Stack)
    ├── Backend: Hono Web Standards (Edge Workers)
    ├── DB: D1 (SQLite Distribuído)
    ├── CDN/Storage: R2 (S3 Standard)
    └── Cache: Cloudflare KV (Rate-Limiting & Session)
```

---

## 🔐 1. Identidade & Segurança (Identity Hub)

O ASPPIBRA DAO utiliza um sistema de **Identidade Soberana Híbrida**, permitindo a transição fluida entre Web2 e Web3.

### ⛓️ Web3 Foundation (Wagmi + SIWE)
- **Framework**: Wagmi v3.
- **Provider**: `Web3Provider` injetado no root layout para gestão global de carteiras.
- **Assinatura**: O hook `useSiwe` utiliza o protocolo **EIP-4361** para garantir que a autenticação seja assinada on-chain e validada off-chain de forma impenetrável.
- **Redirecionamento Inteligente**: Após o login, o sistema detecta o cargo (`admin`, `citizen`) e redireciona instantaneamente para a seção correta da DAO.

### 🛡️ RBAC de Borda (Edge Security)
O portal implementa **Defesa em Profundidade**:
1.  **Network Level (`proxy.ts`)**: Decodifica o JWT no Edge e bloqueia rotas administrativas para cidadãos antes da renderização.
2.  **Route Level (`RoleBasedGuard`)**: Layouts protegidos que impedem o acesso a `/dashboard/post` e `/user/list`.
3.  **Component Level (`HasPermission`)**: Esconde elementos de UI (botões de saque, deleção) baseando-se em Cargos ou posse de Tokens (SBTs).

---

## 🛠️ 2. Guia de Operação e Manutenção

O sistema está otimizado para o padrão **Enterprise 2026**.

1.  **Gestão de Conteúdo**: O Dashboard gera auditorias automáticas no D1 e limpa assets órfãos no R2 a cada exclusão.
2.  **Sincronização de Cookies**: O `AuthProvider` garante que o cookie `accessToken` esteja sempre espelhado no estado local para que o Middleware (Proxy) tome decisões de rota em milissegundos.
3.  **Ambiente de Desenvolvimento**: 
    - `pnpm dev`: Inicia o frontend com suporte a Turbopack.
    - O frontend consome a API de produção em `api.asppibra.com` via Axios Interceptors com tratamento detalhado de erros 401/403.

---

## 🚀 3. Arquitetura de SEO & Performance (Padrão Elite)

> **STATUS:** 🟢 **100% AUDITADO E CONCLUÍDO (SEO YMYL)**

### 🌳 Pilares Estratégicos
- **Automação Total**: `robots.ts` e `sitemap.ts` são geradores dinâmicos sincronizados com o banco de dados Cloudflare D1.
- **Metadados Programáticos**: Uso exaustivo de `generateMetadata` para evitar canibalização de conteúdo.
- **Social Engagement (Satori)**: Geração dinâmica de imagens OpenGraph (Cards Sociais) via código React.
- **Compliance de IA**: Arquivos `llms.txt` e `ai-policy.txt` para instrução de agentes de IA e prevenção de alucinações de dados.
- **E-E-A-T**: Seções de transparência e autoridade (`/about`, `/editorial-policy`, `/fact-checking`) integradas.

---

## 🏁 4. Roadmap de Evolução

- [x] **Fase 1-3**: Implementação de RBAC, Web3 Layer e SEO Enterprise.
- [ ] **Fase 4 - Smart Contracts**: Sincronização dos placeholders de Governança com contratos Hardhat/Foundry.
- [ ] **Fase 5 - Automação CI/CD**: Workflow de deploy atômico Frontend/Backend.
- [ ] **Fase 6 - RWA Vaults**: Visualização em tempo real de ativos de terra e imóveis no dashboard Treasury.

---

## 🔍 Ferramentas de Diagnóstico
Para manter o padrão **10/10**, utilize regularmente:
- **PageSpeed Insights**: Mantém LCP < 2.5s e CLS < 0.1.
- **Search Console**: Validação de URLs dinâmicas e indexação D1.
- **Rich Results Test**: Verificação de Schemas JSON-LD injetados pelo `json-ld.tsx`.

---
> **ASPPIBRA DAO: A Revolução da Posse e Governança.** 🚀🛡️💎
