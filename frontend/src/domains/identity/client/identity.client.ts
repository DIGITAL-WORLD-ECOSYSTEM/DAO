import { IdentityProfileSchema, LoginResponseSchema, IdentityProfile } from '../schemas/identity.schema';

const HONO_URL = process.env.NEXT_PUBLIC_API_URL || 'https://staging.app.asppibra.com';

export const identityClient = {
  /**
   * [SERVER COMPONENT ONLY]
   * Busca o perfil completo do usuário diretamente do Hono.
   */
  async getMe(token: string): Promise<IdentityProfile | null> {
    if (typeof window !== 'undefined') {
      throw new Error('getMe() is a Server-Side only method. Pass data as props.');
    }

    try {
      const response = await fetch(`${HONO_URL}/api/core/identity/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        // In Next.js App Router, we can control cache here
        next: { revalidate: 0 } // Always fresh for auth state
      });

      if (!response.ok) return null;

      const json = await response.json();
      
      // Zod Validation Barrier
      return IdentityProfileSchema.parse(json);
    } catch (e) {
      console.error('Identity Client Error:', e);
      return null;
    }
  },

  /**
   * [CLIENT COMPONENT ONLY]
   * Dispara para o BFF (Next.js Route Handler) para mascarar o token.
   */
  async login(email: string, password: string) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (!res.ok) throw new Error('Login falhou');
    
    const json = await res.json();
    return LoginResponseSchema.parse(json);
  },

  /**
   * [CLIENT COMPONENT ONLY]
   */
  async logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }
};
