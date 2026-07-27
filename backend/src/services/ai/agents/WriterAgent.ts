import { BaseAgent, AgentResponse } from '../base';
import { formatBlogPost } from '../skills/formatter';

export class WriterAgent extends BaseAgent {
	constructor(env: any) {
		super('Redator', 'Creative Content Creator', env);
	}

	async run(input: { theme: string; facts: string }): Promise<AgentResponse> {
		try {
			await this.logAction('START_WRITING', { theme: input.theme });

			const response = await this.env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
				messages: [
					{
						role: 'system',
						content: `Você é o Redator-Chefe da ASPPIBRA. 
						Seu tom de voz é profissional, institucional e informativo.
						Use HTML semântico (tags <p>, <strong>, <h3>). 
						Nunca invente fatos fora dos fornecidos.`
					},
					{
						role: 'user',
						content: `Com base nestes fatos: "${input.facts}", escreva um post completo sobre "${input.theme}".`
					}
				]
			});

			const formattedContent = formatBlogPost(response.response);

			await this.logAction('FINISHED_WRITING', { contentLength: formattedContent.length });

			return {
				success: true,
				data: {
					content: formattedContent,
					model: 'Llama 3.1 8B'
				}
			};
		} catch (error: any) {
			await this.logAction('ERROR_WRITING', { error: error.message });
			return { success: false, error: error.message };
		}
	}
}
