export class EmailRepository {
  constructor(private db: any) {}
  async save(email: any): Promise<void> {}
  async findById(id: string): Promise<any> { return null; }
  async updateStatus(id: string, status: string): Promise<void> {}
  async getAccountIdByEmail(email: string): Promise<string | null> { return null; }
  async createOutboundEmail(data: any): Promise<string> { return crypto.randomUUID(); }
  async create(data: any, accountId?: string): Promise<string> { return crypto.randomUUID(); }
  async list(accountId?: string, limit = 50, cursor?: string): Promise<any[]> { return []; }
  async existsByMessageId(messageId: string): Promise<boolean> { return false; }
  async updateStatusAndMessageId(emailId: string, status: string, messageIdOrError: string): Promise<void> {}
}
