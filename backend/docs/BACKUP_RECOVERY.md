# Plano de Disaster Recovery & Rollback (D1 e Cloudflare Workers)

Este documento estabelece as diretrizes e procedimentos para lidar com perdas de dados, reversão de migrações falhas e restauração de sistema em ambiente de produção da ASPPIBRA.

## 1. Backups Automáticos do D1 (Time Travel)
O Cloudflare D1 possui "Time Travel" ativado por padrão. Ele mantém um histórico do banco de dados (Point-in-Time Recovery) por até 30 dias.

**Como verificar o status de Time Travel de Produção:**
```bash
npx wrangler d1 time-travel info gov-db --env production
```

## 2. Procedimento de Restauração de Emergência (Rollback de Dados)
Se uma migração destrutiva foi executada, ou se um administrador excluiu dados críticos acidentalmente:

**Passo 1: Encontrar o timestamp antes do incidente**
Defina o exato segundo em UTC para o qual deseja voltar.

**Passo 2: Restaurar o banco**
```bash
npx wrangler d1 time-travel restore gov-db --timestamp="2026-07-31T15:00:00Z" --env production
```

> [!WARNING]
> Restaurar o banco de dados via Time Travel fará com que todas as transações (Treasury Ledger, Cadastros, Mensagens de Chat) que ocorreram *após* o timestamp escolhido sejam **PERDIDAS**. Este comando só deve ser usado em caso de colapso estrutural, não para reverter transações individuais.

## 3. Backups Frios (Exportação Complementar Recomendada)
Para isolar a responsabilidade (evitar que o Cloudflare seja o único detentor dos dados), deve-se executar um backup lógico semanal ou diário e armazená-lo em um Cloud Storage externo (AWS S3 ou GCP).

**Exportar backup lógico SQL:**
```bash
npx wrangler d1 export gov-db --output=./backup_$(date +%Y-%m-%d).sql --env production
```
*(Opcionalmente, pode ser configurado um cron job na máquina runner do Github Actions ou via Worker para executar isso).*

## 4. Rollback de Deploy (Worker)
Se o novo código do backend no Github Actions quebrou a produção (Smoke Test falhou, ou bugs severos em produção):

**Procedimento Rápido (Cloudflare Dashboard):**
1. Acesse o Dashboard da Cloudflare.
2. Navegue até Workers & Pages -> `asppibra-api`.
3. Vá em "Deployments".
4. Encontre o último Deploy Estável e clique em **Rollback**.

**Via Wrangler CLI:**
```bash
npx wrangler rollback --env production
```
