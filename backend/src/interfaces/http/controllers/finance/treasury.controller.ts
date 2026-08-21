import type { Context } from 'hono';
import { D1TreasuryRepository } from '../../../../infrastructure/persistence/repositories/finance/D1TreasuryRepository';

export class TreasuryController {
  static async getTreasuryAnalytics(c: Context) {
    try {
      const repository = new D1TreasuryRepository(c.env.DB);
      
      let totalPaid = 0;
      let outstandingBalance = 0;
      let contractTotal = 0;

      const balanceRow = await c.env.DB.prepare(
        'SELECT available_base_units, locked_base_units FROM account_balances WHERE account_id = 10'
      ).first<{ available_base_units: string; locked_base_units: string }>();

      if (balanceRow && balanceRow.available_base_units !== undefined && balanceRow.available_base_units !== null) {
        totalPaid = Math.round(Number(balanceRow.available_base_units) / 100);
        outstandingBalance = Math.round(Number(balanceRow.locked_base_units) / 100);
        contractTotal = totalPaid + outstandingBalance;
      }

      const transactions = await repository.findTransactionsByUserId(10);

      return c.json({
        citizen_id: '10',
        summary: {
          contract_total: contractTotal,
          total_paid: totalPaid,
          outstanding_balance: outstandingBalance,
          settlement_percentage: contractTotal > 0 ? Math.round((totalPaid / contractTotal) * 100) : 0,
          status: outstandingBalance === 0 ? 'fully_paid' : 'in_good_standing',
          next_due_date: '2026-09-15T12:00:00Z',
          next_charge_amount: 800,
          pending_installments: 36,
          overdue_installments: 0,
        },
        transactions,
      });
    } catch (error: any) {
      return c.json({ error: 'Erro ao buscar dados da tesouraria', details: error.message }, 500);
    }
  }

  static async getCitizenLedger(c: Context) {
    try {
      const repository = new D1TreasuryRepository(c.env.DB);
      const transactions = await repository.findTransactionsByUserId(10);
      return c.json({
        citizen_id: c.req.param('citizenId') || '10',
        total_transactions: transactions.length,
        transactions,
      });
    } catch (error: any) {
      return c.json({ error: 'Erro ao buscar extrato do cidadão', details: error.message }, 500);
    }
  }
}
