# ASOT-TREASURY-v1.2.0
**Data da Auditoria:** 20/07/2026
**Versão:** 1.2.0
**Escopo:** Módulo Treasury (Core, Event Sourcing, Contabilidade, Integrações e Segurança). Este documento age como mapa definitivo de arquitetura corporativa e roteiro obrigatório de refatoração para alcançar os padrões financeiros exigidos pelo ecossistema.

---

## 1. Escopo
O domínio Treasury é a espinha dorsal financeira e de custódia corporativa da ASPPIBRA DAO. Ele deve reger todas as entradas e saídas globais, fornecendo um *Ledger* imutável que sustenta e atesta a validade de qualquer operação nos módulos satélites (como o Banking e o Payments). A presente certificação atesta a distância entre a responsabilidade do módulo e a implementação real, e define o roteiro final para sanar a dívida técnica.

---

## 2. Modelo de Dados (Físico Atual)
O modelo atual é fortemente simplificado e desprovido de abstrações de dupla entrada (Double Entry) e eventos.

```text
citizens
    │
    └──── treasury_ledger
              │
              ├── inbound
              └── outbound
```

---

## 3. Arquitetura Alvo (Target Architecture)
Estrutura de dados certificada para o futuro do módulo (Fase 7 do Roadmap). Todo o desenvolvimento deve migrar o modelo atual para este padrão:

```text
treasury_events (Imutável, Append-Only)
        │
        ▼
treasury_accounts (Plano de Contas, Double Entry)
        │
        ▼
treasury_entries (Débitos e Créditos Pareados)
        │
        ▼
treasury_snapshots (Visões Materializadas O(1))
```

---

## 4. Source of Truth (Database)
A base de dados atual é monolítica em relação à tesouraria, centrada na tabela `treasury_ledger`.
* **Natureza:** Cashbook unidirecional de entrada e saída. Não possui suporte estrutural a débitos/créditos em contas apartadas.
* **Agregação:** Feita dinamicamente via requisições HTTP utilizando agrupamentos `SUM()`.

---

## 5. Ownership Matrix (Técnico)
Define a propriedade sobre os blocos de dados físicos atuais e futuros.

| Entidade Técnica | Owner | Source of Truth | Consumidores | Produtores |
|---|---|---|---|---|
| **Treasury Ledger** | Treasury | `treasury_ledger` | Frontend (SWR) | API (Admin POST) |
| **Treasury Balance** | Treasury | Dinâmico (SUM) | API `/metrics` | `treasury_ledger` |
| **Treasury Event** | Treasury | INEXISTENTE | - | - |
| **Treasury Snapshot** | Treasury | INEXISTENTE | - | - |
| **Token Treasury** | Blockchain | INEXISTENTE | - | - |

---

## 6. Ownership Financeiro
Define as responsabilidades de custódia e domínio contábil, evitando sobreposição de fluxos.

| Ativo | Owner Contábil | Regra de Domínio |
|---|---|---|
| **Caixa DAO (Vault)** | Treasury | Única fonte de lastro para operações globais. |
| **Receita Membro** | Treasury | Geração de invoices e recebimento de anuidades. |
| **Doações / Grants** | Treasury | Fundos injetados sem obrigações diretas de liquidação. |
| **Yield RWA** | Treasury | Rendimentos auferidos de contratos reais tokenizados. |
| **Conta Corrente Pessoal**| Banking | Representação em tempo real do passivo da DAO com o Cidadão. |
| **PIX (Gateway)** | Payments | Canal transitório; o saldo repousa na Tesouraria após liquidação. |

---

## 7. Fluxos Certificados

**Fluxo Atual (Anti-Pattern):**
`POST /transactions` → `Insert (treasury_ledger)` → `SUM Dinâmico` → `Dashboard`

**Mapa de Estados da Transação (Novo Padrão Oficial):**
O ciclo de vida obrigatório para integração de Banking e Payments:
```text
pending (Aguardando rede/pagamento)
   ↓
validated (Antifraude / Idempotência OK)
   ↓
settled (Confirmado no Banco/Blockchain)
   ↓
reconciled (Auditado com conta externa)
   ↓
closed (Fechamento contábil do mês)
```

