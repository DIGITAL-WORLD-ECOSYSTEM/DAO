/**
 * Copyright 2026 ASPPIBRA – Associação dos Proprietários e Possuidores de Imóveis no Brasil.
 * Project: Governance System (ASPPIBRA DAO)
 * Role: CryptoVault (AES-256-GCM Enterprise Encryption)
 *
 * Este módulo opera exclusivamente na Edge (V8 WebCrypto).
 * Nenhuma chave é persistida; apenas cifrada/decifrada em tempo real usando a MASTER_SECRET.
 */

export class CryptoVault {
  /**
   * Deriva a chave-mestra (MASTER_SECRET) usando SHA-256 para garantir exatos 256 bits (32 bytes),
   * independentemente do tamanho da string colocada no .dev.vars
   */
  private static async getMasterKey(masterSecret: string): Promise<CryptoKey> {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.digest('SHA-256', enc.encode(masterSecret));
    return await crypto.subtle.importKey('raw', keyMaterial, { name: 'AES-GCM' }, false, [
      'encrypt',
      'decrypt',
    ]);
  }

  /**
   * Criptografa um segredo em texto puro (AES-256-GCM)
   * @returns Uma string no formato "base64(iv):base64(ciphertext)"
   */
  static async encrypt(plainText: string, masterSecret: string): Promise<string> {
    if (!plainText) return '';

    const key = await this.getMasterKey(masterSecret);
    const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV (Standard para AES-GCM)
    const enc = new TextEncoder();

    const encryptedContent = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      enc.encode(plainText)
    );

    // Converte ArrayBuffer para string em Base64
    const ivBase64 = btoa(String.fromCharCode(...new Uint8Array(iv)));
    const cipherBase64 = btoa(String.fromCharCode(...new Uint8Array(encryptedContent)));

    return `${ivBase64}:${cipherBase64}`;
  }

  /**
   * Descriptografa um segredo cifrado
   * @param encryptedPayload String no formato "base64(iv):base64(ciphertext)"
   */
  static async decrypt(encryptedPayload: string, masterSecret: string): Promise<string> {
    if (!encryptedPayload || !encryptedPayload.includes(':')) {
      throw new Error('Formato de payload criptografado inválido ou corrompido.');
    }

    const [ivBase64, cipherBase64] = encryptedPayload.split(':');
    const key = await this.getMasterKey(masterSecret);

    // Reconstroi os buffers a partir do Base64
    const ivString = atob(ivBase64);
    const iv = new Uint8Array(ivString.length);
    for (let i = 0; i < ivString.length; i++) {
      iv[i] = ivString.charCodeAt(i);
    }

    const cipherString = atob(cipherBase64);
    const ciphertext = new Uint8Array(cipherString.length);
    for (let i = 0; i < cipherString.length; i++) {
      ciphertext[i] = cipherString.charCodeAt(i);
    }

    try {
      const decryptedContent = await crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: iv,
        },
        key,
        ciphertext
      );
      const dec = new TextDecoder();
      return dec.decode(decryptedContent);
    } catch (error) {
      throw new Error(
        'Falha catastrófica ao descriptografar segredo. MASTER_SECRET inválida ou payload violado.'
      );
    }
  }

  /**
   * Rotação Mestra (Emergency Scenario)
   * Descriptografa usando a MASTER_SECRET antiga e re-criptografa com a MASTER_SECRET nova.
   */
  static async rotateMasterKey(
    encryptedPayload: string,
    oldMasterSecret: string,
    newMasterSecret: string
  ): Promise<string> {
    const plainText = await this.decrypt(encryptedPayload, oldMasterSecret);
    return await this.encrypt(plainText, newMasterSecret);
  }

  /**
   * Gera o hash imutável em cascata para os logs de auditoria (Blockchain-style Chain Hash).
   * Garante que se o registro N for adulterado, o hash do N+1 quebrará.
   */
  static async generateEventHash(
    payload: Record<string, any>,
    previousHash: string = 'GENESIS'
  ): Promise<string> {
    const rawString = JSON.stringify(payload) + previousHash;
    const enc = new TextEncoder();
    const hashBuffer = await crypto.subtle.digest('SHA-256', enc.encode(rawString));
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
}
