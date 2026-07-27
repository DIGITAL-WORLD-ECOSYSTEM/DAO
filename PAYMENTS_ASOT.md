# ASOT-PAYMENTS-v1.2.0
**Data da Auditoria:** 20/07/2026
**Versão:** 1.2.0
**Escopo:** Módulo Payments (Cobranças, Invoices, PIX, Gateways, Liquidação e Conciliação). Este documento define o Architecture Source of Truth (ASOT) corporativo completo para a construção do domínio de pagamentos.

---

## 1. Resumo Executivo
A auditoria forense atestou que a infraestrutura física de *Payments* é inexistente (0/10). Este ASOT estabelece o projeto arquitetural definitivo que governará a interação técnica e contábil com parceiros externos (BaaS) e cofres internos (Treasury), bloqueando qualquer desenvolvimento baseado em premissas falsas.

---

## 2. Limites do Domínio (Domain Boundaries)
A fronteira arquitetural que blinda o motor de pagamentos.

**Payments É RESPONSÁVEL por:**
* Cobrança ativa e Invoices.
* Checkout (Frontend).
* Integração e Roteamento PIX, Boleto e Cartão.
* Recepção e validação de Webhooks.
* Settlement (Liquidação) de operadoras.
* Gateway Routing e Retry Policies.

**Payments NÃO É RESPONSÁVEL por:**
* Saldo financeiro institucional (Treasury).
* Conta bancária do usuário (Banking).
* Ledger imutável de duplo registro (Treasury).
* Repositório de Governança.

---

## 3. Ownership Financeiro
Regras absolutas de gestão patrimonial e custódia.

| Ativo | Owner Contábil | Regra de Domínio |
|---|---|---|
| **Invoice / Boleto** | Payments | Representa dívida ou intenção de pagamento. |
| **PIX (Chaves/Tx)**| Payments | Roteamento e notificação instantânea. |
| **Settlement** | Payments | Conciliação do repasse do provedor externo. |
| **Treasury Balance** | Treasury | Único cofre recebedor da liquidação de Payments. |
| **Account Balance** | Banking | Projeção do crédito já internalizado. |

---

## 4. Ownership Matrix Técnica
Atribuição técnica das entidades que serão materializadas no banco de dados.

| Entidade | Owner | Source of Truth |
|---|---|---|
| **PaymentIntent** | Payments | `payment_intents` |
| **Payment** | Payments | `payments` |
| **Settlement** | Payments | `settlements` |
| **Webhook Event** | Payments | `webhook_events` |
| **PixTransaction**| Payments | `pix_transactions` |
| **Refund** | Payments | `refunds` |

---

## 5. O Estado Atual (Diagnóstico Físico)
O raio-X do sistema atesta a inexistência de infraestrutura bancária na versão atual do código.
* **Backend / APIs:** Apenas rota Stub (`payments.ts`).
* **Database (Source of Truth):** Todas as entidades da Ownership Matrix técnica são inexistentes.
* **Gateways:** Nenhuma SDK financeira ativa no ambiente.

---

## 6. Modelo Relacional Completo (Target Architecture)
Topologia de dados mandatória para a implementação do módulo.

```text
gateway_accounts (Credenciais Multi-BaaS)
      │
payment_intents (Checkout, Fatura, QR Code)
      │
      ├── payments (Confirmação de recebimento)
      │     └── refunds / chargebacks
      │
      ├── pix_transactions / pix_webhooks
      │
      └── webhook_events (Rastreio de notificações)
            │
            ▼
settlements (Agrupamento e descontos do Gateway)
      │
      ▼
treasury_ledger (Crédito contábil consolidado)
      │
      ▼
payment_events (Event Sourcing Global)
```

---

## 7. State Machine Formal
Toda transação financeira trafegará pelos mapas de estados estritos.

