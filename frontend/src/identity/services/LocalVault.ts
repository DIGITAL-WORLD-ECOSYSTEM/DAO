'use client';

import { CryptoCore } from '@dao/shared';

/**
 * LocalVault: Serviço de Armazenamento Seguro no Cliente.
 * Padrão Fortress: Chaves são criptografadas com AES-GCM antes de persistir no IndexedDB.
 */

const VAULT_DB_NAME = 'dao_vault';
const STORE_NAME = 'secrets';

export class LocalVault {
  /**
   * Inicializa o IndexedDB
   */
  private static async getDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(VAULT_DB_NAME, 1);
      request.onupgradeneeded = () => {
        request.result.createObjectStore(STORE_NAME);
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Salva o Mnemônico criptografado com uma senha de usuário (PIN).
   */
  static async saveMnemonic(mnemonic: string, pin: string): Promise<void> {
    const encoder = new TextEncoder();
    const data = encoder.encode(mnemonic);
    
    // 🛡️ PBKDF2 Hardening para o PIN Local (100.000 iterações)
    const pinData = encoder.encode(pin);
    const pinBase = await crypto.subtle.importKey('raw', pinData, 'PBKDF2', false, ['deriveBits', 'deriveKey']);
    const pinSalt = encoder.encode('dao_local_salt'); // Salt fixo local ou derivado do username
    const pinHashBuffer = await crypto.subtle.deriveBits(
      { name: 'PBKDF2', salt: pinSalt, iterations: 100000, hash: 'SHA-256' },
      pinBase,
      256
    );
    const pinHash = new Uint8Array(pinHashBuffer);
    
    const { ciphertext, iv } = await CryptoCore.encrypt(data, pinHash);
    
    // 🧹 Zeroization: Limpar buffers sensíveis
    data.fill(0);
    pinData.fill(0);
    pinHash.fill(0);
    
    const db = await this.getDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put({ ciphertext, iv }, 'mnemonic_bundle');
    
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  /**
   * Recupera e descriptografa o Mnemônico.
   */
  static async getMnemonic(pin: string): Promise<string> {
    const db = await this.getDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const request = tx.objectStore(STORE_NAME).get('mnemonic_bundle');

    return new Promise((resolve, reject) => {
      request.onsuccess = async () => {
        const bundle = request.result;
        if (!bundle) return reject(new Error('Cofre não encontrado.'));

        try {
          const encoder = new TextEncoder();
          const pinData = encoder.encode(pin);
          const pinBase = await crypto.subtle.importKey('raw', pinData, 'PBKDF2', false, ['deriveBits', 'deriveKey']);
          const pinSalt = encoder.encode('dao_local_salt');
          const pinHashBuffer = await crypto.subtle.deriveBits(
            { name: 'PBKDF2', salt: pinSalt, iterations: 100000, hash: 'SHA-256' },
            pinBase,
            256
          );
          const pinHash = new Uint8Array(pinHashBuffer);

          const decrypted = await CryptoCore.decrypt(bundle.ciphertext, pinHash, bundle.iv);
          
          // 🧹 Zeroization
          pinData.fill(0);
          pinHash.fill(0);
          
          resolve(new TextDecoder().decode(decrypted));
        } catch (e) {
          reject(new Error('PIN incorreto ou cofre corrompido.'));
        }
      };
      request.onerror = () => reject(request.error);
    });
  }
}
