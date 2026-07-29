import { emailAttachments } from '../db/schema';
import { Database } from '../db';
import { NormalizeAttachmentDTO } from '../dto/normalize-email';

export class AttachmentRepository {
  constructor(private db: Database) {}

  async createMany(emailId: string, attachments: NormalizeAttachmentDTO[]): Promise<void> {
    if (!attachments || attachments.length === 0) return;

    const values = attachments.map((att) => ({
      id: crypto.randomUUID(),
      emailId,
      name: att.filename,
      mimeType: att.mimeType,
      sizeBytes: att.sizeBytes,
      r2Key: att.r2Key!,
      publicUrl: att.publicUrl || null,
      contentDisposition: att.contentDisposition || null,
      inline: att.inline,
      cid: att.cid || null,
      sha256: att.sha256 || null,
      virusStatus: att.virusStatus || 'pending',
      createdAt: new Date(),
    }));

    await this.db.insert(emailAttachments).values(values);
  }
}
