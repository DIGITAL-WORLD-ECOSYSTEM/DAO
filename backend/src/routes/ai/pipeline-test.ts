import { Hono } from 'hono';
import { Bindings, Variables } from '../../types/bindings';
import { ObserverAgent } from '../../services/ai/agents/ObserverAgent';
import { WriterAgent } from '../../services/ai/agents/WriterAgent';
import { AuditorAgent } from '../../services/ai/agents/AuditorAgent';
import { VisualAgent } from '../../services/ai/agents/VisualAgent';

const pipeline = new Hono<{ Bindings: Bindings; Variables: Variables }>();

pipeline.get('/run', async (c) => {
	const theme = c.req.query('theme') || 'O futuro do mercado imobiliário RWA no Brasil';
	
	try {
		// 1. O Observador pesquisa os fatos
		const observer = new ObserverAgent(c.env);
		const searchResult = await observer.run(theme);
		
		if (!searchResult.success) throw new Error(searchResult.error);

		// 2. O Redator escreve com base nos fatos
		const writer = new WriterAgent(c.env);
		const writeResult = await writer.run({ 
			theme, 
			facts: searchResult.data.confirmedFacts 
		});

		if (!writeResult.success) throw new Error(writeResult.error);

		// 3. O Auditor revisa o trabalho final
		const auditor = new AuditorAgent(c.env);
		const auditResult = await auditor.run(writeResult.data.content);
		console.log('📊 Resultado da Auditoria no Pipeline:', JSON.stringify(auditResult));

		// 4. O Curador Visual cria o conceito da imagem
		const visual = new VisualAgent(c.env);
		const visualResult = await visual.run(writeResult.data.content);

		return c.json({
			success: true,
			workflow: {
				theme,
				facts: searchResult.data.confirmedFacts,
				content: writeResult.data.content,
				image: {
					prompt: visualResult.data.suggestedPrompt,
					style: visualResult.data.style
				},
				audit: {
					score: auditResult.score,
					feedback: auditResult.data?.feedback
				}
			}
		});

	} catch (error: any) {
		return c.json({ success: false, error: error.message }, 500);
	}
});

export default pipeline;
