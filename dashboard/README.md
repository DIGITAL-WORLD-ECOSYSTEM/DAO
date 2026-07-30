# 🌐 DAO Dashboard - Frontend Client

Este é o frontend do sistema de painel de controle e governança (DAO). Ele foi construído utilizando as melhores práticas modernas de **Clean Architecture**, focando na separação de responsabilidades (Domain Separation) e integração híbrida entre contas tradicionais (Web2) e identidades descentralizadas (Web3 - SIWE).

---

## 🏗️ Arquitetura do Frontend (Architecture)

### 1. Sistema de Identidade: O Padrão View Model
Para garantir que a lógica complexa de perfis não invada os componentes visuais, a aplicação adota o padrão **View Model Pattern**. 

A fonte da verdade de autenticação (`AuthProvider`) foi isolada, retornando apenas a sessão bruta. Os componentes visuais consomem os dados através do Hook especializado:
**`useUserProfile`** (`src/auth/hooks/use-user-profile.ts`)

#### Profile Transformers (`src/utils/profile-transformers.ts`)
A arquitetura conta com uma suíte de "Funções Puras" (Transformers) responsáveis pelas regras de negócio visuais:
* **`buildDisplayName`**: Define o nome de exibição (Single Source of Truth). Prioriza Nomes Civis, realiza o fallback inteligente para endereços de Carteiras Web3 (aplicando o interceptador de emergência) ou extração de e-mails.
* **`formatWalletAddress`**: Formata nativamente qualquer carteira para o padrão simétrico (ex: `0xDfcE...e6b56f`).
* **`buildDisplayAvatar`**: Garante que o aplicativo inteiro respeite o carregamento de imagens de perfil do banco de dados ou acione nativamente a imagem global de Fallback (`/assets/images/avatar/default-avatar.png`).

### 2. Motor de Impressão e Relatórios PDF (A4 Print Engine)
Para a emissão de documentos oficiais (Extratos, Faturas, Certificados) que precisam de fidelidade de impressão ABNT (ou A4 padrão), o sistema adota uma arquitetura baseada em **Componentes Ocultos Injetáveis**. Essa abordagem contorna falhas dos motores de navegadores (como o *Chrome Print Engine bug*).

* **Motor Físico (`A4Page`)**: O componente mestre (`src/components/abnt-document/a4-page.tsx`). Ele delega as margens físicas à diretiva `@page { margin: 15mm 15mm 0mm 15mm }`, desativando a injeção de URLs nativas do navegador. Possui sistema de quebra de páginas, repetição automática de cabeçalho (`<thead>`) e ancoramento de rodapé de aviso legal no limite da folha via *spacer invisível* (`<tfoot>`).
* **Layout de Negócios**: Componentes dedicados como o `<LedgerPrintDocument />` encapsulam o design visual (Ex: métricas com psicologia de cores). O Box-Model é blindado com regras essenciais de impressão nativa:
  * `table-layout: fixed` e `word-wrap: break-word` evitam rompimento de colunas.
  * `white-space: nowrap` previne quebras monetárias indesejadas (órfãos).
  * `page-break-inside: avoid` nas linhas iteradas garante integridade na virada de páginas.
* **Padronização para novos Relatórios:** No futuro, qualquer novo layout que exija a emissão PDF deverá simplesmente importar e envolver o seu design de negócios dentro do motor `<A4Page>` para herdar toda essa proteção geométrica.

### 3. Sistema Financeiro (Banking & Treasury)
O ecossistema financeiro do painel foi desmembrado de pastas genéricas (como `overview/analytics`) para um domínio estritamente isolado (`src/sections/banking/`). O objetivo é garantir **Bounded Context** (Isolamento de Contexto) e blindar regras de negócio monetárias e fiscais.

**Princípio Fundamental:** O domínio financeiro não deve compartilhar dependências visuais intrincadas com outras áreas do painel. Cada subdomínio deve possuir seus próprios hooks, tipagens e componentes.

**Árvore de Diretórios Oficial (Target Architecture):**
```text
src/
└── sections/
    └── banking/
        ├── financial-history/      # Ficha Financeira (Visão 360º de um Associado Específico)
        │   ├── components/         # Buscador, Resumo Financeiro (KPIs) e Extrato (Ledger)
        │   ├── utils/              # Tipagens de perfil (IFinancialProfile) e lógicas locais
        │   └── view/               # Smart Component: orquestra SWR, agrega dados e controla estado
        │
        ├── treasury/               # Visão Macro (O Dashboard da Tesouraria da DAO)
        │   ├── components/         # (A MIGRAR) Gráficos de fluxo de caixa, evolução mensal
        │   └── view/               # Orquestrador de métricas coletivas do banco
        │
        └── payments/               # Fluxo de Saída (Contas a Pagar / Autorizações)
            ├── components/         # (A MIGRAR) Formulários de remessa e aprovação de saques
            └── view/               # Interface de controle de liquidações
```

**Linha de Raciocínio (Guia de Desenvolvimento):**
1. **Regra do Isolamento Estrutural:** Nenhuma funcionalidade nova ligada a finanças, contabilidade ou pagamentos deve ser criada nas pastas `overview/` ou `analytics/`. Elas pertencem a `sections/banking/`.
2. **Padrão Smart/Dumb:** A pasta `view/` deve conter apenas um (ou poucos) componentes "Inteligentes". É ali que os Hooks de API (SWR) e estados globais operam. Todo o restante deve ser criado dentro de `components/` como componentes "Burros" (Dumb Components) que apenas recebem `props` puras.
3. **UX de Estado Vazio (Empty State):** Regra rígida de produto. Nenhum painel financeiro deve iniciar carregando dados aleatórios ou "R$ 0,00". Se nenhuma seleção foi feita, o componente deve repousar com indicadores visuais vazios (`—`) aguardando a intenção direta do usuário.

