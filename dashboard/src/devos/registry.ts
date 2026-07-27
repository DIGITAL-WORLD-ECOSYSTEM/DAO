// registry.ts
// Fonte Central da Verdade para o DevOS

export type DevModule = {
  id: string;
  title: string;
  path: string;
  icon?: string;
  description?: string;
};

export const DEV_MODULES: DevModule[] = [
  { id: 'dashboard', title: 'Command Center', path: '/dev' },
  { id: 'identity', title: 'Identity Lab', path: '/dev/identity' },
  { id: 'impersonation', title: 'Impersonation', path: '/dev/impersonation' },
  { id: 'database', title: 'Database', path: '/dev/database' },
  { id: 'apis', title: 'APIs', path: '/dev/apis' },
  { id: 'audit', title: 'Audit Explorer', path: '/dev/audit' },
  { id: 'security', title: 'Security Center', path: '/dev/security' },
  { id: 'flags', title: 'Feature Flags', path: '/dev/flags' },
  { id: 'infrastructure', title: 'Infrastructure', path: '/dev/infrastructure' },
  { id: 'environment', title: 'Environment', path: '/dev/environment' },
  { id: 'testing', title: 'Testing Lab', path: '/dev/testing' },
  { id: 'dao', title: 'DAO Console', path: '/dev/dao' },
  { id: 'releases', title: 'Release Center', path: '/dev/releases' },
  { id: 'jobs', title: 'Jobs & Queues', path: '/dev/jobs' },
  { id: 'registry', title: 'System Registry', path: '/dev/registry' },
  { id: 'about', title: 'About (Meta)', path: '/dev/about' },
];

export const FOUNDER_MODULES: DevModule[] = [
  { id: 'founder-strategic', title: 'Strategic', path: '/dev/founder/strategic' },
  { id: 'founder-operations', title: 'Operations', path: '/dev/founder/operations' },
  { id: 'founder-emergency', title: 'Emergency', path: '/dev/founder/emergency' },
];
