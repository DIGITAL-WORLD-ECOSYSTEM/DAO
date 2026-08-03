import { BaseEntity } from '../../../shared/kernel/BaseEntity';

export interface TreasuryTransactionProps {
  id: number;
  type: string;
  category: string;
  amountCents: number;
  currency: string;
  description: string;
  status: string;
  createdAt: number | Date;
}

export class TreasuryTransaction extends BaseEntity<number> {
  private _props: TreasuryTransactionProps;

  private constructor(props: TreasuryTransactionProps) {
    super(props.id);
    this._props = props;
  }

  public static restore(props: TreasuryTransactionProps): TreasuryTransaction {
    return new TreasuryTransaction(props);
  }

  get type(): string { return this._props.type; }
  get category(): string { return this._props.category; }
  get amountCents(): number { return this._props.amountCents; }
  get currency(): string { return this._props.currency; }
  get description(): string { return this._props.description; }
  get status(): string { return this._props.status; }
  get createdAt(): number | Date { return this._props.createdAt; }
}
