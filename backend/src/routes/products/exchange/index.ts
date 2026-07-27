import { Hono } from 'hono';
import { Bindings } from '../../../types/bindings';
import { authSignature } from '../../../middleware/auth_signature';

type AppType = {
	Bindings: Bindings;
};

const app = new Hono<AppType>();

// --- ROTA PÚBLICA: Obter preços de par (ex: BTCUSDT) ---
app.get('/binance/price/:symbol', async (c) => {
	const symbol = c.req.param('symbol');
	try {
		const res = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol.toUpperCase()}`);
		if (!res.ok) {
			return c.json({ success: false, message: 'Falha ao conectar na Binance', error: await res.text() }, 502);
		}
		const data = await res.json();
		return c.json({ success: true, data });
	} catch (error: any) {
		return c.json({ success: false, message: error.message }, 500);
	}
});

// ==========================================
// ZERO-TRUST PROTECTED ROUTES
// ==========================================
app.use('/*', authSignature);

// --- ROTA PRIVADA: Consultar saldos da corretora usando API Keys ---
app.get('/binance/balance', async (c) => {
	const apiKey = c.env.BINANCE_API_KEY;
	const apiSecret = c.env.BINANCE_API_SECRET;

	if (!apiKey || !apiSecret) {
		return c.json({ success: false, message: 'Credenciais Binance não configuradas.' }, 500);
	}

	try {
		const timestamp = Date.now().toString();
		const queryString = `timestamp=${timestamp}`;

		// Assinatura usando Web Crypto (Padrão Cloudflare) usando HMAC-SHA256
		const encoder = new TextEncoder();
		const key = await crypto.subtle.importKey('raw', encoder.encode(apiSecret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
		const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(queryString));
		const signatureArray = Array.from(new Uint8Array(signatureBuffer));
		const signature = signatureArray.map((b) => b.toString(16).padStart(2, '0')).join('');

		const res = await fetch(`https://api.binance.com/api/v3/account?${queryString}&signature=${signature}`, {
			headers: {
				'X-MBX-APIKEY': apiKey,
			},
		});

		if (!res.ok) {
			return c.json({ success: false, message: 'Binance API Error', error: await res.text() }, res.status as any);
		}

		const data: any = await res.json();

		// Retorna apenas valores em conta maiores que 0 para limpeza do payload enviado ao Front
		const nonZeroBalances = data.balances?.filter((b: any) => parseFloat(b.free) > 0 || parseFloat(b.locked) > 0) || [];

		return c.json({ success: true, accountType: data.accountType, balances: nonZeroBalances });
	} catch (error: any) {
		return c.json({ success: false, message: error.message }, 500);
	}
});

export default app;
