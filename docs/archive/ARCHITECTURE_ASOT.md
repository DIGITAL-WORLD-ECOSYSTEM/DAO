# ASPPIBRA DAO - Architecture Source of Truth (ASoT)
*Versão: 1.0.0 (Master Global)*
*Data da Auditoria: 18/07/2026*

# ==============================================================================
# DOCUMENTAÇÃO VIVA (LIVING DOCUMENTATION)
# REGRA OBRIGATÓRIA DO PROJETO
# ==============================================================================

Sempre que qualquer arquivo pertencente à plataforma for criado,
removido, renomeado, movido ou alterado, esta documentação DEVE ser
integralmente auditada e atualizada.

A documentação é considerada parte do código.

Nenhum Pull Request poderá ser considerado concluído enquanto a
Architecture Source of Truth (ASoT) não refletir exatamente o estado físico
do repositório.

O agente responsável pela atualização deve realizar obrigatoriamente
uma auditoria completa antes de modificar este documento.
A atualização nunca poderá ser incremental baseada apenas na alteração realizada.
Ela deve reconstruir toda a visão arquitetural.

---

## 1. Auditoria Física (Mapeamento Macro)

O ecossistema é dividido fisicamente em dois monorepos práticos:
- **`dashboard/`**: Frontend React, Vite, MUI. Responsável pela UX de todos os domínios (Banking, DAO, Auth).
- **`backend/`**: Servidor Serverless rodando em Cloudflare Workers (Hono), expondo APIs RESTful conectadas ao banco D1 (SQLite) via Drizzle ORM.
- **`backend/src/db/`**: Camada de persistência.
- **`dashboard/src/sections/`**: Bounded Contexts visuais.

---

## 2. Auditoria das Pastas (Árvore Global)

```text
DAO/
├── backend/
│   ├── migrations/         (Estado histórico do D1)
│   ├── src/
│   │   ├── db/             (schema.ts e index.ts)
│   │   ├── middleware/     (auth, rbac)
│   │   ├── routes/
│   │   │   ├── core/       (identity, compliance, health, webhooks)
│   │   │   ├── platform/   (email, governance, identity, payments, storage, treasury)
│   │   │   └── products/   (agro, exchange, real-estate, rwa)
│   │   ├── services/       (audit, market)
│   │   ├── types/          (bindings)
│   │   ├── utils/          (crypto, did_resolver)
│   │   └── validators/     (auth, email, real-estate)
│   └── wrangler.toml       (CF Deploy configs)
├── dashboard/
│   ├── public/             (assets, mock json)
│   ├── src/
│   │   ├── actions/        (data fetching legados)
│   │   ├── auth/           (JWT Guards e Context)
│   │   ├── components/     (Shared Dumb Components, charts, ui)
│   │   ├── layouts/        (Dashboard, Auth wrappers)
│   │   ├── pages/          (Entrypoints das rotas React Router)
│   │   ├── routes/         (Definições e paths)
│   │   └── sections/       (Bounded Contexts de UX)
│   │       ├── auth/
│   │       ├── banking/    (conta, transacoes)
│   │       ├── blog/
│   │       ├── chat/
│   │       ├── error/
│   │       ├── file-manager/
│   │       ├── invoice/
│   │       ├── overview/   (Hubs globais)
│   │       ├── payment/
│   │       ├── tour/
│   │       └── user/
```

---

## 3. Inventário dos Arquivos (Core)

*(Sumário dos arquivos vitais de arquitetura)*

- **`backend/src/db/schema.ts`**: (Schema) | Global | Produção | Fonte primária do modelo de dados.
- **`backend/src/routes/platform/treasury.ts`**: (API) | Banking | Produção | Agregador financeiro, TVL e Extrato.
- **`backend/src/routes/core/identity/local.ts`**: (API) | Auth | Produção | Onboarding de Users/Citizens.
- **`dashboard/src/sections/banking/conta/view/conta-view.tsx`**: (View) | Banking | Produção | Smart Component do subledger pessoal.
- **`dashboard/src/sections/banking/conta/mocks/mock-accounts.ts`**: (Mock) | Banking | Mock | Objeto hardcoded. 
- **`dashboard/src/auth/guard/auth-guard.tsx`**: (Guard) | Security | Produção | Protege acesso via JWT.

---

## 4. Auditoria das APIs

