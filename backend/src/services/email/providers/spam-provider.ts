import { SpamProvider } from './provider';

export class CloudflareSpamProvider implements SpamProvider {
	async validate(headers: Record<string, string>, authMetadata: Record<string, any>): Promise<{ isSafe: boolean; score: number; reasons: string[] }> {
		const reasons: string[] = [];
		let score = 0; // Lower is better (0 = perfect, > 10 = spam)

		// Check SPF
		const spf = authMetadata.spf?.toLowerCase() || '';
		if (spf.includes('pass')) {
			score -= 1;
		} else if (spf.includes('fail') || spf.includes('softfail')) {
			score += 3;
			reasons.push('SPF Validation Failed');
		} else {
			score += 1;
			reasons.push('SPF Missing');
		}

		// Check DKIM
		const dkim = authMetadata.dkim?.toLowerCase() || '';
		if (dkim.includes('pass')) {
			score -= 1;
		} else if (dkim.includes('fail')) {
			score += 3;
			reasons.push('DKIM Validation Failed');
		} else {
			score += 1;
			reasons.push('DKIM Missing');
		}

		// Check DMARC
		const dmarc = authMetadata.dmarc?.toLowerCase() || '';
		if (dmarc.includes('pass')) {
			score -= 2;
		} else if (dmarc.includes('fail')) {
			score += 4;
			reasons.push('DMARC Validation Failed');
		}

		// Simple heuristic
		const isSafe = score <= 3;
		
		return { isSafe, score, reasons };
	}
}
