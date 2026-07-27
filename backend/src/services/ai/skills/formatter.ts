/**
 * Skill de Formatação: Garante que o conteúdo gerado pela IA siga os padrões visuais da ASPPIBRA.
 */
export function formatBlogPost(rawContent: string): string {
	// Remove possíveis tags de script ou estilos injetados acidentalmente
	let formatted = rawContent.replace(/<script.*?>.*?<\/script>/gi, '');
	
	// Garante que o texto use parágrafos adequados
	if (!formatted.startsWith('<p>')) {
		formatted = `<p>${formatted}</p>`;
	}

	return formatted;
}
