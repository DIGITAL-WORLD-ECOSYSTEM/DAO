import { Bindings } from '../../types/bindings';
import { AuditService } from '../audit';

export interface AgentResponse {
	success: boolean;
	data?: any;
	error?: string;
	auditId?: string;
	score?: number;
}

export abstract class BaseAgent {
	protected audit: AuditService;

	constructor(
		protected name: string,
		protected role: string,
		protected env: Bindings
	) {
		this.audit = new AuditService(env);
	}

	/**
	 * Loga a ação do agente no sistema de auditoria institucional
	 */
	protected async logAction(action: string, metadata: any) {
		// Mapeamento seguro para o tipo AuditAction
		const actionMap: Record<string, any> = {
			'OBSERVADOR': 'AI_AGENT_OBSERVER',
			'REDATOR': 'AI_AGENT_WRITER',
			'AUDITOR': 'AI_AGENT_AUDITOR',
			'CURADOR VISUAL': 'AI_AGENT_VISUAL'
		};

		const auditAction = actionMap[this.name.toUpperCase()] || 'AI_AGENT_ERROR';

		return await this.audit.log({
			action: auditAction,
			ip: 'internal',
			status: 'success',
			metadata: {
				agent: this.name,
				role: this.role,
				subAction: action,
				...metadata
			}
		});
	}

	/**
	 * Método principal que cada agente deve implementar
	 */
	abstract run(input: any): Promise<AgentResponse>;
}
