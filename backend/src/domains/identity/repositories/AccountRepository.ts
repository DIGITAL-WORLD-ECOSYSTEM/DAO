import { eq } from 'drizzle-orm';
import { users, citizens } from '../../../db/schema';

export interface IAccountRepository {
  findByEmail(email: string): Promise<any | null>;
}

export class AccountRepository implements IAccountRepository {
  constructor(private db: any) {}

  async findByEmail(email: string): Promise<any | null> {
    const [user] = await this.db
      .select({
        id: users.id,
        email: users.email,
        password: users.password,
        role: users.role,
        firstName: citizens.firstName,
        lastName: citizens.lastName,
        username: citizens.username,
      })
      .from(users)
      .leftJoin(citizens, eq(users.id, citizens.userId))
      .where(eq(users.email, email))
      .limit(1);

    return user || null;
  }
}
