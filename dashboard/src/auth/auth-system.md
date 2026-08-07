# 🛡️ Documentação Oficial: Sistema de Autenticação DAO

## 1. Visão Geral
O sistema de autenticação da DAO foi projetado para oferecer uma experiência de usuário profissional, segura e visualmente impactante. Ele unifica métodos tradicionais de login (JWT) com tecnologias descentralizadas (Web3/SIWE).

**Estética**: Cyberpunk UI (Neon Verde `#00E5BC` sobre Fundo Escuro `#0A0D10`).
**Layout**: Modelo Centralizado (`AuthCenteredLayout`).

---

## 2. Mapa de Rotas Oficiais
Todas as rotas estão configuradas para o ambiente de produção e integradas ao backend.

| Recurso | URL | Descrição |
| :--- | :--- | :--- |
| **Login Principal** | `/auth/jwt/sign-in` | Acesso via E-mail/Senha ou Web3 (MetaMask) |
| **Cadastro** | `/auth/jwt/sign-up` | Solicitação de novo acesso ao portal |
| **Esqueci a Senha** | `/auth/jwt/reset-password` | Solicitação de link de recuperação por e-mail |
| **Atualizar Senha** | `/auth/jwt/update-password` | Definição de nova credencial via código |
| **Verificação** | `/auth/jwt/verify` | Tela de confirmação de e-mail |

---

## 3. Arquitetura do Sistema

### 3.1 Camada de Layout
- **AuthCenteredLayout**: Único layout oficial para autenticação. Garante que o card de login esteja sempre focado e centralizado, com efeitos de névoa e brilho neon no fundo.

### 3.2 Provedores e Ações
- **Contexto**: Localizado em `src/auth/context/jwt/`.
- **Ações (`action.ts`)**: 
  - `signInWithPassword`: Comunicação via Axios com o endpoint `/api/core/identity/local/login`.
  - `signInWithWeb3`: Fluxo SIWE completo (Nonce -> Assinatura MetaMask -> Verify).

---

## 4. Integração Web3 (SIWE)
O login via carteira utiliza a biblioteca `viem` para garantir performance e segurança.
1. O frontend solicita um **Nonce** único do backend.
2. O usuário assina uma mensagem padrão via **MetaMask**.
3. A assinatura e a conta são enviadas para `/api/core/identity/web3/verify`.
4. O backend retorna o token JWT de sessão.

---

## 5. Padrões Visuais (Cyberpunk Design System)
Para manter a consistência, novos campos ou botões devem seguir estas diretrizes:
- **Cor Primária**: `#00E5BC` (Neon Green).
- **Fundo de Card**: `#0A0D10` (Dark Navy).
- **Bordas**: `1px solid #00E5BC` com `box-shadow` suave para efeito de brilho.
- **Tipografia**: Letras maiúsculas em botões e labels para um visual futurista.

---

## 6. Manutenção e Limpeza
- **Localização**: Todos os textos residem diretamente nas Views em `src/auth/view/jwt/`.
- **Ícones**: Utiliza `src/components/iconify`. Ícones sociais personalizados (MetaMask, Google) devem ser castados como `any` para bypass de tipagem estrita de sets pré-definidos.

---

*Documentação gerada em 26 de Abril de 2026.*
