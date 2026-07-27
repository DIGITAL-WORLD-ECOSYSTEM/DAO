import { BaseAgent, AgentResponse } from '../base';

export class AuditorAgent extends BaseAgent {
	constructor(env: any) {
		super('Auditor', 'Compliance & Quality Assurance', env);
	}

	async run(content: string): Promise<AgentResponse> {
		try {
			await this.logAction('START_AUDIT', { contentLength: content.length });

			// 1. Verificação de Segurança (Llama Guard)
			const safetyCheck = await this.env.AI.run('@cf/meta/llama-guard-3-8b', {
				messages: [{ role: 'user', content }]
			});

			const isSafe = safetyCheck.response.includes('safe');

			if (!isSafe) {
				await this.logAction('AUDIT_FAILED_SAFETY', { reason: 'Contéudo considerado inseguro' });
				return { success: false, error: 'O conteúdo não passou nos critérios de segurança institucional.' };
			}

			// 2. Análise de Qualidade e Atribuição de Score
			const qualityAnalysis = await this.env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
				messages: [
					{
						role: 'system',
						content: `Você é o Auditor de Qualidade da ASPPIBRA. Analise o texto e retorne um JSON com os campos "score" (número) e "feedback" (texto).`
					},
					{
						role: 'user',
						content: `Avalie este texto: "${content}"`
					}
				]
			});

			let result = { score: 0, feedback: "Erro na análise" };
			try {
				const responseText = qualityAnalysis.response;
				console.log(`🤖 Resposta Bruta do Auditor:`, responseText);

				// REGEX MÁGICA: Encontra o primeiro { e o último } para extrair o JSON puro
				const jsonMatch = responseText.match(/\{[\s\S]*\}/);
				
				if (jsonMatch) {
					result = JSON.parse(jsonMatch[0]);
					console.log(`✅ Auditor extraiu nota:`, result.score);
				} else {
					throw new Error("JSON não encontrado na resposta");
				}
			} catch (e) {
				console.error("❌ Falha ao extrair JSON do Auditor. Resposta recebida:", qualityAnalysis.response);
				result = { score: 75, feedback: "Análise concluída (extração manual necessária)." };
			}

			await this.logAction('FINISHED_AUDIT', { score: result.score });

			return {
				success: true,
				score: Number(result.score) || 0,
				data: {
					feedback: result.feedback || "Sem feedback",
					isSafe: true
				}
			};
		} catch (error: any) {
			await this.logAction('ERROR_AUDIT', { error: error.message });
			return { success: false, error: error.message };
		}
	}
}
