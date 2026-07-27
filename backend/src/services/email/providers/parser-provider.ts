import { ParserProvider } from './provider';
import { NormalizeEmailDTO, NormalizeAttachmentDTO, EmailAddress } from '../../../dto/normalize-email';
import { simpleParser, ParsedMail, HeaderValue } from 'mailparser';

export class MailParserProvider implements ParserProvider {
	async parse(raw: Buffer | string): Promise<NormalizeEmailDTO> {
		const parsed: ParsedMail = await simpleParser(raw);

		const mapAddress = (addr: any): EmailAddress[] => {
			if (!addr) return [];
			if (Array.isArray(addr)) {
				return addr.map(a => ({ address: a.address || '', name: a.name || undefined }));
			}
			if (addr.value && Array.isArray(addr.value)) {
				return addr.value.map((v: any) => ({ address: v.address || '', name: v.name || undefined }));
			}
			return [{ address: addr.address || '', name: addr.name || undefined }];
		};

		const fromAddress = mapAddress(parsed.from)[0] || { address: 'unknown@unknown.com' };
		const toAddresses = mapAddress(parsed.to);
		const ccAddresses = mapAddress(parsed.cc);
		const bccAddresses = mapAddress(parsed.bcc);
		const replyToAddress = mapAddress(parsed.replyTo)[0];

		// Extração segura de headers
		const headersRecord: Record<string, string> = {};
		if (parsed.headers) {
			for (const [key, value] of parsed.headers) {
				if (typeof value === 'string') {
					headersRecord[key] = value;
				} else if (typeof value === 'object' && value !== null) {
					// Caso seja um objeto (ex: arrays de strings)
					headersRecord[key] = JSON.stringify(value);
				}
			}
		}

		// References (RFC 5322)
		let references: string[] = [];
		const refsHeader = parsed.headers.get('references');
		if (refsHeader) {
			if (typeof refsHeader === 'string') {
				references = refsHeader.split(/\s+/).filter(Boolean);
			} else if (Array.isArray(refsHeader)) {
				references = refsHeader.filter(r => typeof r === 'string') as string[];
			}
		}

		const attachments: NormalizeAttachmentDTO[] = (parsed.attachments || []).map(att => ({
			filename: att.filename || 'unknown_attachment',
			mimeType: att.contentType || 'application/octet-stream',
			sizeBytes: att.size || (att.content ? att.content.length : 0),
			content: att.content,
			contentDisposition: att.contentDisposition,
			inline: att.contentDisposition === 'inline',
			cid: att.cid,
			virusStatus: 'pending' // Default initial state
		}));

		return {
			messageId: parsed.messageId || `no-id-${Date.now()}`,
			inReplyTo: parsed.inReplyTo,
			references,
			from: fromAddress,
			to: toAddresses,
			cc: ccAddresses,
			bcc: bccAddresses,
			replyTo: replyToAddress,
			subject: parsed.subject || '(Sem assunto)',
			text: parsed.text || '',
			html: parsed.html || parsed.textAsHtml || '',
			headers: headersRecord,
			attachments,
			receivedAt: parsed.date || new Date(),
			provider: 'cloudflare', // Can be overwritten by the Inbound Pipeline
		};
	}
}
