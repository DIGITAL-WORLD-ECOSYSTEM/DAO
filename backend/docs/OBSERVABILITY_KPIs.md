# Observabilidade e KPIs (ASOT-OPERATIONS-v1)

A arquitetura da ASPPIBRA requer a divisão de telemetria em três categorias de indicadores, a fim de que as equipes de Engenharia, SRE e Produto consigam interpretar o estado da plataforma de forma focada.

## 1. Indicadores de Infraestrutura (SRE)
Monitorados diretamente via Cloudflare GraphQL Analytics (rota `/api/core/health/analytics`).
- **Disponibilidade / Liveness:** 99.9% (Meta)
- **Latência Global (Edge):** P95 < 500ms | P99 < 1s
- **Taxa de Erro HTTP 5xx:** < 1%
- **Throughput / Filas:** Mensagens pendentes (DLQ) devem ser zero.
- **Banco de Dados (D1):** Read Queries vs Write Queries (Proporção de bloqueios por concorrência).

## 2. Indicadores de Aplicação (Engenharia)
Monitorados pelos logs nativos e pela tabela de auditoria `audit_logs` no banco de dados.
- **Taxa de Autenticação:** % de `401 Unauthorized` por senhas incorretas vs ataques de força bruta.
- **Bloqueios de RBAC:** Tentativas de elevação de privilégio (`403 Forbidden`).
- **Rate Limiting (Abuso):** Taxa de requisições barradas com HTTP `429 Too Many Requests`.
- **Falhas de Idempotência:** Tentativas duplicadas de `POST /transactions` na Tesouraria.

## 3. Indicadores de Negócio (Produto & Business)
O **Funil de Governança** da ASPPIBRA. Essas métricas demonstram o quão "saudável" a operação da DAO está, refletindo a conversão real.
1. **Accounts Criadas:** `SELECT count(*) FROM users`
2. **KYC Iniciado:** `SELECT count(*) FROM citizens WHERE kyc_status = 'pending'`
3. **KYC Aprovado:** `SELECT count(*) FROM citizens WHERE kyc_status = 'approved'`
4. **Primeiro Depósito (TVL Ativado):** Contas distintas com `treasury_ledger` inbound.
5. **Voto Computado:** `SELECT count(distinct user_id) FROM gov_votes`
6. **Tokenização de Imóvel:** Cadastro do primeiro imóvel real no ecossistema de Real Estate.

> [!NOTE]
> Dashboards visuais devem cruzar essas informações diárias, extraindo-as da rota de métricas do Hono para um painel Grafana interno ou utilizando as visualizações nativas do Cloudflare Logpush.
