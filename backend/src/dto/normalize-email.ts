export interface EmailAddress {
  address: string;
  name?: string;
}

export interface NormalizeAttachmentDTO {
  filename: string;
  mimeType: string;
  sizeBytes: number;
  content: Buffer | Uint8Array | string; // O buffer em memória (antes do upload)
  contentDisposition?: string;
  inline: boolean;
  cid?: string;
  sha256?: string; // Calculado no Attachment Service antes do R2
  r2Key?: string; // Preenchido após upload
  publicUrl?: string; // Preenchido após upload
  virusStatus?: 'pending' | 'clean' | 'infected';
}

export interface NormalizeEmailDTO {
  // Identificação e Threading (RFC 5322)
  messageId: string;
  threadId?: string; // Preenchido pelo Thread Resolver
  references: string[];
  inReplyTo?: string;

  // Rotas
  from: EmailAddress;
  to: EmailAddress[];
  cc: EmailAddress[];
  bcc: EmailAddress[];
  replyTo?: EmailAddress;

  // Conteúdo
  subject: string;
  text: string;
  html: string;

  // Cabeçalhos (Raw)
  headers: Record<string, string>;

  // Anexos
  attachments: NormalizeAttachmentDTO[];

  // Metadados de Timestamp e Rastreabilidade
  receivedAt: Date;
  provider: string; // ex: 'cloudflare', 'resend'

  // Metadados de Segurança/Spam
  authMetadata?: {
    spf?: string;
    dkim?: string;
    dmarc?: string;
    arcSeal?: string;
    arcAuthResults?: string;
    arcMessageSignature?: string;
    authenticationResults?: string;
    [key: string]: any;
  };
}
