'use client';

/**
 * PasskeyService: Integração com WebAuthn (Mundo Digital Elite)
 * Permite que o Cidadão use Biometria (FaceID/TouchID) para assinar o login.
 */

export class PasskeyService {
  /**
   * Registra uma nova Passkey (Vínculo com o Backend)
   */
  static async register(username: string): Promise<Credential | null> {
    if (!window.PublicKeyCredential) {
      throw new Error('WebAuthn não suportado neste navegador.');
    }

    // Desafio aleatório para o registro
    const challenge = crypto.getRandomValues(new Uint8Array(32));

    const options: PublicKeyCredentialCreationOptions = {
      challenge,
      rp: {
        name: 'ASPPIBRA-DAO',
        id: window.location.hostname === 'localhost' ? 'localhost' : 'asppibra.com',
      },
      user: {
        id: new TextEncoder().encode(username),
        name: username,
        displayName: username,
      },
      pubKeyCredParams: [
        { alg: -7, type: 'public-key' }, // ES256
        { alg: -257, type: 'public-key' }, // RS256
      ],
      timeout: 60000,
      attestation: 'none',
      authenticatorSelection: {
        userVerification: 'required',
        residentKey: 'required',
      },
    };

    const credential = await navigator.credentials.create({ publicKey: options as any });
    return credential;
  }

  /**
   * Autentica usando uma Passkey existente
   */
  static async authenticate(challenge: Uint8Array): Promise<Credential | null> {
    const options: PublicKeyCredentialRequestOptions = {
      challenge,
      rpId: window.location.hostname === 'localhost' ? 'localhost' : 'asppibra.com',
      userVerification: 'required',
    };

    const assertion = await navigator.credentials.get({ publicKey: options });
    return assertion;
  }
}
