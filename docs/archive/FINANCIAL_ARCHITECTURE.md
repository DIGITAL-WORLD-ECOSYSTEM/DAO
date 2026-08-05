# ASPPIBRA DAO - Ecossistema Financeiro
## Architecture Source of Truth (ASoT)
*Versão da Arquitetura: 3.0.0*
*Data da Auditoria: 18/07/2026*

## Resumo Executivo
Esta auditoria profunda reflete a arquitetura real, física e lógica do ecossistema financeiro (Web2/Web3) da ASPPIBRA DAO. Não há abstrações ou planos não implementados registrados como prontos. O sistema atual possui forte governança de Identidade e Tesouraria (DAO), mas demanda expansão no domínio de Custódia Pessoal e Pagamentos (Gateway) para completar a visão híbrida de banco.

---

## FASE 1 — Inventário Geral (Descoberta)

- **Identity & Citizen:** Implementados no backend e associados via D1.
- **Treasury Ledger:** Implementado (Eventos de caixa da DAO).
- **Conta / Account:** Módulo Frontend UI implementado e isolado, porém rodando em Mocks. Backend ausente.
- **Financial History:** Frontend UI implementada (produção) consumindo um Aggregate da Treasury API.
- **Wallet & Blockchain:** Tabelas base criadas (Identity Web3), mas sem RPC on-chain ativo para custódia de Cripto.
- **Contracts (RWA):** Schema implementado no backend (`reProperties`).
- **Payments / PIX:** Rota API existe apenas como *stub* (mock). Não há gateway. A dedução de PIX é legada via RegEx no ledger da DAO.
- **Audit:** Sistema forte e em produção (`auditLogsImmutable` com Hash Chain).

---

## FASE 2 — Árvore Completa (O que realmente existe)

```text
DAO/
├── backend/
│   ├── src/
│   │   ├── db/
│   │   │   └── schema.ts
│   │   ├── routes/
│   │   │   └── platform/
│   │   │       ├── identity.ts
│   │   │       ├── payments.ts
│   │   │       └── treasury.ts
│   │   ├── services/
│   │   │   └── audit.ts
│   │   └── utils/
│   │       ├── crypto.ts
│   │       ├── did_resolver.ts
│   │       └── timing_safe.ts
│
├── dashboard/
│   ├── src/
│   │   ├── pages/
│   │   │   └── dashboard/
│   │   │       └── banking/
│   │   │           ├── conta/
│   │   │           │   └── index.tsx
│   │   │           └── transacoes/
│   │   │               └── index.tsx
│   │   ├── sections/
│   │   │   └── banking/
│   │   │       ├── conta/
│   │   │       │   ├── components/
│   │   │       │   │   ├── account-actions.tsx
│   │   │       │   │   ├── account-assets.tsx
│   │   │       │   │   ├── account-selector.tsx
│   │   │       │   │   ├── account-summary.tsx
│   │   │       │   │   └── index.ts
│   │   │       │   ├── hooks/
│   │   │       │   │   ├── use-bank-account.ts
│   │   │       │   │   └── index.ts
│   │   │       │   ├── mocks/
│   │   │       │   │   ├── mock-accounts.ts
│   │   │       │   │   └── index.ts
│   │   │       │   ├── types/
│   │   │       │   │   ├── account.ts
│   │   │       │   │   ├── asset.ts
│   │   │       │   │   └── index.ts
│   │   │       │   ├── view/
│   │   │       │   │   └── conta-view.tsx
│   │   │       └── financial-history/
│   │   │           ├── components/
│   │   │           │   ├── financial-history-details.tsx
│   │   │           │   ├── financial-history-filters.tsx
│   │   │           │   ├── financial-history-table-filters-result.tsx
│   │   │           │   ├── financial-history-table-row.tsx
│   │   │           │   ├── financial-history-table-toolbar.tsx
│   │   │           │   └── index.ts
│   │   │           ├── hooks/
│   │   │           │   ├── use-financial-history.ts
│   │   │           │   └── index.ts
│   │   │           ├── types/
│   │   │           │   ├── financial-history.ts
│   │   │           │   └── index.ts
│   │   │           └── view/
│   │   │               └── financial-history-view.tsx
│   │   └── components/
│   │       └── shared/
│   │           └── qr-code-modal/
│   │               ├── qr-code-modal.tsx
│   │               └── index.ts
```

---

## FASE 3 — Inventário Técnico (Detalhado)

