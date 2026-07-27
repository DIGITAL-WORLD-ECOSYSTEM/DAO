export type BaseCurrency = 'BRL' | 'USD' | 'EUR';

export type Balance = {
  id: string;
  asset: string; // USD, BRL, BTC, USDT
  name: string; // Dólar Americano, Bitcoin
  icon: string;
  available: number;
  blocked: number;
  inLiquidation: number;
  fiatValue: number; // in BaseCurrency (BRL)
};
