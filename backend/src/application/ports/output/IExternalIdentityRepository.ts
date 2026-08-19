import { TransactionContext } from '../../dto/TransactionContext';

export interface ExternalIdentityRecord {
  readonly id: string;
  readonly userId: number;
  readonly provider: 'google' | 'github' | 'discord' | 'apple';
  readonly providerSubjectId: string;
  readonly emailAtBinding?: string | null;
  readonly createdAt: Date;
}

export interface CreateExternalIdentityDTO {
  readonly userId: number;
  readonly provider: 'google' | 'github' | 'discord' | 'apple';
  readonly providerSubjectId: string;
  readonly emailAtBinding?: string;
}

export interface IExternalIdentityRepository {
  findUserIdByProviderSubject(
    provider: string,
    providerSubjectId: string,
    txCtx?: TransactionContext
  ): Promise<number | null>;

  findByProviderSubject(
    provider: string,
    providerSubjectId: string,
    txCtx?: TransactionContext
  ): Promise<ExternalIdentityRecord | null>;

  findByUserId(
    userId: number,
    txCtx?: TransactionContext
  ): Promise<ExternalIdentityRecord[]>;

  save(
    binding: CreateExternalIdentityDTO,
    txCtx?: TransactionContext
  ): Promise<ExternalIdentityRecord>;

  delete(
    id: string,
    txCtx?: TransactionContext
  ): Promise<void>;
}