- **`dashboard/src/pages/dashboard/banking/conta/index.tsx`**: (Page) Importa e renderiza a ContaView. Produção.
- **`dashboard/src/sections/banking/conta/view/conta-view.tsx`**: (View) Orquestrador da página de Conta. Consome hooks. Produção.
- **`dashboard/src/sections/banking/conta/hooks/use-bank-account.ts`**: (Hook) Depende do Mock interno para simular fetching via SWR. Status: Mock (A evoluir).
- **`dashboard/src/sections/banking/conta/mocks/mock-accounts.ts`**: (Mock) Objeto estático falso. Status: Mock (A remover).
- **`backend/src/routes/platform/treasury.ts`**: (Route/Worker API) Responsável por expor Aggregate do Cidadão e registrar lançamentos institucionais na DAO. Utilizado pelo hook `use-financial-history`. Produção.
- **`backend/src/routes/platform/payments.ts`**: (Route) Placeholder vazio. Status: Mock (A criar).
- **`backend/src/db/schema.ts`**: (Schema) Definição do Drizzle ORM. Global. Produção.
- **`dashboard/src/components/shared/qr-code-modal/qr-code-modal.tsx`**: (Component) Modal genérico de código QR. Compartilhado entre Rede e Banking. Produção.

---

## FASE 4 — Banco de Dados (D1 SQLite Schema)

| Nome | Arquivo | Campos Principais | FK / Constraints | Quem Grava | Quem Lê | Source of Truth Para: |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `citizens` | `schema.ts` | `id`, `userId`, `cpf`, `did` | FK: `userId` | Identity API | Todas as APIs | Identidade |
| `treasuryLedger`| `schema.ts`| `id`, `citizenId`, `amount`, `type`| FK: `citizenId` | Treasury API| Treasury API| Balanço DAO |
| `wallets` | `schema.ts` | `id`, `userId`, `address`, `chain` | FK: `userId` | Identity API | N/A | Endereços Cripto |
| `contracts` | `schema.ts` | `userId`, `totalValue`, `paid` | FK: `userId` | Finance/RWA | Treasury API| Obrigações RWA |
| `auditLogs` | `schema.ts` | `action`, `metadata`, `hash` | - | All Services| Audit API | Forense Imutável |

*Nota: Tabelas cruciais ausentes do banco: `InternalLedger` e `Accounts` (ver GAP Analysis).*

---

## FASE 5 — APIs Oficiais (Mapeamento)

| Método | URL | Arquivo | Tabelas Lidas | DTO de Saída | Status | Quem Consome |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/platform/identity/profile` | `identity.ts` | `citizens`, `users` | CitizenDTO | Produção | Frontend Auth |
| `GET` | `/platform/treasury/metrics` | `treasury.ts` | `treasuryLedger` | MetricsDTO | Produção | Dashboard |
| `GET` | `/platform/treasury/citizen/:id/ledger` | `treasury.ts` | `citizens`, `contracts`, `treasuryLedger` | `IFinancialProfile` | Produção | Financial History (SWR) |
| `POST` | `/platform/treasury/transactions` | `treasury.ts` | `treasuryLedger` | TransactDTO | Produção | Backoffice Admin |
| `GET` | `/platform/payments` | `payments.ts` | - | { status: 'active' } | Mock | Ninguém |

---

## FASE 6 — Frontend (Arquitetura Visual)

**Domínio Banking:**
- **`Conta`**: Possui `ContaView` (Orquestrador) que injeta dados falsos no `AccountAssets` (Cartões, Saldos Fiat/Cripto) e `AccountSummary` (PIX/IBAN). Componentes visuais 100% íntegros (Design e UX perfeitos), mas fluxo de dados mockado.
- **`Financial History`**: Possui `FinancialHistoryView` e `FinancialHistoryTableRow`. Consome SWR real do Treasury. Dependência limpa. 100% Produção.

---

## FASE 7 — Fluxo de Dados Arquitetural

**O Fluxo Real Pessoal (Identidade -> Aggregate):**
```text
Login
  ↓
Identify (Worker)
  ↓
Permissions (AuthGuard UI)
  ↓
Account (Visual - Hooks puxam Mock)
  ↓
Financial History (Visual - Hooks puxam Real Aggregate)
  ↓
Aggregate Worker (`treasury.ts`)
  ↓
