import DOMPurify from 'dompurify';
import React, { useMemo } from 'react';

import Box from '@mui/material/Box';

import { Markdown } from 'src/components/markdown';

interface EmailRendererProps {
  content?: string;
  sx?: any;
}

/**
 * Componente centralizado de segurança para renderização de E-mails.
 * Protege contra injeção de XSS purificando o payload que vem do Backend.
 */
export function EmailRenderer({ content = '', sx }: EmailRendererProps) {
  // Memoizamos a sanitização para evitar repetições custosas a cada re-render
  const safeHtml = useMemo(() => {
    if (!content) return '';
    return DOMPurify.sanitize(content, {
      USE_PROFILES: { html: true },
      FORBID_TAGS: ['style', 'script', 'iframe', 'form', 'object', 'embed'],
      FORBID_ATTR: ['onerror', 'onload', 'onmouseover'],
    });
  }, [content]);

  // Se o conteúdo parecer ser Markdown ou Texto simples (sem tags HTML relevantes)
  const isHtml = /<\/?[a-z][\s\S]*>/i.test(content);

  if (!isHtml) {
    return (
      <Markdown
        children={content}
        sx={{
          '& p': { typography: 'body2' },
          ...sx,
        }}
      />
    );
  }

  // Renderização segura de HTML (XSS Protegido)
  return (
    <Box
      sx={{
        '& p': { typography: 'body2' },
        '& a': { color: 'primary.main', textDecoration: 'underline' },
        '& img': { maxWidth: '100%', height: 'auto' },
        ...sx,
      }}
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
}