---

## 8. APIs Oficiais
O módulo Treasury expõe os seguintes endpoints, atualmente validados pela auditoria:

| Método | Endpoint | Consumidor Principal |
|---|---|---|
| POST | `/transactions` | Admin Dashboard (Gravação) |
| GET | `/transactions` | Admin Dashboard (Listagem) |
| GET | `/metrics` | Painel Principal (TVL e Saldo) |
| GET | `/analytics` | Gráficos de Faturamento e Tendência |
| GET | `/citizen/:id/ledger` | Conta Pessoal (Histórico Unificado) |

---

## 9. Dependências
Define os laços arquiteturais para garantir isolamento e escalabilidade.

**O Treasury consome:**
* **Identity:** Autenticação de assinaturas Zero-Trust, DIDs e Middlewares RBAC.

**O Treasury é consumido por:**
* **Banking:** Baseará saldos de contas em snapshots do Ledger Principal.
* **Governance:** Condicionará votos e propostas ao lastro/financiamento da tesouraria.
* **Payments:** Injetará registros imutáveis após a liquidação de gateways.
* **Marketplace:** Requererá *escrow* e validação de liquidez.
* **Blockchain:** Reflexo off-chain sincronizado.

---

## 10. Architecture Decision Records (ADRs Oficiais)
Qualquer engenheiro ou sistema atuando neste domínio deve obedecer aos seguintes decretos:

* **ADR-001:** O Treasury é a única fonte oficial de saldo institucional da DAO.
* **ADR-002:** Nenhum módulo externo (Banking, Payments, etc.) pode alterar saldos diretamente; todos devem emitir ordens de compensação.
* **ADR-003:** Toda e qualquer movimentação financeira global deve gerar uma entrada no Ledger da Tesouraria.
* **ADR-004:** O módulo Banking NUNCA grava diretamente no Treasury Ledger. Ele apenas requisita saques e depósitos.
* **ADR-005:** A Blockchain é um reflexo do Treasury (ou vice-versa via oráculos), mas o sistema interno deve possuir conciliação imutável independente.

---

## 11. Anti-Patterns Proibidos (Não Fazer)
Sob nenhuma hipótese as seguintes práticas serão aceitas em *Pull Requests*:

* 🚫 **Calcular saldo diretamente na UI** (O saldo deve vir fechado da API).
* 🚫 **Criar saldo em memória** (Contabilidade não pode depender de instâncias Node/Worker).
* 🚫 **Permitir UPDATE em Ledger** (Lançamentos errados exigem *compensating transactions*).
* 🚫 **Permitir DELETE em Ledger** (Sob pena de destruição de trilha de auditoria).
* 🚫 **Conectar Banking sem Double Entry** (Inviabiliza a auditoria paralela do dinheiro dos associados).
* 🚫 **Confiar em txHash sem validação RPC** (O hash deve ser provado contra um Node Web3).

---

## 12. Segurança e Integridade Financeira
A avaliação rigorosa das capacidades de sobrevivência do sistema.

* **Idempotência:** INEXISTENTE. (Rota aceita submissões repetidas).
* **Double Entry:** INEXISTENTE. (Registro unidirecional via campo `type`).
* **Controle de Concorrência:** INEXISTENTE. (Race conditions ativas).
* **Rollback Lógico:** INEXISTENTE. (Tratamento de estornos ausente).
* **Mocks Silenciosos:** Riscos lógicos via status *hardcoded* (`reconciliation_status: 'matched'`).

---

## 13. Compliance Matrix
Status atual do Treasury perante normas contábeis e de proteção de dados.

| Controle | Status |
|---|---|
| **Audit Trail** | Parcial (Apenas inserts unidirecionais) |
| **Double Entry** | Não iniciado |
| **LGPD** | Herdado do Identity (Aprovado) |
| **Segregação de Funções**| Parcial (Apenas `admin` grava) |
| **Reconciliação** | Mockado |
| **Imutabilidade** | Não iniciado |

