# ASPPIBRA DAO - Tech Stack Inventory (v1.0)

Este documento registra as versões oficiais e a integração das tecnologias utilizadas no ecossistema ASPPIBRA-DAO.

---

## 🛠️ Ambiente de Desenvolvimento & Runtime
- **Node.js:** v24.14.1 (LTS) - *Obrigatório para suporte nativo a ESM e WebCrypto.*
- **Gerenciador de Pacotes:** pnpm v10.33.0 (Monorepo Workspace).
- **Cloudflare Wrangler:** 4.35.0 (Deployment & Local Dev).

---

## 🌐 Frontend (Edge Client)
- **Framework:** React 19.2.4 + Vinext 0.0.37.
- **Build Tool:** Vite 8.0.3.
- **UI & Styling:** 
  - Material UI (MUI) v7.3.7.
  - Emotion v11.14.0.
  - Framer Motion v12.29.2.
- **Data Fetching:** Axios v1.13.4 + SWR v2.3.8.
- **Formulários:** React Hook Form v7.71.1 + Zod v4.3.6.

---

## ⚙️ Backend (Edge Server)
- **Runtime:** Cloudflare Workers (Edge-Native).
- **Framework API:** Hono v4.10.7.
- **Database (ORM):** Drizzle ORM v0.44.7 + Drizzle Kit v0.31.8.
- **Persistência:** Cloudflare D1 (SQLite).
- **Storage:** Cloudflare R2 (Bucket: socialfi).
- **Auth & Security:** 
  - WebCrypto PBKDF2 (Nativo).
  - JWT HS256 (Hono/JWT).
  - SIWE (Sign-In with Ethereum) v3.0.0.

---

## 🧪 Qualidade & Auditoria
- **Testes:** Vitest v3.2.0 (Backend) / Vite-native (Frontend).
- **Linters:** ESLint 9.39 + Prettier 3.8.1.
- **Security Audit:** `ops/pre-commit-audit.sh` (Custom).

---
*Assinado: Agente Arquiteto - 2026-03-29*
