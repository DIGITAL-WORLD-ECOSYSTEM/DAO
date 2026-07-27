import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AttachmentService } from '../../../services/email/services/attachment-service';
import { StorageProvider } from '../../../services/email/providers/provider';
import { NormalizeAttachmentDTO } from '../../../dto/normalize-email';

describe('AttachmentService', () => {
	let storageProviderMock: any;
	let attachmentService: AttachmentService;

	beforeEach(() => {
		storageProviderMock = {
			upload: vi.fn(),
			delete: vi.fn(),
		};
		attachmentService = new AttachmentService(storageProviderMock as unknown as StorageProvider);
	});

	it('should calculate SHA256, upload, and clean memory buffer', async () => {
		const attachments: NormalizeAttachmentDTO[] = [
			{
				filename: 'test.txt',
				mimeType: 'text/plain',
				sizeBytes: 11,
				content: Buffer.from('hello world'),
				inline: false,
			}
		];

		storageProviderMock.upload.mockResolvedValue({
			key: 'inbound_temp/test_key',
			publicUrl: 'https://cdn.test/test_key'
		});

		const processed = await attachmentService.processAttachments(attachments);

		expect(processed).toHaveLength(1);
		
		const att = processed[0];
		expect(att.sha256).toBeDefined();
		expect(att.sha256).toBe('b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9'); // sha256('hello world')
		expect(att.r2Key).toBe('inbound_temp/test_key');
		expect(att.publicUrl).toBe('https://cdn.test/test_key');
		expect(att.virusStatus).toBe('pending');
		
		// Ensure the buffer was cleared to save memory
		expect(Buffer.isBuffer(att.content)).toBe(true);
		expect((att.content as Buffer).length).toBe(0);

		expect(storageProviderMock.upload).toHaveBeenCalledWith('test.txt', expect.any(Buffer), 'text/plain');
	});

	it('should gracefully handle empty attachments array', async () => {
		const processed = await attachmentService.processAttachments([]);
		expect(processed).toHaveLength(0);
		expect(storageProviderMock.upload).not.toHaveBeenCalled();
	});
	
	it('should handle upload failures by bubbling error up (simulating rollback dependency)', async () => {
		const attachments: NormalizeAttachmentDTO[] = [
			{ filename: 'fail.txt', mimeType: 'text/plain', sizeBytes: 10, content: Buffer.from('123'), inline: false }
		];

		storageProviderMock.upload.mockRejectedValue(new Error('S3 offline'));

		await expect(attachmentService.processAttachments(attachments)).rejects.toThrow('S3 offline');
		// Worker or Queue consumer would catch this, rejecting the message and placing it back to the queue (Retry/Rollback)
	});

	it('should process a mock "giant" attachment (in Node JS buffer limits)', async () => {
		const attachments: NormalizeAttachmentDTO[] = [
			{ filename: 'giant.bin', mimeType: 'application/octet-stream', sizeBytes: 512 * 1024, content: Buffer.alloc(512 * 1024, 'a'), inline: false }
		];

		storageProviderMock.upload.mockResolvedValue({ key: 'giant_key', publicUrl: 'url' });

		const processed = await attachmentService.processAttachments(attachments);
		
		expect(processed).toHaveLength(1);
		expect(processed[0].r2Key).toBe('giant_key');
		// size should be exactly 512KB
		expect(processed[0].sizeBytes).toBe(524288);
		// Should clear 512KB from memory
		expect((processed[0].content as Buffer).length).toBe(0);
	});
});
