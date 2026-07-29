import { StorageProvider } from '../providers/provider';
import { NormalizeAttachmentDTO } from '../../../dto/normalize-email';
import crypto from 'node:crypto'; // Requires nodejs_compat

export class AttachmentService {
  constructor(private storageProvider: StorageProvider) {}

  async processAttachments(
    attachments: NormalizeAttachmentDTO[]
  ): Promise<NormalizeAttachmentDTO[]> {
    if (!attachments || attachments.length === 0) return [];

    const processed: NormalizeAttachmentDTO[] = [];

    for (const att of attachments) {
      const buffer = Buffer.isBuffer(att.content)
        ? att.content
        : att.content instanceof Uint8Array
          ? Buffer.from(att.content)
          : Buffer.from(att.content, 'base64');

      // 1. Calculate SHA256
      const sha256 = crypto.createHash('sha256').update(buffer).digest('hex');
      att.sha256 = sha256;

      // 2. Upload to Storage
      const uploadResult = await this.storageProvider.upload(att.filename, buffer, att.mimeType);
      att.r2Key = uploadResult.key;
      att.publicUrl = uploadResult.publicUrl;

      // 3. Mark virus scan status as pending (future integration)
      att.virusStatus = 'pending';

      // Empty the memory buffer since we already uploaded it and don't want to carry it around in RAM
      att.content = Buffer.from('');

      processed.push(att);
    }

    return processed;
  }
}
