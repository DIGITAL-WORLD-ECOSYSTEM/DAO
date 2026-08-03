export type UUID = string;
export type ISODate = string;

export interface MoneyDTO {
  amount: number;
  currency: string;
}

export interface Metadata {
  [key: string]: string | number | boolean | null;
}

export interface AuditInfo {
  createdBy: string;
  createdAt: ISODate;
  updatedBy?: string;
  updatedAt?: ISODate;
  version: number;
}
