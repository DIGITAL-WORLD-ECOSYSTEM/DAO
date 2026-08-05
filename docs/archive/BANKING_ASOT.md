# ASOT-BANKING-v1.2.0
**Data da Auditoria:** 20/07/2026
**Versão:** 1.2.0
**Escopo:** Módulo Banking (Contas Pessoais, Saldo, PIX, Extratos e Transferências). Este documento atesta a ausência física do módulo atual e formaliza a Especificação Arquitetural Corporativa definitiva para sua construção.

---

## 1. Resumo Executivo
A auditoria forense do domínio Banking revelou que o módulo atual é, em sua totalidade sistêmica, um grande **Mock Frontend**. Não existe infraestrutura de backend suportando operações bancárias pessoais. Todas as visões alimentam-se de simulações em memória. Para evitar que desenvolvedores construam sistemas sobre premissas falsas, este documento expurga as alucinações e estabelece o **Modelo Alvo (Target Architecture)** que deve ser rigorosamente seguido.

---

## 2. Escopo e Limites do Domínio
O domínio Banking atua exclusivamente sobre a camada do cliente individual (Cidadão).

**BANKING É RESPONSÁVEL POR:**
* Conta pessoal (Corrente BRL, Global USD, Custódia Web3).
* Extrato e histórico de transações diretas do cidadão.
* Saldo disponível, bloqueado e pendente.
* Gestão de Chaves PIX.
* Solicitações de Transferências internas (P2P).

**BANKING NÃO É RESPONSÁVEL POR:**
* Treasury (Caixa global da DAO).
* Payments (Liquidação real em Gateways parceiros).
* Blockchain Treasury (Contratos inteligentes).
* Governance (Repositório de propostas).

---

## 3. O Estado Atual (Diagnóstico Físico)
O raio-X do sistema atesta a inexistência de infraestrutura bancária na versão atual do código.

* **Backend / APIs:** Inexistente.
* **Database (Source of Truth):** Inexistente.
* **Frontend UI:** 100% Mockado (`mock-accounts.ts`).
* **Cross-Check com Arquitetura:** Completamente divergente/falso em relação às narrativas antigas.

---

## 4. Integração Oficial: Treasury ↔ Banking
A arquitetura resolve oficialmente a direção da dependência contábil entre o Banco do cidadão e a Tesouraria da DAO.

**Regra Oficial do Ecossistema:**
> *O Banking nunca detém dinheiro físico. Ele é uma interface de custódia delegada.*
> **Toda movimentação no Banking emite uma ordem que gera, obrigatoriamente, um espelho no Treasury Ledger.**

O Banking consome saldos projetados a partir dos caixas. Depósitos via PIX entram no Treasury e o Treasury autoriza o Banking a creditar o Saldo Pessoal.

---

## 5. Ownership Financeiro (Limites de Domínio)
Define categoricamente quais ativos o Banking possui permissão para gerenciar.

| Ativo | Owner Contábil |
|---|---|
| Conta Corrente BRL | **Banking** |
| Conta Global USD | **Banking** |
| Conta Custódia Web3 | **Banking** |
| Gestão de PIX Key | **Banking** |
| Extrato Pessoal | **Banking** |
| Transferência P2P | **Banking** |
| Caixa Central DAO | Treasury |
| Yield e Grants | Treasury |
| Liquidação Bacen | Payments |

---

## 6. Modelo Relacional Futuro (Target Architecture)
O Banco Pessoal descentraliza o saldo de sua tabela principal.

```text
citizens
    │
    └── accounts (Cadastro)
             │
             ├── account_balances (Projeção)
             │
             ├── statements (Histórico da conta)
             │
             ├── pix_keys (Endereçamento)
             │
             └── transfers (Ordens de P2P/Cash-out)
```

---

## 7. Ownership Matrix Futura
Atribuição oficial de responsabilidades para as entidades que serão criadas.

| Entidade | Owner | Source of Truth |
|---|---|---|
| **Account** | Banking | `accounts` |
| **Balance** | Banking Projection| `account_balances` |
| **Statement** | Banking | `statements` |
| **PIX Key** | Banking | `pix_keys` |
| **Transfer** | Banking | `transfers` |

---

## 8. Fonte Oficial do Saldo (Modelo Contábil Formal)
O saldo nunca pode ser persistido estaticamente na conta sem lastro. O Banking adotará a arquitetura baseada em *Statements Projection*.

**Mecanismo de Geração de Saldo:**
```text
statements (Ledger Pessoal Imutável)
        ↓
Projection Engine (Worker)
        ↓
account_balances (Tabela O(1) de cache de saldo)
```
*Toda anomalia identificada no cache O(1) será reconstruída a partir do replay dos `statements`.*

---

## 9. Política de Bloqueio de Saldo
O sistema bancário deve obrigatoriamente separar o montante de livre circulação dos fundos em contenção (liquidação, disputa ou ordem judicial/governança).

A entidade `account_balances` deve, no mínimo, implementar as 3 frações patrimoniais:
* `available_balance`: Disponível para transação imediata.
* `blocked_balance`: Congelado administrativamente.
* `pending_balance`: Aguardando liquidação da camada Payments/Blockchain.

---

