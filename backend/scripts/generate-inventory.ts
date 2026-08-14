import * as fs from 'fs';
import * as ts from 'typescript';
import * as path from 'path';

const dbDir = path.resolve(__dirname, '../src/db');
const outputPath = path.resolve(__dirname, '../src/db/schema.inventory.after.json');

function getAllFiles(dir: string, fileList: string[] = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const stat = fs.statSync(path.join(dir, file));
    if (stat.isDirectory()) {
      getAllFiles(path.join(dir, file), fileList);
    } else if (file.endsWith('.ts') && !file.endsWith('.test.ts') && file !== 'index.ts' && file !== 'seed.ts' && file !== 'schema.ts') {
      fileList.push(path.join(dir, file));
    }
  }
  return fileList;
}

const allFiles = getAllFiles(dbDir);
if (fs.existsSync(path.join(dbDir, 'schema.ts'))) {
  allFiles.push(path.join(dbDir, 'schema.ts'));
}

const inventory: any = {
  constants: [],
  tables: [],
  relations: [],
};

let currentDomain = 'UNKNOWN';
let currentSourceFile: ts.SourceFile | null = null;

function extractDomainFromComments(node: ts.Node) {
  if (!currentSourceFile) return;
  const comments = ts.getLeadingCommentRanges(currentSourceFile.text, node.pos);
  if (comments) {
    for (const comment of comments) {
      const text = currentSourceFile.text.substring(comment.pos, comment.end);
      const match = text.match(/(\d+\.\s+[A-Z0-9\s\/_]+)/);
      if (match) {
        currentDomain = match[1].trim();
      }
    }
  }
}

function hasMethodCall(node: ts.Node, methodName: string): boolean {
  if (ts.isCallExpression(node)) {
    if (ts.isPropertyAccessExpression(node.expression)) {
      if (node.expression.name.text === methodName) {
        return true;
      }
    }
  }
  let found = false;
  ts.forEachChild(node, child => {
    if (!found) found = hasMethodCall(child, methodName);
  });
  return found;
}

function visit(node: ts.Node) {
  extractDomainFromComments(node);

  if (ts.isVariableStatement(node) && node.modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword)) {
    for (const decl of node.declarationList.declarations) {
      if (ts.isIdentifier(decl.name) && decl.initializer) {
        const exportName = decl.name.text;
        
        if (ts.isCallExpression(decl.initializer)) {
          const call = decl.initializer;
          const fnName = ts.isIdentifier(call.expression) ? call.expression.text : '';
          
          if (fnName === 'sqliteTable') {
            const tableName = ts.isStringLiteral(call.arguments[0]) ? call.arguments[0].text : 'unknown';
            
            const columns: any[] = [];
            const primaryKeys: string[] = [];
            const foreignKeys: any[] = [];
            
            if (call.arguments[1] && ts.isObjectLiteralExpression(call.arguments[1])) {
              for (const prop of call.arguments[1].properties) {
                if (ts.isPropertyAssignment(prop) && ts.isIdentifier(prop.name)) {
                  columns.push(prop.name.text);
                  
                  if (hasMethodCall(prop.initializer, 'primaryKey')) {
                    primaryKeys.push(prop.name.text);
                  }
                  
                  if (hasMethodCall(prop.initializer, 'references')) {
                    foreignKeys.push({ column: prop.name.text, def: prop.initializer.getText(currentSourceFile!) });
                  }
                }
              }
            }
            
            const indexes: string[] = [];
            const uniqueIndexes: string[] = [];
            const checks: string[] = [];
            
            if (call.arguments[2] && ts.isArrowFunction(call.arguments[2])) {
              let body = call.arguments[2].body;
              if (ts.isParenthesizedExpression(body)) {
                body = body.expression;
              }
              
              if (ts.isObjectLiteralExpression(body)) {
                 for (const prop of body.properties) {
                   if (ts.isPropertyAssignment(prop) && ts.isIdentifier(prop.name)) {
                     const initText = prop.initializer.getText(currentSourceFile!);
                     if (initText.startsWith('uniqueIndex')) uniqueIndexes.push(prop.name.text);
                     else if (initText.startsWith('index')) indexes.push(prop.name.text);
                     else if (initText.startsWith('check')) checks.push(prop.name.text);
                     else if (initText.startsWith('primaryKey')) primaryKeys.push(prop.name.text);
                   }
                 }
              }
            }
            
            inventory.tables.push({
              exportName,
              tableName,
              domain: currentDomain,
              columns,
              primaryKeys,
              foreignKeys,
              indexes,
              uniqueIndexes,
              checks,
              sourcePosition: currentSourceFile!.getLineAndCharacterOfPosition(decl.getStart(currentSourceFile!)).line + 1
            });
            
          } else if (fnName === 'relations') {
             const relatedTable = call.arguments[0] && ts.isIdentifier(call.arguments[0]) ? call.arguments[0].text : 'unknown';
             inventory.relations.push({
               exportName,
               relatedTable,
               domain: currentDomain,
               sourcePosition: currentSourceFile!.getLineAndCharacterOfPosition(decl.getStart(currentSourceFile!)).line + 1
             });
          }
        } else {
          // Check for constants (arrays or 'as const')
          let isConstant = false;
          if (ts.isArrayLiteralExpression(decl.initializer)) {
            isConstant = true;
          } else if (ts.isAsExpression(decl.initializer)) {
            if (ts.isArrayLiteralExpression(decl.initializer.expression)) {
              isConstant = true;
            }
          }
          if (isConstant) {
            inventory.constants.push({
              exportName,
              domain: currentDomain,
              sourcePosition: currentSourceFile!.getLineAndCharacterOfPosition(decl.getStart(currentSourceFile!)).line + 1
            });
          }
        }
      }
    }
  }
  
  ts.forEachChild(node, visit);
}

for (const file of allFiles) {
  currentSourceFile = ts.createSourceFile(
    file,
    fs.readFileSync(file, 'utf8'),
    ts.ScriptTarget.Latest,
    true
  );
  visit(currentSourceFile);
}

fs.writeFileSync(outputPath, JSON.stringify(inventory, null, 2));
console.log('Inventory saved to', outputPath);
