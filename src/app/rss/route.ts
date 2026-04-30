import { NextResponse } from 'next/server';

import { CONFIG } from 'src/global-config';
import { getPosts } from 'src/actions/blog-queries';

export async function GET() {
  const { posts } = await getPosts();

  const items = posts
    .map(
      (post) => `
      <item>
        <title>${post.title}</title>
        <link>${CONFIG.siteUrl}/news/${post.slug}</link>
        <description>${post.description}</description>
        <pubDate>${post.createdAt ? new Date(post.createdAt).toUTCString() : new Date().toUTCString()}</pubDate>
        <guid>${CONFIG.siteUrl}/news/${post.slug}</guid>
      </item>`
    )
    .join('');

  const feed = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
      <title>ASPPIBRA DAO - Blog Mundo Digital</title>
      <link>${CONFIG.siteUrl}/news</link>
      <description>Últimas novidades e análises sobre o ecossistema RWA, DeFi e Governança ASPPIBRA.</description>
      <language>pt-br</language>
      ${items}
    </channel>
  </rss>`;

  return new NextResponse(feed, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate',
    },
  });
}
