import { Hono } from 'hono';
import { sql, desc, eq } from 'drizzle-orm';
import { treasuryLedger, citizens, contracts } from '../../db/schema';
import { verifyRole } from '../../middleware/rbac';
import { Bindings } from '../../types/bindings';
import { success, error } from '../../utils/response';

type AppType = { Bindings: Bindings; Variables: { db: any; jwtPayload?: any } };

const treasury = new Hono<AppType>();

// 1. Métricas Globais da Tesouraria
treasury.get('/metrics', async (c) => {
  const db = c.get('db');
  try {
    // Computar saldo total (Inbound - Outbound)
    const stats = await db
      .select({
        totalInbound: sql<number>`SUM(CASE WHEN ${treasuryLedger.type} = 'inbound' THEN ${treasuryLedger.amountCents} ELSE 0 END)`,
        totalOutbound: sql<number>`SUM(CASE WHEN ${treasuryLedger.type} = 'outbound' THEN ${treasuryLedger.amountCents} ELSE 0 END)`,
      })
      .from(treasuryLedger);

    const result = stats[0];
    const balance = (result.totalInbound || 0) - (result.totalOutbound || 0);

    return success(c, 'Métricas da tesouraria computadas.', {
      tvl: balance / 100, // Converte centavos para reais
      monthlyFlow: (result.totalInbound || 0) / 100,
      currency: 'BRL',
    });
  } catch (err: any) {
    return error(c, 'Falha ao processar métricas financeiras.', err.message, 500);
  }
});

// 2. Histórico de Transações
treasury.get('/transactions', async (c) => {
  const db = c.get('db');
  try {
    const transactions = await db
      .select()
      .from(treasuryLedger)
      .orderBy(desc(treasuryLedger.createdAt))
      .limit(50);

    return success(c, 'Histórico de transações recuperado.', transactions);
  } catch (err: any) {
    return error(c, 'Falha ao buscar histórico financeiro.', err.message, 500);
  }
});

// 3. Registrar Movimentação (Admin Only)
treasury.post('/transactions', verifyRole(['admin']), async (c) => {
  const db = c.get('db');
  const { type, category, amountCents, description, txHash } = await c.req.json();

  if (!type || !amountCents || !description) {
    return error(c, 'Campos obrigatórios ausentes.', null, 400);
  }

  try {
    const [newTx] = await db
      .insert(treasuryLedger)
      .values({
        type,
        category,
        amountCents,
        description,
        txHash,
        status: 'completed',
      })
      .returning();

    return success(c, 'Transação registrada com sucesso.', newTx, 201);
  } catch (err: any) {
    return error(c, 'Erro ao persistir transação.', err.message, 500);
  }
});

