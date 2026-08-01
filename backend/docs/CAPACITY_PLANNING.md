# Capacity Planning Baseline (ASPPIBRA DAO)

Este documento registra o plano de projeção e a linha de base (baseline) de capacidade para a arquitetura em Cloudflare Workers + D1, conforme a escala de VUs (Virtual Users) em simultâneo. 

A meta é rastrear custos, gargalos e degradação conforme o tamanho do beta aumenta e a plataforma entra em Public Launch.

## Baseline Estimada / Alvos de SLA

### Nível 1: 100 Usuários Simultâneos (Early Adopters Beta)
- **Throughput Esperado:** ~50 a 100 req/s.
- **Latência Esperada (P95):** < 150ms (Graças ao Edge Caching e Hono).
- **Consumo D1:** Irrisório. Custo coberto pelo Free Tier.
- **Gargalo Potencial:** Nenhum.
- **Ação Recomendada:** Acompanhar erros de validação de negócios (bugs no frontend).

### Nível 2: 500 Usuários Simultâneos
- **Throughput Esperado:** ~250 a 500 req/s.
- **Latência Esperada (P95):** < 300ms.
- **Consumo D1:** Aumento no volume de Reads.
- **Gargalo Potencial:** Cold starts em horários de pico (Worker instantiation).
- **Ação Recomendada:** Verificar a saúde das DLQs nas Queues de e-mail e notificações push.

### Nível 3: 1.000 Usuários Simultâneos
- **Throughput Esperado:** ~1.000 req/s.
- **Latência Esperada (P95):** < 400ms.
- **Consumo D1:** As Writes simultâneas na tabela `treasury_ledger` e `gov_votes` podem iniciar contenção leve (locks do SQLite distribuído).
- **Gargalo Potencial:** Limite de Timeouts ou CPU bound em validação criptográfica (JWT / Assinaturas SSI).
- **Ação Recomendada:** Considerar separar o processo Web3 intensivo do processo HTTP.

### Nível 4: 5.000 Usuários Simultâneos
- **Throughput Esperado:** ~5.000 req/s.
- **Latência Esperada (P95):** Monitoramento intensivo (Meta < 500ms).
- **Consumo D1:** Cloudflare Workers fará escala automática perfeitamente, porém o banco de dados (D1) precisará de Read Replicas (D1 Time Travel e Smart Placement).
- **Gargalo Potencial:** Concorrência estrita no banco (Transactions Rate Limit).
- **Custo Estimado:** Migração compulsória para plano Enterprise / Paid Tier Cloudflare para evitar bloqueio por abuso do limite de Writes do D1.

### Nível 5: 10.000 Usuários Simultâneos (Escala Institucional Plena)
- **Throughput Esperado:** ~10.000 req/s.
- **Ação Recomendada:** Nesse estágio, a arquitetura pode necessitar de sharding no nível da aplicação, separando o D1 de Identidade do D1 Financeiro. Revisão completa da arquitetura `ASOT-SCALE-v3`.
