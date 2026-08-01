# Playbook de Incidente: Queues e Filas (SEV-3)

## 1. Como Identificar?
- **Sintoma:** Votos computados na governaça, mas mensagens no chat e e-mails de confirmação não chegam aos usuários.
- **Dashboard Cloudflare:** Navegue para `Workers & Pages` > `Queues`. O número de mensagens acumuladas (Backlog) cresce desenfreadamente sem consumidores acompanharem, e a **Dead Letter Queue (DLQ)** começa a encher.

## 2. Qual o Impacto?
- Latência assíncrona. E-mails e integração de Chat (Durable Objects) ficarão atrasados, degradando a experiência do usuário (UX), mas o sistema principal bancário / tesouraria segue online (SEV-3).

## 3. Como Mitigar?
- Acesse os logs das requisições via Tail: `npx wrangler tail --env production`.
- Monitore erros gerados pelos métodos `handleQueueEvent`. É provável que uma API externa de E-mail (ex: Resend) esteja rejeitando as credenciais com HTTP 403.

## 4. Como Restaurar?
- Se for uma API externa fora do ar, aguarde a restauração da parceira. A Cloudflare Queue tentará o retry automático baseado na configuração do `wrangler.toml` (`max_retries = 3`).
- Se os retries acabarem, a mensagem vai para a DLQ.
- Após consertar a API ou o código, crie um script temporal no D1/Queue para re-injetar os pacotes da DLQ de volta na fila primária, garantindo a entrega.

## 5. Como Validar a Recuperação?
- Monitore a métrica "Messages processed per minute" no Painel Cloudflare. O Backlog deve tender a zero.
