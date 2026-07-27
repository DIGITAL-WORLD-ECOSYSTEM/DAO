import { Bindings } from '../../types/bindings';
import { ObserverAgent } from './agents/ObserverAgent';
import { WriterAgent } from './agents/WriterAgent';
import { AuditorAgent } from './agents/AuditorAgent';
import { VisualAgent } from './agents/VisualAgent';
import { drizzle } from 'drizzle-orm/d1';
import { posts } from '../../db/schema';

export class AiOrchestrator {
	constructor(private env: Bindings) {}

	async createAndPublish(theme: string, category: string) {
		console.log(`🚀 Iniciando Orquestração: ${theme} [Seção: ${category}]`);

		// 0. Mapeamento Automático de Avatares (Especialistas)
		const avatarMap: Record<string, number> = {
			'ECONOMIA': 9,      // Helena Moraes
			'TECNOLOGIA': 5,    // Isabella Viana
			'GEOPOLITICA': 8,   // Carolina Alves
			'MEIO AMBIENTE': 3, // Thiago Mendes
			'GOVERNANCA': 2     // Eleonora Bittencourt
		};

		const authorId = avatarMap[category.toUpperCase()] || 11; // Default: Arthur (Admin)

		// 1. Pesquisa
		const observer = new ObserverAgent(this.env);
		const obsResult = await observer.run(theme);
		if (!obsResult.success) throw new Error(`Falha no Observador: ${obsResult.error}`);

		// 2. Escrita
		const writer = new WriterAgent(this.env);
		const writeResult = await writer.run({ theme, facts: obsResult.data.confirmedFacts });
		if (!writeResult.success) throw new Error(`Falha no Redator: ${writeResult.error}`);

		// 3. Auditoria
		const auditor = new AuditorAgent(this.env);
		const auditResult = await auditor.run(writeResult.data.content);
		if (!auditResult.success) throw new Error(`Falha no Auditor: ${auditResult.error}`);

		// 4. Visual
		const visual = new VisualAgent(this.env);
		const visualResult = await visual.run(writeResult.data.content);
		if (!visualResult.success) {
			console.error(`❌ Erro Agente Visual: ${visualResult.error}`);
			throw new Error(`Falha na Geração de Imagem: ${visualResult.error}`);
		}

		// 5. Publicação no Banco de Dados D1 (Usando SQL Puro para máxima compatibilidade)
		const slug = `${theme.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ /g, '-').replace(/[^\w-]+/g, '')}-${Date.now()}`;
		
		try {
			const coverUrl = visualResult.data.imageUrl;
			const coverAlt = visualResult.data.suggestedPrompt || '';
			
			await this.env.DB.prepare(`
				INSERT INTO posts (author_id, title, slug, description, content, category, status, cover_url, cover_alt, tags)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
			`).bind(
				authorId, 
				theme, 
				slug, 
				`Artigo sobre ${theme}`, 
				writeResult.data.content, 
				category, 
				'published',
				coverUrl,
				coverAlt,
				JSON.stringify(['IA', 'ASPPIBRA', category])
			).run();
		} catch (dbError: any) {
			console.error("❌ Erro de Banco de Dados:", dbError.message);
			throw new Error(`Erro ao salvar no D1: ${dbError.message}`);
		}

		return {
			success: true,
			slug: slug,
			author: authorId === 9 ? 'Helena Moraes' : authorId === 5 ? 'Isabella Viana' : 'Especialista ASPPIBRA',
			auditScore: auditResult.score,
			visualPrompt: visualResult.data?.suggestedPrompt
		};
	}
}
