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
  
  content = content.replace(/sx={{([^}]+)}}\s*sx={{([^}]+)}}/g, 'sx={{ $1, $2 }}');

  fs.writeFileSync(file, content, 'utf8');
});
