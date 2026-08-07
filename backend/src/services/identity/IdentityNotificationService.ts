import { Bindings } from '../../types/bindings';

export class IdentityNotificationService {
  constructor(private env: Bindings) {}

  async sendPasswordRecovery(to: string, resetToken: string): Promise<void> {
    const link = `https://app.asppibra.com/reset-password?token=${resetToken}`;
    await this.sendTransactional({
      to,
      subject: 'Recuperação de Senha — ASPPIBRA DAO',
      html: `<p>Clique no link para redefinir sua senha (expira em 1 hora):</p>
             <p><a href="${link}">${link}</a></p>
             <p>Se não solicitou, ignore este e-mail.</p>`,
    });
  }

  async sendVerificationCode(to: string, code: string): Promise<void> {
    await this.sendTransactional({
      to,
      subject: 'Código de Verificação — ASPPIBRA DAO',
      html: `<p>Seu código de verificação é: <strong>${code}</strong></p>
             <p>Expira em 15 minutos. Não compartilhe com ninguém.</p>`,
    });
  }

  private async sendTransactional(payload: { to: string; subject: string; html: string }) {
    if (!this.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY not configured. Transactional email blocked.', payload);
      return; // Blocked by external dependency (Phase A)
    }
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `ASPPIBRA DAO <${this.env.SENDER_EMAIL || 'suporte@asppibra.com'}>`,
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
      }),
    });
    if (!res.ok) {
      throw new Error(`Falha ao enviar e-mail transacional: ${res.status}`);
    }
  }
}
