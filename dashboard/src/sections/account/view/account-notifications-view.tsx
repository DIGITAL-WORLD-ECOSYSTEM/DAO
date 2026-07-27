import { useAuthContext } from 'src/auth/hooks/use-auth-context';

import { AccountNotifications } from '../account-notifications';

// ----------------------------------------------------------------------

export function AccountNotificationsView() {
  const { user } = useAuthContext();
  const preferences = user?.notificationPreferences || [];

  return <AccountNotifications />;
}
