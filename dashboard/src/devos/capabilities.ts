// capabilities.ts
// Sistema de permissões granulares para a plataforma

export type Capability =
  | 'database.read'
  | 'database.write'
  | 'security.manage'
  | 'identity.impersonate'
  | 'flags.toggle'
  | 'founder.emergency';

export const RoleCapabilities: Record<string, Capability[]> = {
  dev: [
    'database.read',
    'database.write',
    'security.manage',
    'identity.impersonate',
    'flags.toggle',
    'founder.emergency',
  ],
  admin: [
    // Admins de negócio não têm acesso técnico
  ],
  user: [],
};

export const hasCapability = (role: string, cap: Capability) =>
  RoleCapabilities[role]?.includes(cap) ?? false;
