import type { ITreasuryRepository, TreasuryTransactionDTO } from '../../../../application/ports/output/finance/ITreasuryRepository';

export class D1TreasuryRepository implements ITreasuryRepository {
  constructor(private readonly db: D1Database) {}

  async findTransactionsByUserId(userId: number): Promise<TreasuryTransactionDTO[]> {
    const dbTx = await this.db.prepare(`
      SELECT 
        ft.id,
        strftime('%Y-%m-%dT%H:%M:%SZ', ft.created_at, 'unixepoch') as created_at,
        ft.counterparty_name,
        ft.origin_institution,
        ft.destination_institution,
        ft.payment_method,
        ft.source_proof,
        ft.category,
        ft.status,
        fle.amount_base_units
      FROM financial_transactions ft
      LEFT JOIN financial_ledger_entries fle ON ft.id = fle.transaction_id
      WHERE ft.user_id = ?
      ORDER BY ft.created_at ASC, ft.id ASC
    `).bind(userId).all<{
      id: number;
      created_at: string;
      counterparty_name: string | null;
      origin_institution: string | null;
      destination_institution: string | null;
      payment_method: string | null;
      source_proof: string | null;
      category: string;
      status: string;
      amount_base_units: string | null;
    }>();

    if (!dbTx || !dbTx.results) {
      return [];
    }

    return dbTx.results.map((row) => {
      const valInReais = row.amount_base_units ? Math.round(Number(row.amount_base_units) / 100) : 0;
      return {
        id: `tx_${String(row.id).padStart(3, '0')}`,
        created_at: row.created_at || new Date().toISOString(),
        counterparty_name: row.counterparty_name || 'Desconhecido',
        origin_institution: row.origin_institution || 'N/A',
        destination_institution: row.destination_institution || 'N/A',
        payment_method: row.payment_method || 'pix',
        source_proof: row.source_proof || 'Não anexado',
        amount: valInReais,
        base_amount: valInReais,
        currency: 'BRL',
        base_currency: 'BRL',
        type: 'income',
        direction: 'inbound',
        category: row.category || 'membership',
        status: row.status === 'completed' ? 'confirmed' : row.status === 'failed' ? 'failed' : 'confirmed',
        reconciliation_status: 'matched',
      };
    });
  }
}
