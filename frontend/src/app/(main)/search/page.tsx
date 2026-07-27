import { constructMetadata } from 'src/lib/seo/metadata';

export const metadata = constructMetadata({
  title: 'Busca Semântica do Ecossistema',
  description:
    'Rastreie dados on-chain, propostas de governança DAO e relatórios do portal usando nosso motor nativo.',
});

export default async function SearchActionPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const awaitedParams = await searchParams;
  const rawQuery = awaitedParams.q;
  const query = typeof rawQuery === 'string' ? rawQuery : '';

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-6">Resultados Globais</h1>
      <div className="p-6 border border-gray-800 rounded-lg bg-gray-900/50">
        <p className="text-lg text-gray-400">
          Você buscou pelo termo:{' '}
          <span className="text-blue-400 font-bold ml-1">&quot;{query}&quot;</span>
        </p>
        <p className="text-sm text-gray-500 mt-4 italic">
          A injeção do SearchAction do Schema.org apontará as procuras do Google Search Box
          nativamente para esta rota da ASPPIBRA.
        </p>
      </div>
    </div>
  );
}
