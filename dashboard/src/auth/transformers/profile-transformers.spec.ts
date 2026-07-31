import type { AuthUser } from '../types';

import { it, expect, describe } from 'vitest';

import { 
  buildDisplayName, 
  buildDisplayEmail, 
  formatWalletAddress, 
  extractWalletAddress 
} from './profile-transformers';

describe('Profile Transformers', () => {
  describe('extractWalletAddress', () => {
    it('deve extrair a carteira de um DID', () => {
      const did = 'did:dao:asppibra:0xDfcE227bf1ffbbbec6410c2c2e22873293e6b56f';
      expect(extractWalletAddress(did)).toBe('0xDfcE227bf1ffbbbec6410c2c2e22873293e6b56f');
    });

    it('deve retornar undefined se não houver carteira no DID', () => {
      expect(extractWalletAddress('did:dao:asppibra:invalid')).toBeUndefined();
    });
  });

  describe('formatWalletAddress', () => {
    it('deve formatar a carteira corretamente', () => {
      expect(formatWalletAddress('0xDfcE227bf1ffbbbec6410c2c2e22873293e6b56f')).toBe('0xDfcE...eb56f');
    });
  });

  describe('buildDisplayName', () => {
    it('deve usar o primeiro nome se disponível', () => {
      const user = { firstName: 'John', lastName: 'Doe' } as AuthUser;
      expect(buildDisplayName(user)).toBe('John Doe');
    });

    it('deve formatar o nome como carteira se for uma conta puramente Web3', () => {
      const user = { did: '0xDfcE227bf1ffbbbec6410c2c2e22873293e6b56f' } as AuthUser;
      expect(buildDisplayName(user)).toBe('0xDfcE...eb56f');
    });
  });

  describe('buildDisplayEmail', () => {
    it('deve mascarar emails sintéticos Web3 como "Wallet"', () => {
      const user = { email: '12345@web3.com' } as AuthUser;
      expect(buildDisplayEmail(user)).toBe('Wallet');
    });

    it('deve manter emails normais intocados', () => {
      const user = { email: 'john@example.com' } as AuthUser;
      expect(buildDisplayEmail(user)).toBe('john@example.com');
    });
  });
});
