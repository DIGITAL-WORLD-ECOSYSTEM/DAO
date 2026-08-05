# 📂 Estrutura do Projeto: DAO

Este arquivo foi gerado automaticamente em 30/04/2026, 09:28:10.

```text
DAO/
├── .wrangler/
│   └── state/
│       └── v3/
│           ├── cache/
│           │   └── miniflare-CacheObject/
│           │       ├── metadata.sqlite
│           │       ├── metadata.sqlite-shm
│           │       └── metadata.sqlite-wal
│           ├── r2/
│           │   ├── miniflare-R2BucketObject/
│           │   │   ├── 5054bdc64b51388aa64f848ecb37fc148c481b4a608bc50c7b8dc7c9e1cae8cc.sqlite
│           │   │   ├── 5054bdc64b51388aa64f848ecb37fc148c481b4a608bc50c7b8dc7c9e1cae8cc.sqlite-shm
│           │   │   ├── 5054bdc64b51388aa64f848ecb37fc148c481b4a608bc50c7b8dc7c9e1cae8cc.sqlite-wal
│           │   │   ├── metadata.sqlite
│           │   │   ├── metadata.sqlite-shm
│           │   │   └── metadata.sqlite-wal
│           │   └── socialfi/
│           │       └── blobs/
│           │           ├── 0c67e74c5d25d862d55379ae396f89ecf9c1256e93ea142b57758aa1c12f21800000019dba8eb149
│           │           ├── 16b63bde3b71332caea5ca5062146ad32aaee87a09846887e09e9505b90d23440000019dba8ece44
│           │           ├── 230ee1ef368ad47d59d06e1727dd79db4eeb3802fdf015a566df3643971e92c70000019dba8f0175
│           │           ├── 2e3a804135385355917400c5f28dbb148d8134b2fedb94056892b0f42b263dd80000019dba8ef7f8
│           │           ├── 4304ffdd64a0cff2acb04786d8885f4e60ba3bb14e29bf5f303cf4ccad64e8580000019dba8ea7cf
│           │           ├── 6ada2042aa825faff88b782b533494050c60592f26d19942decd1bbfc9c4f81a0000019dba8ec4be
│           │           ├── 9886e5639ebe8f3e57e4017e8d6aa63d4d05e936cd7ee311e3ad122f91f803ee0000019dba8ebb4f
│           │           ├── c89f8b7a960f31dffb6c80bfff783acbc91587d24d4c9b2c927385b0bc4c9d530000019dba8e9317
│           │           ├── d6d1b2259a45b6c42e4f8f8c49dda373d1a35bdccff7f7645002af0a6be2a6f10000019dba8e9d1c
│           │           └── e2ad891f12d4d60b646999aa3e34020bff78000e3b2dd87800049575b16ac79e0000019dba8f0bcc
│           └── workflows/
├── backend/
│   ├── .github/
│   │   └── workflows/
│   │       ├── codeql.yml
│   │       ├── deploy.yml
│   │       ├── quality.yml
│   │       └── security.yml
│   ├── .wrangler/
│   │   ├── state/
│   │   │   └── v3/
│   │   │       ├── cache/
│   │   │       │   └── miniflare-CacheObject/
│   │   │       │       ├── metadata.sqlite
│   │   │       │       ├── metadata.sqlite-shm
│   │   │       │       └── metadata.sqlite-wal
│   │   │       ├── d1/
│   │   │       │   └── miniflare-D1DatabaseObject/
│   │   │       │       ├── 05d4084730d36b1073d62c37ab83e9c425d795b5ff34ed949083cdbf02fd7b33.sqlite
│   │   │       │       ├── 05d4084730d36b1073d62c37ab83e9c425d795b5ff34ed949083cdbf02fd7b33.sqlite-shm
│   │   │       │       ├── 05d4084730d36b1073d62c37ab83e9c425d795b5ff34ed949083cdbf02fd7b33.sqlite-wal
│   │   │       │       ├── metadata.sqlite
│   │   │       │       ├── metadata.sqlite-shm
│   │   │       │       └── metadata.sqlite-wal
│   │   │       ├── kv/
│   │   │       │   ├── 48d7f62733794b62b0a2c0f9049984e1/
│   │   │       │   │   └── blobs/
│   │   │       │   │       ├── 0e7ea69a76d23625ad2c49b36b65bab6649ce06127645a456faf3a366537cc090000019d3e99f9b0
│   │   │       │   │       ├── 13367cf2bc7f885801c527083dba3b405f49e69267eb61ad201d7921cb9d21090000019d3d20c561
│   │   │       │   │       ├── 4646dc98b97823a913dc2744f0ffcf53ad3a8fed33b1170fb804e17fad7521b40000019d3e993cad
│   │   │       │   │       ├── 4e0dab56072233d11cf882f20fed86583b4c001da97bd5b050038af05dc9b7580000019d3d17ee1f
│   │   │       │   │       ├── 4e8fd87e8ceb9800cda3ef09b78990c0a793dbcbc43abbb6ca518eee81f6ecf00000019d3e8d4fdb
│   │   │       │   │       ├── 50faf9ad0e4da21146100d324bc8820285e088c4b9bc68238d1cafb2790a72b00000019d3d28e449
│   │   │       │   │       ├── 59a615b94f27e572aa98e14bc3e3f7c5522e41f24d32bb1dd280c3ae9fbe3ff70000019d3ce456f4
│   │   │       │   │       ├── 70579e538f4c3e93eea262cf72ce07a1385d550c953cf69ddd8419b8755a66250000019d3d0d0191
│   │   │       │   │       ├── 80c64b289c91eca43f764d9dc05ec363f0f23a04d28f027edee54ca9980156f90000019d3e9a9c62
│   │   │       │   │       ├── 82dc07a359496e580d57f27244ac8023e36ba8118633933b1648bee72feb59180000019d3d27b67d
│   │   │       │   │       ├── 8b99f281b8417b06729da96e2a4562c5016fe98c0ed0a0cd50ad274f325ca3690000019d3d1ca048
│   │   │       │   │       ├── bf51a651dca95bcc88a87877f0ec4a49aba3a8fac172dc466e522f264d6bf0b70000019d3d02f375
│   │   │       │   │       ├── d12efcf81593f0a925aeebca7356f04ef8f87f95558783f82ee8cc2c519febe70000019d3d0df6c0
│   │   │       │   │       ├── de585b65e80992b7a393e34c684ef04c07b21b03614cdddaa04270ad3036e5880000019d3cf64e2b
│   │   │       │   │       ├── e5b15d78f89bd522ec300a4e815a77ccd4035a6cd4c17be862ed45a4b1e30ac00000019d3d0f773b
│   │   │       │   │       ├── e6194933bc0d3a48597f38b6f3c66b3f86e45707bb9c532f0703f9157affcb620000019d3ec183b8
│   │   │       │   │       ├── eca3f03972647c6ee9f52082c66fe4b34095b9696c48ae1a4ca70f78bad2f0280000019d3d261570
│   │   │       │   │       └── f991529709ce63967936076da5b63667ea9a95227ea4be72d1f0d7c83c87fc190000019d9cbbea79
│   │   │       │   ├── 8a05d6f497e64e628fa34bde0622ffd4/
│   │   │       │   │   └── blobs/
│   │   │       │   │       ├── 3d7d131b730f131b63c647f7d0771a9abdc8daaff68ba0734d29759658b8fc120000019d9cbcd510
│   │   │       │   │       ├── 54e411c0464663fb34c8d6fddf454adcc19f4196ed9cfda8f9d68802451f750c0000019d9cbcd511
│   │   │       │   │       ├── 76e191c7e34c923e0b537bfa34a5687960e6964e6094193e938e2eb93a1e26450000019d9cb8cf59
│   │   │       │   │       └── df7bf278972396cfa84f981a57355a2da14ca307a8d5d0deed0e4702fb003de00000019d9cb8cf7e
│   │   │       │   └── miniflare-KVNamespaceObject/
│   │   │       │       ├── 36d95d988cc39a69c2d478ce39505e2db13e841c0b4171fec52908c53ccecad9.sqlite
│   │   │       │       ├── 544dbedac54537fab191c82cd4f5a931dcfc1110a610a709ee9e64c5f4cf55fc.sqlite
│   │   │       │       ├── metadata.sqlite
│   │   │       │       ├── metadata.sqlite-shm
│   │   │       │       └── metadata.sqlite-wal
│   │   │       ├── r2/
│   │   │       │   ├── miniflare-R2BucketObject/
│   │   │       │   │   ├── 5054bdc64b51388aa64f848ecb37fc148c481b4a608bc50c7b8dc7c9e1cae8cc.sqlite
│   │   │       │   │   ├── 5054bdc64b51388aa64f848ecb37fc148c481b4a608bc50c7b8dc7c9e1cae8cc.sqlite-shm
│   │   │       │   │   ├── 5054bdc64b51388aa64f848ecb37fc148c481b4a608bc50c7b8dc7c9e1cae8cc.sqlite-wal
│   │   │       │   │   ├── metadata.sqlite
│   │   │       │   │   ├── metadata.sqlite-shm
│   │   │       │   │   └── metadata.sqlite-wal
│   │   │       │   └── socialfi/
│   │   │       │       └── blobs/
│   │   │       │           ├── 1fc020032d9f7c68c58ce29944aa5c98eb1fdf676178363fa99b9f17845222910000019dc2d2ee43
│   │   │       │           └── 5d002179b89270a3514d458989f688d477f832df18873a530defe1dbeef458e40000019dbb12d640
│   │   │       └── workflows/
│   │   └── tmp/
│   ├── migrations/
│   │   ├── meta/
│   │   │   ├── _journal.json
│   │   │   ├── 0000_snapshot.json
│   │   │   ├── 0001_snapshot.json
│   │   │   ├── 0002_snapshot.json
│   │   │   ├── 0003_snapshot.json
│   │   │   ├── 0004_snapshot.json
│   │   │   └── 0005_snapshot.json
│   │   ├── 0000_glamorous_lockjaw.sql
│   │   ├── 0001_steady_enchantress.sql
│   │   ├── 0002_condemned_viper.sql
│   │   ├── 0003_marvelous_shockwave.sql
│   │   ├── 0004_overjoyed_triathlon.sql
│   │   └── 0005_melted_meltdown.sql
│   ├── public/
│   │   ├── assets/
│   │   │   └── images/
│   │   │       └── avatars/
│   │   │           └── synthetic/
│   │   │               ├── arthur_guimaraes.png
│   │   │               ├── carolina_alves.png
│   │   │               ├── eleonora_bittencourt.png
│   │   │               ├── felipe_rios.png
│   │   │               ├── helena_moraes.png
│   │   │               ├── isabella_viana.png
│   │   │               ├── leonardo_ferraz.png
│   │   │               ├── livia_guedes.png
│   │   │               ├── rafael_costa.png
│   │   │               └── thiago_mendes.png
│   │   ├── css/
│   │   │   └── style.css
│   │   ├── icons/
│   │   │   ├── android-chrome-192x192.png
│   │   │   ├── android-chrome-512x512.png
│   │   │   ├── apple-touch-icon.png
│   │   │   ├── favicon-16x16.png
│   │   │   └── favicon-32x32.png
│   │   ├── img/
│   │   │   └── social-preview.png
│   │   ├── js/
│   │   │   └── dashboard.js
│   │   ├── favicon.ico
│   │   ├── robots.txt
│   │   ├── site.webmanifest
│   │   └── sitemap.xml
│   ├── src/
│   │   ├── db/
│   │   │   ├── index.ts
│   │   │   └── schema.ts
│   │   ├── middleware/
│   │   │   ├── auth_signature.test.ts
│   │   │   ├── auth_signature.ts
│   │   │   └── rbac.ts
│   │   ├── routes/
│   │   │   ├── core/
│   │   │   │   ├── identity/
│   │   │   │   │   ├── identity.test.ts
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── local.ts
│   │   │   │   │   └── oauth.ts
│   │   │   │   ├── compliance.test.ts
│   │   │   │   ├── compliance.ts
│   │   │   │   ├── health.test.ts
│   │   │   │   ├── health.ts
│   │   │   │   └── webhooks.ts
│   │   │   ├── platform/
│   │   │   │   ├── email.ts
│   │   │   │   ├── governance.ts
│   │   │   │   ├── identity.ts
│   │   │   │   ├── payments.ts
│   │   │   │   ├── storage.ts
│   │   │   │   └── treasury.ts
│   │   │   └── products/
│   │   │       ├── agro/
│   │   │       │   └── index.ts
│   │   │       ├── exchange/
│   │   │       │   └── index.ts
│   │   │       ├── real-estate/
│   │   │       │   ├── index.ts
│   │   │       │   └── real-estate.test.ts
│   │   │       ├── rwa/
│   │   │       │   └── index.ts
│   │   │       └── blog.ts
│   │   ├── services/
│   │   │   ├── email/
│   │   │   │   └── sendpulse.ts
│   │   │   ├── audit.ts
│   │   │   └── market.ts
│   │   ├── types/
│   │   │   ├── bindings.d.ts
│   │   │   └── manifest.d.ts
│   │   ├── utils/
│   │   │   ├── crypto.ts
│   │   │   ├── did_resolver.ts
│   │   │   ├── response.ts
│   │   │   └── timing_safe.ts
│   │   ├── validators/
│   │   │   ├── auth.ts
│   │   │   ├── email.ts
│   │   │   └── real-estate.ts
│   │   ├── views/
│   │   │   └── dashboard.ts
│   │   └── index.ts
│   ├── tools/
│   │   └── test-siwe.ts
│   ├── .dev.vars
│   ├── .gitignore
│   ├── .prettierrc
│   ├── drizzle.config.ts
│   ├── fresh_start.sql
│   ├── LICENSE
│   ├── package.json
│   ├── r2-cors.json
│   ├── README.md
│   ├── seed_blog_posts.sql
│   ├── seed_synthetic_users.sql
│   ├── server.log
│   ├── tsc_errors.log
│   ├── tsconfig.json
│   ├── vitest.config.ts
│   ├── worker-configuration.d.ts
│   ├── wrangler_dev.log
│   └── wrangler.toml
├── dashboard/
│   ├── public/
│   │   ├── assets/
│   │   │   ├── background/
│   │   │   │   ├── background-3-blur.webp
│   │   │   │   ├── background-3.webp
│   │   │   │   ├── background-4.jpg
│   │   │   │   ├── background-5.webp
│   │   │   │   ├── background-6.webp
│   │   │   │   ├── background-7.webp
│   │   │   │   ├── overlay.svg
│   │   │   │   ├── shape-circle-1.svg
│   │   │   │   ├── shape-circle-3.svg
│   │   │   │   └── shape-square.svg
│   │   │   ├── icons/
│   │   │   │   ├── apps/
│   │   │   │   │   ├── ic-app-1.webp
│   │   │   │   │   ├── ic-app-2.webp
│   │   │   │   │   ├── ic-app-3.webp
│   │   │   │   │   ├── ic-app-4.webp
│   │   │   │   │   ├── ic-app-5.webp
│   │   │   │   │   ├── ic-app-drive.svg
│   │   │   │   │   ├── ic-app-dropbox.svg
│   │   │   │   │   └── ic-app-onedrive.svg
│   │   │   │   ├── components/
│   │   │   │   │   ├── ic-accordion.svg
│   │   │   │   │   ├── ic-alert.svg
│   │   │   │   │   ├── ic-autocomplete.svg
│   │   │   │   │   ├── ic-avatar.svg
│   │   │   │   │   ├── ic-badge.svg
│   │   │   │   │   ├── ic-breadcrumbs.svg
│   │   │   │   │   ├── ic-buttons.svg
│   │   │   │   │   ├── ic-checkbox.svg
│   │   │   │   │   ├── ic-chip.svg
│   │   │   │   │   ├── ic-colors.svg
│   │   │   │   │   ├── ic-data-grid.svg
│   │   │   │   │   ├── ic-date-pickers.svg
│   │   │   │   │   ├── ic-dialog.svg
│   │   │   │   │   ├── ic-drawer.svg
│   │   │   │   │   ├── ic-extra-animate.svg
│   │   │   │   │   ├── ic-extra-carousel.svg
│   │   │   │   │   ├── ic-extra-chart.svg
│   │   │   │   │   ├── ic-extra-dnd.svg
│   │   │   │   │   ├── ic-extra-editor.svg
│   │   │   │   │   ├── ic-extra-form-validation.svg
│   │   │   │   │   ├── ic-extra-form-wizard.svg
│   │   │   │   │   ├── ic-extra-image.svg
│   │   │   │   │   ├── ic-extra-label.svg
│   │   │   │   │   ├── ic-extra-layout.svg
│   │   │   │   │   ├── ic-extra-lightbox.svg
│   │   │   │   │   ├── ic-extra-map.svg
│   │   │   │   │   ├── ic-extra-markdown.svg
│   │   │   │   │   ├── ic-extra-mega-menu.svg
│   │   │   │   │   ├── ic-extra-multi-language.svg
│   │   │   │   │   ├── ic-extra-navigation-bar.svg
│   │   │   │   │   ├── ic-extra-organization-chart.svg
│   │   │   │   │   ├── ic-extra-scroll-progress.svg
│   │   │   │   │   ├── ic-extra-scrollbar.svg
│   │   │   │   │   ├── ic-extra-snackbar.svg
│   │   │   │   │   ├── ic-extra-upload.svg
│   │   │   │   │   ├── ic-extra-utilities.svg
│   │   │   │   │   ├── ic-extra-walktour.svg
│   │   │   │   │   ├── ic-grid.svg
│   │   │   │   │   ├── ic-icons.svg
│   │   │   │   │   ├── ic-list.svg
│   │   │   │   │   ├── ic-menu.svg
│   │   │   │   │   ├── ic-pagination.svg
│   │   │   │   │   ├── ic-popover.svg
│   │   │   │   │   ├── ic-progress.svg
│   │   │   │   │   ├── ic-radio-button.svg
│   │   │   │   │   ├── ic-rating.svg
│   │   │   │   │   ├── ic-shadows.svg
│   │   │   │   │   ├── ic-slider.svg
│   │   │   │   │   ├── ic-stepper.svg
│   │   │   │   │   ├── ic-switch.svg
│   │   │   │   │   ├── ic-table.svg
│   │   │   │   │   ├── ic-tabs.svg
│   │   │   │   │   ├── ic-text-field.svg
│   │   │   │   │   ├── ic-timeline.svg
│   │   │   │   │   ├── ic-tooltip.svg
│   │   │   │   │   ├── ic-transfer-list.svg
│   │   │   │   │   ├── ic-tree-view.svg
│   │   │   │   │   └── ic-typography.svg
│   │   │   │   ├── courses/
│   │   │   │   │   ├── ic-courses-certificates.svg
│   │   │   │   │   ├── ic-courses-completed.svg
│   │   │   │   │   └── ic-courses-progress.svg
│   │   │   │   ├── empty/
│   │   │   │   │   ├── ic-cart.svg
│   │   │   │   │   ├── ic-chat-active.svg
│   │   │   │   │   ├── ic-chat-empty.svg
│   │   │   │   │   ├── ic-content.svg
│   │   │   │   │   ├── ic-email-disabled.svg
│   │   │   │   │   ├── ic-email-selected.svg
│   │   │   │   │   ├── ic-folder-empty.svg
│   │   │   │   │   └── ic-mail.svg
│   │   │   │   ├── faqs/
│   │   │   │   │   ├── ic-account.svg
│   │   │   │   │   ├── ic-assurances.svg
│   │   │   │   │   ├── ic-delivery.svg
│   │   │   │   │   ├── ic-package.svg
│   │   │   │   │   ├── ic-payment.svg
│   │   │   │   │   └── ic-refund.svg
│   │   │   │   ├── files/
│   │   │   │   │   ├── ic-ai.svg
│   │   │   │   │   ├── ic-audio.svg
│   │   │   │   │   ├── ic-document.svg
│   │   │   │   │   ├── ic-excel.svg
│   │   │   │   │   ├── ic-file.svg
│   │   │   │   │   ├── ic-folder.svg
│   │   │   │   │   ├── ic-img.svg
│   │   │   │   │   ├── ic-js.svg
│   │   │   │   │   ├── ic-pdf.svg
│   │   │   │   │   ├── ic-power-point.svg
│   │   │   │   │   ├── ic-pts.svg
│   │   │   │   │   ├── ic-txt.svg
│   │   │   │   │   ├── ic-video.svg
│   │   │   │   │   ├── ic-word.svg
│   │   │   │   │   └── ic-zip.svg
│   │   │   │   ├── glass/
│   │   │   │   │   ├── ic-glass-bag.svg
│   │   │   │   │   ├── ic-glass-buy.svg
│   │   │   │   │   ├── ic-glass-message.svg
│   │   │   │   │   └── ic-glass-users.svg
│   │   │   │   ├── navbar/
│   │   │   │   │   ├── ic-analytics.svg
│   │   │   │   │   ├── ic-banking.svg
│   │   │   │   │   ├── ic-blank.svg
│   │   │   │   │   ├── ic-blog.svg
│   │   │   │   │   ├── ic-booking.svg
│   │   │   │   │   ├── ic-calendar.svg
│   │   │   │   │   ├── ic-chat.svg
│   │   │   │   │   ├── ic-course.svg
│   │   │   │   │   ├── ic-dashboard.svg
│   │   │   │   │   ├── ic-disabled.svg
│   │   │   │   │   ├── ic-ecommerce.svg
│   │   │   │   │   ├── ic-external.svg
│   │   │   │   │   ├── ic-file.svg
│   │   │   │   │   ├── ic-folder.svg
│   │   │   │   │   ├── ic-invoice.svg
│   │   │   │   │   ├── ic-job.svg
│   │   │   │   │   ├── ic-label.svg
│   │   │   │   │   ├── ic-lock.svg
│   │   │   │   │   ├── ic-mail.svg
│   │   │   │   │   ├── ic-menu-item.svg
│   │   │   │   │   ├── ic-order.svg
│   │   │   │   │   ├── ic-params.svg
│   │   │   │   │   ├── ic-product.svg
│   │   │   │   │   ├── ic-subpaths.svg
│   │   │   │   │   ├── ic-tour.svg
│   │   │   │   │   └── ic-user.svg
│   │   │   │   ├── platforms/
│   │   │   │   │   ├── ic-amplify.svg
│   │   │   │   │   ├── ic-auth0.svg
│   │   │   │   │   ├── ic-figma.svg
│   │   │   │   │   ├── ic-firebase.svg
│   │   │   │   │   ├── ic-js.svg
│   │   │   │   │   ├── ic-jwt.svg
│   │   │   │   │   ├── ic-mui.svg
│   │   │   │   │   ├── ic-nextjs.svg
│   │   │   │   │   ├── ic-react.svg
│   │   │   │   │   ├── ic-supabase.svg
│   │   │   │   │   ├── ic-ts.svg
│   │   │   │   │   └── ic-vite.svg
│   │   │   │   └── workspaces/
│   │   │   │       ├── logo-1.webp
│   │   │   │       ├── logo-2.webp
│   │   │   │       └── logo-3.webp
│   │   │   ├── illustrations/
│   │   │   │   ├── characters/
│   │   │   │   │   ├── character-fly.webp
│   │   │   │   │   ├── character-happy-jump.webp
│   │   │   │   │   ├── character-maintenance.webp
│   │   │   │   │   ├── character-notification.webp
│   │   │   │   │   ├── character-present.webp
│   │   │   │   │   ├── character-question.webp
│   │   │   │   │   ├── character-reject.webp
│   │   │   │   │   └── character-study.webp
│   │   │   │   ├── illustration-dashboard.webp
│   │   │   │   ├── illustration-integration.webp
│   │   │   │   ├── illustration-receipt.webp
│   │   │   │   ├── illustration-rocket-large.webp
│   │   │   │   ├── illustration-rocket-small.webp
│   │   │   │   └── illustration-upgrade.webp
│   │   │   └── images/
│   │   │       ├── about/
│   │   │       │   ├── hero.webp
│   │   │       │   ├── testimonials.webp
│   │   │       │   ├── vision.webp
│   │   │       │   ├── what-large.webp
│   │   │       │   └── what-small.webp
│   │   │       ├── contact/
│   │   │       │   └── hero.webp
│   │   │       ├── faqs/
│   │   │       │   └── hero.webp
│   │   │       ├── home/
│   │   │       │   ├── bundle-dark-1.webp
│   │   │       │   ├── bundle-dark-2.webp
│   │   │       │   ├── bundle-light-1.webp
│   │   │       │   ├── bundle-light-2.webp
│   │   │       │   ├── for-designer.webp
│   │   │       │   ├── hero-blur.webp
│   │   │       │   ├── highlight-darkmode.webp
│   │   │       │   ├── highlight-presets-1.webp
│   │   │       │   ├── highlight-presets-2.webp
│   │   │       │   ├── highlight-presets-3.webp
│   │   │       │   ├── highlight-presets-4.webp
│   │   │       │   ├── highlight-presets-5.webp
│   │   │       │   ├── highlight-rtl.webp
│   │   │       │   ├── home-chart.webp
│   │   │       │   └── zone-landing.webp
│   │   │       └── mock/
│   │   │           ├── avatar/
│   │   │           │   ├── avatar-1.webp
│   │   │           │   ├── avatar-10.webp
│   │   │           │   ├── avatar-11.webp
│   │   │           │   ├── avatar-12.webp
│   │   │           │   ├── avatar-13.webp
│   │   │           │   ├── avatar-14.webp
│   │   │           │   ├── avatar-15.webp
│   │   │           │   ├── avatar-16.webp
│   │   │           │   ├── avatar-17.webp
│   │   │           │   ├── avatar-18.webp
│   │   │           │   ├── avatar-19.webp
│   │   │           │   ├── avatar-2.webp
│   │   │           │   ├── avatar-20.webp
│   │   │           │   ├── avatar-21.webp
│   │   │           │   ├── avatar-22.webp
│   │   │           │   ├── avatar-23.webp
│   │   │           │   ├── avatar-24.webp
│   │   │           │   ├── avatar-25.webp
│   │   │           │   ├── avatar-3.webp
│   │   │           │   ├── avatar-4.webp
│   │   │           │   ├── avatar-5.webp
│   │   │           │   ├── avatar-6.webp
│   │   │           │   ├── avatar-7.webp
│   │   │           │   ├── avatar-8.webp
│   │   │           │   └── avatar-9.webp
│   │   │           ├── company/
│   │   │           │   ├── company-1.webp
│   │   │           │   ├── company-10.webp
│   │   │           │   ├── company-11.webp
│   │   │           │   ├── company-12.webp
│   │   │           │   ├── company-2.webp
│   │   │           │   ├── company-3.webp
│   │   │           │   ├── company-4.webp
│   │   │           │   ├── company-5.webp
│   │   │           │   ├── company-6.webp
│   │   │           │   ├── company-7.webp
│   │   │           │   ├── company-8.webp
│   │   │           │   └── company-9.webp
│   │   │           ├── course/
│   │   │           │   ├── about-summary.webp
│   │   │           │   ├── course-1.webp
│   │   │           │   ├── course-10.webp
│   │   │           │   ├── course-11.webp
│   │   │           │   ├── course-12.webp
│   │   │           │   ├── course-2.webp
│   │   │           │   ├── course-3.webp
│   │   │           │   ├── course-4.webp
│   │   │           │   ├── course-5.webp
│   │   │           │   ├── course-6.webp
│   │   │           │   ├── course-7.webp
│   │   │           │   ├── course-8.webp
│   │   │           │   ├── course-9.webp
│   │   │           │   ├── course-large-1.webp
│   │   │           │   ├── course-large-2.webp
│   │   │           │   ├── course-large-3.webp
│   │   │           │   ├── download-app.webp
│   │   │           │   ├── home-summary.webp
│   │   │           │   └── teacher-hero.webp
│   │   │           ├── cover/
│   │   │           │   ├── cover-1.webp
│   │   │           │   ├── cover-10.webp
│   │   │           │   ├── cover-11.webp
│   │   │           │   ├── cover-12.webp
│   │   │           │   ├── cover-13.webp
│   │   │           │   ├── cover-14.webp
│   │   │           │   ├── cover-15.webp
│   │   │           │   ├── cover-16.webp
│   │   │           │   ├── cover-17.webp
│   │   │           │   ├── cover-18.webp
│   │   │           │   ├── cover-19.webp
│   │   │           │   ├── cover-2.webp
│   │   │           │   ├── cover-20.webp
│   │   │           │   ├── cover-21.webp
│   │   │           │   ├── cover-22.webp
│   │   │           │   ├── cover-23.webp
│   │   │           │   ├── cover-24.webp
│   │   │           │   ├── cover-3.webp
│   │   │           │   ├── cover-4.webp
│   │   │           │   ├── cover-5.webp
│   │   │           │   ├── cover-6.webp
│   │   │           │   ├── cover-7.webp
│   │   │           │   ├── cover-8.webp
│   │   │           │   └── cover-9.webp
│   │   │           ├── m-product/
│   │   │           │   ├── product-1.webp
│   │   │           │   ├── product-10.webp
│   │   │           │   ├── product-11.webp
│   │   │           │   ├── product-12.webp
│   │   │           │   ├── product-13.webp
│   │   │           │   ├── product-14.webp
│   │   │           │   ├── product-15.webp
│   │   │           │   ├── product-16.webp
│   │   │           │   ├── product-17.webp
│   │   │           │   ├── product-18.webp
│   │   │           │   ├── product-19.webp
│   │   │           │   ├── product-2.webp
│   │   │           │   ├── product-20.webp
│   │   │           │   ├── product-21.webp
│   │   │           │   ├── product-22.webp
│   │   │           │   ├── product-23.webp
│   │   │           │   ├── product-24.webp
│   │   │           │   ├── product-3.webp
│   │   │           │   ├── product-4.webp
│   │   │           │   ├── product-5.webp
│   │   │           │   ├── product-6.webp
│   │   │           │   ├── product-7.webp
│   │   │           │   ├── product-8.webp
│   │   │           │   └── product-9.webp
│   │   │           ├── portrait/
│   │   │           │   ├── portrait-1.webp
│   │   │           │   ├── portrait-2.webp
│   │   │           │   ├── portrait-3.webp
│   │   │           │   ├── portrait-4.webp
│   │   │           │   ├── portrait-5.webp
│   │   │           │   ├── portrait-6.webp
│   │   │           │   ├── portrait-7.webp
│   │   │           │   └── portrait-8.webp
│   │   │           └── travel/
│   │   │               ├── travel-1.webp
│   │   │               ├── travel-10.webp
│   │   │               ├── travel-11.webp
│   │   │               ├── travel-12.webp
│   │   │               ├── travel-13.webp
│   │   │               ├── travel-14.webp
│   │   │               ├── travel-15.webp
│   │   │               ├── travel-16.webp
│   │   │               ├── travel-2.webp
│   │   │               ├── travel-3.webp
│   │   │               ├── travel-4.webp
│   │   │               ├── travel-5.webp
│   │   │               ├── travel-6.webp
│   │   │               ├── travel-7.webp
│   │   │               ├── travel-8.webp
│   │   │               └── travel-9.webp
│   │   ├── fonts/
│   │   │   ├── Roboto-Bold.ttf
│   │   │   └── Roboto-Regular.ttf
│   │   ├── logo/
│   │   │   ├── logo-full.png
│   │   │   ├── logo-full.svg
│   │   │   ├── logo-single.png
│   │   │   └── logo-single.svg
│   │   └── favicon.ico
│   ├── src/
│   │   ├── _mock/
│   │   │   ├── _blog.ts
│   │   │   ├── _calendar.ts
│   │   │   ├── _files.ts
│   │   │   ├── _invoice.ts
│   │   │   ├── _mock.ts
│   │   │   ├── _order.ts
│   │   │   ├── _others.ts
│   │   │   ├── _overview.ts
│   │   │   ├── _product.ts
│   │   │   ├── _tour.ts
│   │   │   ├── _user.ts
│   │   │   ├── assets.ts
│   │   │   └── index.ts
│   │   ├── actions/
│   │   │   ├── blog.ts
│   │   │   ├── calendar.ts
│   │   │   ├── chat.ts
│   │   │   ├── mail.ts
│   │   │   └── product.ts
│   │   ├── assets/
│   │   │   ├── data/
│   │   │   │   ├── countries.ts
│   │   │   │   └── index.ts
│   │   │   ├── icons/
│   │   │   │   ├── email-inbox-icon.tsx
│   │   │   │   ├── index.ts
│   │   │   │   ├── new-password-icon.tsx
│   │   │   │   ├── password-icon.tsx
│   │   │   │   ├── plan-free-icon.tsx
│   │   │   │   ├── plan-premium-icon.tsx
│   │   │   │   ├── plan-starter-icon.tsx
│   │   │   │   └── sent-icon.tsx
│   │   │   └── illustrations/
│   │   │       ├── avatar-shape.tsx
│   │   │       ├── background-shape.tsx
│   │   │       ├── booking-illustration.tsx
│   │   │       ├── check-in-illustration.tsx
│   │   │       ├── check-out-illustration.tsx
│   │   │       ├── coming-soon-illustration.tsx
│   │   │       ├── forbidden-illustration.tsx
│   │   │       ├── index.ts
│   │   │       ├── maintenance-illustration.tsx
│   │   │       ├── motivation-illustration.tsx
│   │   │       ├── order-complete-illustration.tsx
│   │   │       ├── page-not-found-illustration.tsx
│   │   │       ├── seo-illustration.tsx
│   │   │       ├── server-error-illustration.tsx
│   │   │       └── upload-illustration.tsx
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   ├── form-divider.tsx
│   │   │   │   ├── form-head.tsx
│   │   │   │   ├── form-resend-code.tsx
│   │   │   │   ├── form-return-link.tsx
│   │   │   │   ├── form-socials.tsx
│   │   │   │   └── sign-up-terms.tsx
│   │   │   ├── context/
│   │   │   │   ├── jwt/
│   │   │   │   │   ├── action.ts
│   │   │   │   │   ├── auth-provider.tsx
│   │   │   │   │   ├── constant.ts
│   │   │   │   │   ├── index.ts
│   │   │   │   │   └── utils.ts
│   │   │   │   └── auth-context.tsx
│   │   │   ├── guard/
│   │   │   │   ├── auth-guard.tsx
│   │   │   │   ├── guest-guard.tsx
│   │   │   │   ├── index.ts
│   │   │   │   └── role-based-guard.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── index.ts
│   │   │   │   ├── use-auth-context.ts
│   │   │   │   └── use-mocked-user.ts
│   │   │   ├── utils/
│   │   │   │   ├── error-message.ts
│   │   │   │   └── index.ts
│   │   │   ├── view/
│   │   │   │   └── jwt/
│   │   │   │       ├── index.ts
│   │   │   │       ├── jwt-reset-password-view.tsx
│   │   │   │       ├── jwt-sign-in-view.tsx
│   │   │   │       ├── jwt-sign-up-view.tsx
│   │   │   │       ├── jwt-update-password-view.tsx
│   │   │   │       └── jwt-verify-view.tsx
│   │   │   ├── auth-system.md
│   │   │   └── types.ts
│   │   ├── components/
│   │   │   ├── animate/
│   │   │   │   ├── scroll-progress/
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── scroll-progress.tsx
│   │   │   │   │   └── use-scroll-progress.ts
│   │   │   │   ├── variants/
│   │   │   │   │   ├── actions.ts
│   │   │   │   │   ├── background.ts
│   │   │   │   │   ├── bounce.ts
│   │   │   │   │   ├── container.ts
│   │   │   │   │   ├── fade.ts
│   │   │   │   │   ├── flip.ts
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── path.ts
│   │   │   │   │   ├── rotate.ts
│   │   │   │   │   ├── scale.ts
│   │   │   │   │   ├── slide.ts
│   │   │   │   │   ├── transition.ts
│   │   │   │   │   └── zoom.ts
│   │   │   │   ├── animate-border.tsx
│   │   │   │   ├── animate-count-up.tsx
│   │   │   │   ├── animate-logo.tsx
│   │   │   │   ├── animate-text.tsx
│   │   │   │   ├── back-to-top-button.tsx
│   │   │   │   ├── index.ts
│   │   │   │   ├── motion-container.tsx
│   │   │   │   ├── motion-lazy.tsx
│   │   │   │   └── motion-viewport.tsx
│   │   │   ├── carousel/
│   │   │   │   ├── components/
│   │   │   │   │   ├── arrow-button.tsx
│   │   │   │   │   ├── carousel-arrow-buttons.tsx
│   │   │   │   │   ├── carousel-dot-buttons.tsx
│   │   │   │   │   ├── carousel-progress-bar.tsx
│   │   │   │   │   ├── carousel-slide.tsx
│   │   │   │   │   ├── carousel-thumb.tsx
│   │   │   │   │   ├── carousel-thumbs.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── hooks/
│   │   │   │   │   ├── use-carousel-arrows.ts
│   │   │   │   │   ├── use-carousel-auto-scroll.ts
│   │   │   │   │   ├── use-carousel-autoplay.ts
│   │   │   │   │   ├── use-carousel-dots.ts
│   │   │   │   │   ├── use-carousel-parallax.ts
│   │   │   │   │   ├── use-carousel-progress.ts
│   │   │   │   │   ├── use-carousel.ts
│   │   │   │   │   └── use-thumbs.ts
│   │   │   │   ├── breakpoints.ts
│   │   │   │   ├── carousel.tsx
│   │   │   │   ├── classes.ts
│   │   │   │   ├── index.ts
│   │   │   │   ├── types.ts
│   │   │   │   └── utils.ts
│   │   │   ├── chart/
│   │   │   │   ├── components/
│   │   │   │   │   ├── chart-legends.tsx
│   │   │   │   │   ├── chart-loading.tsx
│   │   │   │   │   ├── chart-select.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── chart.tsx
│   │   │   │   ├── classes.ts
│   │   │   │   ├── index.ts
│   │   │   │   ├── styles.css
│   │   │   │   ├── types.ts
│   │   │   │   └── use-chart.ts
│   │   │   ├── color-utils/
│   │   │   │   ├── classes.ts
│   │   │   │   ├── color-picker.tsx
│   │   │   │   ├── color-preview.tsx
│   │   │   │   └── index.ts
│   │   │   ├── country-select/
│   │   │   │   ├── country-select.tsx
│   │   │   │   └── index.ts
│   │   │   ├── custom-breadcrumbs/
│   │   │   │   ├── back-link.tsx
│   │   │   │   ├── breadcrumb-link.tsx
│   │   │   │   ├── custom-breadcrumbs.tsx
│   │   │   │   ├── index.ts
│   │   │   │   ├── more-links.tsx
│   │   │   │   └── styles.tsx
│   │   │   ├── custom-data-grid/
│   │   │   │   ├── grid-actions-cell-item.tsx
│   │   │   │   ├── index.ts
│   │   │   │   ├── toolbar-core.tsx
│   │   │   │   └── toolbar-extend-settings.tsx
│   │   │   ├── custom-date-range-picker/
│   │   │   │   ├── custom-date-range-picker.tsx
│   │   │   │   ├── index.ts
│   │   │   │   └── use-date-range-picker.ts
│   │   │   ├── custom-dialog/
│   │   │   │   ├── confirm-dialog.tsx
│   │   │   │   ├── index.ts
│   │   │   │   └── types.ts
│   │   │   ├── custom-popover/
│   │   │   │   ├── custom-popover.tsx
│   │   │   │   ├── hooks.ts
│   │   │   │   ├── index.ts
│   │   │   │   ├── styles.tsx
│   │   │   │   ├── types.ts
│   │   │   │   └── utils.ts
│   │   │   ├── editor/
│   │   │   │   ├── components/
│   │   │   │   │   ├── bubble-toolbar.tsx
│   │   │   │   │   ├── code-highlight-block.css
│   │   │   │   │   ├── code-highlight-block.tsx
│   │   │   │   │   ├── heading-block.tsx
│   │   │   │   │   ├── image-block.tsx
│   │   │   │   │   ├── link-block.tsx
│   │   │   │   │   ├── toolbar-icons.tsx
│   │   │   │   │   ├── toolbar-item.tsx
│   │   │   │   │   ├── toolbar.tsx
│   │   │   │   │   └── use-toolbar-state.ts
│   │   │   │   ├── extension/
│   │   │   │   │   ├── clear-format.ts
│   │   │   │   │   └── text-transform.ts
│   │   │   │   ├── classes.ts
│   │   │   │   ├── editor.tsx
│   │   │   │   ├── index.ts
│   │   │   │   ├── styles.tsx
│   │   │   │   └── types.ts
│   │   │   ├── empty-content/
│   │   │   │   ├── empty-content.tsx
│   │   │   │   └── index.ts
│   │   │   ├── file-thumbnail/
│   │   │   │   ├── classes.ts
│   │   │   │   ├── file-thumbnail.tsx
│   │   │   │   ├── index.ts
│   │   │   │   ├── styles.tsx
│   │   │   │   ├── types.ts
│   │   │   │   ├── use-file-preview.ts
│   │   │   │   └── utils.ts
│   │   │   ├── filters-result/
│   │   │   │   ├── filters-block.tsx
│   │   │   │   ├── filters-result.tsx
│   │   │   │   └── index.ts
│   │   │   ├── flag-icon/
│   │   │   │   ├── classes.ts
│   │   │   │   ├── flag-icon.tsx
│   │   │   │   └── index.ts
│   │   │   ├── hook-form/
│   │   │   │   ├── fields.tsx
│   │   │   │   ├── form-provider.tsx
│   │   │   │   ├── help-text.tsx
│   │   │   │   ├── index.ts
│   │   │   │   ├── rhf-autocomplete.tsx
│   │   │   │   ├── rhf-checkbox.tsx
│   │   │   │   ├── rhf-code.tsx
│   │   │   │   ├── rhf-country-select.tsx
│   │   │   │   ├── rhf-date-picker.tsx
│   │   │   │   ├── rhf-editor.tsx
│   │   │   │   ├── rhf-number-input.tsx
│   │   │   │   ├── rhf-phone-input.tsx
│   │   │   │   ├── rhf-radio-group.tsx
│   │   │   │   ├── rhf-rating.tsx
│   │   │   │   ├── rhf-select.tsx
│   │   │   │   ├── rhf-slider.tsx
│   │   │   │   ├── rhf-switch.tsx
│   │   │   │   ├── rhf-text-field.tsx
│   │   │   │   ├── rhf-upload.tsx
│   │   │   │   └── schema-utils.ts
│   │   │   ├── iconify/
│   │   │   │   ├── classes.ts
│   │   │   │   ├── icon-sets.ts
│   │   │   │   ├── iconify.tsx
│   │   │   │   ├── index.ts
│   │   │   │   └── register-icons.ts
│   │   │   ├── image/
│   │   │   │   ├── classes.ts
│   │   │   │   ├── image.tsx
│   │   │   │   ├── index.ts
│   │   │   │   └── styles.tsx
│   │   │   ├── label/
│   │   │   │   ├── classes.ts
│   │   │   │   ├── index.ts
│   │   │   │   ├── label.tsx
│   │   │   │   ├── styles.tsx
│   │   │   │   └── types.ts
│   │   │   ├── lightbox/
│   │   │   │   ├── classes.ts
│   │   │   │   ├── index.ts
│   │   │   │   ├── lightbox.tsx
│   │   │   │   ├── styles.css
│   │   │   │   ├── types.ts
│   │   │   │   ├── use-lightbox.ts
│   │   │   │   └── utils.ts
│   │   │   ├── loading-screen/
│   │   │   │   ├── index.ts
│   │   │   │   ├── loading-screen.tsx
│   │   │   │   └── splash-screen.tsx
│   │   │   ├── logo/
│   │   │   │   ├── classes.ts
│   │   │   │   ├── index.ts
│   │   │   │   └── logo.tsx
│   │   │   ├── map/
│   │   │   │   ├── presets/
│   │   │   │   │   ├── dark-matter-gl.json
│   │   │   │   │   ├── positron-gl.json
│   │   │   │   │   └── voyager-gl.json
│   │   │   │   ├── index.ts
│   │   │   │   ├── map-controls.tsx
│   │   │   │   ├── map-marker.tsx
│   │   │   │   ├── map-popup.tsx
│   │   │   │   ├── map-styles.ts
│   │   │   │   ├── map.tsx
│   │   │   │   ├── styles.css
│   │   │   │   └── use-map-marker-popup.ts
│   │   │   ├── markdown/
│   │   │   │   ├── classes.ts
│   │   │   │   ├── code-highlight-block.css
│   │   │   │   ├── html-tags.ts
│   │   │   │   ├── html-to-markdown.ts
│   │   │   │   ├── index.ts
│   │   │   │   ├── markdown.tsx
│   │   │   │   └── styles.tsx
│   │   │   ├── mega-menu/
│   │   │   │   ├── components/
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── nav-carousel.tsx
│   │   │   │   │   ├── nav-drawer.tsx
│   │   │   │   │   ├── nav-dropdown-content.tsx
│   │   │   │   │   ├── nav-dropdown.tsx
│   │   │   │   │   ├── nav-elements.tsx
│   │   │   │   │   ├── nav-item.tsx
│   │   │   │   │   └── nav-sub-list.tsx
│   │   │   │   ├── horizontal/
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── mega-menu-horizontal.tsx
│   │   │   │   │   └── nav-list.tsx
│   │   │   │   ├── mobile/
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── mega-menu-mobile.tsx
│   │   │   │   │   ├── nav-list-collapse.tsx
│   │   │   │   │   └── nav-list-drawer.tsx
│   │   │   │   ├── styles/
│   │   │   │   │   ├── classes.ts
│   │   │   │   │   ├── css-vars.ts
│   │   │   │   │   ├── index.ts
│   │   │   │   │   └── nav-item-styles.tsx
│   │   │   │   ├── utils/
│   │   │   │   │   ├── create-nav-item.ts
│   │   │   │   │   └── index.ts
│   │   │   │   ├── vertical/
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── mega-menu-vertical.tsx
│   │   │   │   │   └── nav-list.tsx
│   │   │   │   ├── index.ts
│   │   │   │   └── types.ts
│   │   │   ├── nav-basic/
│   │   │   │   ├── components/
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── nav-collapse.tsx
│   │   │   │   │   ├── nav-dropdown.tsx
│   │   │   │   │   └── nav-elements.tsx
│   │   │   │   ├── desktop/
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── nav-basic-desktop.tsx
│   │   │   │   │   ├── nav-item.tsx
│   │   │   │   │   └── nav-list.tsx
│   │   │   │   ├── mobile/
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── nav-basic-mobile.tsx
│   │   │   │   │   ├── nav-item.tsx
│   │   │   │   │   └── nav-list.tsx
│   │   │   │   ├── styles/
│   │   │   │   │   ├── classes.ts
│   │   │   │   │   ├── css-vars.ts
│   │   │   │   │   ├── index.ts
│   │   │   │   │   └── nav-item-styles.tsx
│   │   │   │   ├── utils/
│   │   │   │   │   ├── create-nav-item.ts
│   │   │   │   │   └── index.ts
│   │   │   │   ├── index.ts
│   │   │   │   └── types.ts
│   │   │   ├── nav-section/
│   │   │   │   ├── components/
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── nav-collapse.tsx
│   │   │   │   │   ├── nav-dropdown.tsx
│   │   │   │   │   ├── nav-elements.tsx
│   │   │   │   │   └── nav-subheader.tsx
│   │   │   │   ├── horizontal/
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── nav-item.tsx
│   │   │   │   │   ├── nav-list.tsx
│   │   │   │   │   └── nav-section-horizontal.tsx
│   │   │   │   ├── mini/
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── nav-item.tsx
│   │   │   │   │   ├── nav-list.tsx
│   │   │   │   │   └── nav-section-mini.tsx
│   │   │   │   ├── styles/
│   │   │   │   │   ├── classes.ts
│   │   │   │   │   ├── css-vars.ts
│   │   │   │   │   ├── index.ts
│   │   │   │   │   └── nav-item-styles.tsx
│   │   │   │   ├── utils/
│   │   │   │   │   ├── create-nav-item.ts
│   │   │   │   │   └── index.ts
│   │   │   │   ├── vertical/
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── nav-item.tsx
│   │   │   │   │   ├── nav-list.tsx
│   │   │   │   │   └── nav-section-vertical.tsx
│   │   │   │   ├── index.ts
│   │   │   │   └── types.ts
│   │   │   ├── number-input/
│   │   │   │   ├── index.ts
│   │   │   │   ├── number-input.tsx
│   │   │   │   └── styles.tsx
│   │   │   ├── organizational-chart/
│   │   │   │   ├── index.ts
│   │   │   │   ├── organizational-chart.tsx
│   │   │   │   └── types.ts
│   │   │   ├── phone-input/
│   │   │   │   ├── index.ts
│   │   │   │   ├── list-popover.tsx
│   │   │   │   ├── phone-input.tsx
│   │   │   │   └── types.ts
│   │   │   ├── progress-bar/
│   │   │   │   ├── index.ts
│   │   │   │   ├── progress-bar.tsx
│   │   │   │   └── styles.css
│   │   │   ├── scrollbar/
│   │   │   │   ├── classes.ts
│   │   │   │   ├── index.ts
│   │   │   │   ├── scrollbar.tsx
│   │   │   │   ├── styles.css
│   │   │   │   └── types.ts
│   │   │   ├── search-not-found/
│   │   │   │   ├── index.ts
│   │   │   │   └── search-not-found.tsx
│   │   │   ├── settings/
│   │   │   │   ├── context/
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── settings-context.ts
│   │   │   │   │   ├── settings-provider.tsx
│   │   │   │   │   └── use-settings-context.ts
│   │   │   │   ├── drawer/
│   │   │   │   │   ├── base-option.tsx
│   │   │   │   │   ├── font-options.tsx
│   │   │   │   │   ├── fullscreen-button.tsx
│   │   │   │   │   ├── icons.tsx
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── nav-layout-option.tsx
│   │   │   │   │   ├── presets-options.tsx
│   │   │   │   │   ├── settings-drawer.tsx
│   │   │   │   │   └── styles.tsx
│   │   │   │   ├── index.ts
│   │   │   │   ├── settings-config.ts
│   │   │   │   └── types.ts
│   │   │   ├── snackbar/
│   │   │   │   ├── classes.ts
│   │   │   │   ├── index.ts
│   │   │   │   ├── snackbar.tsx
│   │   │   │   └── styles.tsx
│   │   │   ├── svg-color/
│   │   │   │   ├── classes.ts
│   │   │   │   ├── index.ts
│   │   │   │   ├── svg-color.tsx
│   │   │   │   └── types.ts
│   │   │   ├── table/
│   │   │   │   ├── index.ts
│   │   │   │   ├── table-empty-rows.tsx
│   │   │   │   ├── table-head-custom.tsx
│   │   │   │   ├── table-no-data.tsx
│   │   │   │   ├── table-pagination-custom.tsx
│   │   │   │   ├── table-selected-action.tsx
│   │   │   │   ├── table-skeleton.tsx
│   │   │   │   ├── use-table.ts
│   │   │   │   └── utils.ts
│   │   │   └── upload/
│   │   │       ├── avatar/
│   │   │       │   ├── styles.tsx
│   │   │       │   └── upload-avatar.tsx
│   │   │       ├── box/
│   │   │       │   ├── styles.tsx
│   │   │       │   └── upload-box.tsx
│   │   │       ├── components/
│   │   │       │   ├── multi-file-preview.tsx
│   │   │       │   ├── rejected-files.tsx
│   │   │       │   └── single-file-preview.tsx
│   │   │       ├── default/
│   │   │       │   ├── styles.tsx
│   │   │       │   └── upload-default.tsx
│   │   │       ├── classes.ts
│   │   │       ├── index.ts
│   │   │       └── types.ts
│   │   ├── layouts/
│   │   │   ├── auth-centered/
│   │   │   │   ├── content.tsx
│   │   │   │   ├── index.ts
│   │   │   │   └── layout.tsx
│   │   │   ├── components/
│   │   │   │   ├── notifications-drawer/
│   │   │   │   │   ├── icons.tsx
│   │   │   │   │   ├── index.tsx
│   │   │   │   │   └── notification-item.tsx
│   │   │   │   ├── searchbar/
│   │   │   │   │   ├── index.tsx
│   │   │   │   │   ├── result-item.tsx
│   │   │   │   │   └── utils.ts
│   │   │   │   ├── account-button.tsx
│   │   │   │   ├── account-drawer.tsx
│   │   │   │   ├── account-popover.tsx
│   │   │   │   ├── contacts-popover.tsx
│   │   │   │   ├── language-popover.tsx
│   │   │   │   ├── menu-button.tsx
│   │   │   │   ├── nav-toggle-button.tsx
│   │   │   │   ├── nav-upgrade.tsx
│   │   │   │   ├── settings-button.tsx
│   │   │   │   ├── sign-in-button.tsx
│   │   │   │   ├── sign-out-button.tsx
│   │   │   │   └── workspaces-popover.tsx
│   │   │   ├── core/
│   │   │   │   ├── classes.ts
│   │   │   │   ├── css-vars.ts
│   │   │   │   ├── header-section.tsx
│   │   │   │   ├── index.ts
│   │   │   │   ├── layout-section.tsx
│   │   │   │   └── main-section.tsx
│   │   │   ├── dashboard/
│   │   │   │   ├── content.tsx
│   │   │   │   ├── css-vars.ts
│   │   │   │   ├── index.ts
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── nav-horizontal.tsx
│   │   │   │   ├── nav-mobile.tsx
│   │   │   │   └── nav-vertical.tsx
│   │   │   ├── main/
│   │   │   │   ├── nav/
│   │   │   │   │   ├── components/
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   ├── nav-dropdown.tsx
│   │   │   │   │   │   └── nav-elements.tsx
│   │   │   │   │   ├── desktop/
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   ├── nav-desktop-item-dashboard.tsx
│   │   │   │   │   │   ├── nav-desktop-item.tsx
│   │   │   │   │   │   ├── nav-desktop-list.tsx
│   │   │   │   │   │   └── nav-desktop.tsx
│   │   │   │   │   ├── mobile/
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   ├── nav-mobile-item.tsx
│   │   │   │   │   │   ├── nav-mobile-list.tsx
│   │   │   │   │   │   └── nav-mobile.tsx
│   │   │   │   │   └── types.ts
│   │   │   │   ├── footer.tsx
│   │   │   │   ├── index.ts
│   │   │   │   └── layout.tsx
│   │   │   ├── simple/
│   │   │   │   ├── content.tsx
│   │   │   │   ├── index.ts
│   │   │   │   └── layout.tsx
│   │   │   ├── nav-config-account.tsx
│   │   │   ├── nav-config-dashboard.tsx
│   │   │   ├── nav-config-main-demo.tsx
│   │   │   ├── nav-config-main.tsx
│   │   │   └── nav-config-workspace.tsx
│   │   ├── lib/
│   │   │   └── axios.ts
│   │   ├── locales/
│   │   │   ├── langs/
│   │   │   │   ├── ar/
│   │   │   │   │   ├── common.json
│   │   │   │   │   ├── messages.json
│   │   │   │   │   └── navbar.json
│   │   │   │   ├── cn/
│   │   │   │   │   ├── common.json
│   │   │   │   │   ├── messages.json
│   │   │   │   │   └── navbar.json
│   │   │   │   ├── en/
│   │   │   │   │   ├── common.json
│   │   │   │   │   ├── messages.json
│   │   │   │   │   └── navbar.json
│   │   │   │   ├── fr/
│   │   │   │   │   ├── common.json
│   │   │   │   │   ├── messages.json
│   │   │   │   │   └── navbar.json
│   │   │   │   └── vi/
│   │   │   │       ├── common.json
│   │   │   │       ├── messages.json
│   │   │   │       └── navbar.json
│   │   │   ├── utils/
│   │   │   │   └── number-format-locale.ts
│   │   │   ├── i18n-provider.tsx
│   │   │   ├── index.ts
│   │   │   ├── locales-config.ts
│   │   │   ├── localization-provider.tsx
│   │   │   └── use-locales.ts
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── jwt/
│   │   │   │   │   ├── reset-password.tsx
│   │   │   │   │   ├── sign-in.tsx
│   │   │   │   │   ├── sign-up.tsx
│   │   │   │   │   ├── update-password.tsx
│   │   │   │   │   └── verify.tsx
│   │   │   │   └── oauth/
│   │   │   │       └── callback.tsx
│   │   │   ├── blank/
│   │   │   │   └── index.tsx
│   │   │   ├── components/
│   │   │   │   ├── extra/
│   │   │   │   │   ├── animate/
│   │   │   │   │   │   └── index.tsx
│   │   │   │   │   ├── carousel/
│   │   │   │   │   │   └── index.tsx
│   │   │   │   │   ├── chart/
│   │   │   │   │   │   └── index.tsx
│   │   │   │   │   ├── dnd/
│   │   │   │   │   │   └── index.tsx
│   │   │   │   │   ├── editor/
│   │   │   │   │   │   └── index.tsx
│   │   │   │   │   ├── form-validation/
│   │   │   │   │   │   └── index.tsx
│   │   │   │   │   ├── form-wizard/
│   │   │   │   │   │   └── index.tsx
│   │   │   │   │   ├── image/
│   │   │   │   │   │   └── index.tsx
│   │   │   │   │   ├── label/
│   │   │   │   │   │   └── index.tsx
│   │   │   │   │   ├── layout/
│   │   │   │   │   │   └── index.tsx
│   │   │   │   │   ├── lightbox/
│   │   │   │   │   │   └── index.tsx
│   │   │   │   │   ├── map/
│   │   │   │   │   │   └── index.tsx
│   │   │   │   │   ├── markdown/
│   │   │   │   │   │   └── index.tsx
│   │   │   │   │   ├── mega-menu/
│   │   │   │   │   │   └── index.tsx
│   │   │   │   │   ├── multi-language/
│   │   │   │   │   │   └── index.tsx
│   │   │   │   │   ├── navigation-bar/
│   │   │   │   │   │   └── index.tsx
│   │   │   │   │   ├── organization-chart/
│   │   │   │   │   │   └── index.tsx
│   │   │   │   │   ├── scroll-progress/
│   │   │   │   │   │   └── index.tsx
│   │   │   │   │   ├── scrollbar/
│   │   │   │   │   │   └── index.tsx
│   │   │   │   │   ├── snackbar/
│   │   │   │   │   │   └── index.tsx
│   │   │   │   │   ├── upload/
│   │   │   │   │   │   └── index.tsx
│   │   │   │   │   └── utilities/
│   │   │   │   │       └── index.tsx
│   │   │   │   ├── foundation/
│   │   │   │   │   ├── colors/
│   │   │   │   │   │   └── index.tsx
│   │   │   │   │   ├── grid/
│   │   │   │   │   │   └── index.tsx
│   │   │   │   │   ├── icons/
│   │   │   │   │   │   ├── iconify.tsx
│   │   │   │   │   │   └── index.tsx
│   │   │   │   │   ├── shadows/
│   │   │   │   │   │   └── index.tsx
│   │   │   │   │   └── typography/
│   │   │   │   │       └── index.tsx
│   │   │   │   ├── mui/
│   │   │   │   │   ├── accordion/
│   │   │   │   │   │   └── index.tsx
│   │   │   │   │   ├── alert/
│   │   │   │   │   │   └── index.tsx
│   │   │   │   │   ├── autocomplete/
│   │   │   │   │   │   └── index.tsx
│   │   │   │   │   ├── avatar/
│   │   │   │   │   │   └── index.tsx
│   │   │   │   │   ├── badge/
│   │   │   │   │   │   └── index.tsx
│   │   │   │   │   ├── breadcrumbs/
│   │   │   │   │   │   └── index.tsx
│   │   │   │   │   ├── buttons/
│   │   │   │   │   │   └── index.tsx
│   │   │   │   │   ├── checkbox/
│   │   │   │   │   │   └── index.tsx
│   │   │   │   │   ├── chip/
│   │   │   │   │   │   └── index.tsx
│   │   │   │   │   ├── data-grid/
│   │   │   │   │   │   └── index.tsx
│   │   │   │   │   ├── date-pickers/
│   │   │   │   │   │   └── index.tsx
│   │   │   │   │   ├── dialog/
│   │   │   │   │   │   └── index.tsx
│   │   │   │   │   ├── drawer/
│   │   │   │   │   │   └── index.tsx
│   │   │   │   │   ├── list/
│   │   │   │   │   │   └── index.tsx
│   │   │   │   │   ├── menu/
│   │   │   │   │   │   └── index.tsx
│   │   │   │   │   ├── pagination/
│   │   │   │   │   │   └── index.tsx
│   │   │   │   │   ├── popover/
│   │   │   │   │   │   └── index.tsx
│   │   │   │   │   ├── progress/
│   │   │   │   │   │   └── index.tsx
│   │   │   │   │   ├── radio-button/
│   │   │   │   │   │   └── index.tsx
│   │   │   │   │   ├── rating/
│   │   │   │   │   │   └── index.tsx
│   │   │   │   │   ├── slider/
│   │   │   │   │   │   └── index.tsx
│   │   │   │   │   ├── stepper/
│   │   │   │   │   │   └── index.tsx
│   │   │   │   │   ├── switch/
│   │   │   │   │   │   └── index.tsx
│   │   │   │   │   ├── table/
│   │   │   │   │   │   └── index.tsx
│   │   │   │   │   ├── tabs/
│   │   │   │   │   │   └── index.tsx
│   │   │   │   │   ├── text-field/
│   │   │   │   │   │   └── index.tsx
│   │   │   │   │   ├── timeline/
│   │   │   │   │   │   └── index.tsx
│   │   │   │   │   ├── tooltip/
│   │   │   │   │   │   └── index.tsx
│   │   │   │   │   ├── transfer-list/
│   │   │   │   │   │   └── index.tsx
│   │   │   │   │   └── tree-view/
│   │   │   │   │       └── index.tsx
│   │   │   │   └── index.tsx
│   │   │   ├── dashboard/
│   │   │   │   ├── analytics/
│   │   │   │   │   └── index.tsx
│   │   │   │   ├── banking/
│   │   │   │   │   └── index.tsx
│   │   │   │   ├── booking/
│   │   │   │   │   └── index.tsx
│   │   │   │   ├── calendar/
│   │   │   │   │   └── index.tsx
│   │   │   │   ├── chat/
│   │   │   │   │   └── index.tsx
│   │   │   │   ├── ecommerce/
│   │   │   │   │   └── index.tsx
│   │   │   │   ├── file/
│   │   │   │   │   └── index.tsx
│   │   │   │   ├── file-manager/
│   │   │   │   │   └── index.tsx
│   │   │   │   ├── invoice/
│   │   │   │   │   ├── details.tsx
│   │   │   │   │   ├── edit.tsx
│   │   │   │   │   ├── list.tsx
│   │   │   │   │   └── new.tsx
│   │   │   │   ├── mail/
│   │   │   │   │   └── index.tsx
│   │   │   │   ├── order/
│   │   │   │   │   ├── details.tsx
│   │   │   │   │   └── list.tsx
│   │   │   │   ├── params/
│   │   │   │   │   └── index.tsx
│   │   │   │   ├── post/
│   │   │   │   │   ├── details.tsx
│   │   │   │   │   ├── edit.tsx
│   │   │   │   │   ├── list.tsx
│   │   │   │   │   └── new.tsx
│   │   │   │   ├── product/
│   │   │   │   │   ├── details.tsx
│   │   │   │   │   ├── edit.tsx
│   │   │   │   │   ├── list.tsx
│   │   │   │   │   └── new.tsx
│   │   │   │   ├── subpaths/
│   │   │   │   │   └── index.tsx
│   │   │   │   ├── user/
│   │   │   │   │   ├── account/
│   │   │   │   │   │   ├── billing.tsx
│   │   │   │   │   │   ├── change-password.tsx
│   │   │   │   │   │   ├── general.tsx
│   │   │   │   │   │   ├── notifications.tsx
│   │   │   │   │   │   └── socials.tsx
│   │   │   │   │   ├── cards.tsx
│   │   │   │   │   ├── edit.tsx
│   │   │   │   │   ├── list.tsx
│   │   │   │   │   ├── new.tsx
│   │   │   │   │   └── profile.tsx
│   │   │   │   └── index.tsx
│   │   │   ├── error/
│   │   │   │   ├── 403.tsx
│   │   │   │   ├── 404.tsx
│   │   │   │   └── 500.tsx
│   │   │   ├── maintenance/
│   │   │   │   └── index.tsx
│   │   │   ├── post/
│   │   │   │   ├── details.tsx
│   │   │   │   └── list.tsx
│   │   │   └── product/
│   │   │       ├── checkout.tsx
│   │   │       ├── details.tsx
│   │   │       └── list.tsx
│   │   ├── routes/
│   │   │   ├── components/
│   │   │   │   ├── error-boundary.tsx
│   │   │   │   ├── index.ts
│   │   │   │   └── router-link.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── index.ts
│   │   │   │   ├── use-params.ts
│   │   │   │   ├── use-pathname.ts
│   │   │   │   ├── use-router.ts
│   │   │   │   └── use-search-params.ts
│   │   │   ├── sections/
│   │   │   │   ├── auth.tsx
│   │   │   │   ├── components.tsx
│   │   │   │   ├── dashboard.tsx
│   │   │   │   ├── index.tsx
│   │   │   │   └── main.tsx
│   │   │   └── paths.ts
│   │   ├── sections/
│   │   │   ├── _examples/
│   │   │   │   ├── extra/
│   │   │   │   │   ├── animate-view/
│   │   │   │   │   │   ├── background/
│   │   │   │   │   │   │   ├── container.tsx
│   │   │   │   │   │   │   ├── index.tsx
│   │   │   │   │   │   │   └── toolbar.tsx
│   │   │   │   │   │   ├── dialog/
│   │   │   │   │   │   │   ├── container.tsx
│   │   │   │   │   │   │   └── index.tsx
│   │   │   │   │   │   ├── inview/
│   │   │   │   │   │   │   ├── container.tsx
│   │   │   │   │   │   │   ├── index.tsx
│   │   │   │   │   │   │   └── toolbar.tsx
│   │   │   │   │   │   ├── other/
│   │   │   │   │   │   │   ├── avatar.tsx
│   │   │   │   │   │   │   ├── border.tsx
│   │   │   │   │   │   │   ├── index.tsx
│   │   │   │   │   │   │   ├── svg-path.tsx
│   │   │   │   │   │   │   └── tap-hover.tsx
│   │   │   │   │   │   ├── scroll/
│   │   │   │   │   │   │   ├── container.tsx
│   │   │   │   │   │   │   ├── index.tsx
│   │   │   │   │   │   │   └── toolbar.tsx
│   │   │   │   │   │   ├── control-panel.tsx
│   │   │   │   │   │   ├── get-variant.ts
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   ├── variant-keys.ts
│   │   │   │   │   │   └── view.tsx
│   │   │   │   │   ├── carousel-view/
│   │   │   │   │   │   ├── carousel-align.tsx
│   │   │   │   │   │   ├── carousel-animation.tsx
│   │   │   │   │   │   ├── carousel-auto-height.tsx
│   │   │   │   │   │   ├── carousel-auto-scroll.tsx
│   │   │   │   │   │   ├── carousel-autoplay.tsx
│   │   │   │   │   │   ├── carousel-custom.tsx
│   │   │   │   │   │   ├── carousel-dots-number.tsx
│   │   │   │   │   │   ├── carousel-fade.tsx
│   │   │   │   │   │   ├── carousel-opacity.tsx
│   │   │   │   │   │   ├── carousel-parallax.tsx
│   │   │   │   │   │   ├── carousel-progress.tsx
│   │   │   │   │   │   ├── carousel-scale.tsx
│   │   │   │   │   │   ├── carousel-thumbs-x.tsx
│   │   │   │   │   │   ├── carousel-thumbs-y.tsx
│   │   │   │   │   │   ├── carousel-variable-widths.tsx
│   │   │   │   │   │   ├── carousel-yaxis.tsx
│   │   │   │   │   │   ├── elements.tsx
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── view.tsx
│   │   │   │   │   ├── chart-view/
│   │   │   │   │   │   ├── chart-area.tsx
│   │   │   │   │   │   ├── chart-bar.tsx
│   │   │   │   │   │   ├── chart-box-plot.tsx
│   │   │   │   │   │   ├── chart-column-multiple.tsx
│   │   │   │   │   │   ├── chart-column-negative.tsx
│   │   │   │   │   │   ├── chart-column-single.tsx
│   │   │   │   │   │   ├── chart-column-stacked.tsx
│   │   │   │   │   │   ├── chart-donut.tsx
│   │   │   │   │   │   ├── chart-heatmap.tsx
│   │   │   │   │   │   ├── chart-line.tsx
│   │   │   │   │   │   ├── chart-mixed.tsx
│   │   │   │   │   │   ├── chart-pie.tsx
│   │   │   │   │   │   ├── chart-radar-bar.tsx
│   │   │   │   │   │   ├── chart-radial-bar.tsx
│   │   │   │   │   │   ├── chart-scatter.tsx
│   │   │   │   │   │   ├── chart-semi-circle-gauge.tsx
│   │   │   │   │   │   ├── chart-stroked-gauge.tsx
│   │   │   │   │   │   ├── chart-treemap.tsx
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── view.tsx
│   │   │   │   │   ├── dnd-view/
│   │   │   │   │   │   ├── classes.ts
│   │   │   │   │   │   ├── components.tsx
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   ├── sortable-grid.tsx
│   │   │   │   │   │   ├── sortable-list.tsx
│   │   │   │   │   │   ├── utils.ts
│   │   │   │   │   │   └── view.tsx
│   │   │   │   │   ├── editor-view/
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── view.tsx
│   │   │   │   │   ├── form-validation-view/
│   │   │   │   │   │   ├── components/
│   │   │   │   │   │   │   ├── elements.tsx
│   │   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   │   └── values-preview.tsx
│   │   │   │   │   │   ├── controls-demo.tsx
│   │   │   │   │   │   ├── fields-demo.tsx
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   ├── other-demo.tsx
│   │   │   │   │   │   ├── schema.ts
│   │   │   │   │   │   └── view.tsx
│   │   │   │   │   ├── form-wizard-view/
│   │   │   │   │   │   ├── form-steps.tsx
│   │   │   │   │   │   ├── form-wizard.tsx
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── view.tsx
│   │   │   │   │   ├── image-view/
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── view.tsx
│   │   │   │   │   ├── label-view/
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── view.tsx
│   │   │   │   │   ├── layout-view/
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── view.tsx
│   │   │   │   │   ├── lightbox-view/
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── view.tsx
│   │   │   │   │   ├── map-view/
│   │   │   │   │   │   ├── data.ts
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   ├── map-change-style.tsx
│   │   │   │   │   │   ├── map-clusters.tsx
│   │   │   │   │   │   ├── map-draggable-markers.tsx
│   │   │   │   │   │   ├── map-geojson-animation.tsx
│   │   │   │   │   │   ├── map-heatmap.tsx
│   │   │   │   │   │   ├── map-highlight-by-filter.tsx
│   │   │   │   │   │   ├── map-interaction.tsx
│   │   │   │   │   │   ├── map-markers-popups.tsx
│   │   │   │   │   │   ├── map-side-by-side.tsx
│   │   │   │   │   │   ├── map-viewport-animation.tsx
│   │   │   │   │   │   ├── styles.tsx
│   │   │   │   │   │   └── view.tsx
│   │   │   │   │   ├── markdown-view/
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── view.tsx
│   │   │   │   │   ├── mega-menu-view/
│   │   │   │   │   │   ├── data.tsx
│   │   │   │   │   │   ├── horizontal.tsx
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   ├── mobile.tsx
│   │   │   │   │   │   ├── vertical.tsx
│   │   │   │   │   │   └── view.tsx
│   │   │   │   │   ├── multi-language-view/
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   ├── nav-config-translate.tsx
│   │   │   │   │   │   └── view.tsx
│   │   │   │   │   ├── navigation-bar-view/
│   │   │   │   │   │   ├── data.tsx
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   ├── nav-api.tsx
│   │   │   │   │   │   ├── nav-basic.tsx
│   │   │   │   │   │   ├── nav-horizontal.tsx
│   │   │   │   │   │   ├── nav-mini.tsx
│   │   │   │   │   │   ├── nav-vertical.tsx
│   │   │   │   │   │   └── view.tsx
│   │   │   │   │   ├── organizational-chart-view/
│   │   │   │   │   │   ├── data.ts
│   │   │   │   │   │   ├── group-node.tsx
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   ├── simple-node.tsx
│   │   │   │   │   │   ├── standard-node.tsx
│   │   │   │   │   │   └── view.tsx
│   │   │   │   │   ├── scroll-progress-view/
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── view.tsx
│   │   │   │   │   ├── scrollbar-view/
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── view.tsx
│   │   │   │   │   ├── snackbar-view/
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── view.tsx
│   │   │   │   │   ├── upload-view/
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── view.tsx
│   │   │   │   │   └── utilities-view/
│   │   │   │   │       ├── color-pickers.tsx
│   │   │   │   │       ├── copy-to-clipboard.tsx
│   │   │   │   │       ├── countdown.tsx
│   │   │   │   │       ├── gradients.tsx
│   │   │   │   │       ├── index.ts
│   │   │   │   │       ├── number-inputs.tsx
│   │   │   │   │       ├── phone-inputs.tsx
│   │   │   │   │       ├── styled.tsx
│   │   │   │   │       ├── text-max-line.tsx
│   │   │   │   │       └── view.tsx
│   │   │   │   ├── foundation/
│   │   │   │   │   ├── colors-view/
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── view.tsx
│   │   │   │   │   ├── grid-view/
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── view.tsx
│   │   │   │   │   ├── icons-view/
│   │   │   │   │   │   ├── iconify-view.tsx
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── view.tsx
│   │   │   │   │   ├── shadows-view/
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── view.tsx
│   │   │   │   │   └── typography-view/
│   │   │   │   │       ├── index.ts
│   │   │   │   │       └── view.tsx
│   │   │   │   ├── layout/
│   │   │   │   │   ├── classes.ts
│   │   │   │   │   ├── component-box.tsx
│   │   │   │   │   ├── component-card.tsx
│   │   │   │   │   ├── component-layout.tsx
│   │   │   │   │   ├── component-nav-item.tsx
│   │   │   │   │   ├── component-nav.tsx
│   │   │   │   │   ├── component-search.tsx
│   │   │   │   │   ├── hooks.ts
│   │   │   │   │   ├── index.ts
│   │   │   │   │   └── nav-config-components.ts
│   │   │   │   ├── mui/
│   │   │   │   │   ├── accordion-view/
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── view.tsx
│   │   │   │   │   ├── alert-view/
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── view.tsx
│   │   │   │   │   ├── autocomplete-view/
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── view.tsx
│   │   │   │   │   ├── avatar-view/
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── view.tsx
│   │   │   │   │   ├── badge-view/
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── view.tsx
│   │   │   │   │   ├── breadcrumbs-view/
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── view.tsx
│   │   │   │   │   ├── button-view/
│   │   │   │   │   │   ├── button-groups.tsx
│   │   │   │   │   │   ├── button-variant.tsx
│   │   │   │   │   │   ├── floating-action-button.tsx
│   │   │   │   │   │   ├── icon-buttons.tsx
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   ├── toggle-buttons.tsx
│   │   │   │   │   │   └── view.tsx
│   │   │   │   │   ├── checkbox-view/
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── view.tsx
│   │   │   │   │   ├── chip-view/
│   │   │   │   │   │   ├── chip-variant.tsx
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── view.tsx
│   │   │   │   │   ├── data-grid-view/
│   │   │   │   │   │   ├── data-grid-basic.tsx
│   │   │   │   │   │   ├── data-grid-custom.tsx
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── view.tsx
│   │   │   │   │   ├── date-pickers-view/
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   ├── picker-date-range.tsx
│   │   │   │   │   │   ├── picker-date-time.tsx
│   │   │   │   │   │   ├── picker-date.tsx
│   │   │   │   │   │   ├── picker-time.tsx
│   │   │   │   │   │   └── view.tsx
│   │   │   │   │   ├── dialog-view/
│   │   │   │   │   │   ├── alert-dialog.tsx
│   │   │   │   │   │   ├── form-dialog.tsx
│   │   │   │   │   │   ├── full-screen-dialog.tsx
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   ├── max-width-dialog.tsx
│   │   │   │   │   │   ├── scroll-dialog.tsx
│   │   │   │   │   │   ├── simple-dialog.tsx
│   │   │   │   │   │   ├── transitions-dialog.tsx
│   │   │   │   │   │   └── view.tsx
│   │   │   │   │   ├── drawer-view/
│   │   │   │   │   │   ├── anchor-drawer.tsx
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── view.tsx
│   │   │   │   │   ├── list-view/
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── view.tsx
│   │   │   │   │   ├── menu-view/
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── view.tsx
│   │   │   │   │   ├── pagination-view/
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   ├── pagination-items.tsx
│   │   │   │   │   │   └── view.tsx
│   │   │   │   │   ├── popover-view/
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── view.tsx
│   │   │   │   │   ├── progress-view/
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   ├── progress-circular.tsx
│   │   │   │   │   │   ├── progress-linear.tsx
│   │   │   │   │   │   └── view.tsx
│   │   │   │   │   ├── radio-button-view/
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── view.tsx
│   │   │   │   │   ├── rating-view/
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── view.tsx
│   │   │   │   │   ├── slider-view/
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── view.tsx
│   │   │   │   │   ├── stepper-view/
│   │   │   │   │   │   ├── customized-steppers.tsx
│   │   │   │   │   │   ├── horizontal-linear-stepper.tsx
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   ├── mobile-stepper-variant.tsx
│   │   │   │   │   │   ├── vertical-linear-stepper.tsx
│   │   │   │   │   │   └── view.tsx
│   │   │   │   │   ├── switch-view/
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── view.tsx
│   │   │   │   │   ├── table-view/
│   │   │   │   │   │   ├── basic.tsx
│   │   │   │   │   │   ├── collapsible.tsx
│   │   │   │   │   │   ├── grouping-fixed-header.tsx
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   ├── pagination-with-api.tsx
│   │   │   │   │   │   ├── sorting-selecting.tsx
│   │   │   │   │   │   ├── table-pagination-with-api.tsx
│   │   │   │   │   │   └── view.tsx
│   │   │   │   │   ├── tabs-view/
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── view.tsx
│   │   │   │   │   ├── text-field-view/
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   ├── text-field-variant.tsx
│   │   │   │   │   │   └── view.tsx
│   │   │   │   │   ├── timeline-view/
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── view.tsx
│   │   │   │   │   ├── tooltip-view/
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── view.tsx
│   │   │   │   │   ├── transfer-list-view/
│   │   │   │   │   │   ├── enhanced-transfer-list.tsx
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   ├── simple-transfer-list.tsx
│   │   │   │   │   │   └── view.tsx
│   │   │   │   │   └── tree-view/
│   │   │   │   │       ├── basic.tsx
│   │   │   │   │       ├── custom-icon.tsx
│   │   │   │   │       ├── custom-styling.tsx
│   │   │   │   │       ├── index.ts
│   │   │   │   │       └── view.tsx
│   │   │   │   └── view.tsx
│   │   │   ├── account/
│   │   │   │   ├── view/
│   │   │   │   │   ├── account-billing-view.tsx
│   │   │   │   │   ├── account-change-password-view.tsx
│   │   │   │   │   ├── account-general-view.tsx
│   │   │   │   │   ├── account-notifications-view.tsx
│   │   │   │   │   ├── account-socials-view.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── account-billing-address.tsx
│   │   │   │   ├── account-billing-history.tsx
│   │   │   │   ├── account-billing-payment.tsx
│   │   │   │   ├── account-billing-plan.tsx
│   │   │   │   ├── account-billing.tsx
│   │   │   │   ├── account-change-password.tsx
│   │   │   │   ├── account-general.tsx
│   │   │   │   ├── account-layout.tsx
│   │   │   │   ├── account-notifications.tsx
│   │   │   │   └── account-socials.tsx
│   │   │   ├── address/
│   │   │   │   ├── address-create-form.tsx
│   │   │   │   ├── address-item.tsx
│   │   │   │   ├── address-list-dialog.tsx
│   │   │   │   └── index.ts
│   │   │   ├── blank/
│   │   │   │   └── view.tsx
│   │   │   ├── blog/
│   │   │   │   ├── view/
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── post-create-view.tsx
│   │   │   │   │   ├── post-details-home-view.tsx
│   │   │   │   │   ├── post-details-view.tsx
│   │   │   │   │   ├── post-edit-view.tsx
│   │   │   │   │   ├── post-list-home-view.tsx
│   │   │   │   │   └── post-list-view.tsx
│   │   │   │   ├── post-comment-form.tsx
│   │   │   │   ├── post-comment-item.tsx
│   │   │   │   ├── post-comment-list.tsx
│   │   │   │   ├── post-create-edit-form.tsx
│   │   │   │   ├── post-details-hero.tsx
│   │   │   │   ├── post-details-preview.tsx
│   │   │   │   ├── post-details-toolbar.tsx
│   │   │   │   ├── post-item-horizontal.tsx
│   │   │   │   ├── post-item.tsx
│   │   │   │   ├── post-list-horizontal.tsx
│   │   │   │   ├── post-list.tsx
│   │   │   │   ├── post-search.tsx
│   │   │   │   ├── post-skeleton.tsx
│   │   │   │   └── post-sort.tsx
│   │   │   ├── calendar/
│   │   │   │   ├── hooks/
│   │   │   │   │   ├── use-calendar.ts
│   │   │   │   │   └── use-event.ts
│   │   │   │   ├── view/
│   │   │   │   │   ├── calendar-view.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── calendar-filters-result.tsx
│   │   │   │   ├── calendar-filters.tsx
│   │   │   │   ├── calendar-form.tsx
│   │   │   │   ├── calendar-toolbar.tsx
│   │   │   │   └── styles.tsx
│   │   │   ├── chat/
│   │   │   │   ├── hooks/
│   │   │   │   │   ├── use-collapse-nav.ts
│   │   │   │   │   └── use-messages-scroll.ts
│   │   │   │   ├── utils/
│   │   │   │   │   ├── get-message.ts
│   │   │   │   │   ├── get-nav-item.ts
│   │   │   │   │   └── initial-conversation.ts
│   │   │   │   ├── view/
│   │   │   │   │   ├── chat-view.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── chat-header-compose.tsx
│   │   │   │   ├── chat-header-details.tsx
│   │   │   │   ├── chat-message-input.tsx
│   │   │   │   ├── chat-message-item.tsx
│   │   │   │   ├── chat-message-list.tsx
│   │   │   │   ├── chat-nav-account.tsx
│   │   │   │   ├── chat-nav-item.tsx
│   │   │   │   ├── chat-nav-search-results.tsx
│   │   │   │   ├── chat-nav.tsx
│   │   │   │   ├── chat-room-attachments.tsx
│   │   │   │   ├── chat-room-group.tsx
│   │   │   │   ├── chat-room-participant-dialog.tsx
│   │   │   │   ├── chat-room-single.tsx
│   │   │   │   ├── chat-room.tsx
│   │   │   │   ├── chat-skeleton.tsx
│   │   │   │   ├── layout.tsx
│   │   │   │   └── styles.tsx
│   │   │   ├── checkout/
│   │   │   │   ├── context/
│   │   │   │   │   ├── checkout-context.ts
│   │   │   │   │   ├── checkout-provider.tsx
│   │   │   │   │   ├── index.ts
│   │   │   │   │   └── use-checkout-context.ts
│   │   │   │   ├── view/
│   │   │   │   │   ├── checkout-view.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── checkout-billing-address.tsx
│   │   │   │   ├── checkout-billing-info.tsx
│   │   │   │   ├── checkout-cart-product-list.tsx
│   │   │   │   ├── checkout-cart-product.tsx
│   │   │   │   ├── checkout-cart.tsx
│   │   │   │   ├── checkout-delivery.tsx
│   │   │   │   ├── checkout-order-complete.tsx
│   │   │   │   ├── checkout-payment-methods.tsx
│   │   │   │   ├── checkout-payment.tsx
│   │   │   │   ├── checkout-steps.tsx
│   │   │   │   └── checkout-summary.tsx
│   │   │   ├── error/
│   │   │   │   ├── 403-view.tsx
│   │   │   │   ├── 500-view.tsx
│   │   │   │   ├── index.ts
│   │   │   │   └── not-found-view.tsx
│   │   │   ├── file-manager/
│   │   │   │   ├── view/
│   │   │   │   │   ├── file-manager-view.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── file-data-activity.tsx
│   │   │   │   ├── file-manager-action-selected.tsx
│   │   │   │   ├── file-manager-create-folder-dialog.tsx
│   │   │   │   ├── file-manager-file-details.tsx
│   │   │   │   ├── file-manager-file-item-slots.tsx
│   │   │   │   ├── file-manager-file-item.tsx
│   │   │   │   ├── file-manager-filters-result.tsx
│   │   │   │   ├── file-manager-filters.tsx
│   │   │   │   ├── file-manager-folder-item.tsx
│   │   │   │   ├── file-manager-grid-view.tsx
│   │   │   │   ├── file-manager-invited-item.tsx
│   │   │   │   ├── file-manager-panel.tsx
│   │   │   │   ├── file-manager-share-dialog.tsx
│   │   │   │   ├── file-manager-table-row.tsx
│   │   │   │   ├── file-manager-table.tsx
│   │   │   │   ├── file-recent-item.tsx
│   │   │   │   ├── file-storage-overview.tsx
│   │   │   │   ├── file-upgrade.tsx
│   │   │   │   └── file-widget.tsx
│   │   │   ├── invoice/
│   │   │   │   ├── view/
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── invoice-create-view.tsx
│   │   │   │   │   ├── invoice-details-view.tsx
│   │   │   │   │   ├── invoice-edit-view.tsx
│   │   │   │   │   └── invoice-list-view.tsx
│   │   │   │   ├── invoice-analytic.tsx
│   │   │   │   ├── invoice-create-edit-address.tsx
│   │   │   │   ├── invoice-create-edit-details.tsx
│   │   │   │   ├── invoice-create-edit-form.tsx
│   │   │   │   ├── invoice-create-edit-status-date.tsx
│   │   │   │   ├── invoice-details.tsx
│   │   │   │   ├── invoice-pdf.tsx
│   │   │   │   ├── invoice-table-filters-result.tsx
│   │   │   │   ├── invoice-table-row.tsx
│   │   │   │   ├── invoice-table-toolbar.tsx
│   │   │   │   ├── invoice-toolbar.tsx
│   │   │   │   └── invoice-total-summary.tsx
│   │   │   ├── mail/
│   │   │   │   ├── view/
│   │   │   │   │   ├── index.ts
│   │   │   │   │   └── mail-view.tsx
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── mail-compose.tsx
│   │   │   │   ├── mail-details.tsx
│   │   │   │   ├── mail-header.tsx
│   │   │   │   ├── mail-item.tsx
│   │   │   │   ├── mail-list.tsx
│   │   │   │   ├── mail-nav-item.tsx
│   │   │   │   ├── mail-nav.tsx
│   │   │   │   ├── mail-skeleton.tsx
│   │   │   │   └── README.md
│   │   │   ├── maintenance/
│   │   │   │   └── view.tsx
│   │   │   ├── order/
│   │   │   │   ├── view/
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── order-details-view.tsx
│   │   │   │   │   └── order-list-view.tsx
│   │   │   │   ├── order-details-customer.tsx
│   │   │   │   ├── order-details-delivery.tsx
│   │   │   │   ├── order-details-history.tsx
│   │   │   │   ├── order-details-items.tsx
│   │   │   │   ├── order-details-payment.tsx
│   │   │   │   ├── order-details-shipping.tsx
│   │   │   │   ├── order-details-toolbar.tsx
│   │   │   │   ├── order-table-filters-result.tsx
│   │   │   │   ├── order-table-row.tsx
│   │   │   │   └── order-table-toolbar.tsx
│   │   │   ├── overview/
│   │   │   │   ├── analytics/
│   │   │   │   │   ├── view/
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── overview-analytics-view.tsx
│   │   │   │   │   ├── analytics-conversion-rates.tsx
│   │   │   │   │   ├── analytics-current-subject.tsx
│   │   │   │   │   ├── analytics-current-visits.tsx
│   │   │   │   │   ├── analytics-news.tsx
│   │   │   │   │   ├── analytics-order-timeline.tsx
│   │   │   │   │   ├── analytics-tasks.tsx
│   │   │   │   │   ├── analytics-traffic-by-site.tsx
│   │   │   │   │   ├── analytics-website-visits.tsx
│   │   │   │   │   └── analytics-widget-summary.tsx
│   │   │   │   ├── app/
│   │   │   │   │   ├── view/
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── overview-app-view.tsx
│   │   │   │   │   ├── app-area-installed.tsx
│   │   │   │   │   ├── app-current-download.tsx
│   │   │   │   │   ├── app-featured.tsx
│   │   │   │   │   ├── app-new-invoices.tsx
│   │   │   │   │   ├── app-top-authors.tsx
│   │   │   │   │   ├── app-top-installed-countries.tsx
│   │   │   │   │   ├── app-top-related.tsx
│   │   │   │   │   ├── app-welcome.tsx
│   │   │   │   │   ├── app-widget-summary.tsx
│   │   │   │   │   └── app-widget.tsx
│   │   │   │   ├── banking/
│   │   │   │   │   ├── view/
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── overview-banking-view.tsx
│   │   │   │   │   ├── banking-balance-statistics.tsx
│   │   │   │   │   ├── banking-contacts.tsx
│   │   │   │   │   ├── banking-current-balance.tsx
│   │   │   │   │   ├── banking-expenses-categories.tsx
│   │   │   │   │   ├── banking-invite-friends.tsx
│   │   │   │   │   ├── banking-overview.tsx
│   │   │   │   │   ├── banking-quick-transfer.tsx
│   │   │   │   │   └── banking-recent-transitions.tsx
│   │   │   │   ├── booking/
│   │   │   │   │   ├── view/
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── overview-booking-view.tsx
│   │   │   │   │   ├── booking-available.tsx
│   │   │   │   │   ├── booking-booked.tsx
│   │   │   │   │   ├── booking-check-in-widgets.tsx
│   │   │   │   │   ├── booking-customer-reviews.tsx
│   │   │   │   │   ├── booking-details.tsx
│   │   │   │   │   ├── booking-newest.tsx
│   │   │   │   │   ├── booking-statistics.tsx
│   │   │   │   │   ├── booking-total-incomes.tsx
│   │   │   │   │   └── booking-widget-summary.tsx
│   │   │   │   ├── e-commerce/
│   │   │   │   │   ├── view/
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   └── overview-ecommerce-view.tsx
│   │   │   │   │   ├── ecommerce-best-salesman.tsx
│   │   │   │   │   ├── ecommerce-current-balance.tsx
│   │   │   │   │   ├── ecommerce-latest-products.tsx
│   │   │   │   │   ├── ecommerce-new-products.tsx
│   │   │   │   │   ├── ecommerce-sale-by-gender.tsx
│   │   │   │   │   ├── ecommerce-sales-overview.tsx
│   │   │   │   │   ├── ecommerce-welcome.tsx
│   │   │   │   │   ├── ecommerce-widget-summary.tsx
│   │   │   │   │   └── ecommerce-yearly-sales.tsx
│   │   │   │   └── file/
│   │   │   │       └── view/
│   │   │   │           ├── index.ts
│   │   │   │           └── overview-file-view.tsx
│   │   │   ├── permission/
│   │   │   │   └── view.tsx
│   │   │   ├── product/
│   │   │   │   ├── view/
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── product-create-view.tsx
│   │   │   │   │   ├── product-details-view.tsx
│   │   │   │   │   ├── product-edit-view.tsx
│   │   │   │   │   ├── product-list-view.tsx
│   │   │   │   │   ├── product-shop-details-view.tsx
│   │   │   │   │   └── product-shop-view.tsx
│   │   │   │   ├── cart-icon.tsx
│   │   │   │   ├── product-create-edit-form.tsx
│   │   │   │   ├── product-details-carousel.tsx
│   │   │   │   ├── product-details-description.tsx
│   │   │   │   ├── product-details-review.tsx
│   │   │   │   ├── product-details-summary.tsx
│   │   │   │   ├── product-details-toolbar.tsx
│   │   │   │   ├── product-filters-drawer.tsx
│   │   │   │   ├── product-filters-result.tsx
│   │   │   │   ├── product-item.tsx
│   │   │   │   ├── product-list.tsx
│   │   │   │   ├── product-review-create-form.tsx
│   │   │   │   ├── product-review-item.tsx
│   │   │   │   ├── product-review-list.tsx
│   │   │   │   ├── product-search.tsx
│   │   │   │   ├── product-skeleton.tsx
│   │   │   │   ├── product-sort.tsx
│   │   │   │   ├── product-table-filters-result.tsx
│   │   │   │   ├── product-table-row.tsx
│   │   │   │   └── product-table-toolbar.tsx
│   │   │   └── user/
│   │   │       ├── view/
│   │   │       │   ├── index.ts
│   │   │       │   ├── user-cards-view.tsx
│   │   │       │   ├── user-create-view.tsx
│   │   │       │   ├── user-edit-view.tsx
│   │   │       │   ├── user-list-view.tsx
│   │   │       │   └── user-profile-view.tsx
│   │   │       ├── profile-cover.tsx
│   │   │       ├── profile-followers.tsx
│   │   │       ├── profile-friends.tsx
│   │   │       ├── profile-gallery.tsx
│   │   │       ├── profile-home.tsx
│   │   │       ├── profile-post-item.tsx
│   │   │       ├── user-card-list.tsx
│   │   │       ├── user-card.tsx
│   │   │       ├── user-create-edit-form.tsx
│   │   │       ├── user-quick-edit-form.tsx
│   │   │       ├── user-table-filters-result.tsx
│   │   │       ├── user-table-row.tsx
│   │   │       └── user-table-toolbar.tsx
│   │   ├── theme/
│   │   │   ├── core/
│   │   │   │   ├── components/
│   │   │   │   │   ├── accordion.tsx
│   │   │   │   │   ├── alert.tsx
│   │   │   │   │   ├── appbar.tsx
│   │   │   │   │   ├── autocomplete.tsx
│   │   │   │   │   ├── avatar.tsx
│   │   │   │   │   ├── backdrop.tsx
│   │   │   │   │   ├── badge.tsx
│   │   │   │   │   ├── breadcrumbs.tsx
│   │   │   │   │   ├── button-fab.tsx
│   │   │   │   │   ├── button-group.tsx
│   │   │   │   │   ├── button-icon.tsx
│   │   │   │   │   ├── button-toggle.tsx
│   │   │   │   │   ├── button.tsx
│   │   │   │   │   ├── card.tsx
│   │   │   │   │   ├── checkbox.tsx
│   │   │   │   │   ├── chip.tsx
│   │   │   │   │   ├── dialog.tsx
│   │   │   │   │   ├── drawer.tsx
│   │   │   │   │   ├── form.tsx
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── link.tsx
│   │   │   │   │   ├── list.tsx
│   │   │   │   │   ├── menu.tsx
│   │   │   │   │   ├── mui-x-data-grid.tsx
│   │   │   │   │   ├── mui-x-date-picker.tsx
│   │   │   │   │   ├── mui-x-tree-view.tsx
│   │   │   │   │   ├── pagination.tsx
│   │   │   │   │   ├── paper.tsx
│   │   │   │   │   ├── popover.tsx
│   │   │   │   │   ├── progress.tsx
│   │   │   │   │   ├── radio.tsx
│   │   │   │   │   ├── rating.tsx
│   │   │   │   │   ├── select.tsx
│   │   │   │   │   ├── skeleton.tsx
│   │   │   │   │   ├── slider.tsx
│   │   │   │   │   ├── stack.tsx
│   │   │   │   │   ├── stepper.tsx
│   │   │   │   │   ├── svg-icon.tsx
│   │   │   │   │   ├── switch.tsx
│   │   │   │   │   ├── table.tsx
│   │   │   │   │   ├── tabs.tsx
│   │   │   │   │   ├── text-field.tsx
│   │   │   │   │   ├── timeline.tsx
│   │   │   │   │   └── tooltip.tsx
│   │   │   │   ├── mixins/
│   │   │   │   │   ├── background.ts
│   │   │   │   │   ├── border.ts
│   │   │   │   │   ├── global-styles-components.ts
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── mixins.ts
│   │   │   │   │   └── text.ts
│   │   │   │   ├── custom-shadows.ts
│   │   │   │   ├── index.ts
│   │   │   │   ├── opacity.ts
│   │   │   │   ├── palette.ts
│   │   │   │   ├── shadows.ts
│   │   │   │   └── typography.ts
│   │   │   ├── with-settings/
│   │   │   │   ├── color-presets.ts
│   │   │   │   ├── index.ts
│   │   │   │   ├── right-to-left.tsx
│   │   │   │   ├── update-components.ts
│   │   │   │   └── update-core.ts
│   │   │   ├── create-classes.ts
│   │   │   ├── create-theme.ts
│   │   │   ├── extend-theme-types.d.ts
│   │   │   ├── index.ts
│   │   │   ├── theme-config.ts
│   │   │   ├── theme-overrides.ts
│   │   │   ├── theme-provider.tsx
│   │   │   └── types.ts
│   │   ├── types/
│   │   │   ├── blog.ts
│   │   │   ├── calendar.ts
│   │   │   ├── chat.ts
│   │   │   ├── checkout.ts
│   │   │   ├── common.ts
│   │   │   ├── file.ts
│   │   │   ├── invoice.ts
│   │   │   ├── mail.ts
│   │   │   ├── order.ts
│   │   │   ├── product.ts
│   │   │   ├── tour.ts
│   │   │   └── user.ts
│   │   ├── utils/
│   │   │   ├── crypto.ts
│   │   │   ├── format-number.ts
│   │   │   └── format-time.ts
│   │   ├── app.tsx
│   │   ├── global-config.ts
│   │   ├── global.css
│   │   ├── main.tsx
│   │   └── vite-env.d.ts
│   ├── .editorconfig
│   ├── .env.local
│   ├── .env.production
│   ├── .gitignore
│   ├── .prettierignore
│   ├── eslint.config.mjs
│   ├── index.html
│   ├── package.json
│   ├── prettier.config.mjs
│   ├── README.md
│   ├── tsc_errors_2.txt
│   ├── tsc_errors_3.txt
│   ├── tsc_errors_4.txt
│   ├── tsc_errors.txt
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── vite.config.ts
│   └── wrangler.toml
├── frontend/
│   ├── .github/
│   │   ├── workflows/
│   │   │   ├── codeql.yml
│   │   │   ├── deploy.yml
│   │   │   ├── performance.yml
│   │   │   ├── quality.yml
│   │   │   └── security.yml
│   │   └── dependabot.yml
│   ├── public/
│   │   ├── .well-known/
│   │   │   ├── ai-plugin.json
│   │   │   └── assetlinks.json
│   │   ├── assets/
│   │   │   ├── background/
│   │   │   │   ├── background-3-blur.webp
│   │   │   │   ├── background-3.webp
│   │   │   │   ├── background-4.jpg
│   │   │   │   ├── background-5.webp
│   │   │   │   ├── background-6.webp
│   │   │   │   ├── background-7.webp
│   │   │   │   ├── overlay.svg
│   │   │   │   ├── shape-circle-1.svg
│   │   │   │   ├── shape-circle-3.svg
│   │   │   │   └── shape-square.svg
│   │   │   ├── icons/
│   │   │   │   ├── apps/
│   │   │   │   │   ├── ic-app-1.webp
│   │   │   │   │   ├── ic-app-2.webp
│   │   │   │   │   ├── ic-app-3.webp
│   │   │   │   │   ├── ic-app-4.webp
│   │   │   │   │   ├── ic-app-5.webp
│   │   │   │   │   ├── ic-app-drive.svg
│   │   │   │   │   ├── ic-app-dropbox.svg
│   │   │   │   │   └── ic-app-onedrive.svg
│   │   │   │   ├── components/
│   │   │   │   │   ├── ic-accordion.svg
│   │   │   │   │   ├── ic-alert.svg
│   │   │   │   │   ├── ic-autocomplete.svg
│   │   │   │   │   ├── ic-avatar.svg
│   │   │   │   │   ├── ic-badge.svg
│   │   │   │   │   ├── ic-breadcrumbs.svg
│   │   │   │   │   ├── ic-buttons.svg
│   │   │   │   │   ├── ic-checkbox.svg
│   │   │   │   │   ├── ic-chip.svg
│   │   │   │   │   ├── ic-colors.svg
│   │   │   │   │   ├── ic-data-grid.svg
│   │   │   │   │   ├── ic-date-pickers.svg
│   │   │   │   │   ├── ic-dialog.svg
│   │   │   │   │   ├── ic-drawer.svg
│   │   │   │   │   ├── ic-extra-animate.svg
│   │   │   │   │   ├── ic-extra-carousel.svg
│   │   │   │   │   ├── ic-extra-chart.svg
│   │   │   │   │   ├── ic-extra-dnd.svg
│   │   │   │   │   ├── ic-extra-editor.svg
│   │   │   │   │   ├── ic-extra-form-validation.svg
│   │   │   │   │   ├── ic-extra-form-wizard.svg
│   │   │   │   │   ├── ic-extra-image.svg
│   │   │   │   │   ├── ic-extra-label.svg
│   │   │   │   │   ├── ic-extra-layout.svg
│   │   │   │   │   ├── ic-extra-lightbox.svg
│   │   │   │   │   ├── ic-extra-markdown.svg
│   │   │   │   │   ├── ic-extra-mega-menu.svg
│   │   │   │   │   ├── ic-extra-multi-language.svg
│   │   │   │   │   ├── ic-extra-navigation-bar.svg
│   │   │   │   │   ├── ic-extra-organization-chart.svg
│   │   │   │   │   ├── ic-extra-scroll-progress.svg
│   │   │   │   │   ├── ic-extra-scrollbar.svg
│   │   │   │   │   ├── ic-extra-snackbar.svg
│   │   │   │   │   ├── ic-extra-upload.svg
│   │   │   │   │   ├── ic-extra-utilities.svg
│   │   │   │   │   ├── ic-extra-walktour.svg
│   │   │   │   │   ├── ic-grid.svg
│   │   │   │   │   ├── ic-icons.svg
│   │   │   │   │   ├── ic-list.svg
│   │   │   │   │   ├── ic-menu.svg
│   │   │   │   │   ├── ic-pagination.svg
│   │   │   │   │   ├── ic-popover.svg
│   │   │   │   │   ├── ic-progress.svg
│   │   │   │   │   ├── ic-radio-button.svg
│   │   │   │   │   ├── ic-rating.svg
│   │   │   │   │   ├── ic-shadows.svg
│   │   │   │   │   ├── ic-slider.svg
│   │   │   │   │   ├── ic-stepper.svg
│   │   │   │   │   ├── ic-switch.svg
│   │   │   │   │   ├── ic-table.svg
│   │   │   │   │   ├── ic-tabs.svg
│   │   │   │   │   ├── ic-text-field.svg
│   │   │   │   │   ├── ic-timeline.svg
│   │   │   │   │   ├── ic-tooltip.svg
│   │   │   │   │   ├── ic-transfer-list.svg
│   │   │   │   │   ├── ic-tree-view.svg
│   │   │   │   │   └── ic-typography.svg
│   │   │   │   ├── courses/
│   │   │   │   │   ├── ic-courses-certificates.svg
│   │   │   │   │   ├── ic-courses-completed.svg
│   │   │   │   │   └── ic-courses-progress.svg
│   │   │   │   ├── empty/
│   │   │   │   │   ├── ic-cart.svg
│   │   │   │   │   ├── ic-content.svg
│   │   │   │   │   ├── ic-email-disabled.svg
│   │   │   │   │   ├── ic-email-selected.svg
│   │   │   │   │   ├── ic-folder-empty.svg
│   │   │   │   │   └── ic-mail.svg
│   │   │   │   ├── faqs/
│   │   │   │   │   ├── ic-account.svg
│   │   │   │   │   ├── ic-assurances.svg
│   │   │   │   │   ├── ic-delivery.svg
│   │   │   │   │   ├── ic-package.svg
│   │   │   │   │   ├── ic-payment.svg
│   │   │   │   │   └── ic-refund.svg
│   │   │   │   ├── files/
│   │   │   │   │   ├── ic-ai.svg
│   │   │   │   │   ├── ic-audio.svg
│   │   │   │   │   ├── ic-document.svg
│   │   │   │   │   ├── ic-excel.svg
│   │   │   │   │   ├── ic-file.svg
│   │   │   │   │   ├── ic-folder.svg
│   │   │   │   │   ├── ic-img.svg
│   │   │   │   │   ├── ic-js.svg
│   │   │   │   │   ├── ic-pdf.svg
│   │   │   │   │   ├── ic-power-point.svg
│   │   │   │   │   ├── ic-pts.svg
│   │   │   │   │   ├── ic-txt.svg
│   │   │   │   │   ├── ic-video.svg
│   │   │   │   │   ├── ic-word.svg
│   │   │   │   │   └── ic-zip.svg
│   │   │   │   ├── glass/
│   │   │   │   │   ├── ic-glass-bag.svg
│   │   │   │   │   ├── ic-glass-buy.svg
│   │   │   │   │   ├── ic-glass-message.svg
│   │   │   │   │   └── ic-glass-users.svg
│   │   │   │   ├── navbar/
│   │   │   │   │   ├── ic-analytics.svg
│   │   │   │   │   ├── ic-banking.svg
│   │   │   │   │   ├── ic-blank.svg
│   │   │   │   │   ├── ic-blog.svg
│   │   │   │   │   ├── ic-booking.svg
│   │   │   │   │   ├── ic-calendar.svg
│   │   │   │   │   ├── ic-course.svg
│   │   │   │   │   ├── ic-dashboard.svg
│   │   │   │   │   ├── ic-disabled.svg
│   │   │   │   │   ├── ic-ecommerce.svg
│   │   │   │   │   ├── ic-external.svg
│   │   │   │   │   ├── ic-file.svg
│   │   │   │   │   ├── ic-folder.svg
│   │   │   │   │   ├── ic-invoice.svg
│   │   │   │   │   ├── ic-job.svg
│   │   │   │   │   ├── ic-kanban.svg
│   │   │   │   │   ├── ic-label.svg
│   │   │   │   │   ├── ic-lock.svg
│   │   │   │   │   ├── ic-mail.svg
│   │   │   │   │   ├── ic-menu-item.svg
│   │   │   │   │   ├── ic-order.svg
│   │   │   │   │   ├── ic-params.svg
│   │   │   │   │   ├── ic-product.svg
│   │   │   │   │   ├── ic-subpaths.svg
│   │   │   │   │   ├── ic-tour.svg
│   │   │   │   │   └── ic-user.svg
│   │   │   │   ├── platforms/
│   │   │   │   │   ├── ic-amplify.svg
│   │   │   │   │   ├── ic-auth0.svg
│   │   │   │   │   ├── ic-figma.svg
│   │   │   │   │   ├── ic-firebase.svg
│   │   │   │   │   ├── ic-js.svg
│   │   │   │   │   ├── ic-jwt.svg
│   │   │   │   │   ├── ic-mui.svg
│   │   │   │   │   ├── ic-nextjs.svg
│   │   │   │   │   ├── ic-react.svg
│   │   │   │   │   ├── ic-ts.svg
│   │   │   │   │   └── ic-vite.svg
│   │   │   │   └── workspaces/
│   │   │   │       ├── logo-1.webp
│   │   │   │       ├── logo-2.webp
│   │   │   │       └── logo-3.webp
│   │   │   ├── illustrations/
│   │   │   │   ├── characters/
│   │   │   │   │   ├── character-fly.webp
│   │   │   │   │   ├── character-happy-jump.webp
│   │   │   │   │   ├── character-maintenance.webp
│   │   │   │   │   ├── character-notification.webp
│   │   │   │   │   ├── character-present.webp
│   │   │   │   │   ├── character-question.webp
│   │   │   │   │   ├── character-reject.webp
│   │   │   │   │   └── character-study.webp
│   │   │   │   ├── illustration-integration.webp
│   │   │   │   ├── illustration-rocket-large.webp
│   │   │   │   └── illustration-rocket-small.webp
│   │   │   └── images/
│   │   │       ├── about/
│   │   │       │   ├── hero.webp
│   │   │       │   ├── testimonials.webp
│   │   │       │   ├── vision.webp
│   │   │       │   ├── what-large.webp
│   │   │       │   └── what-small.webp
│   │   │       ├── avatars/
│   │   │       │   ├── synthetic/
│   │   │       │   │   ├── arthur_guimaraes.png
│   │   │       │   │   ├── carolina_alves.png
│   │   │       │   │   ├── eleonora_bittencourt.png
│   │   │       │   │   ├── felipe_rios.png
│   │   │       │   │   ├── helena_moraes.png
│   │   │       │   │   ├── isabella_viana.png
│   │   │       │   │   ├── leonardo_ferraz.png
│   │   │       │   │   ├── livia_guedes.png
│   │   │       │   │   ├── rafael_costa.png
│   │   │       │   │   └── thiago_mendes.png
│   │   │       │   └── fallback.jpg
│   │   │       ├── contact/
│   │   │       │   └── hero.webp
│   │   │       ├── covers/
│   │   │       │   └── banner-fallback.png
│   │   │       ├── faqs/
│   │   │       │   └── hero.webp
│   │   │       ├── home/
│   │   │       │   ├── bundle-dark-1.webp
│   │   │       │   ├── bundle-dark-2.webp
│   │   │       │   ├── bundle-light-1.webp
│   │   │       │   ├── bundle-light-2.webp
│   │   │       │   ├── for-designer.webp
│   │   │       │   ├── hero-blur.webp
│   │   │       │   ├── highlight-darkmode.webp
│   │   │       │   ├── highlight-presets-1.webp
│   │   │       │   ├── highlight-presets-2.webp
│   │   │       │   ├── highlight-presets-3.webp
│   │   │       │   ├── highlight-presets-4.webp
│   │   │       │   ├── highlight-presets-5.webp
│   │   │       │   ├── highlight-rtl.webp
│   │   │       │   └── zone-landing.webp
│   │   │       └── mock/
│   │   │           ├── avatar/
│   │   │           │   ├── avatar-1.webp
│   │   │           │   ├── avatar-10.webp
│   │   │           │   ├── avatar-11.webp
│   │   │           │   ├── avatar-12.webp
│   │   │           │   ├── avatar-13.webp
│   │   │           │   ├── avatar-14.webp
│   │   │           │   ├── avatar-15.webp
│   │   │           │   ├── avatar-16.webp
│   │   │           │   ├── avatar-17.webp
│   │   │           │   ├── avatar-18.webp
│   │   │           │   ├── avatar-19.webp
│   │   │           │   ├── avatar-2.webp
│   │   │           │   ├── avatar-20.webp
│   │   │           │   ├── avatar-21.webp
│   │   │           │   ├── avatar-22.webp
│   │   │           │   ├── avatar-23.webp
│   │   │           │   ├── avatar-24.webp
│   │   │           │   ├── avatar-25.webp
│   │   │           │   ├── avatar-3.webp
│   │   │           │   ├── avatar-4.webp
│   │   │           │   ├── avatar-5.webp
│   │   │           │   ├── avatar-6.webp
│   │   │           │   ├── avatar-7.webp
│   │   │           │   ├── avatar-8.webp
│   │   │           │   └── avatar-9.webp
│   │   │           ├── company/
│   │   │           │   ├── company-1.webp
│   │   │           │   ├── company-10.webp
│   │   │           │   ├── company-11.webp
│   │   │           │   ├── company-12.webp
│   │   │           │   ├── company-2.webp
│   │   │           │   ├── company-3.webp
│   │   │           │   ├── company-4.webp
│   │   │           │   ├── company-5.webp
│   │   │           │   ├── company-6.webp
│   │   │           │   ├── company-7.webp
│   │   │           │   ├── company-8.webp
│   │   │           │   └── company-9.webp
│   │   │           └── cover/
│   │   │               ├── cover-1.webp
│   │   │               ├── cover-10.webp
│   │   │               ├── cover-11.webp
│   │   │               ├── cover-12.webp
│   │   │               ├── cover-13.webp
│   │   │               ├── cover-14.webp
│   │   │               ├── cover-15.webp
│   │   │               ├── cover-16.webp
│   │   │               ├── cover-17.webp
│   │   │               ├── cover-18.webp
│   │   │               ├── cover-19.webp
│   │   │               ├── cover-2.webp
│   │   │               ├── cover-20.webp
│   │   │               ├── cover-21.webp
│   │   │               ├── cover-22.webp
│   │   │               ├── cover-23.webp
│   │   │               ├── cover-24.webp
│   │   │               ├── cover-3.webp
│   │   │               ├── cover-4.webp
│   │   │               ├── cover-5.webp
│   │   │               ├── cover-6.webp
│   │   │               ├── cover-7.webp
│   │   │               ├── cover-8.webp
│   │   │               └── cover-9.webp
│   │   ├── fonts/
│   │   ├── logo/
│   │   │   ├── android-chrome-192x192.png
│   │   │   └── android-chrome-512x512.png
│   │   ├── schemas/
│   │   │   ├── breadcrumb.json
│   │   │   ├── organization.json
│   │   │   └── website.json
│   │   ├── ads.txt
│   │   ├── ai-policy.txt
│   │   ├── favicon-16x16.png
│   │   ├── favicon-32x32.png
│   │   ├── favicon.ico
│   │   ├── humans.txt
│   │   ├── llms.txt
│   │   └── security.txt
│   ├── src/
│   │   ├── _mock/
│   │   │   ├── _blog.ts
│   │   │   ├── _mock.ts
│   │   │   ├── _others.ts
│   │   │   ├── _user.ts
│   │   │   ├── assets.ts
│   │   │   └── index.ts
│   │   ├── actions/
│   │   │   ├── mappers/
│   │   │   │   └── blog-mapper.ts
│   │   │   ├── blog-ssr.ts
│   │   │   ├── blog.ts
│   │   │   └── citizen.ts
│   │   ├── app/
│   │   │   ├── (home)/
│   │   │   │   ├── layout.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── (main)/
│   │   │   │   ├── (legal)/
│   │   │   │   │   ├── cookies/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── privacy/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── terms/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── about/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── authors/
│   │   │   │   │   ├── [slug]/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── contact/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── ecosystem/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── editorial-policy/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── fact-checking/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── methodology/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── search/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── tag/
│   │   │   │   │   └── [slug]/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── team/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── whitepaper/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── layout.tsx
│   │   │   ├── news/
│   │   │   │   ├── [slug]/
│   │   │   │   │   ├── error.tsx
│   │   │   │   │   ├── loading.tsx
│   │   │   │   │   ├── opengraph-image.tsx
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── twitter-image.tsx
│   │   │   │   ├── category/
│   │   │   │   │   └── [slug]/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── error.tsx
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── loading.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── rss/
│   │   │   │   └── route.ts
│   │   │   ├── app.tsx
│   │   │   ├── apple-icon.tsx
│   │   │   ├── layout.tsx
│   │   │   ├── loading.tsx
│   │   │   ├── manifest.ts
│   │   │   ├── not-found.tsx
│   │   │   ├── opengraph-image.tsx
│   │   │   ├── robots.ts
│   │   │   ├── sitemap.ts
│   │   │   └── twitter-image.tsx
│   │   ├── assets/
│   │   │   ├── data/
│   │   │   │   ├── countries.ts
│   │   │   │   ├── index.ts
│   │   │   │   └── world.json
│   │   │   ├── icons/
│   │   │   │   ├── email-inbox-icon.tsx
│   │   │   │   ├── index.ts
│   │   │   │   ├── plan-free-icon.tsx
│   │   │   │   ├── plan-premium-icon.tsx
│   │   │   │   ├── plan-starter-icon.tsx
│   │   │   │   └── sent-icon.tsx
│   │   │   └── illustrations/
│   │   │       ├── avatar-shape.tsx
│   │   │       ├── background-shape.tsx
│   │   │       ├── coming-soon-illustration.tsx
│   │   │       ├── forbidden-illustration.tsx
│   │   │       ├── index.ts
│   │   │       ├── maintenance-illustration.tsx
│   │   │       ├── page-not-found-illustration.tsx
│   │   │       ├── seo-illustration.tsx
│   │   │       └── server-error-illustration.tsx
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   └── index.ts
│   │   │   ├── context/
│   │   │   │   ├── action.ts
│   │   │   │   ├── auth-context.tsx
│   │   │   │   ├── auth-provider.tsx
│   │   │   │   ├── constant.ts
│   │   │   │   ├── index.ts
│   │   │   │   ├── utils.ts
│   │   │   │   └── web3-provider.tsx
│   │   │   ├── guard/
│   │   │   │   ├── auth-guard.tsx
│   │   │   │   ├── has-permission.tsx
│   │   │   │   ├── index.ts
│   │   │   │   └── role-based-guard.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── index.ts
│   │   │   │   ├── use-auth-context.ts
│   │   │   │   ├── use-siwe.ts
│   │   │   │   └── use-token-gating.ts
│   │   │   ├── utils/
│   │   │   │   ├── error-message.ts
│   │   │   │   └── index.ts
│   │   │   ├── view/
│   │   │   │   ├── index.ts
│   │   │   │   └── sign-in-web3-button.tsx
│   │   │   └── types.ts
│   │   ├── components/
│   │   │   ├── animate/
│   │   │   │   ├── scroll-progress/
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── scroll-progress.tsx
│   │   │   │   │   └── use-scroll-progress.ts
│   │   │   │   ├── variants/
│   │   │   │   │   ├── actions.ts
│   │   │   │   │   ├── background.ts
│   │   │   │   │   ├── bounce.ts
│   │   │   │   │   ├── container.ts
│   │   │   │   │   ├── fade.ts
│   │   │   │   │   ├── flip.ts
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── path.ts
│   │   │   │   │   ├── rotate.ts
│   │   │   │   │   ├── scale.ts
│   │   │   │   │   ├── slide.ts
│   │   │   │   │   ├── transition.ts
│   │   │   │   │   └── zoom.ts
│   │   │   │   ├── animate-border.tsx
│   │   │   │   ├── animate-count-up.tsx
│   │   │   │   ├── animate-logo.tsx
│   │   │   │   ├── animate-text.tsx
│   │   │   │   ├── back-to-top-button.tsx
│   │   │   │   ├── features.ts
│   │   │   │   ├── index.ts
│   │   │   │   ├── lazy-render.tsx
│   │   │   │   ├── motion-container.tsx
│   │   │   │   ├── motion-lazy.tsx
│   │   │   │   └── motion-viewport.tsx
│   │   │   ├── background/
│   │   │   │   ├── event-horizon.tsx
│   │   │   │   ├── flower-of-life.tsx
│   │   │   │   ├── galactic.tsx
│   │   │   │   ├── glass-cube.tsx
│   │   │   │   ├── hectohedron.tsx
│   │   │   │   ├── index.tsx
│   │   │   │   ├── scene-controller.tsx
│   │   │   │   ├── space.tsx
│   │   │   │   └── stellar-evolution.tsx
│   │   │   ├── carousel/
│   │   │   │   ├── components/
│   │   │   │   │   ├── arrow-button.tsx
│   │   │   │   │   ├── carousel-arrow-buttons.tsx
│   │   │   │   │   ├── carousel-dot-buttons.tsx
│   │   │   │   │   ├── carousel-progress-bar.tsx
│   │   │   │   │   ├── carousel-slide.tsx
│   │   │   │   │   ├── carousel-thumb.tsx
│   │   │   │   │   ├── carousel-thumbs.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── hooks/
│   │   │   │   │   ├── use-carousel-arrows.ts
│   │   │   │   │   ├── use-carousel-auto-scroll.ts
│   │   │   │   │   ├── use-carousel-autoplay.ts
│   │   │   │   │   ├── use-carousel-dots.ts
│   │   │   │   │   ├── use-carousel-parallax.ts
│   │   │   │   │   ├── use-carousel-progress.ts
│   │   │   │   │   ├── use-carousel.ts
│   │   │   │   │   └── use-thumbs.ts
│   │   │   │   ├── breakpoints.ts
│   │   │   │   ├── carousel.tsx
│   │   │   │   ├── classes.ts
│   │   │   │   ├── index.ts
│   │   │   │   ├── types.ts
│   │   │   │   └── utils.ts
│   │   │   ├── custom-breadcrumbs/
│   │   │   │   ├── back-link.tsx
│   │   │   │   ├── breadcrumb-link.tsx
│   │   │   │   ├── custom-breadcrumbs.tsx
│   │   │   │   ├── index.ts
│   │   │   │   ├── more-links.tsx
│   │   │   │   └── styles.tsx
│   │   │   ├── custom-dialog/
│   │   │   │   ├── confirm-dialog.tsx
│   │   │   │   ├── index.ts
│   │   │   │   └── types.ts
│   │   │   ├── custom-popover/
│   │   │   │   ├── custom-popover.tsx
│   │   │   │   ├── hooks.ts
│   │   │   │   ├── index.ts
│   │   │   │   ├── styles.tsx
│   │   │   │   ├── types.ts
│   │   │   │   └── utils.ts
│   │   │   ├── file-thumbnail/
│   │   │   │   ├── classes.ts
│   │   │   │   ├── file-thumbnail.tsx
│   │   │   │   ├── index.ts
│   │   │   │   ├── styles.tsx
│   │   │   │   ├── types.ts
│   │   │   │   ├── use-file-preview.ts
│   │   │   │   └── utils.ts
│   │   │   ├── flag-icon/
│   │   │   │   ├── classes.ts
│   │   │   │   ├── flag-icon.tsx
│   │   │   │   └── index.ts
│   │   │   ├── hook-form/
│   │   │   │   ├── fields.tsx
│   │   │   │   ├── form-provider.tsx
│   │   │   │   ├── help-text.tsx
│   │   │   │   ├── index.ts
│   │   │   │   ├── rhf-autocomplete.tsx
│   │   │   │   ├── rhf-checkbox.tsx
│   │   │   │   ├── rhf-code.tsx
│   │   │   │   ├── rhf-date-picker.tsx
│   │   │   │   ├── rhf-radio-group.tsx
│   │   │   │   ├── rhf-rating.tsx
│   │   │   │   ├── rhf-select.tsx
│   │   │   │   ├── rhf-slider.tsx
│   │   │   │   ├── rhf-switch.tsx
│   │   │   │   ├── rhf-text-field.tsx
│   │   │   │   ├── schema-utils.ts
│   │   │   │   └── styles.ts
│   │   │   ├── iconify/
│   │   │   │   ├── classes.ts
│   │   │   │   ├── icon-sets.ts
│   │   │   │   ├── iconify.tsx
│   │   │   │   ├── index.ts
│   │   │   │   └── register-icons.ts
│   │   │   ├── image/
│   │   │   │   ├── classes.ts
│   │   │   │   ├── image.tsx
│   │   │   │   ├── index.ts
│   │   │   │   ├── og-image.tsx
│   │   │   │   └── styles.tsx
│   │   │   ├── label/
│   │   │   │   ├── classes.ts
│   │   │   │   ├── index.ts
│   │   │   │   ├── label.tsx
│   │   │   │   ├── styles.tsx
│   │   │   │   └── types.ts
│   │   │   ├── loading-screen/
│   │   │   │   ├── index.ts
│   │   │   │   ├── loading-screen.tsx
│   │   │   │   └── splash-screen.tsx
│   │   │   ├── logo/
│   │   │   │   ├── classes.ts
│   │   │   │   ├── index.ts
│   │   │   │   └── logo.tsx
│   │   │   ├── markdown/
│   │   │   │   ├── classes.ts
│   │   │   │   ├── code-highlight-block.css
│   │   │   │   ├── html-tags.ts
│   │   │   │   ├── html-to-markdown.ts
│   │   │   │   ├── index.ts
│   │   │   │   ├── markdown.tsx
│   │   │   │   └── styles.tsx
│   │   │   ├── nav-basic/
│   │   │   │   ├── components/
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── nav-collapse.tsx
│   │   │   │   │   ├── nav-dropdown.tsx
│   │   │   │   │   └── nav-elements.tsx
│   │   │   │   ├── desktop/
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── nav-basic-desktop.tsx
│   │   │   │   │   ├── nav-item.tsx
│   │   │   │   │   └── nav-list.tsx
│   │   │   │   ├── mobile/
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── nav-basic-mobile.tsx
│   │   │   │   │   ├── nav-item.tsx
│   │   │   │   │   └── nav-list.tsx
│   │   │   │   ├── styles/
│   │   │   │   │   ├── classes.ts
│   │   │   │   │   ├── css-vars.ts
│   │   │   │   │   ├── index.ts
│   │   │   │   │   └── nav-item-styles.tsx
│   │   │   │   ├── utils/
│   │   │   │   │   ├── create-nav-item.ts
│   │   │   │   │   └── index.ts
│   │   │   │   ├── index.ts
│   │   │   │   └── types.ts
│   │   │   ├── nav-section/
│   │   │   │   ├── components/
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── nav-collapse.tsx
│   │   │   │   │   ├── nav-dropdown.tsx
│   │   │   │   │   ├── nav-elements.tsx
│   │   │   │   │   └── nav-subheader.tsx
│   │   │   │   ├── horizontal/
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── nav-item.tsx
│   │   │   │   │   ├── nav-list.tsx
│   │   │   │   │   └── nav-section-horizontal.tsx
│   │   │   │   ├── mini/
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── nav-item.tsx
│   │   │   │   │   ├── nav-list.tsx
│   │   │   │   │   └── nav-section-mini.tsx
│   │   │   │   ├── styles/
│   │   │   │   │   ├── classes.ts
│   │   │   │   │   ├── css-vars.ts
│   │   │   │   │   ├── index.ts
│   │   │   │   │   └── nav-item-styles.tsx
│   │   │   │   ├── utils/
│   │   │   │   │   ├── create-nav-item.ts
│   │   │   │   │   └── index.ts
│   │   │   │   ├── vertical/
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── nav-item.tsx
│   │   │   │   │   ├── nav-list.tsx
│   │   │   │   │   └── nav-section-vertical.tsx
│   │   │   │   ├── index.ts
│   │   │   │   └── types.ts
│   │   │   ├── progress-bar/
│   │   │   │   ├── index.ts
│   │   │   │   ├── progress-bar.tsx
│   │   │   │   └── styles.css
│   │   │   ├── scrollbar/
│   │   │   │   ├── classes.ts
│   │   │   │   ├── index.ts
│   │   │   │   ├── scrollbar.tsx
│   │   │   │   ├── styles.css
│   │   │   │   └── types.ts
│   │   │   ├── search-not-found/
│   │   │   │   ├── index.ts
│   │   │   │   └── search-not-found.tsx
│   │   │   ├── seo/
│   │   │   │   ├── analytics.tsx
│   │   │   │   ├── breadcrumb.tsx
│   │   │   │   ├── canonical.tsx
│   │   │   │   └── json-ld.tsx
│   │   │   ├── settings/
│   │   │   │   ├── context/
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── settings-context.ts
│   │   │   │   │   ├── settings-provider.tsx
│   │   │   │   │   └── use-settings-context.ts
│   │   │   │   ├── drawer/
│   │   │   │   │   ├── base-option.tsx
│   │   │   │   │   ├── font-options.tsx
│   │   │   │   │   ├── fullscreen-button.tsx
│   │   │   │   │   ├── icons.tsx
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── nav-layout-option.tsx
│   │   │   │   │   ├── presets-options.tsx
│   │   │   │   │   ├── settings-drawer.tsx
│   │   │   │   │   └── styles.tsx
│   │   │   │   ├── index.ts
│   │   │   │   ├── server.ts
│   │   │   │   ├── settings-config.ts
│   │   │   │   └── types.ts
│   │   │   ├── snackbar/
│   │   │   │   ├── classes.ts
│   │   │   │   ├── index.ts
│   │   │   │   ├── snackbar.tsx
│   │   │   │   └── styles.tsx
│   │   │   └── threeglobe/
│   │   │       ├── globe.tsx
│   │   │       ├── polyfill.ts
│   │   │       └── types.ts
│   │   ├── hooks/
│   │   │   ├── use-blog.ts
│   │   │   └── use-boolean.ts
│   │   ├── layouts/
│   │   │   ├── blog/
│   │   │   │   ├── index.ts
│   │   │   │   └── layout.tsx
│   │   │   ├── components/
│   │   │   │   ├── notifications-drawer/
│   │   │   │   │   ├── icons.tsx
│   │   │   │   │   ├── index.tsx
│   │   │   │   │   └── notification-item.tsx
│   │   │   │   ├── searchbar/
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── result-item.tsx
│   │   │   │   │   ├── searchbar.tsx
│   │   │   │   │   └── utils.ts
│   │   │   │   ├── account-button.tsx
│   │   │   │   ├── account-drawer.tsx
│   │   │   │   ├── account-popover.tsx
│   │   │   │   ├── core-nav.tsx
│   │   │   │   ├── language-popover.tsx
│   │   │   │   ├── menu-button.tsx
│   │   │   │   ├── sign-in-button.tsx
│   │   │   │   └── sign-out-button.tsx
│   │   │   ├── core/
│   │   │   │   ├── classes.ts
│   │   │   │   ├── css-vars.ts
│   │   │   │   ├── header-section.tsx
│   │   │   │   ├── index.ts
│   │   │   │   ├── layout-section.tsx
│   │   │   │   └── main-section.tsx
│   │   │   ├── main/
│   │   │   │   ├── nav/
│   │   │   │   │   ├── components/
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   ├── nav-dropdown.tsx
│   │   │   │   │   │   └── nav-elements.tsx
│   │   │   │   │   ├── desktop/
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   ├── nav-desktop-item-dashboard.tsx
│   │   │   │   │   │   ├── nav-desktop-item.tsx
│   │   │   │   │   │   ├── nav-desktop-list.tsx
│   │   │   │   │   │   └── nav-desktop.tsx
│   │   │   │   │   ├── mobile/
│   │   │   │   │   │   ├── index.ts
│   │   │   │   │   │   ├── nav-mobile-item.tsx
│   │   │   │   │   │   ├── nav-mobile-list.tsx
│   │   │   │   │   │   └── nav-mobile.tsx
│   │   │   │   │   └── types.ts
│   │   │   │   ├── footer.tsx
│   │   │   │   ├── index.ts
│   │   │   │   └── layout.tsx
│   │   │   ├── simple/
│   │   │   │   ├── content.tsx
│   │   │   │   ├── index.ts
│   │   │   │   └── layout.tsx
│   │   │   ├── nav-config-blog.tsx
│   │   │   └── nav-config-main.tsx
│   │   ├── lib/
│   │   │   ├── seo/
│   │   │   │   ├── metadata.ts
│   │   │   │   ├── openGraph.ts
│   │   │   │   ├── robots.ts
│   │   │   │   └── schema.ts
│   │   │   └── axios.ts
│   │   ├── locales/
│   │   │   ├── langs/
│   │   │   │   ├── ar/
│   │   │   │   │   ├── common.json
│   │   │   │   │   ├── messages.json
│   │   │   │   │   └── navbar.json
│   │   │   │   ├── cn/
│   │   │   │   │   ├── common.json
│   │   │   │   │   ├── messages.json
│   │   │   │   │   └── navbar.json
│   │   │   │   ├── en/
│   │   │   │   │   ├── common.json
│   │   │   │   │   ├── messages.json
│   │   │   │   │   └── navbar.json
│   │   │   │   ├── es/
│   │   │   │   │   └── common.json
│   │   │   │   ├── fr/
│   │   │   │   │   ├── common.json
│   │   │   │   │   ├── messages.json
│   │   │   │   │   └── navbar.json
│   │   │   │   ├── pt/
│   │   │   │   │   └── common.json
│   │   │   │   ├── ru/
│   │   │   │   │   └── common.json
│   │   │   │   └── vi/
│   │   │   │       ├── common.json
│   │   │   │       ├── messages.json
│   │   │   │       └── navbar.json
│   │   │   ├── utils/
│   │   │   │   └── number-format-locale.ts
│   │   │   ├── i18n-provider.tsx
│   │   │   ├── index.ts
│   │   │   ├── locales-config.ts
│   │   │   ├── localization-provider.tsx
│   │   │   ├── server.ts
│   │   │   └── use-locales.ts
│   │   ├── routes/
│   │   │   ├── components/
│   │   │   │   ├── index.ts
│   │   │   │   └── router-link.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── index.ts
│   │   │   │   ├── use-params.ts
│   │   │   │   ├── use-pathname.ts
│   │   │   │   ├── use-router.ts
│   │   │   │   └── use-search-params.ts
│   │   │   └── paths.ts
│   │   ├── schemas/
│   │   │   └── blog-zod.ts
│   │   ├── sections/
│   │   │   ├── blog/
│   │   │   │   ├── components/
│   │   │   │   │   ├── advertisement.tsx
│   │   │   │   │   ├── authors.tsx
│   │   │   │   │   ├── community.tsx
│   │   │   │   │   ├── featured.tsx
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── post-search.tsx
│   │   │   │   │   ├── post-sort.tsx
│   │   │   │   │   └── video.tsx
│   │   │   │   ├── details/
│   │   │   │   │   ├── post-comment-item.tsx
│   │   │   │   │   ├── post-comment-list.tsx
│   │   │   │   │   └── post-details-hero.tsx
│   │   │   │   ├── forms/
│   │   │   │   │   ├── newsletter.tsx
│   │   │   │   │   └── post-comment-form.tsx
│   │   │   │   ├── item/
│   │   │   │   │   ├── category-item.tsx
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── item-horizontal.tsx
│   │   │   │   │   ├── item.tsx
│   │   │   │   │   ├── list-horizontal.tsx
│   │   │   │   │   ├── list.tsx
│   │   │   │   │   ├── recent.tsx
│   │   │   │   │   ├── skeleton.tsx
│   │   │   │   │   └── trending.tsx
│   │   │   │   ├── view/
│   │   │   │   │   ├── public/
│   │   │   │   │   │   ├── post-details-home-view.tsx
│   │   │   │   │   │   └── post-list-home-view.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── ARCHITECTURE.md
│   │   │   │   └── constants.ts
│   │   │   ├── coming-soon/
│   │   │   │   └── view/
│   │   │   │       ├── coming-soon-view.tsx
│   │   │   │       └── index.ts
│   │   │   ├── error/
│   │   │   │   ├── 403-view.tsx
│   │   │   │   ├── 500-view.tsx
│   │   │   │   ├── index.ts
│   │   │   │   └── not-found-view.tsx
│   │   │   ├── home/
│   │   │   │   ├── components/
│   │   │   │   │   ├── hero-svg.tsx
│   │   │   │   │   ├── home-countdown-dialog.tsx
│   │   │   │   │   ├── integrations-diagram.tsx
│   │   │   │   │   ├── section-title.tsx
│   │   │   │   │   └── svg-elements.tsx
│   │   │   │   ├── view/
│   │   │   │   │   ├── home-view.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── cta-banner.tsx
│   │   │   │   ├── home-community.tsx
│   │   │   │   ├── home-ecosystem.tsx
│   │   │   │   ├── home-faqs.tsx
│   │   │   │   ├── home-hero.tsx
│   │   │   │   ├── home-integrations.tsx
│   │   │   │   ├── home-latest-news.tsx
│   │   │   │   ├── home-roadmap.tsx
│   │   │   │   └── home-team.tsx
│   │   │   └── overview/
│   │   ├── test/
│   │   │   ├── sanity.test.ts
│   │   │   └── setup.ts
│   │   ├── theme/
│   │   │   ├── core/
│   │   │   │   ├── components/
│   │   │   │   │   ├── accordion.tsx
│   │   │   │   │   ├── alert.tsx
│   │   │   │   │   ├── appbar.tsx
│   │   │   │   │   ├── autocomplete.tsx
│   │   │   │   │   ├── avatar.tsx
│   │   │   │   │   ├── backdrop.tsx
│   │   │   │   │   ├── badge.tsx
│   │   │   │   │   ├── breadcrumbs.tsx
│   │   │   │   │   ├── button-fab.tsx
│   │   │   │   │   ├── button-group.tsx
│   │   │   │   │   ├── button-icon.tsx
│   │   │   │   │   ├── button-toggle.tsx
│   │   │   │   │   ├── button.tsx
│   │   │   │   │   ├── card.tsx
│   │   │   │   │   ├── checkbox.tsx
│   │   │   │   │   ├── chip.tsx
│   │   │   │   │   ├── dialog.tsx
│   │   │   │   │   ├── drawer.tsx
│   │   │   │   │   ├── form.tsx
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── link.tsx
│   │   │   │   │   ├── list.tsx
│   │   │   │   │   ├── menu.tsx
│   │   │   │   │   ├── mui-x-date-picker.tsx
│   │   │   │   │   ├── mui-x-tree-view.tsx
│   │   │   │   │   ├── pagination.tsx
│   │   │   │   │   ├── paper.tsx
│   │   │   │   │   ├── popover.tsx
│   │   │   │   │   ├── progress.tsx
│   │   │   │   │   ├── radio.tsx
│   │   │   │   │   ├── rating.tsx
│   │   │   │   │   ├── select.tsx
│   │   │   │   │   ├── skeleton.tsx
│   │   │   │   │   ├── slider.tsx
│   │   │   │   │   ├── stack.tsx
│   │   │   │   │   ├── stepper.tsx
│   │   │   │   │   ├── svg-icon.tsx
│   │   │   │   │   ├── switch.tsx
│   │   │   │   │   ├── table.tsx
│   │   │   │   │   ├── tabs.tsx
│   │   │   │   │   ├── text-field.tsx
│   │   │   │   │   ├── timeline.tsx
│   │   │   │   │   └── tooltip.tsx
│   │   │   │   ├── mixins/
│   │   │   │   │   ├── background.ts
│   │   │   │   │   ├── border.ts
│   │   │   │   │   ├── global-styles-components.ts
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── mixins.ts
│   │   │   │   │   └── text.ts
│   │   │   │   ├── custom-shadows.ts
│   │   │   │   ├── index.ts
│   │   │   │   ├── opacity.ts
│   │   │   │   ├── palette.ts
│   │   │   │   ├── shadows.ts
│   │   │   │   └── typography.ts
│   │   │   ├── with-settings/
│   │   │   │   ├── color-presets.ts
│   │   │   │   ├── index.ts
│   │   │   │   ├── right-to-left.tsx
│   │   │   │   ├── update-components.ts
│   │   │   │   └── update-core.ts
│   │   │   ├── create-classes.ts
│   │   │   ├── create-theme.ts
│   │   │   ├── extend-theme-types.d.ts
│   │   │   ├── index.ts
│   │   │   ├── theme-config.ts
│   │   │   ├── theme-overrides.ts
│   │   │   └── types.ts
│   │   ├── types/
│   │   │   ├── apexcharts.d.ts
│   │   │   ├── blog.ts
│   │   │   ├── citizen.ts
│   │   │   ├── common.ts
│   │   │   └── user.ts
│   │   ├── utils/
│   │   │   ├── format-number.ts
│   │   │   └── format-time.ts
│   │   ├── global-config.ts
│   │   ├── global.css
│   │   └── proxy.ts
│   ├── .dev.vars
│   ├── .editorconfig
│   ├── .env
│   ├── .env.local
│   ├── .gitignore
│   ├── .lighthouserc.js
│   ├── .prettierignore
│   ├── eslint.config.mjs
│   ├── LICENSE
│   ├── next-env.d.ts
│   ├── next.config.ts
│   ├── package.json
│   ├── prettier.config.mjs
│   ├── README.md
│   ├── tsconfig.json
│   └── vitest.config.ts
├── generate-structure.js
└── pnpm-workspace.yaml
```

--- 
*Gerado pelo assistente Antigravity para ASPPIBRA DAO.*