import { BaseAgent, AgentResponse } from '../base';
import { webSearch } from '../skills/search';

export class ObserverAgent extends BaseAgent {
	constructor(env: any) {
		super('Observador', 'Intelligence & Monitoring', env);
	}

	async run(theme: string): Promise<AgentResponse> {
		try {
			// 1. Logar o início da atividade
			await this.logAction('START_MONITORING', { theme });

			// 2. Executar a Skill de Busca
			const searchResults = await webSearch(theme, this.env);

			// 3. Usar a IA para analisar e sintetizar os resultados
			const analysis = await this.env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
				messages: [
					{
						role: 'system',
						content: `Você é o Agente Observador da ASPPIBRA. Sua função é extrair FATOS REAIS das buscas e eliminar opiniões ou fake news. Retorne uma lista de pontos confirmados.`
					},
					{
						role: 'user',
						content: `Analise estes resultados de busca sobre "${theme}" e resuma o que é fato confirmado: ${JSON.stringify(searchResults)}`
					}
				]
			});

			// 4. Logar a conclusão
			await this.logAction('FINISHED_MONITORING', { factCount: searchResults.length });

			return {
				success: true,
				data: {
					originalTheme: theme,
					confirmedFacts: analysis.response,
					sources: searchResults.map(r => r.url)
				}
			};
		} catch (error: any) {
			await this.logAction('ERROR_MONITORING', { error: error.message });
			return { success: false, error: error.message };
		}
	}
}