**Detalhamento do Módulo: Histórico Financeiro (`financial-history/`)**
Módulo implementado e estabilizado. Atua como a "Ficha Financeira" oficial do associado, oferecendo uma visão 360º de suas obrigações e transações.
* **`financial-history-view.tsx`:** Orquestrador central (Smart Component). Mantém os estados de filtro (ano, busca textual) e o ID do associado. Realiza o fetch dos dados agregados (`useGetCitizenLedger`) e os repassa aos componentes filhos.
* **`associate-search-card.tsx`:** Motor de busca (Autocomplete) que consome a API de Cidadãos (`useGetCitizens`) para localizar associados por Nome, CPF ou ASP-ID e devolve o UUID selecionado para a View.
* **`financial-summary-header.tsx`:** Painel (Dumb Component) que exibe a Identidade (com ofuscação de CPF/RG para LGPD), Situação do Contrato (valor contratado, pago, saldo, % de quitação) e Obrigações (vencimentos e parcelas). Implementa a regra rígida de "Estado 1" (Vazio) exibindo hifens (`—`) quando não há seleção.
* **`financial-transactions-table.tsx`:** Tabela interativa paginada que renderiza as movimentações financeiras do associado, com formatação de cores (verde/vermelho) para entradas e saídas.
* **`financial-history-print.tsx`:** Documento oculto para emissão de PDF A4, embutido no motor base de impressão para exportação do extrato auditável.

---

## 🗺️ Roadmap de Evolução (Próximas Fases)

O núcleo de apresentação e rotas dinâmicas do dashboard já foi refatorado. As próximas fases focam exclusivamente na **Consistência de Dados e Infraestrutura de Backend**:

### Etapa A: Correção e Expansão dos DTOs (`/login` e `/me`)
* **Objetivo:** O Frontend depende de campos completos (`firstName`, `lastName`, `photoURL`, `did`, `walletAddress`, etc.). Atualmente o login local (`local.ts`) retorna DTOs limitados (`{ id, email, role }`). 
* **Ação:** Atualizar o *Drizzle ORM* e as rotas para retornar a payload completa, permitindo que a camada View Model opere em sua capacidade máxima com dados do banco ao invés de fallbacks.

### Etapa B: Infraestrutura de Storage de Avatar
* **Objetivo:** Substituir as simulações (`Promise.resolve`) no componente `account-general.tsx`.
* **Ação:** Implementar upload `multipart/form-data` conectando ao **Cloudflare R2**, salvando a URL gerada de volta no banco de dados SQLite (D1) e atualizando a sessão em tempo real.

### Etapa C: Central de Comunicação (Chat & Real-Time)
*Status: Descongelado e Refatorado (Fase 1)*

O módulo de Chat (`src/sections/chat`) foi completamente auditado e refatorado para uma arquitetura de classe corporativa, espelhando os padrões Enterprise (Slack/Teams).

**Arquitetura Visual (Three-Pane Layout):**
* **Barra Global (ChatKpiBar):** Injetada no topo da tela com 100% de largura, atuando como um painel executivo intocável contendo os indicadores vitais (Não Lidas, Online, Tickets, Ações IA, Chamadas). Desvinculada completamente do workspace.
* **Sidebar (ChatNav):** Painel lateral esquerdo com lista de contatos e conversas. Altamente responsivo (transforma-se nativamente em um Drawer no Mobile).
* **Main Panel (Workspace):** Orquestrado pela Máquina de Estados no `chat-view.tsx`. Quando não há foco, exibe o `<ChatDashboard>` (Portal e Ações Rápidas). Quando uma conversa é selecionada, injeta o Header nativo, o histórico de mensagens e o Compositor de texto (Input).
* **Details (ChatRoom):** Gaveta lateral direita exibindo metadados, arquivos anexos e ações financeiras do contrato associado (P2P).

**Arquitetura de Dados (Engine Offline-First):**
A camada UI é 100% desacoplada do motor de envio de rede. A orquestração ocorre via `ChatRealtimeProvider`:
* Estado de conexão governado por **WebSocket** (`Connecting`, `Connected`, `Offline`).
* **Fila Offline nativa (IndexedDB):** Mensagens criadas sem conexão com a internet ou em flutuação de rede são enfileiradas no disco do navegador (`Queued`) e injetadas no WebSocket automaticamente assim que o handshake é reestabelecido, alcançando sincronia perfeita (Status: *Sent / Delivered / Read*).

---

## ⚠️ Débitos Técnicos e Módulos Congelados (Known Issues)

*(Atualmente sem grandes módulos bloqueados. O monolito estrutural do componente `ChatMessageItem` e a virtualização do Scroll de histórico do Chat estão mapeados para refatoração na Fase 2 e 3 do Roadmap da Área de Comunicação).*

---

## 🛠️ Instalação e Execução (Dev)

**Pré-requisitos**
* Node.js >=20 (Recomendado)
* Gerenciador de Pacotes: `pnpm` (Padrão atual) ou `yarn`.

**Instalação (pnpm)**
```sh
pnpm install
pnpm dev
```

**Build de Produção**
```sh
pnpm build
```

*(Base do projeto originada do Minimal UI Kit. Ambiente de Mock data genérico em `https://api-dev-minimal-[version].vercel.app` para componentes não integrados ao backend).*
