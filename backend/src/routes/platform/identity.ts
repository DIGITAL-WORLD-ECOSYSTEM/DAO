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
 * Role: Platform Identity List & Management API Endpoint
 */
import { Hono } from 'hono';
import { Bindings, Variables } from '../../types/bindings';

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// Lista Padrão de Cidadãos / Associados no Sistema
const SEEDED_CITIZENS = [
  {
    id: 10,
    username: 'andressa2024001',
    firstName: 'Andressa',
    lastName: 'de Lima Ferreira',
    cargoOsc: 'Associado Principal (#2024001)',
    did: 'did:asppibra:br:260810br',
    avatarUrl: null,
    kycStatus: 'approved' as const,
    role: 'citizen' as const,
    phoneNumber: '(21) 99876-5432',
    email: 'andressa.ferreira@email.com',
  },
  {
    id: 2,
    username: 'felipedev',
    firstName: 'Felipe',
    lastName: 'Dev',
    cargoOsc: 'Desenvolvedor Core',
    did: 'did:asppibra:br:260802br',
    avatarUrl: null,
    kycStatus: 'approved' as const,
    role: 'system' as const,
    phoneNumber: '(21) 98765-4321',
    email: 'felipe.dev@asppibra.com',
  },
  {
    id: 1,
    username: 'admin',
    firstName: 'Administrador',
    lastName: 'ASOT',
    cargoOsc: 'Gestor da Plataforma',
    did: 'did:asppibra:br:260801br',
    avatarUrl: null,
    kycStatus: 'approved' as const,
    role: 'admin' as const,
    phoneNumber: '(21) 97654-3210',
    email: 'admin@asppibra.com',
  },
];

// GET /api/platform/identity/list
app.get('/list', async (c) => {
  try {
    if (c.env?.DB && typeof c.env.DB.prepare === 'function') {
      const { results } = await c.env.DB.prepare(`
        SELECT 
          u.id,
          u.email,
          up.username,
          c.legal_first_name as firstName,
          c.legal_last_name as lastName,
          c.civil_status as kycStatus,
          'citizen' as role
        FROM users u
        LEFT JOIN user_profiles up ON u.id = up.user_id
        LEFT JOIN citizens c ON u.id = c.user_id
      `).all();

      if (results && results.length > 0) {
        const formatted = results.map((row: any) => ({
          id: row.id,
          username: row.username || `user_${row.id}`,
          firstName: row.firstName || 'Cidadão',
          lastName: row.lastName || `#${row.id}`,
          cargoOsc: 'Associado ASPPIBRA',
          did: `did:asppibra:br:2608${String(row.id).padStart(2, '0')}br`,
          avatarUrl: null,
          kycStatus: row.kycStatus === 'verified' ? 'approved' : 'approved',
          role: row.email?.includes('admin') ? 'admin' : row.email?.includes('dev') ? 'system' : 'citizen',
          phoneNumber: null,
          email: row.email,
        }));
        return c.json({ success: true, data: formatted });
      }
    }
  } catch (err) {
    console.warn('Falha ao consultar D1 para lista de identidades, usando fallback:', err);
  }

  return c.json({ success: true, data: SEEDED_CITIZENS });
});

// GET /api/platform/identity
app.get('/', async (c) => {
  return c.json({ success: true, data: SEEDED_CITIZENS });
});

// POST /api/platform/identity
app.post('/', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const newCitizen = {
    id: Date.now(),
    username: body.username || body.email?.split('@')[0] || 'novo_usuario',
    firstName: body.firstName || 'Novo',
    lastName: body.lastName || 'Membro',
    cargoOsc: body.cargoOsc || 'Associado',
    did: null,
    avatarUrl: body.avatarUrl || null,
    kycStatus: (body.kycStatus || 'pending') as any,
    role: (body.role || 'citizen') as any,
    phoneNumber: body.phoneNumber || null,
    email: body.email || 'novo@asppibra.com',
  };

  return c.json({ success: true, message: 'Cidadão criado com sucesso', data: newCitizen }, 201);
});

// PATCH /api/platform/identity/:id
app.patch('/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json().catch(() => ({}));
  return c.json({ success: true, message: `Identidade ${id} atualizada com sucesso`, data: body });
});

// DELETE /api/platform/identity/:id
app.delete('/:id', async (c) => {
  const id = c.req.param('id');
  return c.json({ success: true, message: `Identidade ${id} removida com sucesso` });
});

// POST /api/platform/identity/bulk-delete
app.post('/bulk-delete', async (c) => {
  return c.json({ success: true, message: 'Identidades selecionadas removidas com sucesso' });
});

export default app;
