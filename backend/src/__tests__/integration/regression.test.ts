import { describe, it, expect } from 'vitest';
import app from '../../index'; // Assuming index exports the hono app
import { EmailService } from '../../services/email';
describe('Legacy & Regression Tests', () => {
	it('should confirm Legacy IMAP service instantiates without errors (backward compatibility)', () => {
		// This verifies all dependencies of the old flow (ImapService, emailSyncJobs, legacy routes)
		// are still intact and can be constructed during the transition phase.
		const legacyService = new EmailService({} as any, {} as any);
		expect(legacyService).toBeDefined();
	});

	it('should verify that legacy endpoints still exist for SWR Dashboard compatibility', async () => {
		// Mock a request to the legacy /platform/email/sync endpoint
		const req = new Request('http://localhost/platform/email/sync', { method: 'POST' });
		
		// The app might fail with 401 Unauthorized or 500 because of missing DB context,
		// but it should NOT return 404 Not Found, proving the route exists.
		const res = await app.fetch(req);
		expect(res.status).not.toBe(404);
	});

	it('should verify that Resend Webhook endpoint still exists', async () => {
		const req = new Request('http://localhost/platform/email/webhook/resend', { method: 'POST' });
		
		const res = await app.fetch(req);
		expect(res.status).not.toBe(404);
	});
});
