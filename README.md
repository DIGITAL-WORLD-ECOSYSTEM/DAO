# 🚀 ASPPIBRA DAO - Elite Agent Architecture v2.0

Este repositório é um Monorepo de Alta Performance, governado por uma estrutura de 8 agentes especializados e operando nativamente em **Cloudflare Edge**.

## 🏗️ Estrutura do Projeto
- **`/frontend`**: Aplicação React com Vite/Vinext (Cloudflare Pages).
- **`/backend`**: API Hono com D1 SQLite e R2 Storage (Cloudflare Workers).
- **`/agents`**: Identidades e Prompts dos Agentes de Elite.
- **`/cloud`**: Definições de Domínio, Arquitetura e Contratos.
- **`/skills`**: Memória Institucional e Padrões de Engenharia.

## 🤖 Sistema de Agentes
O projeto é governado pelo `cloud/decision_records/DR-000-Governance-Protocol.md`.
Qualquer intervenção deve respeitar o sistema de **Handover** em `runtime/current_task.json`.

## 🛫 CI/CD (GitHub Actions)
O deploy é automático para cada push na `main`:
1. **Audit Step**: O script `ops/pre-commit-audit.sh` valida segurança e padrões.
2. **Deploy Workers**: Backend atualizado via Wrangler.
3. **Deploy Pages**: Frontend compilado e publicado em Cloudflare Pages.

### Configuração Requerida (Secrets)
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

---
*Engenharia ASPPIBRA DAO - 2026*