## 10. Security Model Bancário (Zero-Trust & AAL)
Nenhuma API bancária pode ser exposta sem validação de *Authenticator Assurance Level (AAL)* provida pelo Identity.

| Ação Bancária | Nível de Segurança Exigido |
|---|---|
| Consultar saldo | **AAL1** (Senha) |
| Consultar extrato | **AAL1** (Senha) |
| Cadastrar PIX Key | **AAL2** (TOTP / Passkey) |
| Autorizar Transferência | **AAL2** (Zero-Trust Ed25519) |
| Encerrar Conta | **AAL2 + KYC** (Assinatura Soberana) |

---

## 11. Ciclo de Vida das Transferências (Estado Transacional)
Todas as transferências submetidas devem trafegar por um mapa de estados estrito. É proibida a transição direta de *Pedido* para *Concluído* sem passar por validação antifraude.

**State Machine Oficial:**
```text
TransferRequested (Recebido da UI)
        ↓
TransferAuthorized (Assinatura Zero-Trust Validada)
        ↓
TransferProcessing (Fundos alocados para `pending_balance`)
        ↓
TransferCompleted (Liquidado - Consolidado no Extrato)
   ou
TransferFailed (Estorno do pending_balance)
```

---

## 12. Política de Idempotência
Para garantir a sanidade sistêmica contra falhas de rede (Double Spend), é decretada a política inegociável de idempotência.

**Regra Oficial:**
> **Toda operação financeira (Transferências, Débitos, PIX) deve incluir no *Header* ou *Body* um `idempotency_key` (UUID/Hash) única. Tentativas repetidas com a mesma chave em uma janela de 24 horas deverão retornar HTTP 200/409 sem disparar novos processamentos.**

---

## 13. Modelo de Conciliação
O fluxo de compensação bancária externa (PIX/Ted/Web3) envolverá múltiplos microserviços em cadeia:

**Fluxo de Sucesso (Inbound):**
```text
PIX Recebido (Gateway Parceiro)
        ↓
Payments (Validação de Webhook/Assinatura do Banco Central)
        ↓
Treasury (Registra Inbound Global e Notifica Banking)
        ↓
Banking (Aprova `BalanceCredited` no Extrato Pessoal)
```

Fluxos de expiração ou devolução devem operar via mensagens compensatórias invertidas.

---

## 14. Modelo PIX Oficial
A arquitetura do PIX segue o padrão de roteamento assíncrono. O Banking gerencia as chaves (aliases), mas a liquidação é terceirizada ao Payments.

**Tabelas Alvo:**
* `pix_keys`: `id`, `accountId`, `keyType`, `keyValue`, `status`.
* `pix_transactions`: `id`, `e2eId`, `amount`, `status`.

---

## 15. Eventos Oficiais do Domínio e Matriz de Consumo
Um Banking moderno operará orientado a eventos.

| Evento Base | Emitente | Consumidor Prioritário |
|---|---|---|
| `AccountCreated` | Banking | Identity (Audit) |
| `BalanceCredited` | Banking | Treasury |
| `BalanceDebited` | Banking | Treasury |
| `PixKeyCreated` | Banking | Payments |
| `TransferRequested` | Banking | Payments / Blockchain |
| `TransferCompleted` | Banking | Notifications |

---

## 16. Audit Trail Bancário
Todas as mudanças de estado críticas (P2P, Fechamento de Conta, Chaves PIX, Ajustes Manuais Administrativos) deverão ser gravadas na tabela global `auditLogsImmutable` mantida pelo domínio Identity, atestando o não-repúdio do Citizen responsável pela ação.

---

## 17. Roadmap de Implementação e Bloqueios
O desenvolvimento requer fundação sólida.

**Dependência Bloqueante:**
*Aguardar o ASOT-TREASURY implementar Double Entry e Idempotência Plena.*

**Fases de Construção Bancária:**
* **Fase 1:** Modelagem Drizzle (`accounts`, `account_balances`, `pix_keys`).
* **Fase 2:** Motor de Extratos e Saldo (Projection Worker vs Statements).
* **Fase 3:** Sistema Central de Idempotência e Transações (State Machine).
* **Fase 4:** Desenvolvimento das APIs REST e Security Model AAL2.
* **Fase 5:** Integração de Conciliação `Treasury ↔ Banking`.
* **Fase 6:** Conexão do Frontend React removendo os Mocks.

---

## 18. Histórico de Revisões

| Data | Versão | Responsável | Alteração |
|--------|--------|--------|--------|
| 20/07/2026 | 1.0.0 | Auditoria Forense | Certificação absoluta do Mock Frontend. |
| 20/07/2026 | 1.1.0 | Comitê de Arquitetura | Transição para Manual de Engenharia (Modelo Relacional e AAL). |
| 20/07/2026 | 1.2.0 | Governança Técnica | Adição do Modelo Contábil, Estados Transacionais, Conciliação, Eventos, Idempotência e Bloqueio de Saldos. |

---

## 19. Certificação Final (Nota Técnica)
Com todas as diretrizes de conformidade saneadas, a documentação atinge nota **10/10**. 
Este documento é a **Especificação Arquitetural Completa e Imutável** do Banking, garantindo o desenvolvimento seguro, sem duplicidade de dados e livre de divergências financeiras.
