import { describe, it, expect } from 'vitest';
import { MailParserProvider } from '../../../services/email/providers/parser-provider';

describe('ParserProvider (mailparser)', () => {
	const parserProvider = new MailParserProvider();

	it('should parse a simple plain text MIME', async () => {
		const rawMime = `From: "Test User" <test@example.com>
To: target@example.com
Subject: Simple Test
Message-ID: <12345@example.com>
Date: Wed, 10 Nov 2026 10:00:00 +0000

Hello World!`;

		const dto = await parserProvider.parse(Buffer.from(rawMime));

		expect(dto.subject).toBe('Simple Test');
		expect(dto.from.address).toBe('test@example.com');
		expect(dto.from.name).toBe('Test User');
		expect(dto.to[0].address).toBe('target@example.com');
		expect(dto.messageId).toBe('<12345@example.com>');
		expect(dto.text.trim()).toBe('Hello World!');
		expect(dto.html.trim()).toBe('<p>Hello World!</p>');
		expect(dto.attachments).toHaveLength(0);
	});

	it('should extract References and In-Reply-To for ThreadResolver', async () => {
		const rawMime = `From: test@test.com
To: target@test.com
Subject: Re: Test
Message-ID: <reply@test.com>
In-Reply-To: <parent@test.com>
References: <grandparent@test.com> <parent@test.com>

Reply body`;

		const dto = await parserProvider.parse(Buffer.from(rawMime));

		expect(dto.inReplyTo).toBe('<parent@test.com>');
		expect(dto.references).toEqual(['<grandparent@test.com>', '<parent@test.com>']);
	});

	it('should handle HTML and Alternative content', async () => {
		const rawMime = `From: test@test.com
To: target@test.com
Subject: HTML Test
Content-Type: multipart/alternative; boundary="boundary-string"

--boundary-string
Content-Type: text/plain; charset="utf-8"

Plain Text
--boundary-string
Content-Type: text/html; charset="utf-8"

<h1>HTML Text</h1>
--boundary-string--`;

		const dto = await parserProvider.parse(Buffer.from(rawMime));

		expect(dto.text.trim()).toBe('Plain Text');
		expect(dto.html.trim()).toBe('<h1>HTML Text</h1>');
	});

	it('should handle multipart/mixed with attachments and CID', async () => {
		const rawMime = `From: test@test.com
To: target@test.com
Subject: Mixed Test
Content-Type: multipart/mixed; boundary="mixed-boundary"

--mixed-boundary
Content-Type: multipart/alternative; boundary="alt-boundary"

--alt-boundary
Content-Type: text/plain; charset="utf-8"

Plain Body
--alt-boundary
Content-Type: text/html; charset="utf-8"

<h1>HTML Body</h1><img src="cid:image123" />
--alt-boundary--
--mixed-boundary
Content-Type: image/png; name="test.png"
Content-Transfer-Encoding: base64
Content-Disposition: attachment; filename="test.png"
Content-ID: <image123>

iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==
--mixed-boundary--`;

		const dto = await parserProvider.parse(Buffer.from(rawMime));

		expect(dto.text.trim()).toBe('Plain Body');
		// mailparser automatically resolves CID to data URI!
		expect(dto.html).toContain('data:image/png;base64');
		expect(dto.attachments).toHaveLength(1);
		
		const att = dto.attachments[0];
		expect(att.filename).toBe('test.png');
		expect(att.mimeType).toBe('image/png');
		expect(att.cid).toBe('image123');
		// mailparser sets size properly after decoding base64
		expect(att.sizeBytes).toBeGreaterThan(0);
	});

	it('should handle UTF-8 and Quoted-Printable encoding', async () => {
		const rawMime = `From: test@test.com
To: target@test.com
Subject: =?utf-8?Q?Ol=C3=A1_Mundo?=
Content-Type: text/plain; charset="utf-8"
Content-Transfer-Encoding: quoted-printable

Ol=C3=A1 Mundo! =
Este =C3=A9 um teste com =
acentos.`;

		const dto = await parserProvider.parse(Buffer.from(rawMime));

		expect(dto.subject).toBe('Olá Mundo');
		// The exact decoding might strip newlines or spaces depending on quoted-printable rules,
		// but 'Olá Mundo! Este é um teste com acentos.' should be present.
		expect(dto.text).toContain('Olá Mundo! Este é um teste com acentos.');
	});
});
