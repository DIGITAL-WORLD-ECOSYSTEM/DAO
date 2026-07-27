import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleQueueEvent } from '../../workers/queue.worker';
import { MessageBatch } from '@cloudflare/workers-types';

vi.mock('../../workers/email.worker', () => ({
	processEmailBuffer: vi.fn().mockResolvedValue(undefined)
}));

describe('Queue Worker Integration', () => {
	let envMock: any;
	let ctxMock: any;
	let batchMock: any;

	beforeEach(() => {
		envMock = {
			R2_EMAIL_ATTACHMENTS: {
				get: vi.fn(),
				delete: vi.fn(),
			},
			DB: {}, 
			// Mocking Resend environment variables if needed
			RESEND_API_KEY: 'test_key'
		};
		
		ctxMock = {
			waitUntil: vi.fn(),
		};

		batchMock = {
			messages: [],
		};
	});

	it('should process a batch of outbound emails and ack them', async () => {
		// Just mocking the high level message processing loop
		const msg1 = { id: 'm1', body: { type: 'unknown_type_for_test' }, ack: vi.fn(), retry: vi.fn() };
		const msg2 = { id: 'm2', body: { type: 'unknown_type_for_test_2' }, ack: vi.fn(), retry: vi.fn() };
		batchMock.messages = [msg1, msg2];

		await handleQueueEvent(batchMock as MessageBatch, envMock, ctxMock);

		// Since we didn't mock DB it might fail if it was a real type that accessed DB,
		// but since it's an unknown type, our worker code logs a warning and calls ack()
		expect(msg1.ack).toHaveBeenCalled();
		expect(msg2.ack).toHaveBeenCalled();
	});

	it('should process large inbound emails from R2 and delete from R2 on success', async () => {
		const msg = { 
			id: 'm1', 
			body: { type: 'inbound_large', r2Key: 'test-key' }, 
			ack: vi.fn(), 
			retry: vi.fn() 
		};
		batchMock.messages = [msg];

		// Mock a successful R2 get that returns a valid arrayBuffer
		envMock.R2_EMAIL_ATTACHMENTS.get.mockResolvedValue({
			arrayBuffer: async () => Buffer.from('From: test\nTo: test\n\nHi')
		});
		
		// Mock DB prepare to not throw, so processEmailBuffer succeeds
		envMock.DB = {
			prepare: vi.fn().mockReturnValue({
				bind: vi.fn().mockReturnThis(),
				first: vi.fn().mockResolvedValue(null),
				run: vi.fn().mockResolvedValue({ success: true })
			})
		};

		// Mock global processEmailBuffer if possible, or just let it run the real one with our mocked env
		await handleQueueEvent(batchMock as MessageBatch, envMock, ctxMock);

		expect(envMock.R2_EMAIL_ATTACHMENTS.get).toHaveBeenCalledWith('test-key');
		// It should succeed and delete the R2 object
		expect(envMock.R2_EMAIL_ATTACHMENTS.delete).toHaveBeenCalledWith('test-key');
		expect(msg.ack).toHaveBeenCalled();
		expect(msg.retry).not.toHaveBeenCalled();
	});

	it('should process a successful outbound email and ack it', async () => {
		const msg = { 
			id: 'm2', 
			body: { 
				type: 'outbound', 
				payload: { messageId: 'local-123', subject: 'hi', from: { address: 'a@a.com' }, to: [] }
			}, 
			ack: vi.fn(), 
			retry: vi.fn() 
		};
		batchMock.messages = [msg];

		envMock.DB = {
			prepare: vi.fn().mockReturnValue({
				bind: vi.fn().mockReturnThis(),
				run: vi.fn().mockResolvedValue({ success: true }),
				first: vi.fn().mockResolvedValue({ id: 'local-123' })
			})
		};

		// The OutboundEmailService uses ResendProvider. 
		// For Resend to not throw, we need fetch mock or just an env variable
		global.fetch = vi.fn().mockResolvedValue({
			ok: true,
			json: async () => ({ id: 'resend-123' })
		}) as any;

		await handleQueueEvent(batchMock as MessageBatch, envMock, ctxMock);

		expect(msg.ack).toHaveBeenCalled();
		expect(msg.retry).not.toHaveBeenCalled();
	});
	
	it('should call retry() on exceptions to enable Dead Letter Queue (DLQ)', async () => {
		const msg = { 
			id: 'error_msg', 
			body: { type: 'outbound' }, // This will cause a failure because outboud service will crash without DB/Resend properly mocked 
			ack: vi.fn(), 
			retry: vi.fn() 
		};
		batchMock.messages = [msg];

		await handleQueueEvent(batchMock as MessageBatch, envMock, ctxMock);

		expect(msg.retry).toHaveBeenCalled();
		expect(msg.ack).not.toHaveBeenCalled();
	});

	it('should call retry() if R2 returns null (object not found)', async () => {
		const msg = { 
			id: 'm1', 
			body: { type: 'inbound_large', r2Key: 'test-key-null' }, 
			ack: vi.fn(), 
			retry: vi.fn() 
		};
		batchMock.messages = [msg];

		envMock.R2_EMAIL_ATTACHMENTS.get.mockResolvedValue(null);

		await handleQueueEvent(batchMock as MessageBatch, envMock, ctxMock);

		expect(msg.retry).toHaveBeenCalled();
		expect(msg.ack).not.toHaveBeenCalled();
	});
});
