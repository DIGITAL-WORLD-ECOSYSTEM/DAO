import { Hono } from 'hono';
import { setupNotificationsDI } from '../../../../infrastructure/di/notifications_container';
import { verifyRole } from '../../../../middleware/rbac';
import { rateLimit } from '../../../../middleware/rate_limit';

const notificationsRouter = new Hono();

// Global middleware to ensure user is logged in for these routes
notificationsRouter.use('*', verifyRole(['citizen', 'partner', 'admin', 'user']));

const apiRateLimit = rateLimit({ windowMs: 60000, maxRequests: 100 });
notificationsRouter.use('*', apiRateLimit);

notificationsRouter.get('/', async (c) => {
  try {
    const { controller } = await setupNotificationsDI(c);
    const req = {
      query: c.req.query(),
      user: c.get('jwtPayload' as any),
    };
    
    const httpResponse = await controller.list(req);
    return c.json(httpResponse.body, httpResponse.status as any);
  } catch (err: any) {
    return c.json({ success: false, message: 'Erro interno', details: err.message }, 500);
  }
});

notificationsRouter.get('/unread-count', async (c) => {
  try {
    const { controller } = await setupNotificationsDI(c);
    const req = {
      user: c.get('jwtPayload' as any),
    };
    
    const httpResponse = await controller.countUnread(req);
    return c.json(httpResponse.body, httpResponse.status as any);
  } catch (err: any) {
    return c.json({ success: false, message: 'Erro interno', details: err.message }, 500);
  }
});

notificationsRouter.put('/:id/read', async (c) => {
  try {
    const { controller } = await setupNotificationsDI(c);
    const req = {
      params: { id: c.req.param('id') },
      user: c.get('jwtPayload' as any),
    };
    
    const httpResponse = await controller.markAsRead(req);
    return c.json(httpResponse.body, httpResponse.status as any);
  } catch (err: any) {
    return c.json({ success: false, message: 'Erro interno', details: err.message }, 500);
  }
});

notificationsRouter.put('/read-all', async (c) => {
  try {
    const { controller } = await setupNotificationsDI(c);
    const req = {
      user: c.get('jwtPayload' as any),
    };
    
    const httpResponse = await controller.markAllAsRead(req);
    return c.json(httpResponse.body, httpResponse.status as any);
  } catch (err: any) {
    return c.json({ success: false, message: 'Erro interno', details: err.message }, 500);
  }
});

export { notificationsRouter };
export default notificationsRouter;
