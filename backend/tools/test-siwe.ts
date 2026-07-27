import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';

(async () => {
	console.log('🦊 Inciando Simulação Local de SIWE (Sign-In with Ethereum)...');

	// 1. Cria uma carteira descartável (Burner Wallet)
	const pk = generatePrivateKey();
	const account = privateKeyToAccount(pk);
	console.log(`\n✅ Carteira gerada: ${account.address}`);

	const baseUrl = 'https://gov-system-backend.asppibra.workers.dev/api/core/identity';

	try {
		// 2. Solicita o Nonce seguro
		console.log('\n📡 Solicitando Nonce ao servidor Cloudflare...');
		const resNonce = await fetch(`${baseUrl}/web3/nonce?address=${account.address}`);
		const dataNonce = await resNonce.json();

		if (!dataNonce.success) throw new Error('Falha ao obter Nonce.');

		const nonce = dataNonce.nonce;
		const messageToSign = dataNonce.message;
		console.log(`✅ Nonce recebido: ${nonce}`);

		// 3. Assina a mensagem (O que a Metamask faz por trás dos panos)
		console.log('\n✍️ Assinando mensagem criptograficamente EIP-4361...');
		const signature = await account.signMessage({ message: messageToSign });
		console.log(`✅ Assinatura: ${signature.slice(0, 15)}...`);

		// 4. Autentica e Gera Shadow User no D1
		console.log('\n🔐 Enviando payload final para POST /web3/verify...');
		const resVerify = await fetch(`${baseUrl}/web3/verify`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				address: account.address,
				message: messageToSign,
				signature,
			}),
		});

		const finalData = await resVerify.json();

		if (finalData.success) {
			console.log('\n🎉 SUCESSO! Acesso Concedido.');
			console.log('JWT Emitido:', finalData.accessToken.slice(0, 40) + '...');
			console.log('Perfil Gerado no Cloudflare D1:', finalData.user);
		} else {
			console.error('\n❌ FALHA na autenticação:', finalData);
		}
	} catch (error) {
		console.error('\n❌ ERRO FATAL no processo:', error);
	}
})();
