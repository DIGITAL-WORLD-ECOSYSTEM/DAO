# Playbook de Incidente: Cloudflare Worker Indisponível (SEV-1)

## 1. Como Identificar?
- **Sintoma:** Qualquer requisição à API retorna HTTP 5xx genérico da tela padrão da Cloudflare ou `Error 1101` (Worker threw exception).
- **Alerta Cloudflare:** Disparo de CPU Limit Exceeded ou Exceeded Memory (128MB límite da Cloudflare).

## 2. Qual o Impacto?
- **Downtime global da API.** O Frontend Web ficará desconectado (Skeleton Loaders infinitos).

## 3. Como Mitigar?
- **É um problema global da Cloudflare?** Acesse [Cloudflare Status](https://www.cloudflarestatus.com/). Se a borda (Edge) estiver com problemas, o incidente é de terceiros e não há muito a fazer além de colocar o domínio no modo estático via DNS.
- **É um problema do código (OOM - Out of Memory)?**
  O Worker estourou os limites do V8 Isolate. Verifique o último deploy recente no Github Actions.

## 4. Como Restaurar?
1. Execute o **Rollback Imediato** para a versão anterior:
   `npx wrangler rollback --env production`
2. Purgar o Cache:
   Limpe o Cloudflare Zone Cache para que respostas 500 não fiquem presas.

## 5. Como Validar a Recuperação?
- Acesse a rota pública: `https://api.asppibra.com/api/core/health/live`.
- Deve retornar Status 200 instantaneamente (Tempo de resposta < 50ms).
