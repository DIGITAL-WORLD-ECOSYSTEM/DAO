/**
 * Copyright 2026 ASPPIBRA – Associação dos Proprietários e Possuidores de Imóveis no Brasil.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Project: Governance System (ASPPIBRA DAO)
 * Role: Platform Treasury API Endpoint (Analytics, Ledger & Transactions)
 * Data Source: Relatório Financeiro Consolidado (Ref: 2026-07-PM4) - Andressa de Lima Ferreira (#2024001)
 */
import { Hono } from 'hono';
import { Bindings, Variables } from '../../types/bindings';

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// Perfil do Cliente e Contrato Registrado
export const CLIENT_ACCOUNT_PROFILE = {
  account_number: '#2024001',
  client_name: 'Andressa de Lima Ferreira',
  email: 'andressa.ferreira@email.com',
  cpf: '173.793.567-80',
  address: 'Rua Palmira F. De Carvalho, lote 05, Quadra D, São José de Imbassaí, Maricá - RJ, 24912-000',
  contract_total: 6500000,      // R$ 65.000,00 em centavos
  total_paid: 3582300,          // R$ 35.823,00 em centavos
  outstanding_balance: 2917700, // R$ 29.177,00 em centavos
  report_ref: '2026-07-PM4',
};

// 45 Transações Consolidadas do Relatório Oficial ASPPIBRA
const CONSOLIDATED_REPORT_TRANSACTIONS = [
  { id: 'tx_001', created_at: '2023-08-08T10:00:00Z', counterparty_name: 'Paulo Roberto Batista Ferreira', origin_institution: 'Itaú Unibanco', destination_institution: 'Nu Pagamentos', amount: 50000, currency: 'BRL', base_currency: 'BRL', base_amount: 50000, type: 'income', direction: 'inbound', category: 'membership', payment_method: 'pix', status: 'confirmed', reconciliation_status: 'matched' },
  { id: 'tx_002', created_at: '2023-08-09T10:00:00Z', counterparty_name: 'Paulo Roberto Batista Ferreira', origin_institution: 'Itaú Unibanco', destination_institution: 'Nu Pagamentos', amount: 50000, currency: 'BRL', base_currency: 'BRL', base_amount: 50000, type: 'income', direction: 'inbound', category: 'membership', payment_method: 'pix', status: 'confirmed', reconciliation_status: 'matched' },
  { id: 'tx_003', created_at: '2023-09-21T10:00:00Z', counterparty_name: 'Paulo Roberto Batista Ferreira', origin_institution: 'Itaú Unibanco', destination_institution: 'Nu Pagamentos', amount: 8000, currency: 'BRL', base_currency: 'BRL', base_amount: 8000, type: 'income', direction: 'inbound', category: 'membership', payment_method: 'pix', status: 'confirmed', reconciliation_status: 'matched' },
  { id: 'tx_004', created_at: '2023-10-20T10:00:00Z', counterparty_name: 'Paulo Roberto Batista Ferreira', origin_institution: 'Itaú Unibanco', destination_institution: 'Nu Pagamentos', amount: 8000, currency: 'BRL', base_currency: 'BRL', base_amount: 8000, type: 'income', direction: 'inbound', category: 'membership', payment_method: 'pix', status: 'confirmed', reconciliation_status: 'matched' },
  { id: 'tx_005', created_at: '2023-11-21T10:00:00Z', counterparty_name: 'Paulo Roberto Batista Ferreira', origin_institution: 'Itaú Unibanco', destination_institution: 'Nu Pagamentos', amount: 8000, currency: 'BRL', base_currency: 'BRL', base_amount: 8000, type: 'income', direction: 'inbound', category: 'membership', payment_method: 'pix', status: 'confirmed', reconciliation_status: 'matched' },
  { id: 'tx_006', created_at: '2023-12-21T10:00:00Z', counterparty_name: 'Sandro Alves de Amorim', origin_institution: 'Itaú Unibanco', destination_institution: 'Bradesco', amount: 7000, currency: 'BRL', base_currency: 'BRL', base_amount: 7000, type: 'income', direction: 'inbound', category: 'operational', payment_method: 'bank_transfer', status: 'confirmed', reconciliation_status: 'matched' },
  { id: 'tx_007', created_at: '2023-12-22T10:00:00Z', counterparty_name: 'Paulo Roberto Batista Ferreira', origin_institution: 'Itaú Unibanco', destination_institution: 'Itaú Unibanco', amount: 8000, currency: 'BRL', base_currency: 'BRL', base_amount: 8000, type: 'income', direction: 'inbound', category: 'membership', payment_method: 'bank_transfer', status: 'confirmed', reconciliation_status: 'matched' },
  { id: 'tx_008', created_at: '2024-01-15T10:00:00Z', counterparty_name: 'Desconhecido', origin_institution: 'N/A', destination_institution: 'N/A', amount: 0, currency: 'BRL', base_currency: 'BRL', base_amount: 0, type: 'income', direction: 'inbound', category: 'other', payment_method: 'pix', status: 'failed', reconciliation_status: 'manual_review' },
  { id: 'tx_009', created_at: '2024-02-16T10:00:00Z', counterparty_name: 'Paulo Roberto Batista Ferreira', origin_institution: 'Itaú Unibanco', destination_institution: 'Itaú Unibanco', amount: 8000, currency: 'BRL', base_currency: 'BRL', base_amount: 8000, type: 'income', direction: 'inbound', category: 'membership', payment_method: 'bank_transfer', status: 'confirmed', reconciliation_status: 'matched' },
  { id: 'tx_010', created_at: '2024-03-11T10:00:00Z', counterparty_name: 'Paulo Roberto Batista Ferreira', origin_institution: 'Itaú Unibanco', destination_institution: 'Itaú Unibanco', amount: 8000, currency: 'BRL', base_currency: 'BRL', base_amount: 8000, type: 'income', direction: 'inbound', category: 'membership', payment_method: 'bank_transfer', status: 'confirmed', reconciliation_status: 'matched' },
  { id: 'tx_011', created_at: '2024-04-30T10:00:00Z', counterparty_name: 'Sandro Alves de Amorim', origin_institution: 'Mercado Pago', destination_institution: 'Bradesco', amount: 7000, currency: 'BRL', base_currency: 'BRL', base_amount: 7000, type: 'income', direction: 'inbound', category: 'operational', payment_method: 'pix', status: 'confirmed', reconciliation_status: 'matched' },
  { id: 'tx_012', created_at: '2024-04-30T11:00:00Z', counterparty_name: 'Paulo Roberto Batista Ferreira', origin_institution: 'Mercado Pago', destination_institution: 'Itaú Unibanco', amount: 8000, currency: 'BRL', base_currency: 'BRL', base_amount: 8000, type: 'income', direction: 'inbound', category: 'membership', payment_method: 'pix', status: 'confirmed', reconciliation_status: 'matched' },
  { id: 'tx_013', created_at: '2024-05-29T10:00:00Z', counterparty_name: 'Paulo Roberto Batista Ferreira', origin_institution: 'Mercado Pago', destination_institution: 'Itaú Unibanco', amount: 8000, currency: 'BRL', base_currency: 'BRL', base_amount: 8000, type: 'income', direction: 'inbound', category: 'membership', payment_method: 'pix', status: 'confirmed', reconciliation_status: 'matched' },
  { id: 'tx_014', created_at: '2024-06-24T10:00:00Z', counterparty_name: 'Paulo Roberto Batista Ferreira', origin_institution: 'Mercado Pago', destination_institution: 'Itaú Unibanco', amount: 8000, currency: 'BRL', base_currency: 'BRL', base_amount: 8000, type: 'income', direction: 'inbound', category: 'membership', payment_method: 'pix', status: 'confirmed', reconciliation_status: 'matched' },
  { id: 'tx_015', created_at: '2024-07-28T10:00:00Z', counterparty_name: 'Paulo Roberto Batista Ferreira', origin_institution: 'Mercado Pago', destination_institution: 'Itaú Unibanco', amount: 8000, currency: 'BRL', base_currency: 'BRL', base_amount: 8000, type: 'income', direction: 'inbound', category: 'membership', payment_method: 'pix', status: 'confirmed', reconciliation_status: 'matched' },
  { id: 'tx_016', created_at: '2024-08-15T10:00:00Z', counterparty_name: 'Desconhecido', origin_institution: 'N/A', destination_institution: 'N/A', amount: 0, currency: 'BRL', base_currency: 'BRL', base_amount: 0, type: 'income', direction: 'inbound', category: 'other', payment_method: 'pix', status: 'failed', reconciliation_status: 'manual_review' },
  { id: 'tx_017', created_at: '2024-09-06T10:00:00Z', counterparty_name: 'Sandro Alves de Amorim', origin_institution: 'Itaú Unibanco', destination_institution: 'Bradesco', amount: 7000, currency: 'BRL', base_currency: 'BRL', base_amount: 7000, type: 'income', direction: 'inbound', category: 'operational', payment_method: 'bank_transfer', status: 'confirmed', reconciliation_status: 'matched' },
  { id: 'tx_018', created_at: '2024-09-06T11:00:00Z', counterparty_name: 'Paulo Roberto Batista Ferreira', origin_institution: 'Itaú Unibanco', destination_institution: 'Itaú Unibanco', amount: 8000, currency: 'BRL', base_currency: 'BRL', base_amount: 8000, type: 'income', direction: 'inbound', category: 'membership', payment_method: 'bank_transfer', status: 'confirmed', reconciliation_status: 'matched' },
  { id: 'tx_019', created_at: '2024-10-09T10:00:00Z', counterparty_name: 'Sandro Alves de Amorim', origin_institution: 'Itaú Unibanco', destination_institution: 'Bradesco', amount: 8000, currency: 'BRL', base_currency: 'BRL', base_amount: 8000, type: 'income', direction: 'inbound', category: 'operational', payment_method: 'bank_transfer', status: 'confirmed', reconciliation_status: 'matched' },
  { id: 'tx_020', created_at: '2024-11-09T10:00:00Z', counterparty_name: 'Paulo Roberto Batista Ferreira', origin_institution: 'Mercado Pago', destination_institution: 'Itaú Unibanco', amount: 8000, currency: 'BRL', base_currency: 'BRL', base_amount: 8000, type: 'income', direction: 'inbound', category: 'membership', payment_method: 'pix', status: 'confirmed', reconciliation_status: 'matched' },
  { id: 'tx_021', created_at: '2024-12-18T10:00:00Z', counterparty_name: 'Paulo Roberto Batista Ferreira', origin_institution: 'Mercado Pago', destination_institution: 'Itaú Unibanco', amount: 8000, currency: 'BRL', base_currency: 'BRL', base_amount: 8000, type: 'income', direction: 'inbound', category: 'membership', payment_method: 'pix', status: 'confirmed', reconciliation_status: 'matched' },
  { id: 'tx_022', created_at: '2025-01-21T10:00:00Z', counterparty_name: 'Paulo Roberto Batista Ferreira', origin_institution: 'Mercado Pago', destination_institution: 'Itaú Unibanco', amount: 8000, currency: 'BRL', base_currency: 'BRL', base_amount: 8000, type: 'income', direction: 'inbound', category: 'membership', payment_method: 'pix', status: 'confirmed', reconciliation_status: 'matched' },
  { id: 'tx_023', created_at: '2025-01-21T11:00:00Z', counterparty_name: 'Sandro Alves de Amorim', origin_institution: 'Mercado Pago', destination_institution: 'Bradesco', amount: 7000, currency: 'BRL', base_currency: 'BRL', base_amount: 7000, type: 'income', direction: 'inbound', category: 'operational', payment_method: 'pix', status: 'confirmed', reconciliation_status: 'matched' },
  { id: 'tx_024', created_at: '2025-02-10T10:00:00Z', counterparty_name: 'Paulo Roberto Batista Ferreira', origin_institution: 'Itaú Unibanco', destination_institution: 'Itaú Unibanco', amount: 8000, currency: 'BRL', base_currency: 'BRL', base_amount: 8000, type: 'income', direction: 'inbound', category: 'membership', payment_method: 'bank_transfer', status: 'confirmed', reconciliation_status: 'matched' },
  { id: 'tx_025', created_at: '2025-03-19T10:00:00Z', counterparty_name: 'Paulo Roberto Batista Ferreira', origin_institution: 'Mercado Pago', destination_institution: 'Itaú Unibanco', amount: 8000, currency: 'BRL', base_currency: 'BRL', base_amount: 8000, type: 'income', direction: 'inbound', category: 'membership', payment_method: 'pix', status: 'confirmed', reconciliation_status: 'matched' },
  { id: 'tx_026', created_at: '2025-04-22T10:00:00Z', counterparty_name: 'Sandro Alves de Amorim', origin_institution: 'Mercado Pago', destination_institution: 'Bradesco', amount: 4000, currency: 'BRL', base_currency: 'BRL', base_amount: 4000, type: 'income', direction: 'inbound', category: 'operational', payment_method: 'pix', status: 'confirmed', reconciliation_status: 'matched' },
  { id: 'tx_027', created_at: '2025-04-30T10:00:00Z', counterparty_name: 'Sandro Alves de Amorim', origin_institution: 'Mercado Pago', destination_institution: 'Bradesco', amount: 4000, currency: 'BRL', base_currency: 'BRL', base_amount: 4000, type: 'income', direction: 'inbound', category: 'operational', payment_method: 'pix', status: 'confirmed', reconciliation_status: 'matched' },
  { id: 'tx_028', created_at: '2025-05-17T10:00:00Z', counterparty_name: 'Paulo Roberto Batista Ferreira', origin_institution: 'Mercado Pago', destination_institution: 'Itaú Unibanco', amount: 7500, currency: 'BRL', base_currency: 'BRL', base_amount: 7500, type: 'income', direction: 'inbound', category: 'membership', payment_method: 'pix', status: 'confirmed', reconciliation_status: 'matched' },
  { id: 'tx_029', created_at: '2025-06-17T10:00:00Z', counterparty_name: 'Sandro Alves de Amorim', origin_institution: 'Itaú Unibanco', destination_institution: 'Banco Inter', amount: 3500, currency: 'BRL', base_currency: 'BRL', base_amount: 3500, type: 'income', direction: 'inbound', category: 'operational', payment_method: 'bank_transfer', status: 'confirmed', reconciliation_status: 'matched' },
  { id: 'tx_030', created_at: '2025-06-17T11:00:00Z', counterparty_name: 'Paulo Roberto Batista Ferreira', origin_institution: 'Mercado Pago', destination_institution: 'Itaú Unibanco', amount: 8000, currency: 'BRL', base_currency: 'BRL', base_amount: 8000, type: 'income', direction: 'inbound', category: 'membership', payment_method: 'pix', status: 'confirmed', reconciliation_status: 'matched' },
  { id: 'tx_031', created_at: '2025-07-26T10:00:00Z', counterparty_name: 'Sandro Alves de Amorim', origin_institution: 'Nu Pagamentos', destination_institution: 'Banco Inter', amount: 6670, currency: 'BRL', base_currency: 'BRL', base_amount: 6670, type: 'income', direction: 'inbound', category: 'operational', payment_method: 'pix', status: 'confirmed', reconciliation_status: 'matched' },
  { id: 'tx_032', created_at: '2025-08-02T10:00:00Z', counterparty_name: 'Paulo Roberto Batista Ferreira', origin_institution: 'Nu Pagamentos', destination_institution: 'Itaú Unibanco', amount: 6670, currency: 'BRL', base_currency: 'BRL', base_amount: 6670, type: 'income', direction: 'inbound', category: 'membership', payment_method: 'pix', status: 'confirmed', reconciliation_status: 'matched' },
  { id: 'tx_033', created_at: '2025-08-15T10:00:00Z', counterparty_name: 'Sandro Alves de Amorim', origin_institution: 'Itaú Unibanco', destination_institution: 'Banco Inter', amount: 6670, currency: 'BRL', base_currency: 'BRL', base_amount: 6670, type: 'income', direction: 'inbound', category: 'operational', payment_method: 'bank_transfer', status: 'confirmed', reconciliation_status: 'matched' },
  { id: 'tx_034', created_at: '2025-09-15T10:00:00Z', counterparty_name: 'Desconhecido', origin_institution: 'N/A', destination_institution: 'N/A', amount: 0, currency: 'BRL', base_currency: 'BRL', base_amount: 0, type: 'income', direction: 'inbound', category: 'other', payment_method: 'pix', status: 'failed', reconciliation_status: 'manual_review' },
  { id: 'tx_035', created_at: '2025-10-13T10:00:00Z', counterparty_name: 'Paulo Roberto Batista Ferreira', origin_institution: 'Itaú Unibanco', destination_institution: 'Santander', amount: 10000, currency: 'BRL', base_currency: 'BRL', base_amount: 10000, type: 'income', direction: 'inbound', category: 'membership', payment_method: 'bank_transfer', status: 'confirmed', reconciliation_status: 'matched' },
  { id: 'tx_036', created_at: '2025-11-17T10:00:00Z', counterparty_name: 'ASPPIBRA', origin_institution: 'Mercado Pago', destination_institution: 'Cora SCFI', amount: 10500, currency: 'BRL', base_currency: 'BRL', base_amount: 10500, type: 'income', direction: 'inbound', category: 'operational', payment_method: 'pix', status: 'confirmed', reconciliation_status: 'matched' },
  { id: 'tx_037', created_at: '2025-12-05T10:00:00Z', counterparty_name: 'ASPPIBRA', origin_institution: 'Nu Pagamentos', destination_institution: 'Cora SCFI', amount: 5500, currency: 'BRL', base_currency: 'BRL', base_amount: 5500, type: 'income', direction: 'inbound', category: 'operational', payment_method: 'pix', status: 'confirmed', reconciliation_status: 'matched' },
  { id: 'tx_038', created_at: '2026-01-15T10:00:00Z', counterparty_name: 'Desconhecido', origin_institution: 'N/A', destination_institution: 'N/A', amount: 0, currency: 'BRL', base_currency: 'BRL', base_amount: 0, type: 'income', direction: 'inbound', category: 'other', payment_method: 'pix', status: 'failed', reconciliation_status: 'manual_review' },
  { id: 'tx_039', created_at: '2026-02-09T10:00:00Z', counterparty_name: 'ASPPIBRA', origin_institution: 'Nu Pagamentos', destination_institution: 'Cora SCFI', amount: 8000, currency: 'BRL', base_currency: 'BRL', base_amount: 8000, type: 'income', direction: 'inbound', category: 'operational', payment_method: 'pix', status: 'confirmed', reconciliation_status: 'matched' },
  { id: 'tx_040', created_at: '2026-02-09T11:00:00Z', counterparty_name: 'Paulo Roberto Batista Ferreira', origin_institution: 'Nu Pagamentos', destination_institution: 'Santander', amount: 7000, currency: 'BRL', base_currency: 'BRL', base_amount: 7000, type: 'income', direction: 'inbound', category: 'membership', payment_method: 'pix', status: 'confirmed', reconciliation_status: 'matched' },
  { id: 'tx_041', created_at: '2026-03-08T10:00:00Z', counterparty_name: 'ASPPIBRA', origin_institution: 'Nu Pagamentos', destination_institution: 'Cora SCFI', amount: 2500, currency: 'BRL', base_currency: 'BRL', base_amount: 2500, type: 'income', direction: 'inbound', category: 'operational', payment_method: 'pix', status: 'confirmed', reconciliation_status: 'matched' },
  { id: 'tx_042', created_at: '2026-03-10T10:00:00Z', counterparty_name: 'ASPPIBRA', origin_institution: 'Itaú Unibanco', destination_institution: 'Cora SCFI', amount: 2500, currency: 'BRL', base_currency: 'BRL', base_amount: 2500, type: 'income', direction: 'inbound', category: 'operational', payment_method: 'bank_transfer', status: 'confirmed', reconciliation_status: 'matched' },
  { id: 'tx_043', created_at: '2026-03-15T10:00:00Z', counterparty_name: 'ASPPIBRA', origin_institution: 'Banco Inter', destination_institution: 'Cora SCFI', amount: 2500, currency: 'BRL', base_currency: 'BRL', base_amount: 2500, type: 'income', direction: 'inbound', category: 'operational', payment_method: 'bank_transfer', status: 'confirmed', reconciliation_status: 'matched' },
  { id: 'tx_044', created_at: '2026-03-27T10:00:00Z', counterparty_name: 'Paulo Roberto Batista Ferreira', origin_institution: 'Banco Inter', destination_institution: 'Santander', amount: 6720, currency: 'BRL', base_currency: 'BRL', base_amount: 6720, type: 'income', direction: 'inbound', category: 'membership', payment_method: 'bank_transfer', status: 'confirmed', reconciliation_status: 'matched' },
  { id: 'tx_045', created_at: '2026-04-15T10:00:00Z', counterparty_name: 'Desconhecido', origin_institution: 'N/A', destination_institution: 'N/A', amount: 0, currency: 'BRL', base_currency: 'BRL', base_amount: 0, type: 'income', direction: 'inbound', category: 'other', payment_method: 'pix', status: 'failed', reconciliation_status: 'manual_review' },
];

