import type { IMail, EmailDTO, IMailSender } from '../types/mail';

/**
 * Utilitário para parsear "Nome <email@dominio.com>" em objetos separados.
 */
function parseEmailString(rawStr: string): IMailSender {
  // Regex simples para capturar Nome e Email
  const match = rawStr.match(/^(.*?)\s*<(.+?)>$/);
  
  if (match) {
    return {
      name: match[1].replace(/['"]/g, '').trim(),
      email: match[2].trim(),
      avatarUrl: null
    };
  }

  // Se não encontrar formato complexo, assume que é só e-mail
  return {
    name: rawStr.split('@')[0],
    email: rawStr.trim(),
    avatarUrl: null
  };
}

export class MailAdapter {
  /**
   * Converte o DTO do Backend (EmailDTO) no objeto Rico (IMail) do Frontend.
   */
  static toIMail(dto: EmailDTO): IMail {
    const from = parseEmailString(dto.sender);
    const to = dto.recipient.split(',').map(parseEmailString);

    return {
      id: dto.id,
      folder: dto.folderId || 'inbox',
      subject: dto.subject,
      message: dto.bodyHtml || dto.bodyText || '',
      isUnread: dto.status === 'unread',
      from,
      to,
      labelIds: [], // será preenchido se o backend suportar labels por message
      isStarred: dto.priority === 'urgent' || dto.priority === 'critical',
      isImportant: dto.priority === 'high',
      createdAt: dto.createdAt,
      attachments: [], // será preenchido se tiver attachments no DTO
    };
  }

  /**
   * Converte os dados do formulário de UI para o formato esperado pelo Backend.
   */
  static toPayload(composeData: { to: string, subject: string, message: string }) {
    return {
      recipient: composeData.to,
      subject: composeData.subject,
      bodyHtml: composeData.message
    };
  }
}
