export class ChatRepository {
  constructor(private d1: any) {}
  async getUserConversations(userId: number): Promise<any[]> { return []; }
  async isUserInConversation(conversationId: string, userId: number): Promise<boolean> { return true; }
  async createConversation(conversationId: string, userId: number, data: any): Promise<any> { return { id: conversationId }; }
  async getMessagesByConversation(conversationId: string, limit = 50, offset = 0): Promise<any[]> { return []; }
  async saveMessage(messageId: string, conversationId: string, userId: number, data: any): Promise<any> { return { id: messageId }; }
}
