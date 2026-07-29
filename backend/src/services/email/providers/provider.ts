import { NormalizeEmailDTO } from '../../../dto/normalize-email';

export interface InboundEmailProvider {
  /**
   * Receives the raw provider-specific event and extracts the necessary
   * streams or raw data to be passed to the parser.
   */
  receive(event: any): Promise<Buffer | ReadableStream | string>;
}

export interface OutboundEmailProvider {
  /**
   * Sends an email using the underlying provider.
   */
  send(email: NormalizeEmailDTO): Promise<{ success: boolean; messageId?: string; error?: string }>;
}

export interface StorageProvider {
  /**
   * Uploads an attachment to the storage provider (e.g. R2)
   * Returns the storage key and the public URL (if applicable)
   */
  upload(
    filename: string,
    content: Buffer | Uint8Array,
    mimeType: string
  ): Promise<{ key: string; publicUrl?: string }>;

  /**
   * Deletes an attachment from the storage provider
   */
  delete(key: string): Promise<boolean>;
}

export interface SpamProvider {
  /**
   * Validates the email's spam score and authentication headers (SPF, DKIM, DMARC)
   * Returns true if the email is considered safe.
   */
  validate(
    headers: Record<string, string>,
    authMetadata: Record<string, any>
  ): Promise<{ isSafe: boolean; score: number; reasons: string[] }>;
}

export interface ParserProvider {
  /**
   * Parses a raw email message into a NormalizeEmailDTO.
   */
  parse(raw: Buffer | ReadableStream | string): Promise<NormalizeEmailDTO>;
}
