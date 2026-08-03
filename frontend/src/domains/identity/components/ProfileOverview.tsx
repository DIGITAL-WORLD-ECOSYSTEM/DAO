'use client';

import { useMe } from '../queries/useMe';
import { IdentityProfile } from '../schemas/identity.schema';
import { ProfileEditor } from './ProfileEditor';

interface ProfileOverviewProps {
  initialData: IdentityProfile;
  initialDataUpdatedAt: number;
}

export function ProfileOverview({ initialData, initialDataUpdatedAt }: ProfileOverviewProps) {
  // TanStack Query é hidratado com os dados do SSR
  const { data: profile, isLoading } = useMe(initialData, initialDataUpdatedAt);

  if (isLoading) return <div>Carregando...</div>;
  if (!profile) return <div>Falha ao carregar perfil</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid #ccc', paddingBottom: '1rem', marginBottom: '2rem' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Avatar Placeholder */}
          <span style={{ fontSize: '24px' }}>{profile.user.email.charAt(0).toUpperCase()}</span>
        </div>
        <div>
          <h2 style={{ margin: 0 }}>{profile.citizen?.fullName || 'Usuário Não Identificado'}</h2>
          <p style={{ margin: 0, color: 'gray' }}>{profile.user.email}</p>
          <span style={{ fontSize: '0.8rem', background: '#e0e0e0', padding: '2px 8px', borderRadius: '12px' }}>Role: {profile.user.role}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div>
          <h3>Status de KYC</h3>
          <p>{profile.citizen?.kycStatus || 'NOT_STARTED'}</p>
        </div>
        <div>
          <h3>Status da Wallet</h3>
          <p>{profile.wallet ? profile.wallet.address : 'Sem Carteira Web3'}</p>
        </div>
      </div>

      <hr style={{ margin: '2rem 0' }} />

      <ProfileEditor />
    </div>
  );
}
