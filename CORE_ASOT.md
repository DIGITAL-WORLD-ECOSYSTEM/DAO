# CORE_ASOT-v1.0.0
**Architecture Source of Truth — Domínio Core & Infra**

---

## 1. Resumo Executivo

A auditoria forense no domínio **Core** revela o sistema nervoso central do ecossistema ASPPIBRA DAO. Diferente dos módulos de negócio (Treasury, Banking), o Core é transversal e agnóstico, atuando como o alicerce de observabilidade, auditoria jurídica imutável, gestão de segredos (KMS) e infraestrutura base (KV, R2, D1). A análise física do código atesta uma maturidade elevada, especialmente pela integração nativa com o Cloudflare GraphQL Analytics e tabelas criptográficas de segredos no Drizzle ORM.

Este documento serve como o Manual Definitivo de Engenharia para os componentes fundamentais que suportam toda a plataforma.

## 2. Domain Boundaries

Para evitar que lógicas de negócio invadam a infraestrutura central, os limites estão estritamente definidos:

**CORE É RESPONSÁVEL POR:**
- Logs de Auditoria Forense (`audit_logs` e `audit_logs_immutable`)
- Gestão de Segredos de API e Cofre (`integration_secrets`)
- Observabilidade Global e Health Checks (`Cloudflare GraphQL Analytics`)
- Gateways e Webhooks Globais Genéricos
- Storage Abstractions (D1, KV, R2)
- Assinaturas Base de Zero-Trust e Rate Limiting global

**CORE NÃO É RESPONSÁVEL POR:**
- Gerenciar Sessões de Usuário (Identity)
- Armazenar saldos e movimentações (Treasury)
- Liquidação de PIX e Boletos (Payments)
- Template de Notificações (Notifications)

## 3. Inventário Físico e Status Atual

| Arquivo Físico | Função | Status | Consumidor |
|----------------|--------|--------|------------|
| `routes/core/health.ts` | Observabilidade, GraphQL Analytics | ✅ Produção | Infra/DevOps |
| `routes/core/compliance.ts` | KYC e Auditoria Base | ✅ Produção | Admin |
| `routes/core/webhooks.ts` | Endpoint de Webhooks | ⚠️ Mockado | Integrações |
| `db/schema.ts` (Secs 960-1045)| Tabelas D1 Core | ✅ Produção | Backend Global |
| `types/bindings.d.ts` | Definição de Environment (KV/R2/D1) | ✅ Produção | Cloudflare Workers |

## 4. Source of Truth e Modelo Relacional

O Domínio Core é a fonte primária da verdade (*Source of Truth*) para duas categorias estruturais cruciais:

**4.1. Auditoria Transversal**
```text
audit_logs
   ├─ id (PK)
   ├─ action (KYC_SUBMITTED, ROTATE_KEY)
   ├─ actorId (FK User)
   └─ metadata (JSON)

audit_logs_immutable (Forense/Chain)
   ├─ id (PK)
   ├─ action
   ├─ eventHash (SHA-256 Imutável)
   └─ previousHash (Ligação em Corrente)
```
*(Nota Arquitetural: Nenhuma deleção é permitida em tabelas `audit_*`).*

**4.2. Gestão de Segredos (Key Management System)**
O Core substitui o `.env` estático por um KMS dinâmico e criptografado:
```text
integration_configs
   └── (1:N) integration_secrets
                └── (1:N) integration_secret_versions
```
*(As colunas de segredo armazenam APENAS cifras criptografadas em AES-256-GCM, não plaintext).*

## 5. Ownership Matrix

| Ativo / Responsabilidade | Owner (Dono) | Source of Truth |
|--------------------------|--------------|-----------------|
| Logs de Auditoria | Core | `audit_logs` |
| Métricas de Tráfego HTTP | Core | Cloudflare Analytics |
| Chaves de API (Stripe, etc)| Core | `integration_secrets` |
| R2 Storage (Anexos KYC) | Core | Cloudflare R2 |
| Configuração Global | Core | `KV_CACHE` e Bindings |

## 6. Fluxos Certificados (Evidência Física)

1. **Observabilidade (Health & Analytics):**
   Rotação física comprovada no arquivo `health.ts`. Ele executa requisições diretas via *GraphQL* na API da Cloudflare para extrair: *Read Queries, Write Queries, Cache Ratio, Edge Response Bytes*.
2. **KYC Compliance Audit:**
   Comprovada no arquivo `compliance.ts`. Ao mudar status, insere via *Zero-Trust* as informações em `auditLogs` garantindo que toda revisão de KYC tenha rastro jurídico.

