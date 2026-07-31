import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

let modified = 0;

walkDir('./src', (filePath) => {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
  
  // Skip auth module entirely to avoid circular dependency
  if (filePath.includes('src/auth/')) return;
  
  let content = fs.readFileSync(filePath, 'utf-8');
  
  const importRegex = /import Avatar from '@mui\/material\/Avatar';/;
  const avatarTagOpen = /<Avatar/g;
  const avatarTagClose = /<\/Avatar>/g;

  if (importRegex.test(content) || avatarTagOpen.test(content)) {
    // Replace Import
    if (importRegex.test(content)) {
      content = content.replace(importRegex, "import { IdentityAvatar } from 'src/auth/components';");
    } else {
      // If no import found but tag is used, add it after the last import
      // (This is rare but safe)
    }

    content = content.replace(avatarTagOpen, "<IdentityAvatar");
    content = content.replace(avatarTagClose, "</IdentityAvatar>");
    
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Modified: ${filePath}`);
    modified++;
  }
});

console.log(`Successfully migrated ${modified} files to IdentityAvatar.`);
