import { emailThreads, emails } from '../db/schema';
import { Database } from '../db';
import { eq, or, desc, inArray } from 'drizzle-orm';

export class ThreadRepository {
  constructor(private db: Database) {}

  async createThread(subject: string, accountId: string = 'system'): Promise<string> {
    const id = crypto.randomUUID();
    await this.db.insert(emailThreads).values({
      id,
      accountId,
      subject,
      lastMessageDate: new Date(),
      createdAt: new Date(),
    });
    return id;
  }

  async updateThreadTimestamp(threadId: string): Promise<void> {
    await this.db
      .update(emailThreads)
      .set({ lastMessageDate: new Date() })
      .where(eq(emailThreads.id, threadId));
  }

  /**
   * Finds a thread by looking up previous emails that share the same messageId
   * found in In-Reply-To or References.
   */
  async findThreadByReferences(messageIds: string[]): Promise<string | null> {
    if (!messageIds || messageIds.length === 0) return null;

    const result = await this.db
      .select({ threadId: emails.threadId })
      .from(emails)
      .where(inArray(emails.messageId, messageIds))
      .orderBy(desc(emails.createdAt))
      .limit(1);

    return result.length > 0 && result[0].threadId ? result[0].threadId : null;
  }
}
