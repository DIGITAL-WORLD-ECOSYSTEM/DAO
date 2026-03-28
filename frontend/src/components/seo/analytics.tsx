
'use client';

import { Analytics as VercelAnalytics } from '@vercel/analytics/react';

// Substitua com seu ID do Google Tag Manager
const GTM_ID = 'GTM-XXXXXXX';

// ----------------------------------------------------------------------

export function Analytics() {
  return (
    <>
      {/* Vercel Analytics */}
      <VercelAnalytics />

      {/* Google Tag Manager (descomente quando tiver o ID) */}
      {/* 
      <script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer', '${GTM_ID}');
          `,
        }}
      />
      */}
    </>
  );
}
