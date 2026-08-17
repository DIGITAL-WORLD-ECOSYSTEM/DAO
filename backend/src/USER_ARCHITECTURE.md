# Comprehensive Domain Architecture — Master Backend & DB Contract

![Project Status](https://img.shields.io/badge/status-active_development-yellow)
![Version](https://img.shields.io/badge/version-v1.0.0-blue)
![Build](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/badge/license-Apache--2.0-blue)
![Edge Computing](https://img.shields.io/badge/edge-Cloudflare_Workers-orange)
![D1 Database](https://img.shields.io/badge/persistence-Cloudflare_D1-blue)
![Workers KV](https://img.shields.io/badge/cache-Workers_KV-orange)
![R2 Storage](https://img.shields.io/badge/storage-Cloudflare_R2-darkblue)
![IPFS Decentralized](https://img.shields.io/badge/decentralized-IPFS-7b78e8)
![AI Layer](https://img.shields.io/badge/ai-Workers_AI-red)

> **Normative Governance Metadata**
> - **Contract Version:** 1.0.0
> - **Last Validation:** 2026-08-16
> - **Schema Compatibility:** Drizzle ORM / Cloudflare D1 v2
> - **Normative Level:** System Constitution / Single Source of Truth
> - **Architecture Test Suite:** `tests/architecture/architecture-boundaries.test.ts`

---

## 📜 01. CHANGE LOG & CURRENT STATE SNAPSHOT

### Architecture Change Log
- **v1.0.0 (2026-08-16):** Official consolidation of Target Architecture, Cross-Domain Dependency Matrix, 20 Golden Rules with Enforcement Levels, Dual Storage Abstraction (`IObjectStorage` R2 vs `IContentAddressedStorage` IPFS), Web3 × Finance Decoupling, STRIDE Security Threat Model, AAL1/AAL2/AAL3 Authentication Levels, Workers AI Squad, and Normative Contracts for 18 Bounded Contexts.

### Current Reality Snapshot
- **Audit Baseline:** Phase 01 (Constitution Freeze & Governance Enforcement).
- **Active DB Bounded Contexts:** 18 contexts defined in `src/db/`.
- **Identified Technical Debts for Migration:**
  - Legacy `src/repositories/` directory (migrating to `infrastructure/persistence/repositories/`).
  - Scattered Chat files (migrating to `src/domains/communication/chat/`).
  - Legacy routes in `routes/platform/` (migrating to `interfaces/http/routes/`).

### 📊 Visual Module Progress Dashboard

```text
GLOBAL ARCHITECTURAL MATURITY: [███░░░░░░░ 32%]

┌──────────────────────┬────────────────────────┬───────┬──────────────────────────────────────────┐
│ Bounded Context      │ Visual Progress        │ %     │ Current Phase Status                     │
├──────────────────────┼────────────────────────┼───────┼──────────────────────────────────────────┤
│ USER Module          │ [███░░░░░░░]           │  30%  │ DB layer 100% compliant; Domain/App pend.│
│ WEB3 Module          │ [██████░░░░]           │  58%  │ DB layer 100% compliant; signers pending │
│ FINANCE Module       │ [███████░░░]           │  65%  │ Double-entry DB ready; domain pending    │
│ COMMUNICATION Module │ [██████░░░░]           │  60%  │ DB, DO & Workers ready; migration pend.  │
│ AUTHENTICATION Module│ [█████░░░░░]           │  50%  │ DB schema ready; Passkeys/OAuth pending  │
│ CIVIL-IDENTITY Module│ [█████░░░░░]           │  50%  │ DB schema ready; KYC isolation pending   │
│ SSI Module           │ [████░░░░░░]           │  40%  │ DB schema ready; Credentials pending     │
│ GOVERNANCE Module    │ [████░░░░░░]           │  40%  │ DB schema ready; Proposals/Vote pending  │
│ Remaining 10 Domains │ [███░░░░░░░]           │  30%  │ DB schemas ready; route alignment pend.  │
└──────────────────────┴────────────────────────┴───────┴──────────────────────────────────────────┘
```

---

## 📑 02. ARCHITECTURE DECISION RECORDS (ADR LOG)

- **ADR-001:** `src/db/<context>/` is the canonical baseline for persistent Bounded Context definitions.
- **ADR-002:** Architecture style is a **Modular Monolith** running on Cloudflare Workers Edge Infrastructure. Service Bindings are optional for isolated Workers.
- **ADR-003:** The `domains/` layer MUST be strictly framework-agnostic (zero imports of Hono, Drizzle, Cloudflare, or Viem).
- **ADR-004:** Web3 execution (`web3Transactions`) is decoupled from Finance accounting (`ledgerEntries`). Web3 events trigger Double-Entry Ledger updates.
- **ADR-005:** Dual-port storage abstraction: `IObjectStorage` (R2/S3) for operational objects and `IContentAddressedStorage` (IPFS) for immutable CIDs. Private/sensitive data on IPFS requires pre-encryption.
- **ADR-006:** Communication context (`src/db/communication/`) unifies Chat, Email, and Notifications capabilities under a single Bounded Context.
- **ADR-007:** Formal Authentication Assurance Levels (AAL1, AAL2, AAL3) govern access to sensitive routes and institutional operations.
- **ADR-008:** Native AI layer integration via Cloudflare Workers AI (`@cf/meta/llama-3.1-8b-instruct`, `@cf/meta/llama-guard-3-8b`, etc.) for automated curation, SEO, and security auditing.

---

## 🔐 03. INSTITUTIONAL SECURITY (STRIDE & AAL LEVELS)

### Authentication Assurance Levels (AAL Matrix)

```text
┌───────┬──────────────────────────┬────────────────────────────────────────────────────────────┐
│ Level │ Description              │ Required Authentication Mechanisms                         │
├───────┼──────────────────────────┼────────────────────────────────────────────────────────────┤
│ AAL1  │ Digital Identity         │ Basic Auth (Email + Password PBKDF2 or Web3 SIWE)          │
│ AAL2  │ Strong Identity          │ AAL1 + Mandatory MFA / TOTP (Google Auth/Authy)            │
│ AAL3  │ Institutional Identity   │ AAL2 + Approved KYC + Cryptographic Challenge (SSH/YubiKey)│
└───────┴──────────────────────────┴────────────────────────────────────────────────────────────┘
```

### Cryptographic Threat Model (STRIDE Matrix)

| Category | Threat | Architectural Mitigation Strategy | Enforcement Level |
| :--- | :--- | :--- | :--- |
| **S**poofing | Identity Spoofing | MFA/TOTP (AAL2), SIWE EIP-4361, Email Verification | **Authentication** |
| **T**ampering | Data Tampering | Immutable IPFS CIDs, Ledger Cryptographic Hashes | **D1 DB / IPFS** |
| **R**epudiation | Action Repudiation | Immutable Audit Logs via `security_audit_logs` | **Security Domain** |
| **I**nformation Disclosure | Data Leakage | Pre-upload IPFS Encryption, Protected R2, HttpOnly Session JWT | **Infrastructure** |
| **D**enial of Service | Service Outage | IP/User Rate Limiting, Cloudflare Turnstile, KV Edge Cache | **Cloudflare Edge** |
| **E**levation of Privilege | Privilege Escalation | Minimum required AAL per route, Explicit D1 RBAC | **Authorization** |

---

## 🏛️ 04. ARCHITECTURE CONSTITUTION (THE 20 GOLDEN RULES)

| # | Architectural Rule | Normative Specification | Enforcement Level |
| :-: | :--- | :--- | :--- |
| **1** | **DB Baseline** | `src/db/<context>/` defines the persistent Bounded Context. Does not imply full application maturity. | **DB / Architecture** |
| **2** | **Domain Purity** | `domains/` contains only *Aggregates, Entities, Value Objects, Domain Services, Domain Events, Specifications, Policies*, and *Domain Errors*. DTOs, Controllers, ORM models, or Cloudflare bindings are strictly forbidden. | **Architecture Test** |
| **3** | **Dependency Inversion** | `application/ports/` is split into `input/` (use cases) and `output/` (repositories, signers, hasher, JWT, storage). | **Architecture Test** |
| **4** | **Concrete Infrastructure** | `infrastructure/` implements all output ports. Domain **never** depends on Infrastructure. | **Architecture Test** |
| **5** | **Interface Adaptation** | `interfaces/` is split into `http/`, `webhooks/`, and `runtime/` (`queue-consumers/`, `workflows/`, `scheduled/`). | **Application / HTTP** |
| **6** | **Eliminate Loose `src/services`** | Legacy `src/services/` is removed. Business logic resides in Use Cases or Domain Services when strictly necessary. | **Architecture Test** |
| **7** | **Eliminate Loose `src/repositories`** | Port interfaces reside in `application/ports/output/` and implementations in `infrastructure/persistence/repositories/`. | **Architecture Test** |
| **8** | **Route Taxonomy** | Routes organized by context in `interfaces/http/routes/<context>/`. Eliminates `core`, `platform`, and `products`. | **Interfaces** |
| **9** | **Agnostic Controllers** | Controllers reside in `interfaces/http/controllers/<context>/`. Domain ignores HTTP. | **Architecture Test** |
| **10** | **Blockchain Ports** | Abstraction via `IBlockchainGateway`, `IWalletSigner`, `IKeyProvider`, and `INonceManager`. Viem/RPC isolated in infrastructure. | **Infrastructure** |
| **11** | **Web3 × Finance** | Web3 transaction (execution) emits an event that feeds the Finance ledger (accounting). Direct on-chain balance mutation is forbidden. | **Domain / Application** |
| **12** | **Dual-Port Storage** | `IObjectStorage` (operational R2) and `IContentAddressedStorage` (immutable IPFS CIDs). | **Infrastructure** |
| **13** | **IPFS Security** | All IPFS CIDs are public. *PRIVATE* and *CONFIDENTIAL* data must be encrypted prior to pinning or stored in protected R2. | **Infrastructure / Security** |
| **14** | **Cloudflare Bindings** | Prefer native bindings (`c.env.DB`, `c.env.R2`) when tied to Workers; REST permitted only for external services without bindings. | **Infrastructure** |
| **15** | **Service Bindings** | Permitted for communication between independent Workers; optional within the Modular Monolith. | **Cloudflare Infrastructure** |
| **16** | **Queue Idempotency** | Cloudflare Queues delivers *at-least-once*. Consumers verify `messageId`, `eventId`, `correlationId`, and `idempotencyKey`. | **Application / Worker** |
| **17** | **Durable Workflows** | Reserved for long-running, multi-step, stateful, and retryable processes (Onboarding, RWA Tokenization, Settlement). | **Runtime / Workflow** |
| **18** | **Stateful Durable Objects** | Used for real-time stateful coordination per entity (WebSockets, presence, rooms, locks), not as main relational datastore. | **Cloudflare Infrastructure** |
| **19** | **DB Enforcement** | Physical constraints (`CHECK`, `FOREIGN KEY`, `UNIQUE`) and `BEFORE UPDATE` triggers enforce relational integrity in D1 SQLite. | **D1 Database Constraints** |
| **20** | **Automated Governance** | The `tests/architecture/architecture-boundaries.test.ts` test suite validates import boundaries in CI/CD. | **CI / Architecture Test** |

---

## 🔗 05. CROSS-DOMAIN DEPENDENCY MATRIX

| Bounded Context | May Depend On | Prohibited Dependencies | Enforcement Level |
| :--- | :--- | :--- | :--- |
| **`user`** | `shared/kernel` | `finance`, `web3`, `civil-identity`, `ssi` | **Architecture Test** |
| **`authentication`** | `user` (only `userId` / email) | `finance`, `web3`, `civil-identity` | **Architecture Test** |
| **`authorization`** | `user` (only `userId`) | `finance`, `web3`, `communication` | **Architecture Test** |
| **`civil-identity`** | `user` (`userId` reference) | `web3` (keys), `finance` (ledger) | **Architecture Test** |
| **`communication`** | `user` (`userId` reference) | `finance` (ledger), `web3` (keys) | **Architecture Test** |
| **`finance`** | `user` (`userId`), `web3` Events | RPC internals, `civil-identity` | **Domain / Application** |
| **`web3`** | `user` (`userId`) | `finance` ledger internals | **Domain / Application** |
| **`ssi`** | `user` (`userId`), `civil-identity` | `finance`, `communication` | **Architecture Test** |

---

## 📐 06. GENERAL TOPOLOGY & DEPENDENCY FLOW

```text
               ┌────────────────────────────────┐
               │          INTERFACES            │
               │  (HTTP / Webhooks / Runtimes)  │
               └───────────────┬────────────────┘
                               │
                               ▼
               ┌────────────────────────────────┐
               │          APPLICATION           │
               │  (Use Cases / Commands / Ports)│
               └───────────────┬────────────────┘
                               │
                               ▼
               ┌────────────────────────────────┐
               │             DOMAIN             │
               │  (Aggregates / Entities / Rules)│
               └───────────────┬────────────────┘
                               │
                        PORTS / CONTRACTS
                               ▲
                               │
               ┌───────────────┴────────────────┐
               │         INFRASTRUCTURE         │
               │ (D1 / Cloudflare / Viem / IPFS)│
               └────────────────────────────────┘
```

---

# 🤖 07. ARTIFICIAL INTELLIGENCE LAYER (WORKERS AI)

The backend features native integration with **Cloudflare Workers AI**, running models on the Edge network with zero external API latency.

### Integrated AI Squad Models

| Function / Role | Cloudflare Workers AI Model | System Application |
| :--- | :--- | :--- |
| **Writing & Communication** | `@cf/meta/llama-3.1-8b-instruct` | Generation and synthesis of official DAO announcements |
| **SEO & Metadata** | `@cf/meta/llama-3.2-3b-instruct` | Optimization of tags, titles, and RWA/Blog metadata |
| **Security & Moderation** | `@cf/meta/llama-guard-3-8b` | Content moderation and anomaly/fraud detection |
| **Visual Assets** | `@cf/black-forest-labs/flux-1-schnell` | Generation of photorealistic covers and visual assets |
| **Accessibility (Alt-Text)** | `@cf/llava-hf/llava-1.5-7b-hf` | Automatic description of KYC documents and images |
| **Multilingual Translation** | `@cf/meta/m2m100-1.2b` | Internationalization (PT/EN/ES) of DAO proposals |

---

# 📦 08. NORMATIVE CONTRACTS PER BOUNDED CONTEXT

---

## MODULE: USER `[███░░░░░░░ 30%]`

- **Physical Path:** `src/db/user/` | **Domain:** `src/domains/user/`
- **Architectural Owner:** User Domain Team / Core Architect
- **Progress Status:** `[███░░░░░░░ 30%]` (DB layer 100% compliant with Section 05; Domain & Application layers pending)
- **Responsibility:** Represents the system's internal account and its directly owned data (profile, contacts, addresses, preferences). Not responsible for authentication, KYC, blockchain, authorization, or finance.

### 1. Overview

```text
┌───────────────────────────────────────────────────────────────────────────┐
│                           USER / ACTOR                                    │
│                                                                           │
│        "Which account exists inside the system?"                         │
│                                                                           │
│        src/db/user/                                                       │
│                                                                           │
│   ┌───────────────────────────────┐                                      │
│   │             users             │                                      │
│   │                               │                                      │
│   │ id                            │ ◄── internal identity (PK)           │
│   │ publicId                      │ ◄── public identity after            │
│   │ subjectType                   │     onboarding + wallet              │
│   │ email                         │                                      │
│   │ emailNormalized               │                                      │
│   │ emailVerifiedAt               │                                      │
│   │ emailChangedAt                │                                      │
│   │ authEpoch                     │                                      │
│   │ status                        │                                      │
│   │ statusChangedAt               │                                      │
│   │ lockedAt                      │                                      │
│   │ disabledAt                    │                                      │
│   │ deletedAt                     │                                      │
│   │ createdAt                     │                                      │
│   │ updatedAt                     │                                      │
│   └───────────────┬───────────────┘                                      │
│                   │                                                      │
│        ┌──────────┼───────────────┬──────────────┬──────────────┐        │
│        │          │               │              │              │        │
│        ▼          ▼               ▼              ▼              ▼        │
│   userProfiles  Contacts      Addresses      Education     Experience    │
│                                                                           │
│                   ┌─────────────────────────────────────┐                │
│                   │         membershipCards              │                │
│                   └─────────────────────────────────────┘                │
│                                                                           │
│                   ┌─────────────────────────────────────┐                │
│                   │   userNotificationSettings           │                │
│                   └─────────────────────────────────────┘                │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘
```

### 2. Identities and Source of Truth
```text
┌──────────────────────┬─────────────────────────────────────────┬────────────────────────────┐
│ Identity             │ Responsibility                          │ Semantics / Enforcement    │
├──────────────────────┼─────────────────────────────────────────┼────────────────────────────┤
│ users.id             │ Internal Relational Identity            │ Primary Key (DB)           │
│ users.publicId       │ Public Projection Derived from Wallet   │ Unique Constraint (DB)     │
│ citizens.userId      │ Civil Identity (KYC)                    │ Composite FK (DB)          │
│ wallets.address      │ Canonical Blockchain Identity           │ Unique EVM Address (DB)    │
│ didIdentities.did    │ SSI Identity (W3C)                      │ Unique Constraint (DB)     │
└──────────────────────┴─────────────────────────────────────────┴────────────────────────────┘
```

### 3. Public ID Invariants
1. `publicId` starts as `NULL` (Approved KYC does not assign `publicId` automatically; it only enables the next step).
2. Internal wallet provisioning is orchestrated by backend: Approved KYC → Backend exposes capability → User requests → Backend creates Internal Wallet → `wallet.address` becomes `users.publicId`.
3. `users.publicId` mirrors the active internal wallet. It cannot point to external wallets.

### 4. Account Lifecycle (`users.status`)
```text
pending_setup ──► active ──► locked / suspended / disabled ──► active
```
- **Critical Rule:** `KYC rejected ≠ user suspended`. KYC failure keeps citizen unverified without suspending account, unless fraud is detected.

### 5. Boundaries (What DOES NOT Belong to User)
- ❌ Passwords, TOTP, Sessions, OAuth Tokens (`authentication`)
- ❌ KYC status, civil documents (`civil-identity`)
- ❌ DIDs and Verifiable Credentials (`ssi`)
- ❌ Balances, Ledger, and Accounts (`finance`)
- ❌ Private keys or EVM signers (`web3`)

### 6. Roadmap: CURRENT STATE vs TARGET ARCHITECTURE

| Component / Feature | State | Owner | Enforcement Level |
| :--- | :--- | :--- | :--- |
| **`users` & `userProfiles`** | ✅ Existing | User Team | DB Constraints |
| **`userContacts` & `userAddresses`** | ✅ Existing | User Team | DB Constraints |
| **`membershipCards`** | ✅ Existing | User Team | DB Constraints |
| **Post-KYC `publicId` (Nullable)** | ⚠️ Defined | User/Web3 Orchestrator | DB + Application |
| **Internal Wallet Provisioning** | ⏳ Pending | Web3 Team | Application Workflow |
| **Sync `wallet.address` → `publicId`** | ⏳ Pending | User Orchestrator | Application / DB |

---

## MODULE: WEB3 `[███████░░░ 70%]`

- **Physical Path:** `src/db/web3/` | **Domain:** `src/domains/web3/`
- **Architectural Owner:** Web3 & Blockchain Engineering Team
- **Progress Status:** `[███████░░░ 70%]` (DB topology ready; signers/nonce ports pending)
- **Responsibility:** Manages technical infrastructure for blockchain network execution, wallets (EOA, Smart Contracts, Safes), and on-chain transaction lifecycles.

### 1. Overview (Web3 Topology)

```text
                    WEB3 DOMAIN
                         │
        ┌────────────────┼────────────────┐
        │                │                │
     wallets      web3Networks     smartContracts
        │                │                │
        └───────────────┬┴────────────────┘
                        │
                 web3Transactions
```

### 2. Wallet Custody Model

```text
┌───────────────────────┬──────────────────┬─────────────────────────────┐
│ Provenance            │ Type             │ Control Mode                │
├───────────────────────┼──────────────────┼─────────────────────────────┤
│ internal              │ eoa              │ platform_key (KMS)          │
│ external              │ eoa              │ external_user (Injected)    │
│ internal / external   │ smart_contract   │ contract_controller         │
└───────────────────────┴──────────────────┴─────────────────────────────┘
```
- **Custody Invariant:** Custodial EOAs require `keyProvider` and `keyReference` (AWS KMS/Fireblocks). Private keys **never** travel or rest in plaintext in database.

### 3. Transaction Lifecycle (Replacement Lineage)
- Support for transaction replacement (`replacementOfTransactionId`) with Optimistic Locking (`version`).
- Strict distinction between `status = failed` (RPC/mempool rejection) and `status = confirmed` with `receiptStatus = reverted` (EVM rollback consuming gas).

### 4. What DOES NOT Belong to Web3
- ❌ Accounting balances, Ledger, Double-Entry (`finance`).
- ❌ Civil identification data (`civil-identity`).
- ❌ Web2 authentication or session management (`authentication`).

### 5. Roadmap: CURRENT STATE vs TARGET ARCHITECTURE

| Component / Feature | State | Owner | Enforcement Level |
| :--- | :--- | :--- | :--- |
| **`web3Networks` & `smartContracts`** | ✅ Existing | Web3 Team | DB Constraints |
| **`wallets` (Provenance & Control)** | ✅ Existing | Web3 Team | DB Constraints (`ck_wallets_control_mode`) |
| **`web3Transactions` (Lineage)** | ✅ Existing | Web3 Team | DB Constraints (`ck_web3_transactions_replacement`) |
| **Ports (`IWalletSigner`, `INonceManager`)** | ⏳ Pending | Web3 Team | Application Ports |
| **Lifecycle Orchestrator Service** | ⏳ Pending | Web3 Team | Application Use Cases |

---

## MODULE: COMMUNICATION `[██████░░░░ 60%]`

- **Physical Path:** `src/db/communication/` | **Domain:** `src/domains/communication/`
- **Architectural Owner:** Communication Subsystem Team
- **Progress Status:** `[██████░░░░ 60%]` (DB, DO & Workers ready; code migration pending)
- **Responsibility:** Unified omnichannel subsystem comprising Chat, Email, and Notifications subdomains.

### 1. Overview

```text
┌───────────────────────────────────────────────────────────────────────────┐
│                        COMMUNICATION SUBSYSTEM                            │
│                                                                           │
│        src/db/communication/                                              │
│                                                                           │
│ ┌───────────────────────┐ ┌───────────────────────┐ ┌──────────────────┐ │
│ │         CHAT          │ │         EMAIL         │ │  NOTIFICATIONS   │ │
│ │                       │ │                       │ │                  │ │
│ │ chatConversations     │ │ emailAccounts         │ │ notifications    │ │
│ │ chatParticipants      │ │ emailThreads          │ └──────────────────┘ │
│ │ chatMessages          │ │ emailLabels           │                      │
│ │ chatAttachments       │ │ emails                │                      │
│ │ chatReadReceipts      │ │ emailMessageLabels    │                      │
│ │ chatEvents            │ │ emailAttachments      │                      │
│ └───────────────────────┘ │ emailEvents           │                      │
│                           └───────────────────────┘                      │
└───────────────────────────────────────────────────────────────────────────┘
```

### 2. Communication Invariants
1. Isolated subdomains in `src/domains/communication/` (`chat/`, `email/`, `notifications/`).
2. Real-time chat orchestrated via `ChatRoomDO` Durable Object for presence/WebSockets, with async relational D1 persistence via `ChatQueueWorker`.
3. Email processing via `EmailQueueWorker` with idempotency control by `messageId`.

### 3. Roadmap: CURRENT STATE vs TARGET ARCHITECTURE

| Component / Feature | State | Owner | Enforcement Level |
| :--- | :--- | :--- | :--- |
| **Chat, Email & Notification Tables** | ✅ Existing | Communication Team | DB Constraints |
| **`ChatRoomDO` (Durable Object)** | ✅ Existing | Infra / Cloudflare | Cloudflare Runtime |
| **`ChatQueueWorker` & `EmailQueueWorker`** | ✅ Existing | Infra / Workers | Cloudflare Queues |
| **Migration to `domains/communication`** | ⏳ Pending | Communication Team | Architecture Test |
| **Elimination of `src/repositories/chat`** | ⏳ Pending | Communication Team | Architecture Test |

---

## MODULE: FINANCE `[███████░░░ 65%]`

- **Physical Path:** `src/db/finance/` | **Domain:** `src/domains/finance/`
- **Architectural Owner:** Financial Systems Engineering Team
- **Progress Status:** `[███████░░░ 65%]` (Double-entry DB ready; domain isolation pending)
- **Responsibility:** Double-Entry Ledger accounting, financial accounts, balances, and transaction idempotency.

### 1. Overview

```text
┌───────────────────────────────────────────────────────────────────────────┐
│                           FINANCE DOMAIN                                  │
│                                                                           │
│        src/db/finance/                                                    │
│                                                                           │
│   ┌───────────────────────────────┐                                       │
│   │       financialAccounts       │ ◄── Internal checking accounts        │
│   └───────────────┬───────────────┘     for users and DAO                 │
│                   │                                                       │
│                   ▼                                                       │
│   ┌───────────────────────────────┐                                       │
│   │         ledgerEntries         │ ◄── Immutable financial ledger journal│
│   │                               │     (Debits & Credits)                │
│   └───────────────┬───────────────┘                                       │
│                   │                                                       │
│                   ▼                                                       │
│   ┌───────────────────────────────┐                                       │
│   │        idempotencyKeys        │ ◄── Financial concurrency lock        │
│   └───────────────────────────────┘                                       │
└───────────────────────────────────────────────────────────────────────────┘
```

### 2. Accounting Invariants
1. **Double-Entry:** Every entry requires symmetrical debits and credits. Account balance is a projection of ledger entries.
2. **Imutability (`Append-Only`):** Entries in `ledgerEntries` NEVER suffer `UPDATE` or `DELETE`. Corrections require reversal entries.
3. **Idempotency:** Financial operations require unique `idempotencyKey`.

### 3. Roadmap: CURRENT STATE vs TARGET ARCHITECTURE

| Component / Feature | State | Owner | Enforcement Level |
| :--- | :--- | :--- | :--- |
| **`financialAccounts` & `ledgerEntries`** | ✅ Existing | Finance Team | DB Constraints |
| **`idempotencyKeys`** | ✅ Existing | Finance Team | DB Constraints |
| **Consolidation into `domains/finance`** | ⏳ Pending | Finance Team | Architecture Test |
| **`ITreasuryRepository` / `ILedgerRepository`** | ⏳ Pending | Finance Team | Application Ports |

---

# 🚀 09. GLOBAL EXECUTION ROADMAP & RECOVERY PROTOCOL

### Interruption Recovery Protocol
In case of an unexpected interruption during refactoring, the agent or developer MUST:
1. Check the **State** column of the table below to identify the last completed phase (`✅`).
2. Resume execution strictly at the first phase marked as `⏳ In Progress` or `⏳ Pending`.
3. Run `npx vitest run tests/architecture/` to confirm boundary compliance before proceeding.

| Phase | Stage | Activity Description | Owner | Enforcement Level | State |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **01** | **Standardization Baseline** | Freeze Constitution and create `tests/architecture/architecture-boundaries.test.ts`. | Core Architect | Architecture Test | ✅ Completed |
| **02** | **Repositories Refactoring** | Eliminate loose `src/repositories/`; migrate to `ports/output` & `infrastructure/persistence/repositories/`. | Infrastructure | Architecture Test | ⏳ In Progress |
| **03** | **Communication Refactoring** | Migrate Chat, Email & Notifications into `src/domains/communication/`. | Communication | Architecture Test | ⏳ Pending |
| **04** | **Authentication Consolidation** | Migrate Passkeys, TOTP, OAuth, and Sessions into `src/domains/authentication/`. | Security/Auth | Architecture Test | ⏳ Pending |
| **05** | **User Domain Refactoring** | Refactor `user` anchor and implement `publicId` orchestrator. | User Team | DB + Application | ⏳ Pending |
| **06** | **Civil Identity & KYC** | Isolate `civil-identity` (Citizens, Documents, KYC Verification). | Compliance Team | Domain Rules | ⏳ Pending |
| **07** | **Finance & Double-Entry** | Isolate `finance` with ledger control and strict idempotency. | Finance Team | DB + Application | ⏳ Pending |
| **08** | **Web3 & Signers Layer** | Implement `IWalletSigner`, `IKeyProvider`, and `INonceManager` with Viem. | Web3 Team | Application Ports | ⏳ Pending |
| **09** | **IPFS & Content Storage** | Implement `IObjectStorage` and `IContentAddressedStorage` adapters. | Infrastructure | Infrastructure | ⏳ Pending |
| **10** | **SSI & Verifiable Credentials** | Consolidate DIDs and Ed25519 Handshake into `src/domains/ssi/`. | Identity Team | Domain Rules | ⏳ Pending |
| **11** | **Products to Domains Migration** | Refactor inline routes (`rwa`, `real-estate`, `agro`, `exchange`) into respective domains. | Platform Team | Interfaces | ⏳ Pending |
| **12** | **Full Audit & CI Certification** | Run complete suite of unit, integration, chaos, and load (k6) tests. | QA / Lead Architect | CI Certification | ⏳ Pending |
