import { useAccountFacade } from 'src/auth/facades/use-account-facade';

import { AccountNotifications } from '../account-notifications';

// ----------------------------------------------------------------------

export function AccountNotificationsView() {
  const { user } = useAccountFacade();
  const preferences = user?.notificationPreferences || [];

  return <AccountNotifications />;
}
