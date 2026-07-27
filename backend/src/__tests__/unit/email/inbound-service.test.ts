import { describe, it, expect, vi, beforeEach } from 'vitest';
import { InboundEmailService } from '../../../services/email/services/inbound-service';

describe('InboundEmailService', () => {
	let emailRepoMock: any;
	let attachmentRepoMock: any;
	let threadServiceMock: any;
	let attachmentServiceMock: any;
	let parserProviderMock: any;
	let spamProviderMock: any;
	let eventServiceMock: any;
	let service: InboundEmailService;

	beforeEach(() => {
		emailRepoMock = {
			create: vi.fn().mockResolvedValue('email-123'),
			existsByMessageId: vi.fn().mockResolvedValue(false),
		};
		attachmentRepoMock = { createMany: vi.fn() };
		threadServiceMock = { resolveThread: vi.fn().mockResolvedValue('thread-123') };
		attachmentServiceMock = { processAttachments: vi.fn().mockResolvedValue([]) };
		parserProviderMock = { 
			parse: vi.fn().mockResolvedValue({
				messageId: 'test-123',
				subject: 'Test',
				from: { address: 'test@test.com' },
				to: [],
				attachments: [],
				headers: {},
				authMetadata: {}
			})
		};
		spamProviderMock = { validate: vi.fn().mockResolvedValue({ isSafe: true, score: 0, reasons: [] }) };
		eventServiceMock = { emit: vi.fn().mockResolvedValue(true) };

		service = new InboundEmailService(
			emailRepoMock,
			attachmentRepoMock,
			threadServiceMock,
			attachmentServiceMock,
			parserProviderMock,
			spamProviderMock,
			eventServiceMock
		);
	});

	it('should fully process an incoming raw email with metadata', async () => {
		const result = await service.processRawEmail(Buffer.from('raw'), { source: 'cf' });
		
		expect(result).toBe('email-123');
		expect(parserProviderMock.parse).toHaveBeenCalled();
		expect(spamProviderMock.validate).toHaveBeenCalled();
		expect(threadServiceMock.resolveThread).toHaveBeenCalled();
		expect(attachmentServiceMock.processAttachments).toHaveBeenCalled();
		expect(emailRepoMock.create).toHaveBeenCalled();
		expect(attachmentRepoMock.createMany).toHaveBeenCalled();
	});

	it('should return early if messageId is duplicated (Idempotency)', async () => {
		emailRepoMock.existsByMessageId.mockResolvedValue(true);
		
		const result = await service.processRawEmail('raw string'); // string instead of buffer
		
		// If duplicate, it returns the messageId directly
		expect(result).toBe('test-123');
		expect(emailRepoMock.create).not.toHaveBeenCalled();
	});

	it('should bubble up exceptions from parser', async () => {
		parserProviderMock.parse.mockRejectedValue(new Error('Parse fail'));
		
		await expect(service.processRawEmail('raw')).rejects.toThrow('Parse fail');
	});
});
