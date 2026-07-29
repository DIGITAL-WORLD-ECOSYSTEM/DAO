import { OutboundEmailProvider } from './provider';
import { NormalizeEmailDTO } from '../../../dto/normalize-email';

export class ResendProvider implements OutboundEmailProvider {
  private apiKey: string;
  private defaultSender: string;

  constructor(env: { RESEND_API_KEY: string; SENDER_EMAIL: string }) {
    this.apiKey = env.RESEND_API_KEY;
    this.defaultSender = env.SENDER_EMAIL || 'suporte@asppibra.com';
  }

  async send(
    email: NormalizeEmailDTO
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      // Convert NormalizeEmailDTO to Resend API Payload
      // We handle attachments as well (resend expects content as base64 string or buffer, we'll provide base64)
      const resendPayload = {
        from: email.from.name ? `${email.from.name} <${email.from.address}>` : email.from.address,
        to: email.to.map((t) => t.address),
        cc: email.cc?.map((c) => c.address),
        bcc: email.bcc?.map((b) => b.address),
        reply_to: email.replyTo?.address,
        subject: email.subject,
        html: email.html,
        text: email.text,
        headers: email.headers,
        attachments: email.attachments?.map((att) => ({
          filename: att.filename,
          content: Buffer.isBuffer(att.content)
            ? att.content.toString('base64')
            : att.content instanceof Uint8Array
              ? Buffer.from(att.content).toString('base64')
              : att.content,
        })),
      };

      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resendPayload),
      });

      const data = (await response.json()) as any;

      if (!response.ok) {
        return {
          success: false,
          error: `Erro Resend (${response.status}): ${JSON.stringify(data)}`,
        };
      }

      return { success: true, messageId: data.id };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}