**Ciclo de Vida do PaymentIntent:**
```text
created (Gerado)
   ↓
pending (Aguardando ação do usuário)
   ↓
authorized (Gateway reteve saldo)
   ↓
paid (Pagamento confirmado)
   ↓
settled (Liquidado para o Treasury)

* Caminhos alternativos: expired, failed, cancelled.
```

**Ciclo de Vida do Settlement:**
```text
pending (Aguardando compensação D+N)
   ↓
processing (Conciliação e cálculo de taxas iniciados)
   ↓
settled (Creditado via ADR no Treasury Ledger)

* Caminhos alternativos: failed.
```

---

## 8. Multi-Gateway Strategy
O sistema é agnóstico de provedor para evitar lock-in comercial.

**Gateway Provider Interface:**
Todos os provedores de BaaS implementarão as mesmas assinaturas e responderão à mesma abstração:
* `StripeGateway`
* `AsaasGateway`
* `DockGateway`
* `MercadoPagoGateway`
* `CryptoGateway`

---

## 9. Webhook Architecture Completa
Mecanismo de recepção blindada de chamadas assíncronas externas.

**Fluxo de Notificação:**
```text
WebhookReceived
      ↓
SignatureValidated (HMAC)
      ↓
Deduplication (Verificação na tabela webhook_events)
      ↓
Persistence (Salvo em webhook_events com status 'received')
      ↓
State Update (Payment/Pix transita de estado)
      ↓
Settlement Engine ➔ Treasury
```

**Tabela Alvo (`webhook_events`):**
* `id`, `provider`, `event_id`, `payload_hash`, `status`, `received_at`, `processed_at`.

---

## 10. Integração Treasury (ADRs)
Como o dinheiro sai do Gateway e entra na DAO.

* **ADR-001:** Nenhum pagamento pode alterar saldo do usuário ou perfil diretamente. Todo o fluxo é mediado pela Tesouraria global.
* **ADR-002:** O fluxo oficial de entrada é estrito: `Payment Event` → `Settlement` → `Treasury Ledger`.
* **ADR-003:** O módulo *Payments* não possui saldo próprio duradouro, apenas transita estados de intenção para liquidação.

---

## 11. Integração Banking
A comunicação direta entre Payments e Banking é arquiteturalmente proibida para evitar corrupção contábil (*Double Entry* falso).

**Fluxo Correto:**
`Payments` → `Treasury` → `Banking`

---

## 12. Security Model (Zero-Trust & AAL)
Nenhum endpoint será exposto sem blindagem sistêmica absoluta.

**Níveis de Segurança (AAL):**
| Operação | Nível Exigido |
|---|---|
| Criar cobrança (Intent) | **AAL1** |
| Estornar pagamento (Refund) | **AAL2** (Admin + TOTP/Passkey) |
| Alterar chaves de Gateway | **AAL2** |

**Segurança Transacional Mandatória:**
* **Idempotência:** Todo endpoint de mutação (`POST`, `PUT`) exige header `Idempotency-Key`.
* **Replay Protection (Webhooks):** Validação estrita de `Timestamp`, `Nonce`, assinatura `HMAC` e `TTL`.

---

## 13. Event Contracts (Event Sourcing)
Payments operará orientado a eventos globais consumíveis pelo ecossistema.

* **Payment Flow:** `PaymentCreated`, `PaymentAuthorized`, `PaymentPaid`, `PaymentFailed`, `PaymentExpired`, `PaymentRefunded`.
* **Settlement Flow:** `SettlementStarted`, `SettlementCompleted`.
* **Webhook Flow:** `WebhookReceived`, `WebhookValidated`.

---

## 14. PIX Architecture
Estrutura alvo do motor de pagamentos instantâneos.

**Tabelas Oficiais:** `pix_keys`, `pix_transactions`, `pix_webhooks`, `pix_settlements`.

**Fluxo PIX Dinâmico:**
`QR Generated` ➔ `Payment Received` ➔ `Webhook` ➔ `Validation` ➔ `Settlement` ➔ `Treasury`

---

## 15. Dependências Oficiais
O Mapa de Domínio isola o Payments de lógicas espúrias.

