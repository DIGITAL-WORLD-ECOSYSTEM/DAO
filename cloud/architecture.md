# Architecture Overview
Definição da stack técnica e padrões de integração.

## Technical Stack
- **Frontend:** React / Vite / Vinext (Cloudflare Pages).
- **Backend:** Hono / Edge Runtime (Cloudflare Workers).
- **Database:** Cloudflare D1 (SQLite).
- **Storage:** Cloudflare R2.
- **Auth:** WebCrypto PBKDF2 + JWT (HS256).

## 🛡️ SSI Vault: Criptografia Soberana
O sistema utiliza Identidade Autogovernada (SSI) para garantir que a DAO nunca possua as chaves privadas dos cidadãos.

### Curvas e Algoritmos
- **Derivação de Seed:** BIP-39 (24 palavras) + PBKDF2 (600.000 iterações).
- **Assinatura (Votos/Propostas):** Ed25519 (RFC 8032) - Alta performance e resistência a ataques de canal lateral.
- **Criptografia (Perfis/Mensagens):** X25519 (Diffie-Hellman na curva Curve25519).
- **Zero Knowledge:** Handshake via assinatura de Nonce (ZKP de posse de senha).

### Hierarquia de Chaves (BIP-44 adaptado)
- `m/44'/60'/0'/0/0`: Chave Mestre de Identidade.
- `m/44'/60'/0'/0/1`: Chave de Operações Financeiras.
- `m/44'/60'/0'/0/2`: Chave de Governança (Votos).
- **Storage:** Cloudflare R2.
- **Auth:** WebCrypto PBKDF2 + JWT (HS256).
