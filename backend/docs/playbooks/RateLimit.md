# Playbook de Incidente: Rate Limiting & Força Bruta (SEV-3 / SEV-4)

## 1. Como Identificar?
- **Sintoma:** Relatos no suporte de que os usuários recebem frequentemente a mensagem "Too Many Requests" (HTTP 429) no meio de operações normais.
- **Log Cloudflare:** Disparo anormal de HTTP 429 nas métricas gerais de Edge, possivelmente vindo de um IP único ou subnet.

## 2. Qual o Impacto?
- Se for ataque real (DDoS Layer 7 ou Força Bruta de Senhas): **Mínimo**. O Rate Limit está cumprindo seu dever e poupando CPU e D1.
- Se for Falso Positivo (Limites muito estritos para eventos lícitos, como um cliente corporativo atrás de um NAT): **Degrada a Experiência do Usuário (SEV-4).**

## 3. Como Mitigar?
1. Analise no painel da Cloudflare (WAF/Security) as regras de Rate Limit em vigor. Identifique se a origem dos IPs bloqueados é limpa ou maliciosa.
2. No caso de Falsos Positivos críticos (exemplo: evento da plataforma onde 500 pessoas votam na mesma rede wifi): Se o Rate Limit que está bloqueando é o Cloudflare WAF, adicione a Subnet/IP aos WAF Bypasses ("Allow").

## 4. Como Restaurar?
- Se o bloqueio for de aplicação (`middleware/rate_limit.ts`), a mitigação permanente é aumentar as janelas (`windowMs`) ou o número de requisições no código. Efetue as mudanças no repositório, rode testes de regressão e faça deploy em produção.
- Limpe o cache no KV de Rate Limit local executando uma expiração forçada da chave se necessário (via painel Cloudflare KV).

## 5. Como Validar a Recuperação?
- Monitore a métrica de respostas HTTP 429 no painel da Cloudflare ou logs nativos (Tail). Deve voltar para patamares base (próximo a 0%).
