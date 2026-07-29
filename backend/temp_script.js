const fs = require('fs');
let content = fs.readFileSync('dashboard/src/layouts/nav-config-dashboard.tsx', 'utf-8');

// The block to extract starts exactly after:
//   /**
//    * 📂 GRUPO 1: ADMIN
//    */
//   {
//     subheader: '📂 GRUPO 1: ADMIN',
//     items: [
// and ends before:
//   /**
//    * 📂 GRUPO 2: USUÁRIOS

const startToken = `  /**\n   * 📂 GRUPO 1: ADMIN\n   */\n  {\n    subheader: '📂 GRUPO 1: ADMIN',\n    items: [\n`;
const startIndex = content.indexOf(startToken);

const endToken = `    ],\n  },\n  /**\n   * 📂 GRUPO 2: USUÁRIOS`;
const endIndex = content.indexOf(endToken, startIndex);

if (startIndex > -1 && endIndex > -1) {
  const extractedItems = content.slice(startIndex + startToken.length, endIndex);

  // Remove the block
  content =
    content.slice(0, startIndex) +
    `  /**\n   * 📂 GRUPO 2: USUÁRIOS` +
    content.slice(endIndex + endToken.length - `  /**\n   * 📂 GRUPO 2: USUÁRIOS`.length);

  // Now find DEVELOPER items array end
  const devEndToken = `      },\n    ],\n  },\n];`;
  const devEndIndex = content.lastIndexOf(devEndToken);

  if (devEndIndex > -1) {
    content =
      content.slice(0, devEndIndex + 7) +
      `\n      // --- MOVIDOS DO GRUPO 1 ---\n` +
      extractedItems +
      content.slice(devEndIndex + 7);
    fs.writeFileSync('dashboard/src/layouts/nav-config-dashboard.tsx', content);
    console.log('Success');
  } else {
    console.log('Could not find DEVELOPER end');
  }
} else {
  console.log('Could not find GRUPO 1');
}
