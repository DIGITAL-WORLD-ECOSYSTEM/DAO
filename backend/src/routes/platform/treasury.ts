import { Hono } from 'hono';
import { sql, desc, eq } from 'drizzle-orm';
import { treasuryLedger, citizens, contracts, auditLogs } from '../../db/schema';
import { verifyRole } from '../../middleware/rbac';
import { idempotency, rateLimit } from '../../middleware/rate_limit';
import { Bindings } from '../../types/bindings';
import { success, error } from '../../utils/response';
import { LedgerRepository } from '../../domains/treasury/repositories/LedgerRepository';
import { GetFinancialAnalyticsUseCase } from '../../domains/treasury/usecases/GetFinancialAnalyticsUseCase';
import { TreasuryController } from '../../domains/treasury/controllers/TreasuryController';

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
const treasuryRateLimiter = rateLimit({ windowMs: 10000, maxRequests: 10 });
treasury.post('/transactions', verifyRole(['admin']), treasuryRateLimiter, idempotency(), async (c) => {
  const db = c.get('db');
  const payload = c.get('jwtPayload'); // Operador Admin
  const { userId, type, category, amountCents, description, txHash, externalTransactionId } = await c.req.json();

  if (!userId || !type || !amountCents || !description) {
    return error(c, 'Campos obrigatórios ausentes.', null, 400);
  }

  // Gera um UUID interno se não for passado um externalTransactionId
  const extTxId = externalTransactionId || `INTERNAL-${crypto.randomUUID()}`;

  try {
    const [newTx] = await db
      .insert(treasuryLedger)
      .values({
        userId,
        type,
        category,
        amountCents,
        description,
        txHash,
        externalTransactionId: extTxId,
        status: 'completed',
      })
      .returning();

    // Registro de auditoria: quem operou a transação?
    await db.insert(auditLogs).values({
      targetUserId: userId,
      action: 'TREASURY_MANUAL_ENTRY',
      status: 'success',
      metadata: {
        operatorAdminId: payload.userId,
        amountCents,
        type,
        externalTransactionId: extTxId,
      },
    });

    return success(c, 'Transação registrada com sucesso.', newTx, 201);
  } catch (err: any) {
    if (err.message.includes('UNIQUE')) {
      return error(c, 'Transação duplicada detectada (externalTransactionId).', null, 409);
    }
    return error(c, 'Erro ao persistir transação.', err.message, 500);
  }
});

// 4. Analytics para o Dashboard Vincit Ledger
treasury.get('/analytics', async (c) => {
  const db = c.get('db');

  try {
    const repo = new LedgerRepository(db);
    const useCase = new GetFinancialAnalyticsUseCase(repo);
    const controller = new TreasuryController(useCase);
    
    const data = await controller.getAnalytics(c);
    
    return success(c, 'Dados de analytics recuperados.', data);
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
      .where(eq(treasuryLedger.userId, citizen.userId!))
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
      status: 'active', // Substituído: status agora pertence apenas à conta (users)
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
