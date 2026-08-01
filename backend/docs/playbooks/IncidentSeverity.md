# Classificação de Incidentes e Severidade (SLOs)

Antes de abrir qualquer Playbook específico, classifique o incidente atual conforme a matriz abaixo para engajar o time adequado e definir a prioridade (SLA) de resposta.

## Matriz de Severidade

| Severidade | Definição | Exemplo de Cenário | SLA de Resposta | Ação de Engajamento |
| :--- | :--- | :--- | :--- | :--- |
| **SEV-1 (Crítico)** | Sistema completamente indisponível ou vazamento massivo confirmado. | Database D1 fora do ar / Worker retornando erro 500 global. Vazamento do JWT_SECRET. | **< 15 min** (24/7) | War Room. C-Level alertado. Pause todas as transações. |
| **SEV-2 (Alto)** | Um componente vital de negócio não funciona, mas o sistema base está online. | Usuários não conseguem efetuar login. Falha generalizada no serviço de Tesouraria. | **< 1h** | Engenharia On-Call e Produto alertados. Prioridade máxima da sprint. |
| **SEV-3 (Médio)** | Degradação de performance, lentidão ou funções não críticas offline. | Dashboard de Analytics demorando 15s para carregar. E-mails chegando com atraso de 10 min. | **< 4h** | Ticket P3 no backlog, a ser resolvido em horário comercial. |
| **SEV-4 (Baixo)** | Bugs cosméticos ou falsos positivos em um baixo volume. | Um usuário relatou erro de limite de taxa acidentalmente (Falso Positivo Rate Limit). | **Até 24h** | Tarefa de manutenção normal (Tech Debt). |

## Ciclo de Vida de Resposta (IR)
1. **Identificar:** Qual alerta disparou? (Painel da Cloudflare).
2. **Classificar:** Usar a matriz acima.
3. **Comunicar:** Emitir banner de manutenção no Frontend se SEV-1.
4. **Mitigar:** Rolar back, restaurar ou travar a API o mais rápido possível para estancar sangramento de dados. A *causa raiz* pode ser procurada **após** a mitigação de contenção.
5. **Resolver e Post-mortem:** Após normalizar, documentar o que ocorreu no ASOT-OPERATIONS.
