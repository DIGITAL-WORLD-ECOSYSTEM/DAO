import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { UserCreateForm } from '../user-create-form';

// ----------------------------------------------------------------------

export function UserCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Provisionar Credencial de Acesso"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Usuários', href: paths.dashboard.user.root },
          { name: 'Novo Acesso' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <UserCreateForm />
    </DashboardContent>
  );
}