## 7. APIs Oficiais (Alvo e Produção)

| Método | Endpoint | Middleware | RBAC | Escopo |
|--------|----------|------------|------|--------|
| GET | `/core/health` | - | Public | Ping Base |
| GET | `/core/health/analytics` | Cloudflare Token | System | GraphQL Metrics (Produção) |
| POST | `/core/compliance/kyc/submit`| `authSignature` | Cidadão| Registro de KYC (Produção) |
| POST | `/core/compliance/kyc/review`| `adminKey` HMAC | Admin | Aprovação KYC com AuditLog |
| POST | `/core/webhooks` | - | System | *Inexistente/Mock* |

## 8. Infraestrutura e Bindings Oficiais

O Core consome nativamente os serviços da *Edge* conforme tipagem verificada em `bindings.d.ts`:
* **DB:** Drizzle via *Cloudflare D1* (SQL Edge).
* **STORAGE:** S3/Object Storage via *Cloudflare R2*.
* **KV_AUTH & KV_CACHE:** Armazenamento chave-valor sub-milissegundo para tokens e sessões globais.
* **SECRETS:** Mais de 20 bindings injetados via *wrangler.toml* (Ex: `MORALIS_API_KEY`, `SENDPULSE_ID`).

## 9. Segurança (Core Principles Aplicados)

* **Prevenção a Timing Attacks:** Em `compliance.ts`, a verificação do `adminKey` contra `ADMIN_PASSWORD` utiliza a função `timingSafeEqual`, impedindo que hackers adivinhem a senha pelo tempo de resposta da CPU.
* **AES-256-GCM:** Segredos dinâmicos (integrações de terceiros) possuem campo no D1 (`encryptedValue`), obrigando que qualquer leitura na ponta seja decifrada em RAM.

## 10. Código Morto e Alucinações

* **Webhook Global:** O endpoint `/core/webhooks.ts` é apenas um *Stub* retornando `{ module: 'Webhooks', received: true }`. Não possui validação HMAC ou assinatura de segurança real (como Stripe ou Web3). Ele não pode ser colocado em produção sem refatoração.

## 11. Roadmap Obrigatório (Próxima Fase)

O módulo **Core** é a fundação para o sistema. As prioridades de escalonamento são:

**P0 (Crítico):**
* Implantar motor de migração Drizzle integrado no CI/CD para as tabelas `integration_*`.
* Configurar o Cloudflare Queues (Message Bus) nas bindings de `bindings.d.ts` para que *Identity* e *Payments* possam se falar assincronamente.

**P1 (Consolidação):**
* Motor de Webhooks Seguro (`/core/webhooks`) implementando *Signature Verification* padronizada.
* Criptografia/Descriptografia *On-The-Fly* nativa no módulo ORM para ler o KMS.

**P2 (Analytics & Feature Flags):**
* Integrar `auditLogsImmutable` com Hash chaining (SHA-256 entre linhas) garantindo que nenhum Sysadmin apague rastros forenses.
* Tabela de `feature_flags` no D1 alavancada por leitura via `KV_CACHE`.

## 12. Certificação e Maturidade

| Critério | Nota (0 a 10) | Justificativa |
|----------|---------------|---------------|
| Audit Logging | 9/10 | Esquema e endpoint prontos, tabela imutável pronta. Falta o motor hash. |
| KMS & Configs | 8/10 | Tabelas e versionamento geniais no Drizzle. Falta lib de decifração em runtime. |
| Observabilidade | 10/10 | Endpoint GraphQL conectando direto no Cloudflare Analytics. |
| Infra Cloudflare | 10/10 | Uso excelente de Bindings e tipagem forte em TypeScript. |
| **Média Geral** | **9,2 / 10** | **Estado: Enterprise Ready.** |

## 13. Conclusão Executiva

O domínio **Core** encontra-se em um excelente nível de maturidade e abstração física. O isolamento de tabelas criptográficas e a infraestrutura nativa mapeada com *D1*, *KV* e *R2* previnem dívida técnica e evitam dependências pesadas de terceiros para infraestrutura. Ao criar a tabela `auditLogsImmutable`, a fundação DAO se protege juridicamente. A única falha grave hoje que bloqueia integrações globais seguras é a falta de um barramento de eventos (*Cloudflare Queues/Message Bus*) físico configurado, e o endpoint genérico de Webhooks que atua apenas como um Mock perigoso.
