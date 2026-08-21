/**
 * Utilitário de Formatação Financeira pt-BR
 * Converte unidades menores (centavos) ou numéricos decimais para notação monetária pt-BR estrita.
 */

export function formatCurrencyBRL(amount: number, isMinorUnits: boolean = false): string {
  const valueInReais = isMinorUnits ? amount / 100 : amount;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valueInReais);
}

export function formatMinorToBRL(amountMinor: number | string): string {
  const minor = typeof amountMinor === 'string' ? parseInt(amountMinor, 10) : amountMinor;
  return formatCurrencyBRL(isNaN(minor) ? 0 : minor, true);
}
