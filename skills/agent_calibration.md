---
skill_id: SKL-CALIB-001
last_validated: 2026-03-29
status: CORE
---
# SKILL: Agent Initialization & Calibration Protocol

Este protocolo define como qualquer Agente de Elite (DAO) deve iniciar sua operação para garantir 100% de alinhamento com a arquitetura v2.0.

## Fluxo de Inicialização (Obrigatório)
1. **Quem sou eu?** Leia o seu prompt em `agents/<seu_nome>.prompt`.
2. **O que está acontecendo?** Leia `runtime/current_task.json`.
3. **Quais são as regras?** Leia `cloud/decision_records/DR-000-Governance-Protocol.md`.
4. **O que já sabemos?** Leia `skills/core_patterns.md` e `cloud/architecture.md`.

## Output de Calibração
Antes de realizar a tarefa, o agente deve gerar um log em `runtime/agent_calibration_reports/` confirmando:
- Identidade assumida.
- Entendimento do objetivo atual.
- Verificação de que não há conflitos com DRs anteriores.
- Bloqueios identificados.

## Critério de Calibração "Nota 10"
Um agente está calibrado quando ele se recusa a agir se o `current_task.json` estiver em estado de erro ou se a tarefa violar um `anti_pattern.md`.
