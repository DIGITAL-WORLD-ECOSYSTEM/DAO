import { ISessionRepository } from '../../application/ports/output/ISessionRepository';
import { eq } from 'drizzle-orm';
import { userSessions } from '../../db/schema';

export class DrizzleSessionRepository implements ISessionRepository {
  constructor(private db: any) {}

  async createSession(sessionData: {
    id: string;
    userId: number;
    jti: string;
    ip: string;
    userAgent: string;
    refreshTokenHash: string;
    aal: number;
    createdAt: Date;
    expiresAt: Date;
    revoked: boolean;
  }): Promise<void> {
    await this.db.insert(userSessions).values(sessionData);
  }

  async revokeAllUserSessions(userId: number): Promise<void> {
    await this.db.update(userSessions)
      .set({ revoked: true })
      .where(eq(userSessions.userId, userId));
  }

  async getSessionById(sessionId: string): Promise<any | null> {
    const [session] = await this.db
      .select()
      .from(userSessions)
      .where(eq(userSessions.id, sessionId))
      .limit(1);
    return session || null;
  }
}
