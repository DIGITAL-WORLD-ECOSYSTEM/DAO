# Arquitetura Completa do Módulo USER (Contrato Definitivo)

A documentação abaixo serve como a "Constituição" e o Roadmap oficial para o módulo `user`. Ela separa explicitamente o estado atual da arquitetura-alvo, estabelecendo invariantes rigorosos para evitar alucinações de implementação.

**Local físico:** `/home/sandro/DAO/backend/src/db/user/`

**Responsabilidade:** O módulo user representa a conta interna do sistema e os dados diretamente pertencentes a essa conta. Ele não é responsável por autenticação, KYC, blockchain, autorização ou regras de negócio.

---

## 1. Visão Geral

```text
┌───────────────────────────────────────────────────────────────────────────┐
│                           USER / ACTOR                                    │
│                                                                           │
│        "Qual conta existe dentro do sistema?"                            │
│                                                                           │
│        src/db/user/                                                       │
│                                                                           │
│   ┌───────────────────────────────┐                                      │
│   │             users             │                                      │
│   │                               │                                      │
│   │ id                            │ ◄── identidade interna                │
│   │ publicId                      │ ◄── identidade pública após          │
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

---

## 2. Identidades e Source of Truth

Para impedir colisões entre identificadores, o sistema distingue rigidamente:

```text
┌──────────────────────┬─────────────────────────────────────────┐
│ Identidade           │ Responsabilidade                        │
├──────────────────────┼─────────────────────────────────────────┤
│ users.id             │ identidade interna (PK relacional)      │
│ users.publicId       │ identidade pública blockchain (EVM)     │
│ citizens.userId      │ identidade civil (KYC)                  │
│ wallets.address      │ endereço técnico da wallet interna      │
│ didIdentities.did    │ identidade SSI                          │
│ Google identity      │ método/identidade externa de login      │
│ GitHub identity      │ método/identidade externa de login      │
└──────────────────────┴─────────────────────────────────────────┘
```

### SOURCE OF TRUTH
- **`wallets.address`** = Fonte técnica da identidade blockchain (Endereço EVM da Wallet Interna).
- **`users.publicId`** = Identidade pública blockchain da conta ASPPIBRA, materializada pelo endereço da wallet interna.

**Regra:** O objetivo arquitetural é impedir divergência semântica: `users.publicId` NÃO é um UUID público genérico nem uma projeção independente, e deve sempre espelhar a wallet interna ativa. O usuário NÃO escolhe esse identificador nem precisa conhecer detalhes da rede, e a wallet externa de saque NUNCA pode alimentar `users.publicId`. O módulo `user` não cria identidades externas; o módulo `authentication` é responsável por resolver qual `User` existente deve ser vinculado a elas.

---

## 3. Public ID Invariants

O `publicId` representa exclusivamente a identidade pública blockchain da conta ASPPIBRA e está sujeito aos seguintes invariantes técnicos:

1. `publicId` começa `NULL` (KYC aprovado não cria o publicId automaticamente, apenas habilita o próximo passo).
2. `publicId` só nasce depois de: criação da conta → onboarding → KYC aprovado → liberação de "Criar Wallet" → geração do endereço interno EVM → vinculação à conta.
3. O sistema administra nativamente rede, taxas e chainId EVM. O mesmo endereço pode ser usado em várias redes internamente, ocultando essa complexidade do usuário.
4. `publicId` NÃO pode ser alterado arbitrariamente. A revogação da wallet interna é um evento excepcional de segurança. Se houver rotação extraordinária, o endereço antigo vai para um histórico interno e o novo assume o `publicId`. Não criar segunda identidade pública concorrente.
5. `publicId` NÃO pode apontar para uma wallet externa (que é apenas um destino financeiro de saque do domínio `web3`/`finance`).
6. Uma conta NÃO pode possuir dois `publicIds` ativos simultaneamente.
7. O endereço da wallet interna NÃO pode ser reutilizado por outra conta.

---

## 4. Ciclo de Vida e Máquina de Estados

### 4.1. Transição de Status da Conta
A máquina de estados da conta (`users.status`) é restrita e independente do KYC:

```text
pending_setup
      │
      ▼
    active
      │
 ┌────┼────┐
 ▼    ▼    ▼
locked suspended disabled
 │
 └──────► active
```
**Regra Crítica:** `KYC rejected ≠ user suspended`. A falha no KYC apenas mantém o cidadão não verificado, sem suspender automaticamente o acesso à plataforma, a menos que haja fraude detectada (o que é responsabilidade do domínio de segurança/auditoria).

### 4.2. Momentos da Criação da Wallet Interna
A wallet interna é criada pela plataforma. A ativação da identidade pública passa pelos seguintes estados explícitos:

```text
KYC APPROVED (civil-identity)
      ↓
frontend libera opção "Criar Wallet"
      ↓
usuário solicita criação
      ↓
backend orquestra e cria wallet interna
      ↓
wallet = ACTIVE (produz um único endereço EVM)
      ↓
