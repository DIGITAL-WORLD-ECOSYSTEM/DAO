import { Hono } from 'hono';
import { setupCitizensDI } from '../../../infrastructure/di/citizens_container';

const citizens = new Hono<{ Bindings: any }>();

citizens.get('/profile/:accountId', async (c) => {
  try {
    const { controller } = await setupCitizensDI(c);

    const req = { 
      body: {}, 
      query: {}, 
      params: { accountId: c.req.param('accountId') }, 
      headers: {} 
    };
    
    const httpResponse = await controller.getProfile(req);
    
    return c.json(httpResponse.body, httpResponse.status as any);
  } catch (err: any) {
    return c.json({ success: false, message: 'Erro interno', details: err.message }, 500);
  }
});

citizens.post('/profile/:accountId', async (c) => {
  try {
    const { controller } = await setupCitizensDI(c);

    const body = await c.req.json();
    const req = { 
      body, 
      query: {}, 
      params: { accountId: c.req.param('accountId') }, 
      headers: {} 
    };
    
    const httpResponse = await controller.updateProfile(req);
    
    return c.json(httpResponse.body, httpResponse.status as any);
  } catch (err: any) {
    return c.json({ success: false, message: 'Erro interno', details: err.message }, 500);
  }
});

citizens.post('/:accountId/verify', async (c) => {
  try {
    const { controller } = await setupCitizensDI(c);

    const req = { 
      body: {}, 
      query: {}, 
      params: { accountId: c.req.param('accountId') }, 
      headers: {} 
    };
    
    const httpResponse = await controller.verify(req);
    return c.json(httpResponse.body, httpResponse.status as any);
  } catch (err: any) {
    return c.json({ success: false, message: 'Erro interno', details: err.message }, 500);
  }
});

citizens.post('/:accountId/suspend', async (c) => {
  try {
    const { controller } = await setupCitizensDI(c);

    const body = await c.req.json();
    const req = { 
      body, 
      query: {}, 
      params: { accountId: c.req.param('accountId') }, 
      headers: {} 
    };
    
    const httpResponse = await controller.suspend(req);
    return c.json(httpResponse.body, httpResponse.status as any);
  } catch (err: any) {
    return c.json({ success: false, message: 'Erro interno', details: err.message }, 500);
  }
});

export default citizens;
