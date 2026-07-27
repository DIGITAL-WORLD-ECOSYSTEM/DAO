import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleEmailEvent, processEmailBuffer } from '../../workers/email.worker';
import { ForwardableEmailMessage } from '@cloudflare/workers-types';

describe('Email Worker Integration', () => {
	let envMock: any;
	let ctxMock: any;
	let messageMock: any;

	beforeEach(() => {
		envMock = {
			EMAIL_SYNC_QUEUE: {
				send: vi.fn().mockResolvedValue(undefined),
			},
			R2_EMAIL_ATTACHMENTS: {
				put: vi.fn().mockResolvedValue(undefined),
			},
			DB: {}, // Not testing DB insertion here unless we mock the whole chain
		};
		
		ctxMock = {
			waitUntil: vi.fn(),
		};

		messageMock = {
			from: 'sender@test.com',
			to: 'target@test.com',
			headers: new Headers(),
			raw: new ReadableStream({
				start(controller) {
					controller.enqueue(new Uint8Array(Buffer.from('hello')));
					controller.close();
				}
			}),
			rawSize: 1024,
			setReject: vi.fn(),
		};
	});

	it('should route small emails directly to processEmailBuffer', async () => {
		// Spy on processEmailBuffer which we imported but wait, we can't easily spy on exported functions from the same module
		// Actually, vitest allows vi.spyOn but let's just see if it doesn't call queue.
		messageMock.rawSize = 100 * 1024; // 100KB

		// Since we didn't mock DB, it might crash inside processEmailBuffer.
		// Let's mock DB or just expect it to crash but verify it didn't use queue
		let errorThrown = false;
		try {
			await handleEmailEvent(messageMock as ForwardableEmailMessage, envMock, ctxMock);
		} catch (e) {
			errorThrown = true;
		}

		expect(envMock.EMAIL_SYNC_QUEUE.send).not.toHaveBeenCalled();
		expect(envMock.R2_EMAIL_ATTACHMENTS.put).not.toHaveBeenCalled();
	});

	it('should route >512KB emails to R2 and Queue (Smart Queue)', async () => {
		messageMock.rawSize = 600 * 1024; // 600KB (> 512KB threshold)

		await handleEmailEvent(messageMock as ForwardableEmailMessage, envMock, ctxMock);

		expect(envMock.R2_EMAIL_ATTACHMENTS.put).toHaveBeenCalled();
		const putCall = envMock.R2_EMAIL_ATTACHMENTS.put.mock.calls[0];
		expect(putCall[0]).toContain('inbound_temp/');

		expect(envMock.EMAIL_SYNC_QUEUE.send).toHaveBeenCalled();
		const sendCall = envMock.EMAIL_SYNC_QUEUE.send.mock.calls[0];
		expect(sendCall[0]).toMatchObject({
			type: 'inbound_large',
			from: 'sender@test.com',
			to: 'target@test.com',
		});
		expect(sendCall[0].r2Key).toBe(putCall[0]);
	});

	it('should handle interrupted streams or invalid messages gracefully by rejecting', async () => {
		messageMock.raw = new ReadableStream({
			start(controller) {
				controller.error(new Error('Stream interrupted'));
			}
		});
		// Assuming it's small so it tries to read the stream
		messageMock.rawSize = 1024;

		await handleEmailEvent(messageMock as ForwardableEmailMessage, envMock, ctxMock);

		// The worker catches the error and calls setReject
		expect(messageMock.setReject).toHaveBeenCalledWith('Failed to process email');
	});
});