Consulta D1 (`citizens` + `treasuryLedger` + `contracts`)
```

---

## FASE 8 — Source of Truth (Donos Fatuais)

1. **Quem é dono da identidade?** `citizens` (Database D1)
2. **Quem é dono da conta?** Inexistente (Fake Mocks no UI)
3. **Quem é dono do saldo fiat?** Ninguém (Não existe internal ledger)
4. **Quem é dono do saldo macro DAO?** `treasuryLedger` (Calculado, não persistido)
5. **Quem é dono da wallet?** A tabela `wallets` registra a posse, mas a Blockchain dita o saldo real.
6. **Quem é dono da blockchain?** Smart Contracts (RPC Nodes On-Chain)
7. **Quem é dono do ledger (DAO)?** Domínio Treasury
8. **Quem é dono da auditoria?** Tabela `auditLogsImmutable`
9. **Quem é dono da custódia fiat?** BaaS / Provedor Bancário Externo (a conectar via Gateway)
10. **Quem é dono dos contratos RWA?** Tabelas `reProperties` e `contracts`
11. **Quem é dono dos pagamentos?** Gateway (Stripe/Bacen) que notificará via Webhook
12. **Quem calcula os saldos?** Aggregate API Endpoint (`treasury.ts`)
13. **Quem persiste os eventos?** Worker Database (Insert em Ledgers)
14. **Quem monta o Aggregate?** Controller do Worker (Sem cache atualmente)
15. **Quem entrega os DTOs?** O Worker final via JSON (response padronizado)

---

## FASE 9 — Ownership Matrix

| Entidade | Owner (Domínio) | Source of Truth | Consumidores | Produtores | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Citizen** | Identity | D1 `citizens` | API, Auth | Signup UI | ✅ Prod |
| **Account** | Banking | D1 `accounts` (Pendente) | Banking UI | Aggregate API | 🔴 Gap |
| **Fiat Balance** | Ledger | `InternalLedger` (Pendente) | Banking UI | Pagamentos API | 🔴 Gap |
| **DAO Balance** | Treasury | `treasuryLedger` | Analytics UI | Treasury API | ✅ Prod |
| **Wallet** | Blockchain | D1 `wallets` | Web3 Services | Auth UI / Web3 | 🟡 Parcial |
| **Payments** | Payments | Gateway Externo (Webhook) | InternalLedger | BaaS / Gateway | 🔴 Mock |
| **Audit Log** | Security | D1 `auditLogs` | Backoffice | Todas as APIs | ✅ Prod |

---

## FASE 10 — Dependências (Grafo Causal Real)

```text
Identity (Root Auth)
  ↓
Citizen (Permissões Físicas)
  ↓
Treasury Ledger (Eventos DAO)
  ↓
Aggregate Worker (Construção do DTO)
  ↓
