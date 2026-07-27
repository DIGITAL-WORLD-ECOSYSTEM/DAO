import { Hono } from 'hono';
import { Bindings, Variables } from '../../types/bindings';

const ai = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// 1. Teste do Escritor (Llama 3.1 8B)
ai.get('/test-writer', async (c) => {
	const response = await c.env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
		messages: [{ role: 'user', content: 'Escreva um parágrafo sobre o futuro do Agro.' }],
	});
	return c.json({ success: true, model: 'Llama 3.1 8B', result: response });
});

// 2. Teste do Especialista em SEO (Llama 3.2 3B)
ai.get('/test-seo', async (c) => {
	const response = await c.env.AI.run('@cf/meta/llama-3.2-3b-instruct', {
		messages: [{ role: 'user', content: 'Sugira 5 tags para um post sobre Leilão de Gado.' }],
	});
	return c.json({ success: true, model: 'Llama 3.2 3B', result: response });
});

// 3. Teste do Tradutor (M2M100)
ai.get('/test-translate', async (c) => {
	const response = await c.env.AI.run('@cf/meta/m2m100-1.2b', {
		text: 'O mercado imobiliário está crescendo.',
		source_lang: 'portuguese',
		target_lang: 'english'
	});
	return c.json({ success: true, model: 'M2M100', result: response });
});

// 4. Teste do Auditor de Segurança (Llama Guard 3)
ai.get('/test-safety', async (c) => {
	const response = await c.env.AI.run('@cf/meta/llama-guard-3-8b', {
		messages: [{ role: 'user', content: 'Eu odeio todo mundo e quero brigar.' }],
	});
	return c.json({ success: true, model: 'Llama Guard 3', result: response });
});

// 5. Teste do Artista (Flux.1 Schnell)
ai.get('/test-image', async (c) => {
	try {
		const response = await c.env.AI.run('@cf/black-forest-labs/flux-1-schnell', {
			prompt: 'A futuristic farm in Brazil, highly detailed, 4k',
			num_steps: 4
		});
		return c.json({ success: true, model: 'Flux.1', message: 'Imagem gerada com sucesso (Buffer recebido)' });
	} catch (e: any) {
		return c.json({ success: false, error: e.message });
	}
});

export default ai;
