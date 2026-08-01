# Playbook de Incidente: Deploy com Falha / Rollback (SEV-2)

## 1. Como Identificar?
- **Sintoma:** Logo após um "Merge to Main", a Pipeline do Github Actions acusa "Smoke Test Failed" (A Liveness probe do worker falhou) ou usuários reportam quebra em funcionalidades que estavam perfeitas ontem.
- **Logs:** Ações comuns estão causando *Internal Server Error* na esteira principal do código devido a regressions.

## 2. Qual o Impacto?
- Se o erro atinge rotas cruciais, as operações principais ficam corrompidas. O impacto varia de Médio a Alto (SEV-2).

## 3. Como Mitigar?
O mantra de SRE é: **"Rollback primeiro, pergunte depois"**.
Não tente corrigir o código (hotfix) e empurrar uma nova versão enquanto os usuários sangram. Reverta instantaneamente.

## 4. Como Restaurar?
**Via Cloudflare Dashboard (Mais Rápido):**
1. Acesse o Painel Cloudflare -> `Workers & Pages` -> `asppibra-api`.
2. Guia **Deployments**.
3. Na lista de Deployments anteriores, clique no ícone "Voltar/Rollback" ao lado da versão funcional do dia anterior.
4. A Cloudflare Edge Network propagará o código antigo globalmente em 3-5 segundos.

**Via Wrangler (Terminal Seguro):**
```bash
npx wrangler rollback --env production
```

## 5. Como Validar a Recuperação?
1. Acesse manualmente as rotas outrora quebradas usando um ambiente não-autenticado ou usuário de teste, garantindo que o HTTP 200 retornou.
2. O time de Engenharia deve baixar os logs do Worker (Tail) quebrado na máquina local e testar contra a Sandbox para achar a Regression.
