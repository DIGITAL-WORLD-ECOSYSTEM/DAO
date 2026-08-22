import { Hono } from 'hono';
import { TreasuryController } from '../../controllers/finance/treasury.controller';
import { setupTreasuryDI } from '../../../../infrastructure/di/treasury_container';

const treasuryRouter = new Hono();

// Middleware de Injeção DI para o contexto da Tesouraria
treasuryRouter.use('*', async (c, next) => {
  const container = await setupTreasuryDI(c);
  c.set('treasury_container' as any, container);
  await next();
});

treasuryRouter.get('/', TreasuryController.getRootInfo);
treasuryRouter.get('/analytics', TreasuryController.getTreasuryAnalytics);
treasuryRouter.get('/citizen/:citizenId/ledger', TreasuryController.getCitizenLedger);
treasuryRouter.get('/financial-history', TreasuryController.getTreasuryAnalytics);

export { treasuryRouter };
