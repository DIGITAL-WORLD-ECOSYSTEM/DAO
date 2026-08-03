import { TreasuryTransaction } from '../../domains/treasury/entities/TreasuryTransaction';

export class TreasuryMapper {
  static toDomain(raw: any): TreasuryTransaction {
    return TreasuryTransaction.restore({
      id: raw.id,
      type: raw.type,
      category: raw.category,
      amountCents: raw.amountCents,
      currency: raw.currency,
      description: raw.description,
      status: raw.status,
      createdAt: raw.createdAt
    });
  }
}
