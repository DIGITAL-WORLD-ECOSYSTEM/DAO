import { BaseAgent, AgentResponse } from '../base';

export class VisualAgent extends BaseAgent {
	constructor(env: any) {
		super('Curador Visual', 'Multimedia Designer', env);
	}

	async run(postSummary: string): Promise<AgentResponse> {
		try {
			await this.logAction('START_VISUAL_GEN', { summary: postSummary.substring(0, 50) });

			// 1. Gerar o prompt otimizado para o Flux.1
			const promptGen = await this.env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
				messages: [
					{
						role: 'system',
						content: 'You are a world-class Art Director for a premium agribusiness and technology magazine. Create a highly detailed English prompt for a cinematic, photorealistic cover image. Style: Professional photography, wide-angle, natural lighting, 8k resolution, sharp focus, no text on image. Avoid cartoons or low-quality 3D renders.'
					},
					{
						role: 'user',
						content: `Create a prompt for this content summary: "${postSummary.substring(0, 500)}"`
					}
				]
			});

			const imagePrompt = promptGen.response;

			// 2. Gerar a imagem REAL com Flux-1 Schnell
			const imageResponse = await this.env.AI.run('@cf/black-forest-labs/flux-1-schnell', {
				prompt: imagePrompt,
				num_steps: 4
			});

			// O Flux retorna um objeto { image: string (base64) } ou o binário direto
			let imageBuffer = (imageResponse as any).image || imageResponse;
			let binaryImage: ArrayBuffer;

			if (typeof imageBuffer === 'string') {
				// Se for string Base64, converter para ArrayBuffer
				const binaryString = atob(imageBuffer);
				const bytes = new Uint8Array(binaryString.length);
				for (let i = 0; i < binaryString.length; i++) {
					bytes[i] = binaryString.charCodeAt(i);
				}
				binaryImage = bytes.buffer;
			} else {
				binaryImage = await new Response(imageBuffer as any).arrayBuffer();
			}

			// 3. Salvar no R2
			const timestamp = Date.now();
			const fileName = `img-${timestamp}.png`;
			const prefix = 'blog';
			const fullKey = `${prefix}/${fileName}`;
			
			await this.env.STORAGE.put(fullKey, binaryImage, {
				httpMetadata: { contentType: 'image/png' }
			});

			// URL pública baseada na sua rota existente: /api/platform/storage/public/:prefix/:key
			const imageUrl = `https://api.asppibra.com/api/platform/storage/public/${prefix}/${fileName}`;

			await this.logAction('FINISHED_VISUAL_GEN', { imagePrompt, fullKey });

			return {
				success: true,
				data: {
					imageUrl: imageUrl,
					suggestedPrompt: imagePrompt
				}
			};
		} catch (error: any) {
			await this.logAction('ERROR_VISUAL', { error: error.message });
			return { success: false, error: error.message };
		}
	}
}
