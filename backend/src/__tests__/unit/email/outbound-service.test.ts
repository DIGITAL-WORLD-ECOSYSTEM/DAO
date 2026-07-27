import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OutboundEmailService } from '../../../services/email/services/outbound-service';

describe('OutboundEmailService', () => {
	let emailRepoMock: any;
	let resendProviderMock: any;
	let eventServiceMock: any;
	let service: OutboundEmailService;

	beforeEach(() => {
		emailRepoMock = {
			create: vi.fn().mockResolvedValue('email-123'),
			updateStatusAndMessageId: vi.fn(),
		};
		resendProviderMock = {
			send: vi.fn().mockResolvedValue({ success: true, messageId: 'resend-123' }),
		};
		eventServiceMock = { emit: vi.fn().mockResolvedValue(true) };

		service = new OutboundEmailService(emailRepoMock, resendProviderMock, eventServiceMock);
	});

	it('should save email as processing and then send via provider', async () => {
		const dto = {
			messageId: 'local-123',
			subject: 'Outbound',
			from: { address: 'from@test.com' },
			to: [{ address: 'to@test.com' }],
			html: '<p>Hi</p>',
			text: 'Hi',
		} as any;

		const result = await service.sendEmail(dto);

		expect(result).toBe('email-123');
		
		// Should create in DB first
		expect(emailRepoMock.create).toHaveBeenCalledWith(dto);

		// Should call provider
		expect(resendProviderMock.send).toHaveBeenCalled();

		// Should update DB with final success
		expect(emailRepoMock.updateStatusAndMessageId).toHaveBeenCalledWith(
			'email-123',
			'sent',
			'resend-123'
		);
	});

	it('should update status to failed if provider fails', async () => {
		resendProviderMock.send.mockResolvedValue({ success: false, error: 'Bounced' });
		
		await expect(service.sendEmail({} as any)).rejects.toThrow('Failed to send email: Bounced');

		// The repo update happens before the throw
		expect(emailRepoMock.updateStatusAndMessageId).toHaveBeenCalledWith(
			'email-123',
			'failed',
			'Error: Bounced'
		);
	});

	it('should throw and not update status if provider throws exception', async () => {
		resendProviderMock.send.mockRejectedValue(new Error('Network Fail'));

		await expect(service.sendEmail({} as any)).rejects.toThrow('Network Fail');
		
		// The error bubbles up so Queue worker can catch it and Retry
		expect(emailRepoMock.updateStatusAndMessageId).not.toHaveBeenCalled();
	});
});