Financial History (Consumidor SWR)
```
*(As dependências de Account, Payments e Internal Ledger estão cortadas na base física).*

---

## FASE 11 — Event Sourcing (O Motor da Verdade)

**Quais eventos existem hoje?**
No `treasuryLedger`, os eventos são inseridos sem deleção (Double Entry rudimentar macro):
- `inbound` (Pagamento recebido na DAO)
- `outbound` (Saída institucional)

**O que falta implementar na Conta Pessoal:**
O sistema precisa criar a tabela `internalLedger` com:
- Quem grava: `Payments API` (via webhook de liquidação).
- Quem lê e calcula: `Account API` (Aggregate).
- Quem faz reversão: Transação de sinal invertido inserida no Ledger.
- Quem gera auditoria: Middleware de API Worker.

---

## FASE 12 — Blockchain & Custódia On-Chain

A infraestrutura atual guarda tabelas para Wallets e Imóveis (`rePropertyBlockchain`).
- **Gaps:** Não existem bibliotecas ativas (`viem` ou `ethers.js`) rodando nos Workers para fazer *polling* de RPCs. 
- **O que significa:** O sistema "sabe" que a carteira X existe, mas não consulta o saldo real no Blockchain. Toda Custódia de Cripto on-chain exigirá implementação de RPC fetching.

---

## FASE 13 — Segurança e Auditoria

1. **JWT & RBAC:** Toda rota sensível (`identity`, `treasury`) é protegida pelo middleware `verifyAuth` ou `verifyRole`. Em produção.
2. **Audit Immutable:** Implementado em Schema. Utiliza `eventHash` e `previousHash` criando uma cadeia criptográfica anti-fraude. Exemplo primoroso de Security By Design.
3. **LGPD:** Dados sensíveis de `users` e `citizens` são expostos através de sanitização de Controllers antes de gerar o DTO.

---

## FASE 14 — Componentes Compartilhados

- **`qr-code-modal.tsx`:** Localizado em `src/components/shared/qr-code-modal`. 
  - **Uso:** Conta (Saldos Cripto/PIX) e Hub de Referência (Rede).
  - **Status:** Correto, isolado e seguindo melhores práticas. Não pertence a nenhum Bounded Context restrito (Domain-Agnostic).

---

## FASE 15 — Gap Analysis

- ✅ **Existe (Em Produção):** `Citizens`, `TreasuryLedger`, `UI Conta (UX)`, `UI Extrato (UX)`, `API Aggregate Histórico`, `Middlewares Auth`, `Audit Logs`.
- 🟡 **Parcial:** `Wallets` (Faltam colunas e consulta on-chain), `Contracts` (Sem motor automático).
- 🔴 **Mock (Precisa Refatorar):** Hook `useBankAccount` (Preso a `mock-accounts.ts`).
- ⚫ **Obsoleto:** Lógica de Regex para detectar pagamentos PIX dentro da rota de Tesouraria (Gambiarra legada que deve morrer quando o módulo de Payments existir).
- ❌ **Inexistente (Urgente):** Tabelas `accounts`, `internalLedger`, rotas reais em `payments.ts`.

---

## FASE 16 — Roadmap Técnico (Ordem Obrigatória)

| Prioridade | Fase | Domínio | Bloqueadores | Impacto |
| :--- | :--- | :--- | :--- | :--- |
| **P1** | **Fundação do D1** | Banking | Nenhum | ⚡ Alto (Libera UI Real) |
| Ação | Criar `internalLedger` (Event Sourcing), criar tabela `accounts`, atualizar `wallets` no schema.ts |
| **P2** | **Agregação e Extinção de Mock** | API/Banking | P1 | ⚡ Alto |
| Ação | Criar rota `GET /platform/account/me` que calcula saldo. Ligar SWR Hook nela. Deletar JSON Mock. |
| **P3** | **Gateway PIX** | Payments | P1 | ⚖️ Médio |
| Ação | Implementar webhook real em `payments.ts` que registra cash-in no `internalLedger`. |
| **P4** | **Custódia Web3** | Blockchain | P1 | ⚖️ Médio |
| Ação | Conectar `viem` em um Worker RPC para ler e popular a UI com saldos da rede Cripto. |

---

## FASE 17 — Architecture Decision Records (ADRs)

1. **ADR-001 (Confirmada):** **Nenhum saldo é coluna persistida.** Todos os montantes financeiros derivam de um *Aggregate* baseado na soma dos eventos do Ledger.
2. **ADR-002 (Confirmada):** Bounded Context Forte. Componentes UI financeiros não dependem de pastas globais administrativas, devendo ficar isolados em `sections/banking`.
3. **ADR-003 (Implícita, agora Formalizada):** O Patrimônio da DAO (Tesouraria) NUNCA se mistura com o Patrimônio Pessoal do usuário (Custódia Fiat/Internal Ledger).
4. **ADR-004 (Ausente, Requer Atenção):** Não havia documentação de como o Gateway de Pagamentos iria se conectar à Conta do Usuário, dependendo de Mocks e Regex. Foi decidido (via Roadmap P3) utilizar Webhooks externos isolados.

---

## FASE 18 — Architecture Score (Avaliação Técnica)

- **Domain Driven Design (DDD):** 9/10 (Aggregate perfeitamente implementado no Treasury; isolamento forte na UI Conta).
- **Clean Architecture:** 10/10 (Frontend puramente Vite React; Backend rodando em Workers serverless segregados).
- **Event Sourcing:** 6/10 (Implementado na Tesouraria Institucional; inexistente para contas P2P/Fiat individuais).
- **Double Entry:** 4/10 (Apenas logs de inserção única, falta motor de compensação crédito/débito).
- **Segurança e Auditoria:** 10/10 (JWT + RBAC + AuditImmutable com HashChain).
- **Blockchain:** 3/10 (Apenas dados de esquema no banco, sistema não opera on-chain atualmente).

**Recomendação Master:** Implementar as fases P1 e P2 do Roadmap Imediatamente para alinhar a Nota de Event Sourcing do ambiente pessoal para 10/10.

---

## FASE 19 — Conclusão da Documentação

As informações da documentação antiga (limitadas a lógicas de frontend do dashboard) foram englobadas, obsoletas substituídas pela verdade atual e as lacunas desmascaradas preenchidas.

Esta **ASoT (Architecture Source of Truth)** dita a evolução corporativa do banco ASPPIBRA. Nenhum PR (Pull Request) financeiro será aceito se desrespeitar as ADRs ou os donos soberanos de dados mapeados na Fase 8. A próxima evolução deve seguir estritamente o Roadmap Fase 1.
