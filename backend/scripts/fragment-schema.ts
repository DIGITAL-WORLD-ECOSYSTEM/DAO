import * as fs from 'fs';
import * as ts from 'typescript';
import * as path from 'path';

const schemaPath = path.resolve(__dirname, '../src/db/schema.ts');
const inventoryPath = path.resolve(__dirname, '../src/db/schema.inventory.before.json');
const dbDir = path.resolve(__dirname, '../src/db');

const sourceFile = ts.createSourceFile(
  'schema.ts',
  fs.readFileSync(schemaPath, 'utf8'),
  ts.ScriptTarget.Latest,
  true
);

const inventory = JSON.parse(fs.readFileSync(inventoryPath, 'utf8'));

// Map domain string to directory name
function getDirName(domainStr: string): string {
  const map: Record<string, string> = {
    '10. USER / ACTOR': 'user',
    '20. AUTHENTICATION': 'authentication',
    '30. AUTHORIZATION': 'authorization',
    '40. CIVIL IDENTITY / KYC': 'civil-identity',
    '50. SSI / DIGITAL IDENTITY': 'ssi',
    '60. ORGANIZATIONS': 'organizations',
    '70. WEB3 IDENTITY': 'web3',
    '80. SOCIAL': 'social',
    '90. COMMUNICATION': 'communication',
    '100. GOVERNANCE': 'governance',
    '110. CONTRIBUTIONS': 'contributions',
    '120. CONTRACTS / OBLIGATIONS': 'contracts',
    '130. FINANCE / TREASURY': 'finance',
    '140. REAL ESTATE / RWA': 'real-estate',
    '150. DEVOPS / INTEGRATIONS': 'integrations',
    '160. COMPLIANCE / PRIVACY': 'compliance',
    '170. SECURITY / AUDIT': 'security',
    '180. INFRASTRUCTURE': 'infrastructure',
    // fallback for relations blocks
    '901. USER / ACTOR': 'user',
    '902. AUTHENTICATION': 'authentication',
    '903. AUTHORIZATION': 'authorization',
    '904. CIVIL IDENTITY / KYC': 'civil-identity',
    '905. SSI / DIGITAL IDENTITY': 'ssi',
    '906. ORGANIZATIONS': 'organizations',
    '907. WEB3 IDENTITY': 'web3',
    '908. SOCIAL': 'social',
    '909. COMMUNICATION': 'communication',
    '910. GOVERNANCE': 'governance',
    '911. CONTRIBUTIONS': 'contributions',
    '912. CONTRACTS / OBLIGATIONS': 'contracts',
    '913. FINANCE / TREASURY': 'finance',
    '914. REAL ESTATE / RWA': 'real-estate',
    '915. DEVOPS / INTEGRATIONS': 'integrations',
    '916. COMPLIANCE / PRIVACY': 'compliance',
    '917. SECURITY / AUDIT': 'security',
    '918. INFRASTRUCTURE': 'infrastructure'
  };
  return map[domainStr] || 'unknown';
}

const exportMap: Record<string, { type: 'table' | 'relation' | 'constant', dir: string }> = {};

for (const t of inventory.tables) {
  exportMap[t.exportName] = { type: 'table', dir: getDirName(t.domain) };
}
for (const r of inventory.relations) {
  exportMap[r.exportName] = { type: 'relation', dir: getDirName(r.domain) };
}
for (const c of inventory.constants) {
  exportMap[c.exportName] = { type: 'constant', dir: '' };
}

// Global imports to keep in tables and relations
const drizzleImports = [
  'sqliteTable', 'text', 'integer', 'index', 'uniqueIndex', 'primaryKey', 'check', 'relations', 'sql', 'AnyColumn', 'RelationConfig'
];
// DTO imports
const dtoImports = [
  'EventCategory', 'DeliveryStatus', 'OutboxStatus', 'WalletStatus', 'WalletVerificationStatus', 'IntegrationStatus', 'KYCLevel', 'KYCStatus', 'DidStatus'
];

type ExtractedNode = {
  exportName: string;
  code: string;
  type: 'table' | 'relation' | 'constant';
  dir: string;
  dependencies: Set<string>;
};

const extractedNodes: ExtractedNode[] = [];
let currentDomain = 'UNKNOWN';

function extractDomainFromComments(node: ts.Node) {
  const comments = ts.getLeadingCommentRanges(sourceFile.text, node.pos);
  if (comments) {
    for (const comment of comments) {
      const text = sourceFile.text.substring(comment.pos, comment.end);
      const match = text.match(/(\d+\.\s+[A-Z0-9\s\/_]+)/);
      if (match) {
        currentDomain = match[1].trim();
      }
    }
  }
}

function findDependencies(node: ts.Node, deps: Set<string>) {
  if (ts.isIdentifier(node)) {
    if (exportMap[node.text]) {
      deps.add(node.text);
    }
  }
  ts.forEachChild(node, child => findDependencies(child, deps));
}

