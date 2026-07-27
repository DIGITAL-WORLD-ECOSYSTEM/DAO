import { InboundEmailProvider } from './provider';
import type { ForwardableEmailMessage } from '@cloudflare/workers-types';

export class CloudflareEmailProvider implements InboundEmailProvider {
	
	async receive(event: ForwardableEmailMessage): Promise<Buffer> {
		// Cloudflare provides the raw email as a ReadableStream
		const rawStream = event.raw;
		
		// Read the stream into a Uint8Array
		const reader = rawStream.getReader();
		const chunks: Uint8Array[] = [];
		let totalLength = 0;
		
		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			if (value) {
				chunks.push(value);
				totalLength += value.length;
			}
		}
		
		// Convert chunks to a single Buffer
		const buffer = Buffer.concat(chunks, totalLength);
		return buffer;
	}

	/**
	 * Extract SPF, DKIM, DMARC metadata from Cloudflare's ForwardableEmailMessage headers.
	 * Cloudflare injects these headers automatically upon receiving the email.
	 */
	extractAuthMetadata(headers: any): Record<string, any> {
		return {
			spf: headers.get('Received-SPF') || undefined,
			dkim: headers.get('DKIM-Signature') || undefined,
			dmarc: headers.get('DMARC-Filter') || undefined, // Note: Cloudflare might use standard Authentication-Results
			authenticationResults: headers.get('Authentication-Results') || undefined,
			arcSeal: headers.get('ARC-Seal') || undefined,
			arcAuthResults: headers.get('ARC-Authentication-Results') || undefined,
			arcMessageSignature: headers.get('ARC-Message-Signature') || undefined,
		};
	}
}
