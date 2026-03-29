# DR-001: Vite & WebCrypto Migration
**Status:** Approved
**Date:** 2026-03-29

## Contexto
O projeto original em Next.js apresentava gargalos críticos de CPU em Cloudflare Workers (por conta do `bcryptjs`) e instabilidade de build/SSR com Material UI.

## Decisões
1. **Migração para Vite/Vinext:** Melhor controle sobre o bundle e renderização nativa em Cloudflare Pages.
2. **WebCrypto PBKDF2:** Substituição do Bcrypt por APIs nativas do Edge para performance extrema.
3. **Optimized Pre-bundling:** Uso de `optimizeDeps.include` para resolver conflitos ESM/CJS de bibliotecas legadas (Day.js, MUI).

## Impacto
- Redução de latência de autenticação de ~500ms para <10ms.
- Tempo de renderização inicial otimizado.
- Independência total de vendor lock-in da Vercel.