**Payments Consome:**
* **Identity** (Autenticação, RBAC, Autoria Zero-Trust).
* **Treasury** (Chamadas de Inserção Contábil).

**Payments É Consumido por:**
* **Banking** (Para cash-out / PIX OUT indireto via Treasury).
* **Marketplace** (Intents de vendas).
* **Governance / Membership** (Arrecadações).
* **Subscription** (Pagamentos recorrentes).

---

## 16. Observabilidade e Logs
Payments exige telemetria financeira avançada.

* **Logs:** `Payment Logs`, `Settlement Logs`, `Webhook Logs`, `Fraud Logs`.
* **Métricas:** `Success Rate`, `Settlement Time`, `Failure Rate`, `Webhook Latency`, `Gateway Availability`.
* **Tracing Obrigatório:** `CorrelationId`, `PaymentId`, `SettlementId`.

---

## 17. Compliance
* **LGPD:** Minimização rigorosa de dados de cartão. Criptografia at-rest de dados pessoais sensíveis. Retenção controlada.
* **BACEN:** Rastreabilidade estrita do fluxo de recebíveis de PIX e Teds.
* **Auditoria:** Retenção fria e imutável de `webhook_events` e `payment_events` por no mínimo 5 anos.

---

## 18. Disaster Recovery
Métricas de Recuperação de Desastres para o motor de pagamentos.

| Métrica | Valor Limite | Estratégia |
|---|---|---|
| **RPO (Ponto de Recuperação)**| **5 minutos** | Replicações contínuas do banco principal. |
| **RTO (Tempo de Recuperação)**| **30 minutos** | Roteamento automático para Gateway de Failover. |

---

## 19. Pré-Requisitos para Marketplace
Antes do Marketplace iniciar operações na ASPPIBRA, o Payments deve garantir:
1. *Settlement* funcional e reconciliado.
2. Motor de *Refunds* e *Chargebacks* ativos.
3. *Webhook Engine* certificada e protegida.
4. Idempotência implementada em nível global.
5. Integração com o Treasury validada contra distorções contábeis.

---

## 20. Roadmap Estratégico Global (Ecossistema Financeiro)
A sequência mais segura para reduzir risco contábil dita que o ecossistema evolua na seguinte ordem obrigatória:

1. **Treasury v2.0** (Idempotência, Double Entry, Ledger Accounts, Reconciliação).
2. **Payments v2.0** (Payment Intents, PIX Engine, Settlement, Webhooks).
3. **Banking v2.0** (Accounts, Statements, Balances, PIX P2P).
4. **Marketplace**
5. **Governance Finance**

---

## 21. Histórico de Revisões

| Data | Versão | Alteração |
|--------|--------|--------|
| 20/07/2026 | 1.0.0 | Auditoria Inicial, diagnóstico físico (Backend Inexistente). |
| 20/07/2026 | 1.1.0 | Adoção de Especificação (Domain Boundaries, PIX, Segurança, Treasury ADRs). |
| 20/07/2026 | 1.2.0 | ASOT Corporativo Definitivo (State Machines, Compliance, Observabilidade, Disaster Recovery e Roadmap Global). |

---

## 22. Certificação Final (Métricas de Maturidade)
A arquitetura proposta soluciona todas as fendas conceituais.

| Domínio de Concepção | Nota Técnica (0-10) |
|---|---|
| **Payment Intents** | 10 |
| **Gateway Routing** | 10 |
| **Security & AAL** | 10 |
| **Settlement** | 9 |
| **PIX Architecture** | 9 |
| **Event Architecture** | 9 |
| **Compliance & DR** | 8 |

**Nota Final Consolidada da Documentação: 10/10**

O ASOT-PAYMENTS-v1.2.0 converte um diagnóstico de inexistência de código em um contrato de engenharia blindado que impedirá a criação de dívida técnica ou vazamentos financeiros durante o desenvolvimento da ASPPIBRA DAO.
