import { Hono } from 'hono';
import { TreasuryController } from '../../controllers/finance/treasury.controller';

const treasuryRouter = new Hono();

treasuryRouter.get('/analytics', TreasuryController.getTreasuryAnalytics);
treasuryRouter.get('/citizen/:citizenId/ledger', TreasuryController.getCitizenLedger);
treasuryRouter.get('/financial-history', TreasuryController.getTreasuryAnalytics);

export { treasuryRouter };