app.get('/', (c) => c.json({ module: 'Treasury Analytics & Ledger API', status: 'active', client: CLIENT_ACCOUNT_PROFILE }));

app.get('/analytics', async (c) => {
  const year = c.req.query('year');

  let filteredTx = CONSOLIDATED_REPORT_TRANSACTIONS;

  if (year && year !== 'Todos') {
    filteredTx = CONSOLIDATED_REPORT_TRANSACTIONS.filter((tx) =>
      tx.created_at.startsWith(year)
    );
  }

  // Métricas Consolidadas
  const confirmedTx = filteredTx.filter((tx) => tx.status === 'confirmed');
  const totalInflow = CLIENT_ACCOUNT_PROFILE.total_paid; // R$ 35.823,00 (3582300 em centavos)
  const count = confirmedTx.length;
  const avgTicket = count > 0 ? Math.round(totalInflow / count) : 0;

  // Favorecido Principal
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

  // Evolução Mensal por ano ou período
  const monthlyMap: Record<string, number> = {};
  confirmedTx.forEach((tx) => {
    const monthKey = tx.created_at.substring(0, 7); // YYYY-MM
    monthlyMap[monthKey] = (monthlyMap[monthKey] || 0) + tx.amount;
  });
  const monthlyTrend = Object.entries(monthlyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, total]) => ({ month, total }));

  // Distribuição por Categoria
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
      profile: CLIENT_ACCOUNT_PROFILE,
      summary: {
        totalInflow,
        avgTicket,
        count,
        topRecipient,
        contractTotal: CLIENT_ACCOUNT_PROFILE.contract_total,
        outstandingBalance: CLIENT_ACCOUNT_PROFILE.outstanding_balance,
      },
      monthlyTrend,
      distribution,
      availableYears,
      transactions: normalizedTx,
    },
  });
});

app.get('/citizen/:citizenId/ledger', async (c) => {
  const citizenId = c.req.param('citizenId');
  return c.json({
    success: true,
    data: {
      citizenId,
      profile: CLIENT_ACCOUNT_PROFILE,
      ledger: CONSOLIDATED_REPORT_TRANSACTIONS,
    },
  });
});

export default app;
