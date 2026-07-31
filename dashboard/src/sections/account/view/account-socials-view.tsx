import type { ISocialLink } from 'src/types/common';

import { useAccountFacade } from 'src/auth/facades/use-account-facade';

import { AccountSocials } from '../account-socials';

// ----------------------------------------------------------------------

export function AccountSocialsView() {
  const { user } = useAccountFacade();

  const socialLinks: ISocialLink = {
    facebook: user?.socialLinks?.facebook || '',
    instagram: user?.socialLinks?.instagram || '',
    linkedin: user?.socialLinks?.linkedin || '',
    twitter: user?.socialLinks?.twitter || '',
  };

  return <AccountSocials socialLinks={socialLinks} />;
}
