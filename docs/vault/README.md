# 🛡️ SSI Vault Documentation Hub (ASPPIBRA-DAO)

Bem-vindo ao centro de documentação da tecnologia de **Identidade Soberana (SSI)** da ASPPIBRA-DAO. Esta infraestrutura garante soberania total, privacidade e segurança de nível elite para todos os Cidadãos.

---

## 📚 Documentos Principais

| Documento | Descrição |
| :--- | :--- |
| [**Specification**](file:///home/sandro/DAO/docs/vault/specification.md) | O "Bluebook" técnico. Criptografia, Handshake e Vault. |
| [**PoI Protocol**](file:///home/sandro/DAO/docs/vault/poi_documentation.md) | Como atestamos a identidade e os níveis de cidadania. |
| [**Audit Report**](file:///home/sandro/DAO/audit/full_credential_audit.md) | Resultados do stress-test e certificação de segurança. |
| [**Lifecycle Logs**](file:///home/sandro/DAO/runtime/identity_lifecycle.md) | Histórico forense do ciclo de vida das credenciais. |

---

## 🛠️ Componentes do Sistema

### 1. `@dao/shared` (Core Criptográfico)
Pacote monorepo contendo as primitivas de BIP-39, Ed25519, PBKDF2 e AES-GCM.
- **Status:** ✅ Auditado e Testado.

### 2. Identity Service (Backend Hono)
API Edge que gerencia o Handshake ZK-Proof e a Revocation List.
- **Status:** 🟢 Operacional no Port 8789.

### 3. RegisterGenesisView (Frontend)
Interface de 6 etapas para a descoberta e ativação da identidade soberana.
- **Status:** 💎 Experiência de Usuário Premium.

---

## 🚦 Próximos Passos
- Integração do DID Document no SocialFi.
- Implementação de Recovery via Social Recovery (Guardiões).

*ASPPIBRA-DAO - Construindo o Mundo Digital Soberano.*
