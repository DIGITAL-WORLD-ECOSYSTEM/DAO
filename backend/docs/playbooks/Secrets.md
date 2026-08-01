# Playbook de Incidente: Vazamento de Secrets (SEV-1)

## 1. Como Identificar?
- **Sintoma:** Movimentações anômalas na Tesouraria efetuadas por "Admins" que não estavam online, ou Alerta do GitHub Advanced Security notificando um commit que vazou uma Cloudflare API Key.

## 2. Qual o Impacto?
- O Sistema inteiro perdeu a integridade (Comprometimento Crítico). Se o atacante possui os tokens administrativos, os fundos de tesouraria ou os DIDs dos Cidadãos podem ser roubados (Supply Chain Attack).

## 3. Como Mitigar?
**Gatilho de Defesa Inicial (WAR ROOM):**
1. Derrube todo e qualquer acesso administrativo imediatamente via banco D1:
   `UPDATE users SET status = 'suspended' WHERE role = 'admin';`
2. Derrube as integrações externas rotacionando imediatamente as chaves originais diretamente nos provedores (Cloudflare API Tokens, Stripe, etc).

## 4. Como Restaurar?
- Gere chaves completamente virgens (Tokens novos).
- Utilize o Wrangler Secret Put para substituir as antigas na infraestrutura Produtiva:
  `npx wrangler secret put CLOUDFLARE_API_TOKEN --env production`
  `npx wrangler secret put JWT_SECRET --env production`
  *(Nota: Rotacionar o JWT_SECRET desconectará forçadamente todos os usuários ativos da plataforma).*
- Remova o commit ofensivo do histórico do Git usando `git filter-branch` ou ferramentas avançadas de expurgo (BFG Repo-Cleaner).

## 5. Como Validar a Recuperação?
- Inicie a Auditoria Forense. Recupere as logs do *AuditService* no D1 para identificar se alguma ação destrutiva de negócio foi feita entre a hora do vazamento e a hora da contenção. Se sim, aplique o Rollback do D1 (veja `D1.md`).
