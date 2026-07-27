import { ThreadRepository } from '../../../repositories/thread.repository';
import { NormalizeEmailDTO } from '../../../dto/normalize-email';
import crypto from 'node:crypto'; // Supported in Cloudflare Workers nodejs_compat

export class ThreadService {
	constructor(private threadRepo: ThreadRepository) {}

	async resolveThread(dto: NormalizeEmailDTO): Promise<string> {
		// Calculate a robust thread hash based on normalized subject and references
		const subjectCore = dto.subject.replace(/^(re|fwd|fw|enc):\s*/i, '').trim();
		const threadHash = this.calculateThreadHash(subjectCore);

		// Try to find by RFC 5322 In-Reply-To or References
		const lookupIds = [];
		if (dto.inReplyTo) lookupIds.push(dto.inReplyTo);
		if (dto.references && dto.references.length > 0) {
			lookupIds.push(...dto.references);
		}

		let threadId = await this.threadRepo.findThreadByReferences(lookupIds);

		if (threadId) {
			await this.threadRepo.updateThreadTimestamp(threadId);
		} else {
			// Create a new thread
			threadId = await this.threadRepo.createThread(subjectCore);
		}

		return threadId;
	}

	private calculateThreadHash(subjectCore: string): string {
		return crypto.createHash('sha256').update(subjectCore.toLowerCase()).digest('hex');
	}
}
