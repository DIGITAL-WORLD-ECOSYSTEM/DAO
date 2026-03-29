# 🚀 ASPPIBRA DAO - Elite Agent Architecture v2.0

Este repositório é um Monorepo de Alta Performance, governado por uma estrutura de 8 agentes especializados e operando nativamente em **Cloudflare Edge**.

## 🏗️ Estrutura do Projeto
- **`/frontend`**: Aplicação React com Vite/Vinext (Cloudflare Pages).
- **`/backend`**: API Hono com D1 SQLite e R2 Storage (Cloudflare Workers).
- **`/agents`**: Identidades e Prompts dos Agentes de Elite.
- **`/cloud`**: Definições de Domínio, Arquitetura e Contratos.
- **`/skills`**: Memória Institucional e Padrões de Engenharia.
- **`/docs/vault`**: Hub de Identidade Soberana (SSI).

## 🛡️ Sistema de Identidade Soberana (SSI Vault)
O ecossistema opera sob o status **Alpha Elite Platinum**, com soberania total do usuário e arquitetura **Zero-Trust**.

### 🗺️ Mapa de Documentação
```text
/docs/vault
├── README.md (Hub Central)
├── specification.md (Protocolos Criptográficos)
└── poi_documentation.md (Proof of Identity)
/audit
├── alpha_elite_certification.md (Certificado Platinum)
├── production_verification_report.md (Checklist 100% OK)
├── full_credential_audit.md (Testes de Stress)
└── vault_fortress_audit.md (Auditoria Fortress)
/runtime
└── identity_lifecycle.md (Logs Forenses)
/analysis
└── ssi_vault_missing_features.md (Gap Analysis)
```

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
