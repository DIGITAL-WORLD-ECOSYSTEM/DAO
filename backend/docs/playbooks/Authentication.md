# Playbook de Incidente: Falhas de Autenticação / RBAC (SEV-2)

## 1. Como Identificar?
- **Sintoma:** Usuários reclamando que não conseguem fazer login ou recebem deslogamento instantâneo.
- **Log Cloudflare:** Pico de HTTP 401 (Unauthorized) ou 403 (Forbidden) nas rotas de `/api/core/identity`.
- **Database:** A tabela `user_sessions` pode ter sido acidentalmente truncada ou a coluna `revoked` sofreu um UPDATE global indevido.

## 2. Qual o Impacto?
- O ecossistema fica trancado. Novos entrantes não conseguem depositar na Tesouraria e cidadãos não podem votar.

## 3. Como Mitigar?
1. **Verifique os Logs de Auditoria:**
   Execute a query no D1: `SELECT * FROM audit_logs WHERE action = 'SESSION_REVOCATION' ORDER BY id DESC LIMIT 50;`
   Isso mostrará se um Admin revogou as sessões de todos acidentalmente.
2. **Tempo (Expiração):**
   Cheque se o segredo de configuração `JWT_EXPIRE_IN` no Cloudflare Secrets não foi acidentalmente mudado para "1s" (um segundo).
3. **Versão de Token:**
   Verifique se o `tokenVersion` da tabela `users` não foi incrementado por um loop na aplicação.

## 4. Como Restaurar?
- Se o problema for vazamento / revogação acidental:
  Force todos a logar novamente, notificando por e-mail a falha sistêmica (Não há como recuperar uma tabela de sessões apagada intencionalmente, os usuários terão que reinserir as credenciais).
- Se o erro for de código (JWT Secret errado no Worker):
  Edite o Cloudflare Secret via CLI: `npx wrangler secret put JWT_SECRET --env production` e insira a chave original da KMS.

## 5. Como Validar a Recuperação?
- Simule um fluxo completo no Insomnia / Postman: 
  `POST /login` -> Obter Token -> `GET /me` (Espera-se HTTP 200).
