// src/actions/blog-ssr.ts
import { kebabCase } from 'es-toolkit';

import { _sofi } from 'src/_mock/_blog'; // Fonte estática de verdade
import { CONFIG } from 'src/global-config';

const API_URL = CONFIG.serverUrl;

// ----------------------------------------------------------------------

/**
 * BUSCA PRINCIPAL: Retorna todos os sofi.
 * Prioriza a API, mas usa o MOCK como fallback durante o desenvolvimento.
 */
export async function getSoFis() {
  try {
    const url = `${API_URL}/api/sofi`;
    
    // Se estivermos em dev ou banco vazio, podemos forçar o mock aqui
    if (!API_URL || API_URL.includes('localhost')) {
       return { sofi: _sofi };
    }

    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return { sofi: _sofi }; // Fallback para Mock se a API falhar

    const data = await res.json();
    const sofi = Array.isArray(data) ? data : (data.sofi || []);

    return { sofi: sofi.length > 0 ? sofi : _sofi };
  } catch (error) {
    return { sofi: _sofi };
  }
}

// ----------------------------------------------------------------------

/**
 * BUSCA INDIVIDUAL: Pega um post específico pelo Título (Slug).
 */
export async function getSoFi(paramTitle: string) {
  if (!paramTitle) return { post: null };

  try {
    // 🟢 Lógica de busca no Mock (Padrão 2026 com Slug)
    const post = _sofi.find((p) => kebabCase(p.title) === paramTitle);

    return { post: post || null };
  } catch (error) {
    return { post: null };
  }
}

// ----------------------------------------------------------------------

/**
 * BUSCA RELACIONADOS: Retorna os últimos sofi.
 */
export async function getLatestSoFis(paramTitle: string) {
  try {
    const { sofi } = await getSoFis();
    
    const latestSoFis = sofi
      .filter((p: any) => kebabCase(p.title) !== paramTitle)
      .slice(0, 4);

    return { latestSoFis }; // 🟢 Corresponde ao que a Page.tsx desestrutura
  } catch (error) {
    return { latestSoFis: [] };
  }
}
