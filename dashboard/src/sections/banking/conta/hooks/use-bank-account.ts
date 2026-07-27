import type { AccountData } from '../types';

import { useState, useEffect } from 'react';

import { MOCK_ACCOUNTS } from '../mocks';

export function useBankAccount() {
  const [accounts, setAccounts] = useState<AccountData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In the future, this will be replaced by useSWR or similar
    const fetchAccounts = async () => {
      setIsLoading(true);
      try {
        // Simulating network delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        setAccounts(MOCK_ACCOUNTS);
      } catch (error) {
        console.error('Failed to fetch accounts', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  return { accounts, isLoading };
}
