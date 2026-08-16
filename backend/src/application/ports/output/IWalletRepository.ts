import { Result } from '../../../shared/kernel/Result';

export interface WalletRecord {
  id?: number;
  userId: number;
  address: string;
  addressNormalized: string;
  networkId: number;
  provenance?: 'internal' | 'external';
  isPrimary?: boolean;
}

export interface IWalletRepository {
  findByAddress(address: string): Promise<Result<WalletRecord>>;
  save(wallet: WalletRecord): Promise<Result<WalletRecord>>;
}