function visit(node: ts.Node) {
  extractDomainFromComments(node);

  if (ts.isVariableStatement(node) && node.modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword)) {
    for (const decl of node.declarationList.declarations) {
      if (ts.isIdentifier(decl.name) && decl.initializer) {
        const exportName = decl.name.text;
        if (!exportMap[exportName]) continue;

        const info = exportMap[exportName];
        
        // Find dependencies referenced inside this node
        const deps = new Set<string>();
        findDependencies(decl.initializer, deps);
        
        // Remove self dependency
        deps.delete(exportName);

        // Get the full code of the export statement (including comments above it if we want)
        // Let's grab the whole VariableStatement text
        let code = node.getText(sourceFile);
        
        // Include leading comments specifically for this statement if needed, 
        // but simple getText() on the VariableStatement doesn't include JSDoc sometimes.
        const fullStart = node.getFullStart();
        const start = node.getStart(sourceFile);
        const leadingCommentsText = sourceFile.text.slice(fullStart, start);
        
        // Clean up domain headers from leading comments so we don't spam them everywhere
        const cleanedComments = leadingCommentsText.split('\n')
            .filter(line => !line.match(/====/) && !line.match(/\d+\.\s+/) && !line.match(/Owner:/) && !line.match(/Depends on:/) && !line.match(/References:/) && !line.match(/Emits:/))
            .join('\n');
            
        code = cleanedComments + code;

        extractedNodes.push({
          exportName,
          code,
          type: info.type,
          dir: info.dir,
          dependencies: deps
        });
      }
    }
  }
  ts.forEachChild(node, visit);
}

visit(sourceFile);

// Group by directory
const modules: Record<string, { tables: ExtractedNode[], relations: ExtractedNode[] }> = {};
const constants: ExtractedNode[] = [];

for (const node of extractedNodes) {
  if (node.type === 'constant') {
    constants.push(node);
  } else {
    if (!modules[node.dir]) modules[node.dir] = { tables: [], relations: [] };
    if (node.type === 'table') modules[node.dir].tables.push(node);
    if (node.type === 'relation') modules[node.dir].relations.push(node);
  }
}

// Force creation of all 18 module directories even if empty
const allDirs = [
  'user', 'authentication', 'authorization', 'civil-identity', 'ssi', 'organizations',
  'web3', 'social', 'communication', 'governance', 'contributions', 'contracts',
  'finance', 'real-estate', 'integrations', 'compliance', 'security', 'infrastructure'
];

allDirs.forEach(dir => {
  const fullPath = path.join(dbDir, dir);
  if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath);
  if (!modules[dir]) modules[dir] = { tables: [], relations: [] };
});

function getImports(deps: Set<string>, currentDir: string, currentFile: 'tables' | 'relations'): string {
  const imports: Record<string, string[]> = {};
  
  for (const dep of deps) {
    const info = exportMap[dep];
    if (!info) continue;
    
    let relPath = '';
    if (info.type === 'constant') {
      relPath = currentDir === '' ? './constants' : '../constants';
    } else {
      const targetFile = info.type === 'table' ? 'tables' : 'relations';
      if (info.dir === currentDir) {
        if (targetFile === currentFile) continue; // same file
        relPath = `./${targetFile}`;
      } else {
         relPath = `../${info.dir}/${targetFile}`;
      }
    }
    
    if (!imports[relPath]) imports[relPath] = [];
    imports[relPath].push(dep);
  }
  
  let out = '';
  for (const p of Object.keys(imports)) {
    out += `import { ${imports[p].join(', ')} } from '${p}';\n`;
  }
  return out;
}

// 1. Write constants.ts
let constantsCode = `// Constants extracted mechanically\n`;
for (const c of constants) constantsCode += c.code + '\n\n';
fs.writeFileSync(path.join(dbDir, 'constants.ts'), constantsCode);

// 2. Write modules
for (const dir of allDirs) {
  const mod = modules[dir];
  
  // Write tables.ts
  const tableDeps = new Set<string>();
  let tableCode = '';
  for (const t of mod.tables) {
    tableCode += t.code + '\n\n';
    t.dependencies.forEach(d => tableDeps.add(d));
  }
  
  let tableHeader = `import { sqliteTable, text, integer, index, uniqueIndex, primaryKey, check } from 'drizzle-orm/sqlite-core';\nimport { sql } from 'drizzle-orm';\n`;
  tableHeader += `import type { EmailEventMetadata } from '../../dto/email-event';\n`;
  tableHeader += getImports(tableDeps, dir, 'tables') + '\n';
  fs.writeFileSync(path.join(dbDir, dir, 'tables.ts'), tableHeader + tableCode);
  
  // Write relations.ts
  const relDeps = new Set<string>();
  let relCode = '';
  for (const r of mod.relations) {
    relCode += r.code + '\n\n';
    r.dependencies.forEach(d => relDeps.add(d));
  }
  
  let relHeader = `import { relations, AnyColumn, RelationConfig } from 'drizzle-orm';\n`;
  relHeader += getImports(relDeps, dir, 'relations') + '\n';
  fs.writeFileSync(path.join(dbDir, dir, 'relations.ts'), relHeader + relCode);
}

console.log('Fragmentation complete. Run validation before touching schema.ts.');
