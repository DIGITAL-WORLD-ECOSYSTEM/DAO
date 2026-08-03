import { Hono } from 'hono';
import { GetCitizenProfileUseCase } from '../../../domains/citizens/usecases/GetCitizenProfileUseCase';
import { UpdateCitizenProfileUseCase } from '../../../domains/citizens/usecases/UpdateCitizenProfileUseCase';
import { CitizenController } from '../../../domains/citizens/controllers/CitizenController';
import { DrizzleUnitOfWork } from '../../../infrastructure/repositories/DrizzleUnitOfWork';

const citizens = new Hono<{ Bindings: any }>();

citizens.get('/profile/:accountId', async (c) => {
  try {
    const db = c.get('db' as any);
    const uow = new DrizzleUnitOfWork(db);
    const getProfileUseCase = new GetCitizenProfileUseCase(uow);
    const updateProfileUseCase = new UpdateCitizenProfileUseCase(uow);
    const controller = new CitizenController(getProfileUseCase, updateProfileUseCase);

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
    const db = c.get('db' as any);
    const uow = new DrizzleUnitOfWork(db);
    const getProfileUseCase = new GetCitizenProfileUseCase(uow);
    const updateProfileUseCase = new UpdateCitizenProfileUseCase(uow);
    const controller = new CitizenController(getProfileUseCase, updateProfileUseCase);

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

export default citizens;
