# Documentação do Sistema de E-mail

Este documento descreve a estrutura de arquivos, componentes e dependências do sistema de e-mail do projeto, abrangendo tanto o front-end quanto o back-end.

## Estrutura de Arquivos (Frontend)

```
.
├── public/
│   └── assets/
│       └── icons/
│           ├── empty/
│           │   ├── ic-email-disabled.svg
│           │   └── ic-email-selected.svg
│           └── navbar/
│               └── ic-mail.svg
│
└── src/
    ├── _mock/
    │   └── _mail.ts
    │
    ├── actions/
    │   └── mail.ts
    │
    ├── assets/
    │   └── icons/
    │       └── email-inbox-icon.tsx
    │
    ├── pages/
    │   └── dashboard/
    │       └── mail/
    │           └── index.tsx
    │
    ├── sections/
    │   └── mail/
    │       ├── layout.tsx
    │       ├── mail-compose.tsx
    │       ├── mail-details.tsx
    │       ├── mail-header.tsx
    │       ├── mail-item.tsx
    │       ├── mail-list.tsx
    │       ├── mail-nav.tsx
    │       ├── mail-nav-item.tsx
    │       ├── mail-skeleton.tsx
    │       └── view/
    │           ├── index.ts
    │           └── mail-view.tsx
    │
    └── types/
        └── mail.ts
```

## Estrutura de Arquivos (Backend - Cloudflare Workers)

A arquitetura do backend segue o padrão de **Monolito Modular**, garantindo isolamento e escalabilidade.

```
/home/sandro/DAO/backend/src
├── routes/
│   └── platform/
│       └── email.ts              <-- Controlador Hono: Rota API /campaign
├── services/
│   └── email/
│       └── sendpulse.ts          <-- Lógica SendPulse: Auth (KV Cache) + Fetch (AbortController)
├── validators/
│   └── email.ts                  <-- Zod Schemas: Validação rigorosa de payloads
└── types/
    └── bindings.d.ts             <-- Definições: SENDPULSE_ID e SENDPULSE_SECRET
```

## Descrição dos Diretórios e Arquivos (Frontend)

*   **`public/assets/icons/`**: Ícones estáticos (SVG) usados na interface.
*   **`src/_mock/_mail.ts`**: Mock data para desenvolvimento offline e testes.
*   **`src/actions/mail.ts`**: Ações de gerenciamento de estado (buscar, selecionar, deletar).
*   **`src/assets/icons/email-inbox-icon.tsx`**: Componente React animado para o ícone da inbox.
*   **`src/pages/dashboard/mail/index.tsx`**: Página principal do sistema de e-mail no dashboard.
*   **`src/sections/mail/`**: Blocos de construção da UI (compose, details, list, skeleton, etc.).
*   **`src/types/mail.ts`**: Definições de tipos TypeScript (IMail, etc.).

## Descrição dos Componentes (Backend)

*   **Router ([routes/platform/email.ts](file:///home/sandro/DAO/backend/src/routes/platform/email.ts))**: Endpoint seguro protegido por [authSignature](file:///home/sandro/DAO/backend/src/middleware/auth_signature.ts#7-94). Valida a entrada e delega para o serviço.
*   **Service ([services/email/sendpulse.ts](file:///home/sandro/DAO/backend/src/services/email/sendpulse.ts))**: Gerencia o ciclo de vida do token SendPulse via cache no Cloudflare KV e executa disparos com proteção de timeout.
*   **Validator ([validators/email.ts](file:///home/sandro/DAO/backend/src/validators/email.ts))**: Garante a integridade dos dados antes que cheguem à lógica de negócio.

## Bibliotecas e Dependências

### Frontend
*   **React & TypeScript**: Base do desenvolvimento.
*   **Material-UI (MUI)**: Suíte de componentes para interface premium.
*   **minimal-shared/hooks**: Hooks utilitários compartilhados.

### Backend
*   **Hono**: Framework web ultra-leve para Edge.
*   **Zod**: Validação de esquemas e tipagem estática.
*   **Cloudflare KV**: Armazenamento de alta performance para tokens OAuth.
*   **AbortController**: Nativo para controle de resiliência e timeouts.

---
*Este documento serve como marco da arquitetura integrada ASPPIBRA DAO - Sistema de E-mail.*