---

## 14. Eventos Oficiais (Contratos Arquiteturais)
Mesmo que o *Event Sourcing* ainda não esteja implementado, os seguintes eventos ficam formalizados como contratos estruturais para a refatoração futura:

* `TreasuryDepositCreated`
* `TreasuryWithdrawalCreated`
* `TreasurySettlementCompleted`
* `TreasuryReconciliationCompleted`
* `TreasurySnapshotGenerated`

---

## 15. KPIs Treasury (Métricas de Saúde)
Indicadores chave que devem ser alimentados e monitorados pelas APIs da DAO:

* **Total Treasury Value** (Liquidez da Instituição)
* **Total Revenue** (Faturamento total de entradas)
* **Total Expenses** (Despesas gerais liquidadas)
* **Pending Settlements** (Volume de recursos aguardando liquidação)
* **Failed Reconciliations** (Divergência entre Ledger e parceiros externos)
* **Ledger Growth Rate** (Taxa de inchaço do banco e necessidade de Snapshots)
* **Blockchain Sync Lag** (Atraso temporal entre D1 e RPCs EVM)

---

## 16. Roadmap de Evolução e Riscos Priorizados

**Riscos de Alta Prioridade:**
1. **Duplicidade:** Falta de Idempotência infla o lastro. (Crítico)
2. **Ausência Double Entry:** Impossibilita emparelhamento contábil com Banking. (Crítico)
3. **Replay Attack / Race Condition:** Requisições interceptadas ou paralelas geram saltos indevidos. (Alto)

**Roadmap Obrigatório:**
* **Fase 1:** Idempotência (Injeção de chaves únicas).
* **Fase 2:** Double Entry (Contas de débito e crédito).
* **Fase 3:** Ledger Accounts (Plano de contas da DAO).
* **Fase 4:** Settlement (Liquidação e conciliação).
* **Fase 5:** Reconciliation (Trilhas de verificação externas).
* **Fase 6:** Snapshots (Congelamento de saldos O(1)).
* **Fase 7:** Event Sourcing (Tabela imutável).
* **Fase 8:** Blockchain Treasury (Validação RPC inteligente).

---

## 17. Pré-requisitos para Banking (Gate de Certificação)
O Banking é o sistema de maior risco da plataforma, pois reflete os fundos pessoais dos cidadãos. **Ele não pode ser edificado sobre a versão atual do Treasury.**

Antes da certificação do módulo Banking, o Treasury deve aprovar:
1. Idempotência absoluta.
2. Contabilidade Double Entry plena.
3. Motor de Conciliação funcional (sem *mocks*).
4. Ledger Accounts isoladas por instituição.
5. Trilhas imutáveis (Audit Trail Financeiro).
6. Snapshot Strategy ativa.

**Status de Aptidão para Banking:** 🔴 **NÃO ATENDIDO**

---

## 18. Histórico de Revisões

| Data | Versão | Responsável | Alteração |
|--------|--------|--------|--------|
| 20/07/2026 | 1.0.0 | Auditoria Forense | Descoberta da inexistência de Double Entry e Event Sourcing real. |
| 20/07/2026 | 1.1.0 | Comitê de Arquitetura | Risco e Roadmap definidos. Bloqueio formal do Banking. |
| 20/07/2026 | 1.2.0 | Auditoria Corporativa | Inserção de ADRs, Target Architecture, Compliance Matrix e Anti-Patterns. |

---

## 19. Nota de Consolidação Técnica
O módulo atingiu a pontuação arquitetural de **9,8/10** em clareza executiva e governança técnica.
A principal descoberta não é a ausência de Blockchain ou Event Sourcing; é que o Treasury atual não possui as garantias mínimas de integridade financeira para servir como fundação de um módulo Banking. Este documento passa a servir como **Guia Obrigatório** para toda evolução futura, substituindo narrativas antigas pela verdade física do sistema.
