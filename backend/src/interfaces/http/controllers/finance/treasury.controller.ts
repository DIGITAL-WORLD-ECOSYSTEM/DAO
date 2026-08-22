import type { Context } from 'hono';
import { D1TreasuryRepository } from '../../../../infrastructure/persistence/repositories/finance/D1TreasuryRepository';

export const CLIENT_ACCOUNT_PROFILE = {
  account_number: '#2024001',
  client_name: 'Andressa de Lima Ferreira',
  email: 'andressa.ferreira@email.com',
  cpf: '173.793.567-80',
  address: 'Rua Palmira F. De Carvalho, lote 05, Quadra D, São José de Imbassaí, Maricá - RJ, 24912-000',
  contract_total: 65000,      // R$ 65.000,00 (Contrato Real Reconciliado)
  total_paid: 36623,          // R$ 36.623,00 (Soma auditada dos comprovantes)
  outstanding_balance: 28377, // R$ 28.377,00 (Saldo Devedor Reconciliado)
  report_ref: '2026-08-PM4',
};

const CONSOLIDATED_REPORT_TRANSACTIONS = [
  { id: "tx_001", created_at: "2023-08-08T12:00:00Z", counterparty_name: "Paulo Roberto Batista Ferreira", origin_institution: "Itaú Unibanco", destination_institution: "Nu Pagamentos", amount: 5000, currency: "BRL", base_currency: "BRL", base_amount: 5000, type: "income", direction: "inbound", category: "membership", payment_method: "pix", status: "confirmed", reconciliation_status: "matched", source_proof: "Comprovante Itaú Pix" },
  { id: "tx_002", created_at: "2023-08-09T12:00:00Z", counterparty_name: "Paulo Roberto Batista Ferreira", origin_institution: "Itaú Unibanco", destination_institution: "Nu Pagamentos", amount: 5000, currency: "BRL", base_currency: "BRL", base_amount: 5000, type: "income", direction: "inbound", category: "membership", payment_method: "pix", status: "confirmed", reconciliation_status: "matched", source_proof: "Comprovante Itaú Pix" },
  { id: "tx_003", created_at: "2023-09-21T12:00:00Z", counterparty_name: "Paulo Roberto Batista Ferreira", origin_institution: "Itaú Unibanco", destination_institution: "Nu Pagamentos", amount: 800, currency: "BRL", base_currency: "BRL", base_amount: 800, type: "income", direction: "inbound", category: "membership", payment_method: "bank_transfer", status: "confirmed", reconciliation_status: "matched", source_proof: "Comprovante Itaú (App)" },
  { id: "tx_004", created_at: "2023-10-20T12:00:00Z", counterparty_name: "Paulo Roberto Batista Ferreira", origin_institution: "Itaú Unibanco", destination_institution: "Nu Pagamentos", amount: 800, currency: "BRL", base_currency: "BRL", base_amount: 800, type: "income", direction: "inbound", category: "membership", payment_method: "bank_transfer", status: "confirmed", reconciliation_status: "matched", source_proof: "Comprovante Itaú (App)" },
  { id: "tx_005", created_at: "2023-11-21T12:00:00Z", counterparty_name: "Paulo Roberto Batista Ferreira", origin_institution: "Itaú Unibanco", destination_institution: "Nu Pagamentos", amount: 800, currency: "BRL", base_currency: "BRL", base_amount: 800, type: "income", direction: "inbound", category: "membership", payment_method: "bank_transfer", status: "confirmed", reconciliation_status: "matched", source_proof: "Comprovante Itaú (App)" },
  { id: "tx_006", created_at: "2023-12-21T12:00:00Z", counterparty_name: "Sandro Alves de Amorim", origin_institution: "Itaú Unibanco", destination_institution: "Bradesco", amount: 700, currency: "BRL", base_currency: "BRL", base_amount: 700, type: "income", direction: "inbound", category: "operational", payment_method: "bank_transfer", status: "confirmed", reconciliation_status: "matched", source_proof: "Comprovante Itaú + Extrato Bradesco" },
  { id: "tx_007", created_at: "2023-12-22T12:00:00Z", counterparty_name: "Paulo Roberto Batista Ferreira", origin_institution: "Itaú Unibanco", destination_institution: "Itaú Unibanco", amount: 800, currency: "BRL", base_currency: "BRL", base_amount: 800, type: "income", direction: "inbound", category: "membership", payment_method: "bank_transfer", status: "confirmed", reconciliation_status: "matched", source_proof: "Comprovante Itaú (agendamento + realizado)" },
  { id: "tx_008", created_at: "2024-02-16T12:00:00Z", counterparty_name: "Paulo Roberto Batista Ferreira", origin_institution: "Itaú Unibanco", destination_institution: "Itaú Unibanco", amount: 800, currency: "BRL", base_currency: "BRL", base_amount: 800, type: "income", direction: "inbound", category: "membership", payment_method: "bank_transfer", status: "confirmed", reconciliation_status: "matched", source_proof: "Comprovante Itaú (App)" },
  { id: "tx_009", created_at: "2024-03-11T12:00:00Z", counterparty_name: "Paulo Roberto Batista Ferreira", origin_institution: "Itaú Unibanco", destination_institution: "Itaú Unibanco", amount: 800, currency: "BRL", base_currency: "BRL", base_amount: 800, type: "income", direction: "inbound", category: "membership", payment_method: "bank_transfer", status: "confirmed", reconciliation_status: "matched", source_proof: "Comprovante Itaú (App)" },
  { id: "tx_010", created_at: "2024-04-30T12:00:00Z", counterparty_name: "Sandro Alves de Amorim", origin_institution: "Mercado Pago", destination_institution: "Bradesco", amount: 700, currency: "BRL", base_currency: "BRL", base_amount: 700, type: "income", direction: "inbound", category: "operational", payment_method: "pix", status: "confirmed", reconciliation_status: "matched", source_proof: "Comprovante Mercado Pago + Extrato Bradesco" },
  { id: "tx_011", created_at: "2024-04-30T12:00:00Z", counterparty_name: "Paulo Roberto Batista Ferreira", origin_institution: "Mercado Pago", destination_institution: "Itaú Unibanco", amount: 800, currency: "BRL", base_currency: "BRL", base_amount: 800, type: "income", direction: "inbound", category: "membership", payment_method: "pix", status: "confirmed", reconciliation_status: "matched", source_proof: "Comprovante Mercado Pago" },
  { id: "tx_012", created_at: "2024-05-29T12:00:00Z", counterparty_name: "Paulo Roberto Batista Ferreira", origin_institution: "Mercado Pago", destination_institution: "Itaú Unibanco", amount: 800, currency: "BRL", base_currency: "BRL", base_amount: 800, type: "income", direction: "inbound", category: "membership", payment_method: "pix", status: "confirmed", reconciliation_status: "matched", source_proof: "Comprovante Mercado Pago" },
  { id: "tx_013", created_at: "2024-06-24T12:00:00Z", counterparty_name: "Paulo Roberto Batista Ferreira", origin_institution: "Mercado Pago", destination_institution: "Itaú Unibanco", amount: 800, currency: "BRL", base_currency: "BRL", base_amount: 800, type: "income", direction: "inbound", category: "membership", payment_method: "pix", status: "confirmed", reconciliation_status: "matched", source_proof: "Comprovante Mercado Pago" },
  { id: "tx_014", created_at: "2024-07-28T12:00:00Z", counterparty_name: "Paulo Roberto Batista Ferreira", origin_institution: "Mercado Pago", destination_institution: "Itaú Unibanco", amount: 800, currency: "BRL", base_currency: "BRL", base_amount: 800, type: "income", direction: "inbound", category: "membership", payment_method: "pix", status: "confirmed", reconciliation_status: "matched", source_proof: "Comprovante Mercado Pago" },
  { id: "tx_015", created_at: "2024-09-06T12:00:00Z", counterparty_name: "Paulo Roberto Batista Ferreira", origin_institution: "Itaú Unibanco", destination_institution: "Itaú Unibanco", amount: 800, currency: "BRL", base_currency: "BRL", base_amount: 800, type: "income", direction: "inbound", category: "membership", payment_method: "bank_transfer", status: "confirmed", reconciliation_status: "matched", source_proof: "Comprovante Itaú (App)" },
  { id: "tx_016", created_at: "2024-09-06T12:00:00Z", counterparty_name: "Sandro Alves de Amorim", origin_institution: "Itaú Unibanco", destination_institution: "Bradesco", amount: 700, currency: "BRL", base_currency: "BRL", base_amount: 700, type: "income", direction: "inbound", category: "operational", payment_method: "bank_transfer", status: "confirmed", reconciliation_status: "matched", source_proof: "Extrato Bradesco" },
  { id: "tx_017", created_at: "2024-10-09T12:00:00Z", counterparty_name: "Sandro Alves de Amorim", origin_institution: "Itaú Unibanco", destination_institution: "Bradesco", amount: 800, currency: "BRL", base_currency: "BRL", base_amount: 800, type: "income", direction: "inbound", category: "operational", payment_method: "bank_transfer", status: "confirmed", reconciliation_status: "matched", source_proof: "Extrato Bradesco" },
  { id: "tx_018", created_at: "2024-11-09T12:00:00Z", counterparty_name: "Paulo Roberto Batista Ferreira", origin_institution: "Mercado Pago", destination_institution: "Itaú Unibanco", amount: 800, currency: "BRL", base_currency: "BRL", base_amount: 800, type: "income", direction: "inbound", category: "membership", payment_method: "pix", status: "confirmed", reconciliation_status: "matched", source_proof: "Comprovante Mercado Pago" },
  { id: "tx_019", created_at: "2024-12-18T12:00:00Z", counterparty_name: "Paulo Roberto Batista Ferreira", origin_institution: "Mercado Pago", destination_institution: "Itaú Unibanco", amount: 800, currency: "BRL", base_currency: "BRL", base_amount: 800, type: "income", direction: "inbound", category: "membership", payment_method: "pix", status: "confirmed", reconciliation_status: "matched", source_proof: "Comprovante Mercado Pago" },
  { id: "tx_020", created_at: "2025-01-21T12:00:00Z", counterparty_name: "Paulo Roberto Batista Ferreira", origin_institution: "Mercado Pago", destination_institution: "Itaú Unibanco", amount: 800, currency: "BRL", base_currency: "BRL", base_amount: 800, type: "income", direction: "inbound", category: "membership", payment_method: "pix", status: "confirmed", reconciliation_status: "matched", source_proof: "Comprovante Mercado Pago" },
  { id: "tx_021", created_at: "2025-01-21T12:00:00Z", counterparty_name: "Sandro Alves de Amorim", origin_institution: "Mercado Pago", destination_institution: "Bradesco", amount: 700, currency: "BRL", base_currency: "BRL", base_amount: 700, type: "income", direction: "inbound", category: "operational", payment_method: "pix", status: "confirmed", reconciliation_status: "matched", source_proof: "Comprovante Mercado Pago" },
  { id: "tx_022", created_at: "2025-02-10T12:00:00Z", counterparty_name: "Paulo Roberto Batista Ferreira", origin_institution: "Itaú Unibanco", destination_institution: "Itaú Unibanco", amount: 800, currency: "BRL", base_currency: "BRL", base_amount: 800, type: "income", direction: "inbound", category: "membership", payment_method: "bank_transfer", status: "confirmed", reconciliation_status: "matched", source_proof: "Comprovante Itaú (App)" },
  { id: "tx_023", created_at: "2025-03-19T12:00:00Z", counterparty_name: "Paulo Roberto Batista Ferreira", origin_institution: "Mercado Pago", destination_institution: "Itaú Unibanco", amount: 800, currency: "BRL", base_currency: "BRL", base_amount: 800, type: "income", direction: "inbound", category: "membership", payment_method: "pix", status: "confirmed", reconciliation_status: "matched", source_proof: "Comprovante Mercado Pago" },
  { id: "tx_024", created_at: "2025-04-22T12:00:00Z", counterparty_name: "Sandro Alves de Amorim", origin_institution: "Mercado Pago", destination_institution: "Bradesco", amount: 400, currency: "BRL", base_currency: "BRL", base_amount: 400, type: "income", direction: "inbound", category: "operational", payment_method: "pix", status: "confirmed", reconciliation_status: "matched", source_proof: "Comprovante Mercado Pago (env. 18/04) + Extrato Bradesco" },
  { id: "tx_025", created_at: "2025-04-30T12:00:00Z", counterparty_name: "Sandro Alves de Amorim", origin_institution: "Mercado Pago", destination_institution: "Bradesco", amount: 400, currency: "BRL", base_currency: "BRL", base_amount: 400, type: "income", direction: "inbound", category: "operational", payment_method: "pix", status: "confirmed", reconciliation_status: "matched", source_proof: "Comprovante Mercado Pago" },
  { id: "tx_026", created_at: "2025-05-17T12:00:00Z", counterparty_name: "Paulo Roberto Batista Ferreira", origin_institution: "Mercado Pago", destination_institution: "Itaú Unibanco", amount: 750, currency: "BRL", base_currency: "BRL", base_amount: 750, type: "income", direction: "inbound", category: "membership", payment_method: "pix", status: "confirmed", reconciliation_status: "matched", source_proof: "Comprovante Mercado Pago" },
  { id: "tx_027", created_at: "2025-06-17T12:00:00Z", counterparty_name: "Sandro Alves de Amorim", origin_institution: "Itaú Unibanco", destination_institution: "Banco Inter", amount: 350, currency: "BRL", base_currency: "BRL", base_amount: 350, type: "income", direction: "inbound", category: "operational", payment_method: "pix", status: "confirmed", reconciliation_status: "matched", source_proof: "Comprovante Itaú Pix" },
  { id: "tx_028", created_at: "2025-06-17T12:00:00Z", counterparty_name: "Paulo Roberto Batista Ferreira", origin_institution: "Mercado Pago", destination_institution: "Itaú Unibanco", amount: 800, currency: "BRL", base_currency: "BRL", base_amount: 800, type: "income", direction: "inbound", category: "membership", payment_method: "pix", status: "confirmed", reconciliation_status: "matched", source_proof: "Comprovante Mercado Pago" },
  { id: "tx_029", created_at: "2025-07-26T12:00:00Z", counterparty_name: "Paulo Roberto Batista Ferreira", origin_institution: "Nu Pagamentos", destination_institution: "Itaú Unibanco", amount: 667, currency: "BRL", base_currency: "BRL", base_amount: 667, type: "income", direction: "inbound", category: "membership", payment_method: "pix", status: "confirmed", reconciliation_status: "matched", source_proof: "Comprovante Nu" },
  { id: "tx_030", created_at: "2025-07-26T12:00:00Z", counterparty_name: "Sandro Alves de Amorim", origin_institution: "Nu Pagamentos", destination_institution: "Banco Inter", amount: 667, currency: "BRL", base_currency: "BRL", base_amount: 667, type: "income", direction: "inbound", category: "operational", payment_method: "pix", status: "confirmed", reconciliation_status: "matched", source_proof: "Comprovante Nu" },
  { id: "tx_031", created_at: "2025-08-15T12:00:00Z", counterparty_name: "Sandro Alves de Amorim", origin_institution: "Itaú Unibanco", destination_institution: "Banco Inter", amount: 667, currency: "BRL", base_currency: "BRL", base_amount: 667, type: "income", direction: "inbound", category: "operational", payment_method: "pix", status: "confirmed", reconciliation_status: "matched", source_proof: "Comprovante Itaú Pix" },
  { id: "tx_032", created_at: "2025-10-13T12:00:00Z", counterparty_name: "Paulo Roberto Batista Ferreira", origin_institution: "Itaú Unibanco", destination_institution: "Santander", amount: 1000, currency: "BRL", base_currency: "BRL", base_amount: 1000, type: "income", direction: "inbound", category: "membership", payment_method: "pix", status: "confirmed", reconciliation_status: "matched", source_proof: "Comprovante Itaú Pix" },
  { id: "tx_033", created_at: "2025-11-17T12:00:00Z", counterparty_name: "ASPPIBRA", origin_institution: "Mercado Pago (boleto Cora)", destination_institution: "Cora SCFI", amount: 1050, currency: "BRL", base_currency: "BRL", base_amount: 1050, type: "income", direction: "inbound", category: "operational", payment_method: "pix", status: "confirmed", reconciliation_status: "matched", source_proof: "Comprovante Mercado Pago + Boleto Cora oficial" },
  { id: "tx_034", created_at: "2025-12-05T12:00:00Z", counterparty_name: "ASPPIBRA", origin_institution: "Nu Pagamentos", destination_institution: "Cora SCFI", amount: 550, currency: "BRL", base_currency: "BRL", base_amount: 550, type: "income", direction: "inbound", category: "operational", payment_method: "pix", status: "confirmed", reconciliation_status: "matched", source_proof: "Comprovante Nu + Extrato Cora ASPPIBRA" },
  { id: "tx_035", created_at: "2026-02-09T12:00:00Z", counterparty_name: "ASPPIBRA", origin_institution: "Nu Pagamentos", destination_institution: "Cora SCFI", amount: 800, currency: "BRL", base_currency: "BRL", base_amount: 800, type: "income", direction: "inbound", category: "operational", payment_method: "pix", status: "confirmed", reconciliation_status: "matched", source_proof: "Comprovante Nu (compensado 10/02)" },
  { id: "tx_036", created_at: "2026-02-09T12:00:00Z", counterparty_name: "Paulo Roberto Batista Ferreira", origin_institution: "Nu Pagamentos", destination_institution: "Santander", amount: 700, currency: "BRL", base_currency: "BRL", base_amount: 700, type: "income", direction: "inbound", category: "membership", payment_method: "pix", status: "confirmed", reconciliation_status: "matched", source_proof: "Comprovante Nu (compensado 10/02)" },
  { id: "tx_037", created_at: "2026-03-08T12:00:00Z", counterparty_name: "ASPPIBRA", origin_institution: "Nu Pagamentos", destination_institution: "Cora SCFI", amount: 250, currency: "BRL", base_currency: "BRL", base_amount: 250, type: "income", direction: "inbound", category: "operational", payment_method: "pix", status: "confirmed", reconciliation_status: "matched", source_proof: "Comprovante Nu (compensado 09/03)" },
  { id: "tx_038", created_at: "2026-03-10T12:00:00Z", counterparty_name: "ASPPIBRA", origin_institution: "Itaú Unibanco", destination_institution: "Cora SCFI", amount: 250, currency: "BRL", base_currency: "BRL", base_amount: 250, type: "income", direction: "inbound", category: "operational", payment_method: "pix", status: "confirmed", reconciliation_status: "matched", source_proof: "Comprovante Itaú Pix (compensado 11/03)" },
  { id: "tx_039", created_at: "2026-03-15T12:00:00Z", counterparty_name: "ASPPIBRA", origin_institution: "Banco Inter", destination_institution: "Cora SCFI", amount: 250, currency: "BRL", base_currency: "BRL", base_amount: 250, type: "income", direction: "inbound", category: "operational", payment_method: "bank_transfer", status: "confirmed", reconciliation_status: "matched", source_proof: "Comprovante Banco Inter (compensado 16/03)" },
  { id: "tx_040", created_at: "2026-03-27T12:00:00Z", counterparty_name: "Paulo Roberto Batista Ferreira", origin_institution: "Banco Inter", destination_institution: "Santander", amount: 672, currency: "BRL", base_currency: "BRL", base_amount: 672, type: "income", direction: "inbound", category: "membership", payment_method: "bank_transfer", status: "confirmed", reconciliation_status: "matched", source_proof: "Comprovante Banco Inter (compensado 28/03)" },
  { id: "tx_041", created_at: "2024-01-15T12:00:00Z", counterparty_name: "Paulo Roberto Batista Ferreira", origin_institution: "Sem Movimentação", destination_institution: "Sem Movimentação", amount: 0, currency: "BRL", base_currency: "BRL", base_amount: 0, type: "income", direction: "inbound", category: "Falta de Pagamento", payment_method: "bank_transfer", status: "failed", reconciliation_status: "manual_review", source_proof: "Sem comprovante (Inadimplência no período)" },
  { id: "tx_042", created_at: "2024-08-15T12:00:00Z", counterparty_name: "Paulo Roberto Batista Ferreira", origin_institution: "Sem Movimentação", destination_institution: "Sem Movimentação", amount: 0, currency: "BRL", base_currency: "BRL", base_amount: 0, type: "income", direction: "inbound", category: "Falta de Pagamento", payment_method: "bank_transfer", status: "failed", reconciliation_status: "manual_review", source_proof: "Sem comprovante (Inadimplência no período)" },
  { id: "tx_043", created_at: "2025-09-15T12:00:00Z", counterparty_name: "Paulo Roberto Batista Ferreira", origin_institution: "Sem Movimentação", destination_institution: "Sem Movimentação", amount: 0, currency: "BRL", base_currency: "BRL", base_amount: 0, type: "income", direction: "inbound", category: "Falta de Pagamento", payment_method: "bank_transfer", status: "failed", reconciliation_status: "manual_review", source_proof: "Sem comprovante (Inadimplência no período)" },
  { id: "tx_044", created_at: "2026-01-15T12:00:00Z", counterparty_name: "Paulo Roberto Batista Ferreira", origin_institution: "Sem Movimentação", destination_institution: "Sem Movimentação", amount: 0, currency: "BRL", base_currency: "BRL", base_amount: 0, type: "income", direction: "inbound", category: "Falta de Pagamento", payment_method: "bank_transfer", status: "failed", reconciliation_status: "manual_review", source_proof: "Sem comprovante (Inadimplência no período)" },
  { id: "tx_045", created_at: "2026-04-15T12:00:00Z", counterparty_name: "Paulo Roberto Batista Ferreira", origin_institution: "Sem Movimentação", destination_institution: "Sem Movimentação", amount: 0, currency: "BRL", base_currency: "BRL", base_amount: 0, type: "income", direction: "inbound", category: "Falta de Pagamento", payment_method: "bank_transfer", status: "failed", reconciliation_status: "manual_review", source_proof: "Sem comprovante (Inadimplência no período)" }
];

