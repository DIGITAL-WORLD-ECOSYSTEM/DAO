'use client';

import { useMockedUser } from 'src/auth/hooks';
import RoleBasedGuard from 'src/auth/guard/role-based-guard';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  const { user } = useMockedUser();

  return (
    <RoleBasedGuard hasContent allowedRoles={['admin']} currentRole={user?.role}>
      {children}
    </RoleBasedGuard>
  );
}
