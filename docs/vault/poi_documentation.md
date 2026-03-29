# Proof of Identity (PoI) - ASPPIBRA-DAO

O **Proof of Identity (PoI)** é o protocolo de atestação que vincula uma identidade criptográfica (DID) a um "Cidadão" validado no ecossistema Mundo Digital.

---

## 1. Níveis de Atenticação

| Nível | Nome | Requisito | Capacidade |
| :--- | :--- | :--- | :--- |
| **L1** | Anonymous | DID Gerado (Handshake) | Navegação, SocialFi (Leitura). |
| **L2** | Citizen | Ed25519 Sign + PIN | Voto em propostas básicas, Postar no SocialFi. |
| **L3** | Verified | L2 + KYC/WebAuthn | Transações Financeiras (On-Ramp), Governança Avançada. |

---

## 2. Processo de Atestação

1. **Geração:** O usuário gera seu par de chaves localmente.
2. **Registro:** A Chave Pública é enviada ao Registro D1 via Handshake ZK-Proof.
3. **Validação:** O sistema emite um `audit_log` marcando o evento `CITIZEN_GENESIS_COMPLETE`.
4. **Persistência:** O DID documento é tornado imutável ou versionado no D1.

---

## 3. Auditoria de Identidade

Qualquer entidade autorizada pode verificar a autenticidade de uma ação (Voto/Post) seguindo estes passos:
1. Recuperar o `publicKey` do Cidadão no Registro D1.
2. Verificar a assinatura digital anexada ao conteúdo.
3. Checar a **Revocation List** (Status no D1) para garantir que a chave ainda é válida.

---
*Escrito por: Agente Arquiteto - ASPPIBRA-DAO 2026*
