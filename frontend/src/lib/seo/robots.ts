export function getRobotsRules(isProduction: boolean) {
  if (!isProduction) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
      sitemap: 'https://asppibra-dao.org/sitemap.xml',
    };
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/', '/api/', '/identity/'], // Protect private DAO elements
      },
      {
        // Advanced 2026 AI Scraping block matching the llms.txt policies
        userAgent: ['GPTBot', 'CCBot', 'Anthropic-ai', 'Google-Extended'],
        disallow: '/',
      },
    ],
    sitemap: 'https://asppibra-dao.org/sitemap.xml',
  };
}
