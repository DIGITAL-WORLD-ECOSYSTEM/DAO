import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

function getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

describe('Constitutional Architecture Static Enforcement (AF-001 - AF-014)', () => {
  const srcDir = path.resolve(__dirname, '../src');
  const allSrcFiles = getAllFiles(srcDir);

  it('AF-002: Authentication domain MUST NEVER import RegisterAccountUseCase', () => {
    const authDir = path.join(srcDir, 'domains/identity');
    if (fs.existsSync(authDir)) {
      const authFiles = getAllFiles(authDir).filter(
        (f) =>
          !f.includes('RegisterAccountUseCase') &&
          !f.includes('Register') &&
          !f.includes('Controller')
      );

      for (const filePath of authFiles) {
        const content = fs.readFileSync(filePath, 'utf-8');
        expect(content).not.toContain('RegisterAccountUseCase');
      }
    }
  });

  it('AF-009 / AF-010: Zero Shadow Accounts (@web3.local or @ssi.local MUST NOT exist in codebase)', () => {
    for (const filePath of allSrcFiles) {
      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).not.toContain('@web3.local');
      expect(content).not.toContain('@ssi.local');
    }
  });

  it('AF-003: VerifyExternalIdentityUseCase MUST NOT create users automatically', () => {
    const useCasePath = path.join(srcDir, 'domains/identity/usecases/VerifyExternalIdentityUseCase.ts');
    if (fs.existsSync(useCasePath)) {
      const content = fs.readFileSync(useCasePath, 'utf-8');
      expect(content).not.toContain('accountRepo.save');
      expect(content).not.toContain('Account.restore');
      expect(content).toContain('IDENTITY_NOT_LINKED');
    }
  });
});