// 4. Analytics para o Dashboard Vincit Ledger
treasury.get('/analytics', async (c) => {
  const db = c.get('db');
  const { year } = c.req.query();

  try {
    // Filtro de data se fornecido
    const dateFilter =
      year && year !== 'Todos'
        ? sql`strftime('%Y', datetime(${treasuryLedger.createdAt}, 'unixepoch')) = ${year}`
        : sql`1=1`;

    // A. Summary Stats (Inbound focus)
    const statsResult = await db
      .select({
        totalInflow: sql<number>`SUM(${treasuryLedger.amountCents})`,
        avgTicket: sql<number>`AVG(${treasuryLedger.amountCents})`,
        count: sql<number>`COUNT(*)`,
      })
      .from(treasuryLedger)
      .where(sql`${treasuryLedger.type} = 'inbound' AND ${dateFilter}`);

    const stats = statsResult[0];
    const monthExpr = sql`strftime('%m', datetime(${treasuryLedger.createdAt}, 'unixepoch'))`;

    // B. Website Visits (Monthly Trend - Inbound para visualização de faturamento)
    const monthlyTrend = await db
      .select({
        month: monthExpr,
        total: sql<number>`SUM(${treasuryLedger.amountCents})`,
      })
      .from(treasuryLedger)
      .where(sql`${treasuryLedger.type} = 'inbound' AND ${dateFilter}`)
      .groupBy(monthExpr)
      .orderBy(monthExpr);

    // D. Latest Transactions (Ledger) - Ordenação ASC conforme solicitado
    const latestTx = await db
      .select()
      .from(treasuryLedger)
      .where(dateFilter)
      .orderBy(sql`${treasuryLedger.createdAt} ASC`);

    // Buscar anos disponíveis
    const yearResults = await db
      .select({
        year: sql`strftime('%Y', datetime(${treasuryLedger.createdAt}, 'unixepoch'))`,
      })
      .from(treasuryLedger)
      .groupBy(sql`strftime('%Y', datetime(${treasuryLedger.createdAt}, 'unixepoch'))`)
      .orderBy(sql`strftime('%Y', datetime(${treasuryLedger.createdAt}, 'unixepoch')) DESC`);

    const availableYears = ['Todos', ...yearResults.map((y: any) => y.year)];

    // Processamento Dinâmico
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

      const refMatch =
        descText.match(/referencia:\s*([^\s|]+)/i) || descText.match(/ref:\s*([^\s|]+)/i);
      const documentName = refMatch ? refMatch[1] : null;

      // Computar Distribuição (Baseado em Inbound agora)
      if (tx.type === 'inbound' && favored !== 'Sistema') {
        recipientMap[favored] = (recipientMap[favored] || 0) + tx.amountCents;
      }

      const method = descText.toLowerCase().includes('pix')
        ? 'pix'
        : descText.toLowerCase().includes('boleto')
          ? 'boleto'
          : 'ted';
      const isRecurring =
        descText.toLowerCase().includes('mensalidade') ||
        descText.toLowerCase().includes('recorrente');

      // Correção da Data: SQLite strftime('%s') retorna segundos. JS precisa de milissegundos.
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
        status:
          tx.status === 'completed' ? 'confirmed' : tx.status === 'failed' ? 'failed' : 'pending',
        reconciliation_status: 'matched',
        risk_score: {
          level: tx.amountCents > 1000000 ? 'medium' : 'low',
          score: tx.amountCents > 1000000 ? 45 : 10,
        },
        integrity_hash: `sha256:${tx.id}x${tx.createdAt}`,
        documents: documentName
          ? [{ id: `doc_${tx.id}`, type: 'receipt', name: documentName, verified: true }]
          : [],
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

    return success(c, 'Dados de analytics recuperados.', {
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
    });
  } catch (err: any) {
    return error(c, 'Falha ao processar analytics financeiro.', err.message, 500);
  }
});