address torna-se users.publicId
```

---

## 5. Regras Específicas de Entidades

- **Email — Identificador Inicial da Conta:** `users.email` tem duas funções: atua como o **contato principal da conta** e, durante a fase inicial de criação, funciona como o **identificador primário de login**. A credencial utilizada para autenticar esse login (ex: senha) pertence ao módulo `authentication`.

```text
┌─────────────────────────────────────────────┐
│ USER                                        │
│                                             │
│ email = "usuario@exemplo.com"               │
│                                             │
│ "Esta conta é identificada inicialmente     │
│  por este email."                           │
└───────────────────┬─────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│ AUTHENTICATION                              │
│                                             │
│ password credential                         │
│                                             │
│ "Esta pessoa provou que controla essa      │
│  conta."                                    │
└─────────────────────────────────────────────┘
```
- **Membership Cards:** `membershipCards` é a credencial emitida para representar a associação do usuário à DAO. **Não é** credencial de autenticação, role de autorização, wallet ou credencial de KYC.
- **Notification Settings:** `userNotificationSettings` guarda preferências. Ele **não determina** quais eventos existem, como são gerados, nem como emails/chats são entregues (Isso é responsabilidade de `communication`).
- **Identidades Externas de Login (Google/GitHub/Wallet como Autenticação):** São puramente mecanismos externos de vinculação (domínio `authentication`). Eles **NÃO substituem `users.id`** e **NÃO criam contas duplicadas silenciosamente**. O módulo de autenticação deve encontrar a conta pré-existente e apenas atestar o vínculo. A wallet, especificamente, nunca pode criar a conta inicial (só pode ser usada para login após a conta existir e KYC/Onboarding estarem concluídos).
- **Wallet Externa (Destino Financeiro):** Pertence ao domínio `web3`, e operações com ela pertencem ao `finance`. Ela NÃO é a identidade da conta e NÃO pode ser o `publicId`. Fluxo de saque: `USER` solicita saque → escolhe wallet externa → sistema apresenta (rede, valor, taxas, destino) → confirmação explícita → `FINANCE` executa operação com contexto técnico do `WEB3`.

---

## 6. As Fronteiras (O que NÃO PERTENCE ao User)

O módulo `user` é a âncora, mas **não deve possuir**:
- ❌ Senhas, TOTP, Sessões, Google ID, GitHub ID (`authentication`)
- ❌ Status do processo de KYC, RG, CPF (`civil-identity`)
- ❌ DIDs (`ssi`)
- ❌ Autenticadores Wallet ou endereços como chaves primárias de web3 (`web3`, `authentication`)
- ❌ Regras RBAC, Roles, Permissões (`authorization`)
- ❌ Auditorias imutáveis (`security`)
- ❌ Saldos, Ledger, Contas Internas e Métodos de Pagamento Fiat (`finance`): O módulo User cede apenas o seu `users.id`. É responsabilidade exclusiva do banco de dados do `finance` garantir, via chaves estrangeiras compostas e *constraints*, que um usuário não movimente ou possua contas de outro.

---

## 7. Roadmap: CURRENT STATE vs TARGET ARCHITECTURE

Esta tabela diferencia claramente a documentação arquitetural das funcionalidades que já estão implementadas em código. Ela deve guiar as próximas fases da refatoração.

| Componente/Funcionalidade | Estado | Detalhe (Target Architecture) |
| :--- | :--- | :--- |
| **`users`** | ✅ Existente | Tabela base modelada |
| **`userProfiles`** | ✅ Existente | Perfil de apresentação modelado |
| **`userContacts`** | ✅ Existente | Contatos modelados |
| **`userAddresses`** | ✅ Existente | Endereços modelados |
| **`userProfessionalExperience`** | ✅ Existente | Experiência modelada |
| **`userEducation`** | ✅ Existente | Educação modelada |
| **`membershipCards`** | ✅ Existente | Credencial da DAO modelada |
| **`userNotificationSettings`** | ✅ Existente | Preferências modeladas |
| **`publicId` pós-KYC** | ⚠️ Arquitetura Definida | `publicId` transformado em `nullable` em DB, pendente orquestração. |
| **Criação automática wallet interna** | ⏳ Implementação Pendente | Necessita orquestração a partir de liberação do frontend. |
| **Sincronização `wallet.address` → `publicId`** | ⏳ Implementação Pendente | Necessita orquestrador para atribuir o endereço ao publicId. |
| **Histórico de rotação de `publicId`** | ⚠️ Arquitetura Definida | Log imutável em caso extraordinário de comprometimento. |
| **Resolução de Google/GitHub** | ⏳ Implementação Pendente | `authentication` deve encontrar usuário sem duplicar conta. |
| **Vinculação de Wallet p/ Login** | ⏳ Implementação Pendente | Apenas após KYC e carteira interna existirem. |
| **Prevenção de duplicidade (Identidades externas)** | ⏳ Implementação Pendente | Assegurar que nenhum método gera nova conta silenciosamente. |
| **Propriedade Financeira (Cross-Domain)** | ✅ Existente | `users.id` atua como âncora de `financialAccounts`, `fiatAccounts` e `idempotencyKeys`, com integridade garantida via DB Constraints no domínio Finance. |
