import { Hono } from 'hono';
import { Bindings, Variables } from '../../types/bindings';
import { AiOrchestrator } from '../../services/ai/orchestrator';

import { VisualAgent } from '../../services/ai/agents/VisualAgent';

const publish = new Hono<{ Bindings: Bindings; Variables: Variables }>();

publish.post('/generate-and-save', async (c) => {
	const { theme, category } = await c.req.json();
	
	try {
		const orchestrator = new AiOrchestrator(c.env);
		const result = await orchestrator.createAndPublish(
			theme || 'O Impacto da Blockchain no Agro',
			category || 'Tecnologia'
		);

		return c.json(result);
	} catch (error: any) {
		return c.json({ success: false, error: error.message }, 500);
	}
});

// 🚀 PUBLICAÇÃO EM LOTE (Para Escala)
publish.post('/batch', async (c) => {
	const { categories } = await c.req.json(); // Array de categorias: ["Economia", "Tecnologia"]
	
	if (!Array.isArray(categories)) {
		return c.json({ success: false, message: "Categories must be an array" }, 400);
	}

	const results = [];
	const orchestrator = new AiOrchestrator(c.env);

	for (const category of categories) {
		try {
			const result = await orchestrator.createAndPublish(
				`Nova tendencia em ${category} para 2026`,
				category
			);
			results.push({ category, success: true, slug: result.slug });
		} catch (error: any) {
			results.push({ category, success: false, error: error.message });
		}
	}

	return c.json({ success: true, results });
});

export default publish;