| Endpoint | Controlador | Banco lido | DTO In/Out | Permissões | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET /platform/identity/profile` | `identity.ts` | `citizens`, `users` | CitizenDTO | JWT, RBAC | Produção |
| `GET /platform/treasury/citizen/:id/ledger`| `treasury.ts` | `citizens`, `treasury`, `contracts` | IFinancialProfile | JWT | Produção |
| `POST /platform/treasury/transactions` | `treasury.ts` | `treasuryLedger` | JSON Payload | Admin Only | Produção |
| `GET /platform/payments` | `payments.ts` | N/A | {status: active} | Public | Mock |
| `GET /products/real-estate` | `real-estate.ts`| `reProperties` | RwaDTO | Public | Parcial |

---

## 5. Auditoria dos Hooks (Frontend SWR)

- **`useBankAccount`**: (Mock) - Substitui latência, lê de `mock-accounts.ts`. Alimenta `ContaView`.
- **`useFinancialHistory`**: (Produção) - SWR Fetch para `/platform/treasury/citizen/:id/ledger`. Alimenta `FinancialHistoryView`.
- **`useAuthContext`**: (Produção) - Obtém o estado Global JWT. Alimenta Guards e NavBar.

---

## 6. Auditoria dos Componentes (Padrão View/Components)

**Padrão Exigido:** Smart Components ficam nas pastas `view/`. Dumb Components ficam nas subpastas `components/` ou em `src/components/shared/`.
- **`ContaView`**: Smart. Possui lógica de SWR.
- **`AccountAssets`**: Dumb. Apenas renderiza tabela baseada em props.
- **`QrCodeModal`**: Shared (Dumb). Interage via Props para renderizar PIX/Crypto em formato de imagem QR.

---

## 7. Auditoria do Banco de Dados (D1 SQLite Schema)

| Tabela | Owner (Domínio) | PK | Relacionamentos (FK) | Quem Grava | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `users` | Auth | `id` | - | Identity API | Produção |
| `citizens` | Identity | `id` | `userId` | Identity API | Produção |
| `treasuryLedger` | Treasury | `id` | `citizenId` | Treasury API | Produção |
| `auditLogsImmutable`| Security | `id` | `userId` | Middlewares | Produção |
| `wallets` | Blockchain | `id` | `userId` | Identity API | Parcial |
| `contracts` | Finance | `id` | `userId` | N/A | Parcial |
| `reProperties` | RWA | `id` | `creatorWallet` | N/A | Produção |
| `govProposals` | DAO | `id` | `proposer` (citizen) | Governance API | Produção |
| `accounts` | Banking | `id` | `userId` | N/A | 🔴 GAP |
| `internalLedger` | Banking | `id` | `accountId` | N/A | 🔴 GAP |

---

## 8. Auditoria do Event Sourcing (Ledger)

O sistema de finanças é pautado pela imutabilidade.
- **Treasury Ledger (DAO):** Opera como Event Sourcing institucional. Não há `UPDATES` de valores, apenas inserções (`inbound`/`outbound`). O "Saldo DAO" é gerado agregando esta tabela (TVL = Soma In - Soma Out).
- **Internal Ledger (P2P):** Gap arquitetural. Faltam as tabelas e rotas para processar as trocas financeiras individuais dentro do sistema fiduciário.
- **Auditoria Universal:** Os Eventos Financeiros possuem um hash encadeado na tabela `auditLogsImmutable`.

---

## 9. Auditoria Blockchain (Web3)

- **RPC & Viem/Ethers:** O backend contém esquemas para rastrear os endereços (`rePropertyBlockchain`), mas *NÃO* opera nós ou scripts de *polling* para atualizar saldos periodicamente.
- **Wallet:** Funciona atualmente como um "cadastro de endereço".
- **NFT/Tokens RWA:** Modelados via `contracts` e `reProperties`, mas a custódia depende 100% da leitura da chain na camada externa.

---

## 10. Auditoria de Segurança e Governança

- **JWT:** Usado para stateless session validation no Hono (Backend) e Guards no Vite (Frontend).
- **RBAC:** Controle de Roles em middlewares de backend (`admin`, `citizen`).
- **LGPD:** Dados expostos sanitizados nos controllers antes do DTO JSON retornar ao frontend.
- **Immutable Hash Chain:** `auditLogsImmutable` assegura que apagamentos físicos de registros deixem o banco inválido e auditável criptograficamente.

---

## 11. Grafo de Dependências Macro

```text
Identity (Citizens/Auth)
  ├── DAO Governance (Proposals, Votes)
  ├── Treasury Ledger (DAO Funds, Transactions)
  │    └── Financial Aggregate (Extratos Pessoais)
  └── Wallet (Web3 Identity)
       └── RWA / Contracts (Ativos Reais Tokenizados)
