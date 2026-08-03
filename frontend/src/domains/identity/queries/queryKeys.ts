export const identityKeys = {
  all: ['identity'] as const,
  me: () => [...identityKeys.all, 'me'] as const,
  wallet: () => [...identityKeys.all, 'wallet'] as const,
  membership: () => [...identityKeys.all, 'membership'] as const,
  kyc: () => [...identityKeys.all, 'kyc'] as const,
};
