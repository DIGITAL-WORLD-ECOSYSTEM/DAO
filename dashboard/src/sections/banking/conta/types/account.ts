import type { Balance } from './asset';

export type AccountStatus = 'Ativa' | 'Verificada' | 'Limitada' | 'Em Revisão' | 'Bloqueada';
export type AccountType = 'brl' | 'global' | 'web3';

export type AccountData = {
  id: string;
  type: AccountType;
  label: string;
  status: AccountStatus;
  balances: Balance[];
  // BRL specific
  bankName?: string;
  agency?: string;
  accountNumber?: string;
  pixKeys?: { id: string; type: string; value: string }[];
  // Global specific
  iban?: string;
  swift?: string;
  aba?: string;
  // Web3 specific
  web3Addresses?: {
    id: string;
    network: string;
    address: string;
    icon: string;
    isFavorite?: boolean;
  }[];
};
