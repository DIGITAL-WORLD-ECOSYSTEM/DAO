export class AttachmentRepository {
  constructor(private db: any) {}
  async save(attachment: any): Promise<void> {}
  async createMany(emailId: string, attachments: any[]): Promise<void> {}
}