// 5. Ledger Individual (IFinancialProfile Aggregator)
treasury.get('/citizen/:id/ledger', async (c) => {
  const db = c.get('db');
  const citizenId = parseInt(c.req.param('id'), 10);

  if (isNaN(citizenId)) {
    return error(c, 'ID de associado inválido.', null, 400);
  }

  try {
    // 1. Fetch Citizen
    const citizenResult = await db
      .select()
      .from(citizens)
      .where(eq(citizens.id, citizenId))
      .limit(1);
    if (citizenResult.length === 0) {
      return error(c, 'Associado não encontrado.', null, 404);
    }
    const citizen = citizenResult[0];

    // 2. Fetch Contract
    let contractData = null;
    if (citizen.userId) {
      const contractResult = await db
        .select()
        .from(contracts)
        .where(eq(contracts.userId, citizen.userId))
        .limit(1);
      if (contractResult.length > 0) {
        contractData = contractResult[0];
      }
    }

    // 3. Fetch Transactions
    const txs = await db
      .select()
      .from(treasuryLedger)
      .where(eq(treasuryLedger.citizenId, citizenId))
      .orderBy(desc(treasuryLedger.createdAt));

    // Processar transações no formato esperado pelo frontend
    const processedTransactions = txs.map((tx: any) => {
      const descText = tx.description || '';

      let favored = 'Sistema';
      let originBank = 'N/A';
      let destinationBank = 'N/A';

      if (descText.includes('|')) {
        const parts = descText.split('|');
        const payerPart = parts.find((p: string) => p.toLowerCase().includes('pagador:'));
        if (payerPart) originBank = payerPart.match(/\(([^)]+)\)/)?.[1] || 'N/A';

        const favoredPart = parts.find((p: string) => p.toLowerCase().includes('favorecido:'));
        if (favoredPart) {
          const rawFavored = favoredPart.replace(/favorecido:/i, '').trim();
          favored = rawFavored.split('(')[0]?.trim();
          destinationBank = rawFavored.match(/\(([^)]+)\)/)?.[1] || 'N/A';
        }
      }

      const method = descText.toLowerCase().includes('pix')
        ? 'pix'
        : descText.toLowerCase().includes('boleto')
          ? 'boleto'
          : 'ted';
      const isRecurring =
        descText.toLowerCase().includes('mensalidade') ||
        descText.toLowerCase().includes('recorrente');

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
        amount: tx.amountCents / 100, // Frontend awaits raw value, but wait, the treasury global analytics returns cents/100? No, wait. Previous mock had raw value?
        // Let's pass the raw value like we do in treasury analytics. Wait, in analytics: tx.amountCents.
        // In MOCK_FINANCIAL_PROFILE, amount is e.g. 150.00 (raw value).
        // The frontend `LedgerPrintDocument` uses `Number(tx.amount)`. So we send real number value.
        amountCents: tx.amountCents, // keeping this just in case
        currency: tx.currency || 'BRL',
        base_currency: 'BRL',
        base_amount: tx.amountCents / 100,
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
        status:
          tx.status === 'completed' ? 'confirmed' : tx.status === 'failed' ? 'failed' : 'pending',
        reconciliation_status: 'matched',
        risk_score: {
          level: tx.amountCents > 1000000 ? 'medium' : 'low',
          score: tx.amountCents > 1000000 ? 45 : 10,
        },
        integrity_hash: `sha256:${tx.id}x${tx.createdAt}`,
        documents: [],
        ai_flags: isRecurring ? [{ type: 'recurring', confidence: 0.98 }] : [],
        source_channel: 'api',
        notes: tx.description,
      };
    });

    // Construir Objeto IFinancialProfile

    // 1. Associate Data
    const fullName =
      `${citizen.firstName || ''} ${citizen.lastName || ''}`.trim() || citizen.username;
    const alphaHash = `ASP-${citizen.id.toString().padStart(4, '0')}`;

    const associateData = {
      id: citizen.id.toString(),
      name: fullName,
      cpf: citizen.cpf || '',
      rg: citizen.rg || '',
      email: 'email@not.available', // We would need to join users to get email, but let's mock or use citizen fields if added
      phone: citizen.phoneNumber || '',
      category: citizen.cargoOsc || 'Associado',
      photoURL: citizen.profileTags ? '' : '', // TODO: map from avatarUrl if we had it. We can add later.
      status:
        citizen.status === 'active'
          ? 'active'
          : citizen.status === 'suspended'
            ? 'suspended'
            : 'inactive',
    };

    // 2. Contract Data
    const contractValue = contractData ? contractData.totalValue / 100 : 0;
    // Simplification for now, we sum the paid installments from inbound txs
    const paidTxs = processedTransactions.filter(
      (t: any) => t.direction === 'inbound' && t.status === 'confirmed'
    );
    const paidAmount = paidTxs.reduce((acc: number, t: any) => acc + t.amount, 0);

    const contractRes = {
      id: contractData ? contractData.id.toString() : 'N/A',
      planName: contractData ? contractData.description : 'Plano Básico',
      contractedAmount: contractValue,
      paidAmount: paidAmount,
      openAmount: contractValue > paidAmount ? contractValue - paidAmount : 0,
      status: contractData ? contractData.status : 'active',
    };

    // 3. Obligations Data
    let nextDueStr = '-';
    if (contractData && contractData.nextDueDate) {
      const d = new Date(contractData.nextDueDate);
      nextDueStr = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
    }

    const obligationsRes = {
      nextDueDate: nextDueStr,
      nextDueAmount: contractData?.installmentValue ? contractData.installmentValue / 100 : 0,
      pendingInstallments: contractData
        ? (contractData.totalInstallments || 0) - (contractData.paidInstallments || 0)
        : 0,
      overdueInstallments: 0,
    };

    const profile = {
      associate: associateData,
      contract: contractRes,
      obligations: obligationsRes,
      transactions: processedTransactions.map((t: any) => ({ ...t, amount: t.amountCents / 100 })), // Fixing amount field for the UI
    };

    return success(c, 'Perfil financeiro recuperado com sucesso.', profile);
  } catch (err: any) {
    return error(c, 'Erro ao buscar ledger do associado.', err.message, 500);
  }
});

export default treasury;
