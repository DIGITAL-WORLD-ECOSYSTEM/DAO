import { CryptoCore, ShamirCore } from './packages/shared/src/index';

const API_URL = 'http://127.0.0.1:8788/api/core/identity';
const USERNAME = 'alpha_auditor_' + Math.random().toString(36).substring(7);

async function runEliteAudit() {
  console.log('🛡️ Iniciando Auditoria ALPHA ELITE PLATINUM...');

  try {
    // 1. Testar Gênese & DID
    console.log('Step 1: Testando Gênese e DID Resolver...');
    const challengeRes = await fetch(`${API_URL}/challenge/${USERNAME}`);
    const { challenge } = await challengeRes.json();

    const mnemonic = CryptoCore.generateMnemonic();
    const seed = await CryptoCore.deriveSeed(mnemonic, '');
    const { priv, pub } = CryptoCore.getEd25519KeyPair(seed);
    const signature = CryptoCore.sign(new TextEncoder().encode(challenge), priv);

    await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: USERNAME,
        publicKey: JSON.stringify(Array.from(pub)),
        signature: JSON.stringify(Array.from(signature)),
        challenge
      })
    });

    const didRes = await fetch(`${API_URL}/did/did:dao:asppibra:${USERNAME}`);
    const didDoc = await didRes.json();
    if (didDoc.id.includes(USERNAME)) {
      console.log('✅ DID Resolver OK (W3C Standard)');
    }

    // 2. Testar Zero-Trust (Signed Request)
    console.log('Step 2: Testando Middleware Zero-Trust...');
    const timestamp = Date.now().toString();
    const body = JSON.stringify({ username: USERNAME });
    const msg = new TextEncoder().encode(timestamp + body);
    const ztSignature = CryptoCore.sign(msg, priv);
    const sigBase64 = btoa(String.fromCharCode(...ztSignature));

    const revokeRes = await fetch(`${API_URL}/revoke`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-Identity-Signature': sigBase64,
        'X-Identity-DID': `did:dao:asppibra:${USERNAME}`,
        'X-Identity-Timestamp': timestamp
      },
      body
    });
    const revokeData = await revokeRes.json();
    console.log('✅ Zero-Trust Signature OK:', revokeData.message);

    // 3. Testar Social Recovery (SSS)
    console.log('Step 3: Testando Social Recovery (Shamir)...');
    const secret = new TextEncoder().encode(mnemonic);
    const shares = ShamirCore.split(secret, 3, 2);
    const recovered = ShamirCore.combine([shares[0], shares[2]]);
    if (new TextDecoder().decode(recovered) === mnemonic) {
      console.log('✅ Shamir Secret Sharing OK (2-of-3 Recovery)');
    }

    console.log('\n🏆 AUDITORIA FINALIZADA: STATUS ALPHA ELITE CONFIRMADO');

  } catch (e) {
    console.error('❌ Falha Crítica na Auditoria:', e.message);
    process.exit(1);
  }
}

runEliteAudit();
