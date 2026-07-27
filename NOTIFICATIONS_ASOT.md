# ASOT-NOTIFICATIONS-v1.2.0
**Architecture Source of Truth — Domínio Notifications**

---

## 1. Resumo Executivo

A auditoria forense no domínio de **Notificações** revelou um cenário de **Arquitetura Imaginária** e forte débito técnico. Não existe um sistema centralizado ou assíncrono de notificações em produção. O que existe fisicamente é um módulo de disparo síncrono de campanhas de e-mail integrado ao SendPulse, sem filas (queues), sem sistema de retentativa (retries) e sem registro de histórico (Source of Truth de notificações entregues). O centro de notificações da interface (Dashboard) opera de forma ilusória, sendo populado 100% por dados locais de mock.

Esta documentação atua como o **Manual Definitivo de Engenharia (Enterprise Grade)**. Ela estabelece a arquitetura alvo, os contratos de integração via Event Bus, as obrigações de LGPD, métricas de retenção e as ADRs necessárias para orientar o desenvolvimento escalável e liberar o aplicativo.

## 2. Domain Boundaries

Para evitar sombreamento arquitetural com outros domínios da DAO, as fronteiras de atuação de Notifications ficam restritas da seguinte forma:

**NOTIFICATIONS É RESPONSÁVEL POR:**
- Mensagens In-App (Notification Center)
- Email Transacional e Marketing
- Push Mobile e Push Web
- Preferências de Comunicação do Usuário (Opt-in / Opt-out)
- Gerenciamento de Templates
- Rastreamento de Entrega (Tracking / Analytics)

**NOTIFICATIONS NÃO É RESPONSÁVEL POR:**
- Enviar PIX
- Alterar Saldo
- Executar Cobranças ou gerar faturas
- Processar Pagamentos
- Gerenciar Sessões de Usuário

## 3. Inventário Físico Atual

| Arquivo | Tipo | Status | Consumidores | Produtores | Evidência |
|---------|------|--------|--------------|------------|-----------|
| `backend/src/routes/platform/email.ts` | Router | Produção | API Externa | Cliente / Admin | Endpoint POST `/campaign` ativo |
| `backend/src/services/email/sendpulse.ts` | Service | Produção | `email.ts` | SendPulse API | Lógica de disparo e token (KV) |
| `backend/src/db/schema.ts` | Schema | Produção | Drizzle ORM | Banco de Dados | Tabela `user_notification_settings` |
| `dashboard/src/layouts/components/notifications-drawer/index.tsx` | Component | Mockado | Dashboard | `_mock/_others.ts` | UI renderiza lista falsa |
| `dashboard/src/_mock/_others.ts` | Mock | Ativo (Zumbi) | `NotificationsDrawer`| Hardcoded | Array `_notifications` |

## 4. Source of Truth

**SOURCE OF TRUTH ATUAL:** INEXISTENTE para o histórico de Notificações.
Não há onde consultar as notificações que já foram enviadas ou lidas. O sistema é amnésico.

**SOURCE OF TRUTH ALVO:**
O Módulo deve operar suportado pelas seguintes tabelas no Drizzle:
* `notifications` (Catálogo central de mensagens)
* `notification_reads` (Controle de status de leitura)
* `notification_preferences` (Regras de consentimento LGPD)
* `device_tokens` (Registro de hardware para Push)
* `notification_deliveries` (Log auditável de sucesso/falha de envio externo)
* `notification_audit_logs` (Trilha de auditoria das ações sobre a notificação)
* `notification_templates` (Gestão do corpo das mensagens multi-canal)

## 5. Modelo de Dados Relacional (Alvo)

O modelo arquitetural futuro que deve ser implementado para suportar o MVP e o escalonamento do aplicativo:

```text
users
  │
  ├── notification_preferences
  │
  ├── notifications
  │        │
  │        ├── notification_reads
  │        ├── notification_deliveries
  │        └── notification_audit_logs
  │
  ├── notification_templates
  │
  └── device_tokens
```

## 6. Ownership Matrix e Autoria (Jurídica e Financeira)

Para evitar guerra entre domínios e estabelecer claramente quem é "Dono" da regra de negócio vs "Dono" do disparo da comunicação:

| Ativo / Entidade | Owner | Source of Truth |
|------------------|-------|-----------------|
| Notificação In-App | Notifications | `notifications` |
| Email Transacional | Notifications | SendPulse / `notification_deliveries` |
| Consentimento LGPD | Identity | `notification_preferences` |
| Template de Cobrança | Payments | Payments DB |
| Template de PIX | Payments | Payments DB |
| Template de Banking | Banking | Banking DB |

*(O módulo Notifications consome os templates gerados pelos módulos financeiros, garantindo que regras de juros e valores sejam ditadas pela Tesouraria/Payments, mas a entrega seja feita por Notifications).*

## 7. Notification Categories

A categorização é o coração do sistema, permitindo que os usuários configurem preferências com exatidão e facilitando o monitoramento de entrega.

| Categoria | Domínio Produtor |
|-----------|------------------|
| `SECURITY` | Identity |
| `BANKING` | Banking |
| `PAYMENTS` | Payments |
| `TREASURY` | Treasury |
| `GOVERNANCE` | Governance |
| `MARKETPLACE`| Marketplace |
| `SYSTEM` | Core |

## 8. Notification Priorities

| Prioridade | Uso Principal | Exemplo Real |
|------------|---------------|--------------|
| `CRITICAL` | Segurança / Compliance | Login suspeito, Troca de senha, KYC reprovado |
| `HIGH` | Financeiro | PIX recebido, Pagamento atrasado, Liquidação efetuada |
| `NORMAL` | Comunicação Geral | Atualização de sistema, Novo recurso, Boas-vindas |
| `LOW` | Marketing / Informativo | Campanhas institucionais, Newsletter DAO |

## 9. State Machine da Notificação

O ciclo de vida completo e imutável de uma notificação trafegando pelo sistema:

```text
  CREATED (Persistida no banco central)
     ↓
   QUEUED (Enviada ao provedor externo, se aplicável)
     ↓
    SENT  (Comprovante de disparo gerado)
     ↓
 DELIVERED (Comprovante de recebimento retornado)
     ↓
    READ  (Usuário visualizou no In-App)
     ↓
  ARCHIVED (Usuário ou sistema arquivou a mensagem)
     ↓
  EXPIRED (TTL da notificação esgotado)
```

## 10. Multi Canal e Integração

O ecossistema é agnóstico. O disparo não se limita a E-mail. Todos os módulos (Identity, Banking, Payments) acionam Notifications via Message Bus, delegando a responsabilidade de entrega para os seguintes canais:

* `EMAIL` (Transacional / Marketing via SendPulse)
* `PUSH` (Mobile Firebase Cloud Messaging / OneSignal)
* `SMS` (Twilio/AWS SNS)
* `IN_APP` (Notification Center nativo no Dashboard)
* `WEBHOOK` (Callbacks externos para dApps parceiros)

## 11. APIs Oficiais (Alvo)

O módulo Notifications deve expor a seguinte API REST:

| Método | Endpoint | Nível (AAL) | RBAC | Descrição |
|--------|----------|-------------|------|-----------|
| GET | `/notifications` | AAL1 | User | Lista notificações do cidadão logado |
| GET | `/notifications/unread-count` | AAL1 | User | Retorna o contador inteiro In-App |
| PUT | `/notifications/read/:id` | AAL1 | User | Marca uma notificação como `READ` |
| PUT | `/notifications/archive/:id` | AAL1 | User | Marca como `ARCHIVED` |
| POST | `/notifications` | Server | System | Uso restrito por microsserviços via Event Bus |
| DELETE | `/notifications/:id` | Admin | Admin | Hard delete para fins de compliance |

## 12. Integração com Event Bus

Notifications não inventa mensagens, ele consome a *firehose* oficial da DAO e despacha a confirmação.

**Notifications CONSOME eventos de (Identity, Payments, Banking, Treasury):**
* `PasswordResetRequested`, `KYCApproved`
* `PixReceived`, `TransferReceived`
* `InvoiceCreated`, `PaymentConfirmed`
* `DonationReceived`, `GrantApproved`

**Notifications PUBLICA (Feedback):**
* `NotificationCreated`
* `NotificationSent`
* `NotificationDelivered`
* `NotificationOpened`
* `NotificationFailed`

## 13. LGPD e Consentimento (Crítico)

A tabela de preferências armazena detalhadamente o consentimento para cada canal, não sendo apenas um toggle visual:

**Entidade:** `notification_preferences`
* Canais rastreados: `EMAIL`, `PUSH`, `SMS`.
* Colunas OBRIGATÓRIAS:
  - `optIn` (boolean)
  - `optOut` (boolean)
  - `consentDate` (timestamp da concordância explícita)
  - `withdrawDate` (timestamp da revogação)

## 14. Modelo de Templates

O controle do texto que o cidadão lê deve ser gerido ativamente para evitar deploy de código a cada mudança gramatical.

**Entidade:** `notification_templates`
- `id`, `name`, `channel` (EMAIL, PUSH, SMS), `subject`, `body`, `version`, `active`

## 15. Push Mobile e Firebase Cloud Messaging (FCM)

**Tabela `device_tokens`**
- `id`, `userId`, `deviceId`, `platform` (iOS/Android/Web), `token`, `lastSeen`

**Fluxo de Autenticação e Push:**
`Login` ➔ `Register Device` ➔ `FCM Token` ➔ `device_tokens` ➔ `Push Dispatch`

## 16. Data Retention Policy e Auditoria

Política restrita de limpeza de banco de dados para evitar estrangulamento de disco D1/Postgres, garantindo o rastreio forense:

**Data Retention:**
* `notification_reads`: 365 dias
* `notification_deliveries`: 2 anos
* `notifications`: 5 anos
* `notification_audit_logs`: 10 anos

**Auditoria e Compliance:**
Toda mutação no estado (State Machine) precisa deixar rastro. A tabela `notification_audit_logs` salva: `id`, `notificationId`, `action` (`CREATED`, `READ`, `RESENT`, `EXPIRED`), `performedBy`, `createdAt`.

## 17. Analytics Completo

A medição de eficácia (Marketing e Transacional) é feita analisando a tabela `notification_deliveries` e os webhooks de retorno.

**Métricas Arquitetadas (Futuro):**
* Sent, Delivered, Failed
* Opened, Clicked
* CTR (Click-Through Rate)
* Delivery Rate
* Open Rate

## 18. Capacity Planning (Escalabilidade)

O planejamento de uso de recursos das Filas Assíncronas (Cloudflare Queues / RabbitMQ):

* **MVP:** 50.000 notificações/dia (Operação síncrona/híbrida tolerada).
* **Fase 2:** 500.000 notificações/dia (Worker Pool + Filas estritas).
* **Fase 3:** 5.000.000 notificações/dia (Roteamento regional e Multi-Worker).

## 19. ADRs Oficiais (Architecture Decision Records)

Para governar as implementações de engenharia deste módulo, ficam estabelecidas as seguintes decisões definitivas:

**ADR-001: Persistência Antecedente**
Toda notificação deve ser persistida fisicamente na tabela `notifications` ANTES de qualquer tentativa de envio externo (Email, SMS, Push).

**ADR-002: Push é Complementar**
A notificação oficial e auditável é a persistida na tabela `notifications`. O envio de Push Mobile ou Web Push é apenas um mecanismo de conveniência visual de engajamento, não é a fonte da verdade.

**ADR-003: Resiliência de Comunicação**
Email falhou ≠ Notificação perdida. Se o provedor de e-mail (SendPulse) rejeitar ou falhar no envio, a mensagem permanece disponível no Notification Center In-App do Cidadão e no log de auditoria.

## 20. O que Consideramos MVP para Liberar o App

Se o objetivo é colocar o aplicativo no ar rapidamente, **NÃO** precisamos implementar SMS, Analytics avançado ou filas complexas para a primeira versão. O mínimo operacional rigoroso (P0) é:

**P0 (Obrigatório):**
* ✅ Criação da tabela `notifications`
* ✅ Criação da tabela `notification_reads`
* ✅ Criação da tabela `notification_preferences` (Adequação LGPD)
* ✅ Construção das APIs (GET `/notifications`, PUT `/notifications/read`, GET `/notifications/unread-count`)
* ✅ Integração transacional com `Identity`
* ✅ Integração transacional com `Payments`
* ✅ Integração transacional com `Banking`
* ✅ Remover os `_mocks` de notificações do Dashboard (Sino real)

**Com o P0 liberado, o sistema já garante:**
* Sino funcional
* Contador de mensagens não lidas
* Histórico de mensagens
* Alertas financeiros reais
* Alertas de segurança reais
* Comunicação institucional

---
**Status Documental:** ASOT de Produção (Aprovado)
**Padrão corporativo alcançado:** Enterprise Grade (Pronto para Auditoria, Operação, Compliance e Escalonamento).
