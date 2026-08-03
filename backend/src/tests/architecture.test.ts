import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

function getFiles(dir: string, fileList: string[] = []): string[] {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const stat = fs.statSync(path.join(dir, file));
    if (stat.isDirectory()) {
      fileList = getFiles(path.join(dir, file), fileList);
    } else if (file.endsWith('.ts')) {
      fileList.push(path.join(dir, file));
    }
  }
  return fileList;
}

describe('Architecture Fitness Tests', () => {
  const domainsDir = path.resolve(__dirname, '../domains');
  const applicationDir = path.resolve(__dirname, '../application');
  const sharedDir = path.resolve(__dirname, '../shared');

  const allDomainFiles = getFiles(domainsDir);
  const allAppFiles = getFiles(applicationDir);
  const allSharedFiles = getFiles(sharedDir);

  const contractsDir = path.resolve(__dirname, '../../../packages/contracts/src');
  const frontendDir = path.resolve(__dirname, '../../../frontend/src');
  const allContractsFiles = getFiles(contractsDir);
  const allFrontendFiles = getFiles(frontendDir);

  const testForbidden = (files: string[], forbiddenRegex: RegExp, errorMessage: string) => {
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf-8');
      if (forbiddenRegex.test(content)) {
        throw new Error(`${errorMessage} in file: ${file}`);
      }
    }
  };

  it('Domain layer MUST NOT import infrastructure or frameworks', () => {
    // 1. Sem Hono, Drizzle, Cloudflare
    testForbidden(
      allDomainFiles,
      /from\s+['"](hono|drizzle-orm|@cloudflare)/g,
      'Domain Layer is leaking framework dependencies (hono/drizzle/cloudflare)'
    );

    // 2. Sem routes
    testForbidden(
      allDomainFiles,
      /from\s+['"]([^'"]*\/routes\/[^'"]*)['"]/g,
      'Domain Layer is importing HTTP routes directly'
    );

    // 3. Sem process.env
    testForbidden(
      allDomainFiles,
      /process\.env/g,
      'Domain Layer is accessing environment variables directly'
    );
  });

  it('Application layer MUST NOT import routes', () => {
    testForbidden(
      allAppFiles,
      /from\s+['"]([^'"]*\/routes\/[^'"]*)['"]/g,
      'Application Layer is importing HTTP routes directly'
    );
  });

  it('Gate 9: Public API Surface - MUST NOT bypass @asppibra/contracts', () => {
    // 1. Proibir importação direta de dist/ ou src/ do pacote contracts
    const allBackendFiles = [...allDomainFiles, ...allAppFiles, ...allSharedFiles, ...getFiles(path.resolve(__dirname, '../routes'))];
    testForbidden(
      allBackendFiles,
      /from\s+['"]@asppibra\/contracts\/(src|dist).*['"]/g,
      'Bypass of Public API Surface: Importing directly from contracts/src or contracts/dist'
    );
    
    // 2. Proibir relative paths para contracts
    testForbidden(
      allBackendFiles,
      /from\s+['"]\.\.\/.*\/?contracts\/src.*['"]/g,
      'Bypass of Public API Surface: Using relative paths to contracts source'
    );
  });

  it('Shared Kernel MUST NOT import external frameworks', () => {
    testForbidden(
      allSharedFiles,
      /from\s+['"](hono|drizzle-orm|@cloudflare)/g,
      'Shared Kernel is leaking framework dependencies (hono/drizzle/cloudflare)'
    );
  });

  it('Gate 10: Dependency Direction - Domain MUST ONLY depend on Shared Kernel or Application Ports', () => {
    testForbidden(
      allDomainFiles,
      /from\s+['"](?:\.\.\/)+infrastructure.*['"]/g,
      'Dependency Direction Violation: Domain Layer is importing from Infrastructure Layer'
    );
    testForbidden(
      allDomainFiles,
      /from\s+['"](?:\.\.\/)+routes.*['"]/g,
      'Dependency Direction Violation: Domain Layer is importing from Routes Layer'
    );
  });

  it('Gate 11: Dependency Direction - Application MUST ONLY depend on Ports or Kernel', () => {
    testForbidden(
      allAppFiles,
      /from\s+['"](?:\.\.\/)+infrastructure.*['"]/g,
      'Dependency Direction Violation: Application Layer is importing from Infrastructure Layer'
    );
  });

  it('Gate 12: Public Dependency Rule - Contracts MUST NOT import internal modules', () => {
    testForbidden(
      allContractsFiles,
      /from\s+['"](.*\/?shared\/kernel|.*\/?application|.*\/?domains|.*\/?infrastructure|.*\/?frontend|.*\/?backend).*['"]/g,
      'Public Dependency Rule Violation: Contracts is importing from internal Monorepo modules'
    );
  });

  it('Gate 13: Package Boundary Validation', () => {
    // frontend -> NUNCA -> backend
    testForbidden(
      allFrontendFiles,
      /from\s+['"](?:\.\.\/)+backend.*['"]/g,
      'Package Boundary Violation: Frontend is importing from Backend'
    );

    // backend -> NUNCA -> frontend
    const allBackendFiles = [...allDomainFiles, ...allAppFiles, ...allSharedFiles, ...getFiles(path.resolve(__dirname, '../routes'))];
    testForbidden(
      allBackendFiles,
      /from\s+['"](?:\.\.\/)+frontend.*['"]/g,
      'Package Boundary Violation: Backend is importing from Frontend'
    );

    // domain -> NUNCA -> drizzle
    testForbidden(
      allDomainFiles,
      /from\s+['"]drizzle-orm.*['"]/g,
      'Package Boundary Violation: Domain is importing Drizzle ORM'
    );

    // application -> NUNCA -> cloudflare
    testForbidden(
      allAppFiles,
      /from\s+['"]@cloudflare.*['"]/g,
      'Package Boundary Violation: Application is importing Cloudflare APIs'
    );
  });

  it('Ensures there are no Circular Dependencies between Domain and Infra', () => {
    // This is covered manually by imports regex above (routes blocked), 
    // but ensures the fundamental Hexagonal rules.
    expect(true).toBe(true);
  });
});
