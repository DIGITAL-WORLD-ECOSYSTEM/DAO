const fs = require('fs');
const path = require('path');

/**
 * CONFIGURAÇÕES: Pastas que o script deve ignorar para não poluir o relatório.
 */
const IGNORE_LIST = [
  'node_modules',
  '.git',
  '.next',
  'dist',
  'out',
  '.vercel',
  '.gemini',
  '.vscode',
  'pnpm-lock.yaml',
  'package-lock.json',
  'yarn.lock'
];

/**
 * Função recursiva para ler a estrutura e gerar a árvore
 */
function generateTree(dir, prefix = '') {
  let structure = '';
  const files = fs.readdirSync(dir);

  // Ordena para que pastas apareçam antes de arquivos
  const sortedFiles = files.filter(f => !IGNORE_LIST.includes(f)).sort((a, b) => {
    const isDirA = fs.statSync(path.join(dir, a)).isDirectory();
    const isDirB = fs.statSync(path.join(dir, b)).isDirectory();
    return isDirB - isDirA || a.localeCompare(b);
  });

  sortedFiles.forEach((file, index) => {
    const isLast = index === sortedFiles.length - 1;
    const filePath = path.join(dir, file);
    const isDirectory = fs.statSync(filePath).isDirectory();

    const linePrefix = isLast ? '└── ' : '├── ';
    structure += `${prefix}${linePrefix}${file}${isDirectory ? '/' : ''}\n`;

    if (isDirectory) {
      const nextPrefix = isLast ? '    ' : '│   ';
      structure += generateTree(filePath, prefix + nextPrefix);
    }
  });

  return structure;
}

// Início da execução
const projectRoot = process.cwd();
const projectName = path.basename(projectRoot);
const reportFile = path.join(projectRoot, 'PROJECT_STRUCTURE.md');

console.log('🔍 Mapeando estrutura do projeto...');

const tree = generateTree(projectRoot);

const reportContent = `# 📂 Estrutura do Projeto: ${projectName}\n\n` +
  `Este arquivo foi gerado automaticamente em ${new Date().toLocaleString('pt-BR')}.\n\n` +
  `\`\`\`text\n${projectName}/\n${tree}\`\`\`\n\n` +
  `--- \n*Gerado pelo assistente Antigravity para ASPPIBRA DAO.*`;

fs.writeFileSync(reportFile, reportContent);

console.log(`✅ Relatório gerado com sucesso em: ${reportFile}`);
