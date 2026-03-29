# Especificação Técnica: SSI Vault (ASPPIBRA-DAO)

Este documento descreve a arquitetura de **Identidade Soberana (SSI)** implementada no ecossistema Mundo Digital. O objetivo é garantir que nenhum dado sensível (chaves privadas, sementes) jamais deixe o dispositivo do usuário.

---

## 1. Fluxo de Gênese (Criação de Identidade)

### A. Coleta de Entropia (Entropy Collector)
- **Método:** Movimentos do mouse e timestamp de alta precisão.
- **Objetivo:** Gerar uma semente de aleatoriedade física (256-bit) para o CSPRNG.

### B. Backup Mnemônico (BIP-39)
- **Padrão:** 24 palavras (Inglês).
- **Criptografia:** Derivado via `bip39.generateMnemonic(256)`.
- **Segurança:** O mnemônico é a "Chave Mestra". Perder o mnemônico significa perda total de acesso à conta (Non-Custodial).

### C. Hardening de Semente (PBKDF2)
- **Algoritmo:** PBKDF2-HMAC-SHA256.
- **Iterações:** 600.000 (Elite Standard).
- **Salt:** UUID exclusivo gerado no primeiro acesso + Salt do Backend (opcional).
- **Saída:** Seed de 512-bit (64 bytes).

---

## 2. Hierarquia de Chaves (Key Derivation)

Usamos a semente de 64 bytes para derivar pares de chaves especializados:

| Função | Algoritmo | Segmento da Seed | Uso |
| :--- | :--- | :--- | :--- |
| **Identidade (Sign)** | Ed25519 | bytes 0-31 | Votos, Assinatura de Transações, Login. |
| **Privacidade (Enc)** | X25519 | bytes 32-63 | Criptografia P2P, Mensagens Privadas. |

---

## 3. Protocolo de Handshake (Zero Knowledge Login)

O login não utiliza senhas enviadas ao servidor. O fluxo é um **Desafio-Resposta (Challenge-Response)**:

1. **Pedido:** O cliente solicita um desafio para o usuário `sandro`.
2. **Desafio:** O servidor gera um `nonce` aleatório e o armazena temporariamente (KV).
3. **Assinatura:** O cliente assina o `nonce` localmente com sua **Chave Privada Ed25519**.
4. **Resolução:** O cliente envia a **Assinatura** + **Chave Pública**.
5. **Verificação:** O servidor valida a assinatura. Se correta, emite um JWT de sessão.

---

## 4. Gerenciamento de Ciclo de Vida (Lifecycle)

Monitoramos todas as transições de estado de uma identidade para garantir a rastreabilidade auditável:

| Evento | Gatilho | Ação |
| :--- | :--- | :--- |
| **GENESIS** | Primeiro Registro | Criação do registro no D1 e log de auditoria forense. |
| **HANDSHAKE** | Login com Sucesso | Emissão de desafio/assinatura e registro de IP/Session. |
| **FORTRESS_UPGRADE** | Adição de Passkey | Vínculo de biometria ao perfil e incremento de nível de segurança. |
| **REVOCATION** | Denúncia ou Perda | Desativação imediata da Chave Pública no D1. |

---

## 5. Registro de Revogação (Revocation List)

Uma identidade pode ser revogada em casos de:
1. **Comprometimento de Chave:** O usuário reporta que seu mnemônico vazou.
2. **Má Conduta DAO:** Decisão de governança para desativar os direitos de um DID.
3. **Upgrade de Identidade:** Migração para um novo conjunto de chaves.

**Protocolo de Revogação:**
- O servidor muda o `status` para `'revoked'` na tabela `citizens`.
- Qualquer Handshake futuro com essa `publicKey` será rejeitado imediatamente.
- O DID permanece na lista como `'tombstone'` para preservar a integridade histórica dos votos passados.

---

## 7. Fortress (Segurança de Dispositivo & 2FA)

O nível **Fortress** garante que, mesmo com acesso físico ao dispositivo, as chaves permaneçam seguras.

### A. LocalVault (IndexedDB Encrypted)
- **Armazenamento:** O mnemônico e as sementes são guardados no `IndexedDB` do navegador.
- **Criptografia:** AES-256-GCM.
- **Derivação de PIN:** O PIN de 4-6 dígitos do usuário não é a chave, mas a base para uma derivação via **PBKDF2-HMAC-SHA256** com **100.000 iterações** e salt local.

### B. Biometria (WebAuthn / Passkeys)
- **Fluxo:** O Cidadão vincula sua biometria (FaceID/TouchID) ao DID.
- **Vantagem:** Permite logins rápidos sem redigitar o PIN, mantendo o mesmo nível de segurança criptográfica.
- **Backend:** O `credentialID` e a `publicKey` da Passkey são persistidos no D1.

---

## 8. Auditoria e Calibração
- **Frequência:** Diária via Agente Auditor em `/runtime`.
- **Certificação:** Stress-tested com 100% de sucesso em 29/03/2024.
- **Logs:** [audit/full_credential_audit.md](file:///home/sandro/DAO/audit/full_credential_audit.md).

---
*Escrito por: Agente Arquiteto - ASPPIBRA-DAO 2026*
