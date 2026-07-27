import type { EmailDTO } from '../types/mail';

import { it, expect, describe } from 'vitest';

import { MailAdapter } from './mail-adapter';

describe('MailAdapter', () => {
	it('deve converter corretamente um EmailDTO para o formato UI (IMail)', () => {
		const rawDto: EmailDTO = {
			id: '123',
			accountId: 'acc1',
			folderId: 'inbox',
			direction: 'inbound',
			sender: 'Sandro <sandro@asppibra.com.br>',
			recipient: 'Contato <contato@dao.com>',
			subject: 'Teste de DTO',
			bodyHtml: '<p>Teste</p>',
			priority: 'normal',
			status: 'sent',
			createdAt: new Date('2026-07-25T10:00:00Z').toISOString(),
		};

		const result = MailAdapter.toIMail(rawDto);

		expect(result.id).toBe('123');
		expect(result.subject).toBe('Teste de DTO');
		expect(result.isUnread).toBe(false);
		expect(result.folder).toBe('inbox');
		
		// Parsing de remetente
		expect(result.from.name).toBe('Sandro');
		expect(result.from.email).toBe('sandro@asppibra.com.br');
		
		// Parsing de destinatário
		expect(result.to[0].name).toBe('Contato');
		expect(result.to[0].email).toBe('contato@dao.com');
	});

	it('deve extrair nome do e-mail de fallback caso não exista nome no string de envio', () => {
		const rawDto: EmailDTO = {
			id: '124',
			accountId: 'acc1',
			direction: 'inbound',
			sender: 'no-reply@domain.com', // Sem o formato "Nome <email>"
			recipient: 'test@domain.com',
			priority: 'normal',
			subject: 'Fallback',
			status: 'sent',
			createdAt: new Date().toISOString(),
		};

		const result = MailAdapter.toIMail(rawDto);
		
		expect(result.from.name).toBe('no-reply@domain.com'); // Cai pro raw string
		expect(result.from.email).toBe('no-reply@domain.com');
	});
});