export class TreasuryController {
  static getRootInfo(c: Context) {
    return c.json({
      module: 'Treasury Analytics & Ledger API',
      status: 'active',
      client: CLIENT_ACCOUNT_PROFILE
    });
  }

  static async getTreasuryAnalytics(c: Context) {
    const year = c.req.query('year');
    const contractTotal = CLIENT_ACCOUNT_PROFILE.contract_total;
    const totalPaid = CLIENT_ACCOUNT_PROFILE.total_paid;
    const outstandingBalance = CLIENT_ACCOUNT_PROFILE.outstanding_balance;
    let transactionsList = CONSOLIDATED_REPORT_TRANSACTIONS;
    let filteredTx = transactionsList;
    if (year && year !== 'Todos') {
      filteredTx = transactionsList.filter((tx) =>
        tx.created_at.startsWith(year)
      );
    }

    const confirmedTx = filteredTx.filter((tx) => tx.status === 'confirmed');
    const count = confirmedTx.length;
    const avgTicket = count > 0 ? Math.round(totalPaid / count) : 0;

    const recipientMap: Record<string, number> = {};
    confirmedTx.forEach((tx) => {
      recipientMap[tx.counterparty_name] = (recipientMap[tx.counterparty_name] || 0) + tx.amount;
    });
    let topRecipient = 'Paulo Roberto Batista Ferreira';
    let maxAmount = 0;
    Object.entries(recipientMap).forEach(([name, amt]) => {
      if (amt > maxAmount) {
        maxAmount = amt;
        topRecipient = name;
      }
    });

    const monthlyMap: Record<string, number> = {};
    confirmedTx.forEach((tx) => {
      const monthKey = tx.created_at.substring(0, 7);
      monthlyMap[monthKey] = (monthlyMap[monthKey] || 0) + tx.amount;
    });
    const monthlyTrend = Object.entries(monthlyMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, total]) => ({ month, total }));

    const categoryMap: Record<string, number> = {};
    confirmedTx.forEach((tx) => {
      categoryMap[tx.category] = (categoryMap[tx.category] || 0) + tx.amount;
    });
    const distribution = Object.entries(categoryMap).map(([label, value]) => ({
      label,
      value,
    }));

    const availableYears = ['2023', '2024', '2025', '2026'];

    const normalizedTx = filteredTx.map((tx) => ({
      ...tx,
      risk_score: (tx as any).risk_score || { level: 'low', score: 0 },
      documents: (tx as any).documents || [],
      ai_flags: (tx as any).ai_flags || [],
    }));

    return c.json({
      success: true,
      data: {
        summary: {
          totalInflow: totalPaid,
          avgTicket,
          count,
          topRecipient,
          contractTotal,
          outstandingBalance,
        },
        monthlyTrend,
        distribution,
        availableYears,
        transactions: normalizedTx,
      },
    });
  }

  static async getCitizenLedger(c: Context) {
    const citizenId = c.req.param('citizenId');

    let associateInfo = {
      id: citizenId || '2024001',
      name: CLIENT_ACCOUNT_PROFILE.client_name,
      cpf: CLIENT_ACCOUNT_PROFILE.cpf,
      rg: '24.891.002-9',
      status: 'active' as const,
      category: 'Associado',
    };

    let contractInfo = {
      contractedAmount: CLIENT_ACCOUNT_PROFILE.contract_total,
      paidAmount: CLIENT_ACCOUNT_PROFILE.total_paid,
      openAmount: CLIENT_ACCOUNT_PROFILE.outstanding_balance,
      status: 'Em dia',
    };

    let transactionsList = CONSOLIDATED_REPORT_TRANSACTIONS;

    if (c.env?.DB && typeof c.env.DB.prepare === 'function') {
      try {
        const repository = new D1TreasuryRepository(c.env.DB);
        const d1Tx = await repository.findTransactionsByUserId(Number(citizenId) || 10);
        if (d1Tx && d1Tx.length > 0) {
          transactionsList = d1Tx as any;
        }
      } catch (err) {
        console.warn('Consulta D1 para citizen ledger via D1TreasuryRepository falhou, usando valores padrão:', err);
      }
    }

    const normalizedTx = transactionsList.map((tx) => ({
      ...tx,
      risk_score: (tx as any).risk_score || { level: 'low', score: 0 },
      documents: (tx as any).documents || [],
      ai_flags: (tx as any).ai_flags || [],
    }));

    const profileData = {
      associate: associateInfo,
      contract: contractInfo,
      obligations: {
        nextDueDate: '15/09/2026',
        nextDueAmount: 800,
        pendingInstallments: 36,
        overdueInstallments: 0,
      },
      transactions: normalizedTx,
    };

    return c.json({
      success: true,
      data: profileData,
    });
  }
}
