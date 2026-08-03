import { ITreasuryRepository } from '../../../application/ports/output/ITreasuryRepository';

export class GetFinancialAnalyticsUseCase {
  constructor(private repo: ITreasuryRepository) {}

  async execute(year?: string) {
    const statsResult = await this.repo.getSummaryStats(year);
    const monthlyTrendResult = await this.repo.getMonthlyTrend(year);
    const latestTxResult = await this.repo.getLatestTransactions(year);
    const yearResultsResult = await this.repo.getAvailableYears();

    if (statsResult.isFailure || monthlyTrendResult.isFailure || latestTxResult.isFailure || yearResultsResult.isFailure) {
      return { success: false, message: 'Falha ao recuperar dados da tesouraria', status: 500 };
    }

    const stats = statsResult.getValue();
    const monthlyTrend = monthlyTrendResult.getValue();
    const latestTx = latestTxResult.getValue();
    const yearResults = yearResultsResult.getValue();

    const availableYears = ['Todos', ...yearResults.map((y: any) => y.year)];

    const recipientMap: Record<string, number> = {};
    const processedTransactions = latestTx.map((tx: any) => {
      const descText = tx.description || '';
      let favored = 'Sistema';
      let originBank = 'N/A';
      let destinationBank = 'N/A';

      if (descText.includes('|')) {
        const parts = descText.split('|');
        const payerPart = parts.find((p: string) => p.toLowerCase().includes('pagador:'));
        if (payerPart) {
          originBank = payerPart.match(/\(([^)]+)\)/)?.[1] || 'N/A';
        }
        const favoredPart = parts.find((p: string) => p.toLowerCase().includes('favorecido:'));
        if (favoredPart) {
          const rawFavored = favoredPart.replace(/favorecido:/i, '').trim();
          favored = rawFavored.split('(')[0]?.trim();
          destinationBank = rawFavored.match(/\(([^)]+)\)/)?.[1] || 'N/A';
        }
      }

      const refMatch = descText.match(/referencia:\s*([^\s|]+)/i) || descText.match(/ref:\s*([^\s|]+)/i);
      const documentName = refMatch ? refMatch[1] : null;

      if (tx.type === 'inbound' && favored !== 'Sistema') {
        recipientMap[favored] = (recipientMap[favored] || 0) + tx.amountCents;
      }

      const method = descText.toLowerCase().includes('pix') ? 'pix' : descText.toLowerCase().includes('boleto') ? 'boleto' : 'ted';
      const isRecurring = descText.toLowerCase().includes('mensalidade') || descText.toLowerCase().includes('recorrente');

      const rawDate = tx.createdAt;
      let dateObj: Date;
      if (typeof rawDate === 'number') {
        const timestamp = rawDate < 100000000000 ? rawDate * 1000 : rawDate;
        dateObj = new Date(timestamp);
      } else {
        dateObj = new Date(rawDate);
      }

      return {
        id: tx.id.toString(),
        tenant_id: 'asppibra',
        version: 1,
        created_at: dateObj.toISOString(),
        updated_at: dateObj.toISOString(),
        processed_at: tx.status === 'completed' ? dateObj.toISOString() : null,
        amount: tx.amountCents,
        currency: tx.currency || 'BRL',
        base_currency: 'BRL',
        base_amount: tx.amountCents,
        exchange_rate: 1,
        type: tx.type === 'inbound' ? 'income' : 'expense',
        direction: tx.type as 'inbound' | 'outbound',
        category: tx.category || 'other',
        tags: isRecurring ? ['recorrente', method] : [method],
        payer_id: tx.type === 'inbound' ? 'external' : 'asppibra',
        recipient_id: tx.type === 'outbound' ? 'external' : 'asppibra',
        counterparty_name: favored,
        origin_institution: originBank,
        destination_institution: destinationBank,
        payment_method: method,
        external_reference: tx.txHash,
        status: tx.status === 'completed' ? 'confirmed' : tx.status === 'failed' ? 'failed' : 'pending',
        reconciliation_status: 'matched',
        risk_score: {
          level: tx.amountCents > 1000000 ? 'medium' : 'low',
          score: tx.amountCents > 1000000 ? 45 : 10,
        },
        integrity_hash: `sha256:${tx.id}x${tx.createdAt}`,
        documents: documentName ? [{ id: `doc_${tx.id}`, type: 'receipt', name: documentName, verified: true }] : [],
        ai_flags: isRecurring ? [{ type: 'recurring', confidence: 0.98 }] : [],
        source_channel: 'ocr_import',
        notes: tx.description,
      };
    });

    const totalValue = Object.values(recipientMap).reduce((a, b) => a + b, 0);
    const distribution = Object.entries(recipientMap)
      .map(([label, value]) => ({
        label,
        value: totalValue > 0 ? Number(((value / totalValue) * 100).toFixed(1)) : 0,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 4);

    const topRecipient = distribution.length > 0 ? distribution[0].label : 'N/A';

    return {
      success: true,
      data: {
        summary: {
          totalInflow: (stats.totalInflow || 0) / 100,
          avgTicket: (stats.avgTicket || 0) / 100,
          count: stats.count || 0,
          topRecipient,
        },
        monthlyTrend: monthlyTrend.map((m: any) => ({
          month: m.month,
          total: m.total / 100,
        })),
        distribution,
        availableYears,
        transactions: processedTransactions,
      }
    };
  }
}
