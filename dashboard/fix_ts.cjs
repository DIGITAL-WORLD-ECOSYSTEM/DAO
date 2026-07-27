const fs = require('fs');

const files = [
  'src/sections/overview/app/app-active-projects.tsx',
  'src/sections/overview/app/app-chat-hub-summary.tsx',
  'src/sections/overview/app/app-communication-carousel.tsx',
  'src/sections/overview/app/app-community-feed.tsx',
  'src/sections/overview/app/app-ecosystem-numbers.tsx',
  'src/sections/overview/app/app-governance-highlight.tsx',
  'src/sections/overview/app/app-my-actions.tsx',
  'src/sections/overview/app/app-onboarding.tsx',
  'src/sections/overview/app/app-opportunities.tsx',
  'src/sections/overview/app/app-upcoming-events.tsx',
  'src/sections/overview/app/app-weekly-recognition.tsx'
];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  
  // Fix Iconify as any
  content = content.replace(/<Iconify icon={([^}]+)}/g, (match, p1) => {
    if (p1.includes('as any')) return match;
    if (p1.startsWith('"') || p1.startsWith("'")) {
      return `<Iconify icon={${p1} as any}`;
    }
    return `<Iconify icon={${p1} as any}`;
  });
  
  content = content.replace(/<Iconify icon="([^"]+)"/g, '<Iconify icon={"$1" as any}');

  // Fix Stack alignItems and justifyContent
  content = content.replace(/<Stack direction="row" alignItems="center" justifyContent="space-between"/g, '<Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}');
  content = content.replace(/<Stack direction="row" alignItems="center" spacing={([0-9.]+)}/g, '<Stack direction="row" spacing={$1} sx={{ alignItems: "center" }}');
  content = content.replace(/<Stack direction="row" alignItems="center" spacing={([0-9.]+)} sx={{([^}]+)}}/g, '<Stack direction="row" spacing={$1} sx={{ alignItems: "center", $2 }}');
  content = content.replace(/<Stack direction="row" alignItems="center" justifyContent="space-between" sx={{([^}]+)}}/g, '<Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", $1 }}');

  fs.writeFileSync(file, content, 'utf8');
});
