# DR-000: Protocolo de Governança dos Agentes (v1.0)
**Status:** Vital / Mandatário
**Data:** 2026-03-29

## Contexto
Para garantir a nota máxima de engenharia e evitar degradação da arquitetura por intervenções automáticas incoerentes, estabelecemos este protocolo de soberania.

## Regras de Ouro
1. **Soberania do Arquiteto:** Nenhuma alteração de contrato (`api_contracts.md`) ou domínio (`domain.md`) pode ser feita sem um Decision Record (DR) assinado.
2. **Prioridade do QA:** O código só é considerado "Real" se houver um teste correspondente em `tests/`. Se o teste falhar, o status da tarefa em `runtime/current_task.json` é revertido para `FAILED`.
3. **Bloqueio do Auditor:** O script `ops/pre-commit-audit.sh` é o gatekeeper final. Commits que falham na auditoria (secrets, anti-patterns) são proibidos.
4. **Handovers Obrigatórios:** A transição entre agentes deve ser registrada via `runtime/current_task.json`. Nunca dois agentes operam no mesmo arquivo simultaneamente fora de um Merge resolvido pelo Integrador.

## Fluxo de Mudança
1. **Architect** propõe -> 2. **QA** gera testes -> 3. **Developer** implementa -> 4. **Runner** valida -> 5. **Auditor** aprova -> 6. **Integrator** assina o release.

## Impacto
- Estabilidade total do ecossistema.
- Nota 10 em auditoria técnica.
- Preparação para escala de múltiplos desenvolvedores humanos e IAs.