```

---

## 12. GAP Analysis Automático

| Tipo | Local | Elemento | Descrição do Problema |
| :--- | :--- | :--- | :--- |
| **Mock** | Dashboard | `mock-accounts.ts` | Hardcoded saldos financeiros. Precisa ser substituído por API `InternalLedger`. |
| **Mock** | Backend | `payments.ts` | Retorna 200 `{status: active}` vazio. Não há integração gateway de PIX/Stripe. |
| **Dead Code** | Backend | RegEx Parser Treasury | Inferência de PIX lendo string `"referencia: pix"`. Precisa ser removido quando o Gateway for lançado. |
| **Gap** | Database | `Accounts` | Não há representação lógica para as "Agências/Contas Virtuais" do usuário. |
| **Gap** | Database | `InternalLedger`| Nenhuma tabela de transferências P2P fiat ou subledgers está persistida. |

---

## 13. Roadmap Macro

1. **[Planejado] Fase 1 (Fundação Bancária):** Criar `InternalLedger`, `Accounts` e extender `Wallets` no D1 `schema.ts`.
2. **[Planejado] Fase 2 (Extinção de Mocks):** Modificar a API `/account/me` para agregar os dados do Internal Ledger e conectar a UI de Banking ao SWR vivo.
3. **[Planejado] Fase 3 (Gateway Payments):** Desenvolver webhooks de PIX real em `payments.ts` gravando no `InternalLedger`.
4. **[Planejado] Fase 4 (Sync Web3):** Inserir Polling Worker (`viem`) para puxar saldos Ethereum/Polygon e injetar no Aggregate de saldos.
5. **[Experimental] Fase 5 (Multi-Moeda):** Open Finance e FX (Câmbio) via BaaS.

---

## 14. Architecture Decision Records (ADRs)

- **[Ativo] ADR-001 (Saldos Efêmeros):** O saldo (fiat, DAO) nunca é uma coluna estática (`balance: 50`), mas sempre computado pela leitura acumulada do Ledger de transações (Event Sourcing).
- **[Ativo] ADR-002 (Web3 as Truth):** A Blockchain é a fonte da verdade de saldos criptográficos; o banco apenas aponta para o endereço da Wallet.
- **[Ativo] ADR-003 (Separação Contábil):** Patrimônio da Instituição (Treasury) não se mistura com o Patrimônio Pessoal do usuário (Internal Ledger).
- **[Ativo] ADR-004 (Empty States Estritos):** É proibido iniciar interfaces financeiras exibindo saldo `R$ 0,00` ou *loaders* contínuos; a UX deve aguardar interação explícita (Privacy by Design).

---

## 15. Architecture Score (O Mestre)

- **Domain Driven Design (DDD):** `9/10` (Bounds claríssimos no Frontend e Backend).
- **Clean Architecture:** `10/10` (Hono Serverless puro, sem acoplamento de frameworks massivos, separação rígida D1/API/Vite).
- **Event Sourcing:** `7/10` (Operante para a DAO, porém o ambiente Pessoal precisa ser construído).
- **Security & Audit:** `10/10` (Padrão Forense impecável).
- **Blockchain Sync:** `3/10` (Dados mortos, precisa de Worker).

---

## 16. Matriz de Source of Truth Global

Se houver choque de realidade ou ideias novas, **ESTA TABELA ESTABELECE A LEI**.

- Identidade civil e KYC 👉 `Citizens` D1.
- Log de sistema 👉 `auditLogsImmutable` D1.
- Saldos da ASPPIBRA 👉 Eventos do `treasuryLedger` D1.
- Saldos Pessoais (BRL) 👉 Eventos do `InternalLedger` D1 (Futuro).
- Saldos Cripto 👉 Blockchain (On-chain, viem/rpc).
- Pagamentos 👉 Gateway Externo (Source of Truth Financeira Legal).

> **REGRA DE OURO DE DIVERGÊNCIA:**
> Se o Código desviar desta Documentação, o Código é a Verdade Absoluta. O Agente autônomo é legalmente obrigado a sobrescrever a ASoT para espelhar a realidade física do projeto e nunca mascarar débitos técnicos.

---
*(Fim da Documentação. Auditada e Sincronizada.)*
