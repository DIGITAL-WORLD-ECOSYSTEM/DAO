'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { identityClient } from '@/domains/identity/client/identity.client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // O Client Component chama o BFF (Route Handler), mascarando a chave e o Hono.
      await identityClient.login(email, password);
      // Sucesso: Redireciona para a raiz logada
      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Credenciais inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif' }}>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px', padding: '2rem', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>Login ASOT</h2>
        
        {error && <div style={{ color: 'red', fontSize: '0.9rem' }}>{error}</div>}
        
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Senha</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <button type="submit" disabled={loading} style={{ padding: '0.75rem', background: 'black', color: 'white', border: 'none', cursor: 'pointer' }}>
          {loading ? 'Entrando...' : 'Acessar'}
        </button>
      </form>
    </div>
  );
}
