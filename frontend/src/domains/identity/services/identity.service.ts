import { identityClient } from '../client/identity.client';

/**
 * Service Layer:
 * Responsável por orquestrar a lógica de negócio, transformações e
 * decidir o fluxo, delegando as requisições HTTP para o Client.
 */
export const identityService = {
  /**
   * Atualiza o Perfil do Usuário
   */
  async updateProfile(payload: { fullName: string }) {
    // Aqui poderíamos ter transformações de dados ou regras antes de enviar
    const response = await identityClient.updateProfile(payload);
    return response;
  },

  /**
   * Realiza Login
   */
  async login(email: string, password: string) {
    // BFF Auth
    return await identityClient.login(email, password);
  },

  /**
   * Realiza Logout e redireciona (Regra de orquestração UI)
   */
  async logout() {
    await identityClient.logout();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }
};
