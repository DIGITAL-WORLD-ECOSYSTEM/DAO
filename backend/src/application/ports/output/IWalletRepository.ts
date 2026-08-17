import { Result } from '../../../shared/kernel/Result';

export interface WalletRecord {
  id?: number;
  userId: number;
  address: string;
  addressNormalized: string;
  networkId: number;
  provenance?: 'internal' | 'external';
  walletType?: 'eoa' | 'smart_contract';
  controlMode?: 'platform_key' | 'external_user' | 'contract_controller';
  isPrimary?: boolean;
  status?: 'pending' | 'active' | 'suspended' | 'revoked' | 'unlinked';
  verificationStatus?: 'pending' | 'verified' | 'failed';
}

export interface IWalletRepository {
  findByAddress(address: string): Promise<Result<WalletRecord>>;
  findByUserId(userId: number): Promise<Result<WalletRecord[]>>;
  save(wallet: WalletRecord): Promise<Result<WalletRecord>>;
}
