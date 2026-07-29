import { emails, emailAccounts } from '../db/schema';
import { Database } from '../db';
import { eq, or, isNull, desc, and } from 'drizzle-orm';
import { NormalizeEmailDTO } from '../dto/normalize-email';

export class EmailRepository {
  constructor(private db: Database) {}

  async create(dto: NormalizeEmailDTO, accountId?: string): Promise<string> {
    const id = crypto.randomUUID();
    await this.db.insert(emails).values({
      id,
      messageId: dto.messageId,
      accountId,
      threadId: dto.threadId,
      direction: 'inbound',
      sender: dto.from.address, // For simplification in this mock, we only save the address in the string column
      recipient: dto.to.map((t) => t.address).join(', '),
      cc: dto.cc?.map((c) => c.address).join(', ') || null,
      bcc: dto.bcc?.map((b) => b.address).join(', ') || null,
      subject: dto.subject,
      bodyHtml: dto.html,
      bodyText: dto.text,
      status: 'unread',
      inReplyTo: dto.inReplyTo,
      references: dto.references,
      provider: dto.provider,
      receivedAt: dto.receivedAt,
      processedAt: new Date(),
      authMetadata: dto.authMetadata,
      createdAt: new Date(),
    });
    return id;
  }

  async existsByMessageId(messageId: string): Promise<boolean> {
    const result = await this.db
      .select({ id: emails.id })
      .from(emails)
      .where(eq(emails.messageId, messageId))
      .limit(1);
    return result.length > 0;
  }

  async getAccountIdByEmail(emailAddress: string): Promise<string | null> {
    const result = await this.db
      .select({ id: emailAccounts.id })
      .from(emailAccounts)
      .where(eq(emailAccounts.email, emailAddress))
      .limit(1);
    return result.length > 0 ? result[0].id : null;
  }

  async updateStatusAndMessageId(id: string, status: string, messageId: string) {
    await this.db
      .update(emails)
      .set({ status, messageId, processedAt: new Date() } as any)
      .where(eq(emails.id, id));
  }

  // === LEGACY METHODS (For Phase 1 & 2 backward compatibility) ===
  async createOutboundEmail(data: {
    accountId?: string;
    sender: string;
    recipient: string;
    subject: string;
    bodyHtml: string;
    status: 'queued' | 'sent' | 'failed';
    idempotencyKey?: string;
  }) {
    const id = crypto.randomUUID();
    await this.db.insert(emails).values({
      id,
      accountId: data.accountId,
      direction: 'outbound',
      sender: data.sender,
      recipient: data.recipient,
      subject: data.subject,
      bodyHtml: data.bodyHtml,
      status: data.status,
      createdAt: new Date(),
    });
    return id;
  }

  async createInboundEmail(data: {
    messageId: string;
    accountId: string;
    sender: string;
    recipient: string;
    subject: string;
    bodyHtml: string;
    bodyText: string;
    createdAt: Date;
  }) {
    const id = crypto.randomUUID();
    await this.db.insert(emails).values({
      id,
      messageId: data.messageId,
      accountId: data.accountId,
      direction: 'inbound',
      sender: data.sender,
      recipient: data.recipient,
      subject: data.subject,
      bodyHtml: data.bodyHtml,
      bodyText: data.bodyText,
      status: 'unread',
      createdAt: data.createdAt,
    });
    return id;
  }

  async list(accountId?: string, limit: number = 50, cursor?: string) {
    let conditions = [];
    if (accountId) {
      conditions.push(eq(emails.accountId, accountId));
    }
    // TODO: Add cursor logic if needed

    let query = this.db.select().from(emails);
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    const results = await query.orderBy(desc(emails.createdAt)).limit(limit);
    return results;
  }
}
