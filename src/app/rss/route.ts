import { NextResponse } from 'next/server';

export async function GET() {
  const feed = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
      <title>ASPPIBRA-DAO Mundo Digital</title>
      <link>https://asppibra-dao.org</link>
      <description>Últimas novidades do ecossistema RWA e DeFi.</description>
      <item>
        <title>Ecossistema Mundo Digital Inicializado</title>
        <link>https://asppibra-dao.org</link>
        <description>Arquitetura SEO 100% de nível Enterprise estabelecida.</description>
        <pubDate>${new Date().toUTCString()}</pubDate>
      </item>
    </channel>
  </rss>`;

  return new NextResponse(feed, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate',
    },
  });
}
