/**
 * No Next.js App Router (Padrão 2026), tags Canonical devem ser injetadas
 * globalmente via API `generateMetadata` (no `metadataBase` ou `alternates`).
 *
 * Este componente serve exclusivamente como um fallback manual (Override)
 * para rotas de erro específicas ou páginas do cliente estrito onde o
 * SSR de metadados não conseguiu interagir.
 */
export function CanonicalOverride({ path }: { path: string }) {
  const fullUrl = `https://asppibra-dao.org${path}`;

  return <link rel="canonical" href={fullUrl} />;
}
