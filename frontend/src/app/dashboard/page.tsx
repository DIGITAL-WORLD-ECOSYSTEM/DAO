import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { identityClient } from '@/domains/identity/client/identity.client';

import { ProfileOverview } from '@/domains/identity/components/ProfileOverview';

export default async function DashboardPage() {
  const cookieStore = cookies();
  const token = cookieStore.get('asppibra_session')?.value;

  if (!token) {
    redirect('/login');
  }

  // Faz o fetch direto no Hono via Server Component (Bypass Browser)
  const profile = await identityClient.getMe(token);

  if (!profile) {
    // Se o token estiver expirado ou for inválido no backend
    redirect('/login');
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Dashboard (Account Overview)</h1>
      
      <ProfileOverview initialData={profile} initialDataUpdatedAt={Date.now()} />
      
      <form action="/api/auth/logout" method="POST" style={{ marginTop: '2rem' }}>
        <button type="submit" style={{ padding: '0.5rem 1rem', background: 'red', color: 'white', border: 'none', cursor: 'pointer' }}>
          Sair da Plataforma (Logout)
        </button>
      </form>
    </div>
  );
}
