# Análise de Lacunas (Gap Analysis): SSI Vault ASPPIBRA-DAO

Esta análise identifica os componentes necessários para elevar o sistema atual do estado "Operacional Blindado" para "Nível de Soberania Global (Elite)".

---

## 🛑 1. Recuperação e Resiliência (High Priority)
- **Social Recovery (Guardiões):** Atualmente, se o usuário perder as 24 palavras, a conta é irrecuperável. Falta implementar o protocolo **Shamir Secret Sharing (SSS)** para dividir a semente mestre em "fragmentos" confiados a amigos ou outros DIDs.
- **Múltiplos Dispositivos:** O sistema atual é focado em um único cofre local. Falta um protocolo de sincronização segura entre dispositivos (Mobile vs. Desktop) que não envolva enviar a chave privada para a nuvem.

## 🔑 2. Gestão de Chaves e Identidade (Strategic)
- **Key Rotation (Rotação):** Não há um fluxo para o usuário trocar sua "Chave de Assinatura" (Signer Key) sem perder o DID. Isso é vital se houver suspeita de vazamento da chave de dispositivo (Fortress).
- **Sub-chaves (Derived Keys):** Atualmente usamos a chave mestra para tudo. O ideal seria derivar "Session Keys" temporárias para interações menores, preservando a chave Ed25519 principal em "frio".
- **DID Document (JSON-LD):** O DID existe no D1, mas não é servido como um documento compatível com os padrões da W3C (contendo `authentication`, `assertionMethod`, etc.).

## 🛡️ 3. Segurança Avançada (Infra)
- **Pinned Sessions:** O JWT é a única prova de sessão após o login. Em um sistema Elite, **cada requisição sensível** deveria exigir uma micro-assinatura Ed25519 do cliente, invalidando JWTs roubados.
- **WebAuthn Step-up:** O Passkey foi implementado como 2FA opcional. Falta forçar o "Step-up Authentication" (pedir biometria) para ações críticas como movimentação de fundos ou votos de alta relevância.
- **Hardware Binding:** Explorar o uso de `Secure Enclave` (iOS/Mac) ou `TPM` (Windows) para que a chave nunca possa ser extraída nem pelo software do navegador (usando APIs mais profundas que o IndexedDB).

## 📊 4. Transparência e Auditoria (Trust)
- **Security Dashboard:** O usuário não tem uma interface para ver seus próprios `audit_logs` ou gerenciar suas Passkeys e sessões ativas.
- **Proof of Existence (PoE):** O sistema não ancora as raízes dos audit logs em uma blockchain pública ou em uma "Transparency Log" centralizada/auditável para evitar que a DAO apague logs.

---

## 🛠️ Próximas Implementações Recomendadas (Sprints):
1. **Sprint 5:** Social Recovery (Shamir Secret Sharing).
2. **Sprint 6:** DID Document Standardization (W3C Compliance).
3. **Sprint 7:** Key-Pinned Sessions (Zero-Trust Requests).

*Documento de Auditoria e Planejamento - ASPPIBRA-DAO 2026*
