import { emailEvents } from '../db/schema';
import { Database } from '../db';
import { eq } from 'drizzle-orm';
import { EmailEventDTO } from '../dto/email-event';

export class EventRepository {
	constructor(private db: Database) {}

	async append(event: EmailEventDTO): Promise<string> {
		const id = crypto.randomUUID();
		await this.db.insert(emailEvents).values({
			id,
			...event
		});
		return id;
	}

	async appendMany(events: EmailEventDTO[]): Promise<void> {
		if (events.length === 0) return;
		const values = events.map(e => ({
			id: crypto.randomUUID(),
			...e
		}));
		await this.db.insert(emailEvents).values(values);
	}

	async findByMessageId(messageId: string) {
		return await this.db.select().from(emailEvents).where(eq(emailEvents.messageId, messageId));
	}

	async findByEmailId(emailId: string) {
		return await this.db.select().from(emailEvents).where(eq(emailEvents.emailId, emailId));
	}
}
