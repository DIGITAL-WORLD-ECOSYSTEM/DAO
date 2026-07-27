import type { UseSetStateReturn } from 'minimal-shared/hooks';
import type { IUserTableFilters } from 'src/types/user';
import type { FiltersResultProps } from 'src/components/filters-result';

import { useCallback } from 'react';

import Chip from '@mui/material/Chip';

import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

// ----------------------------------------------------------------------

type Props = FiltersResultProps & {
  onResetPage: () => void;
  filters: UseSetStateReturn<IUserTableFilters>;
};

export function UserTableFiltersResult({ filters, onResetPage, totalResults, sx }: Props) {
  const { state: currentFilters, setState: updateFilters, resetState: resetFilters } = filters;

  const handleRemoveKeyword = useCallback(() => {
    onResetPage();
    updateFilters({ name: '' });
  }, [onResetPage, updateFilters]);

  const handleRemoveStatus = useCallback(() => {
    onResetPage();
    updateFilters({ status: 'all' });
  }, [onResetPage, updateFilters]);

  const handleRemoveRole = useCallback(
    (inputValue: string) => {
      const newValue = currentFilters.role.filter((item) => item !== inputValue);

      onResetPage();
      updateFilters({ role: newValue });
    },
    [onResetPage, updateFilters, currentFilters.role]
  );

  const handleRemoveKyc = useCallback(
    (inputValue: string) => {
      const newValue = (currentFilters.kycStatus || []).filter((item) => item !== inputValue);

      onResetPage();
      updateFilters({ kycStatus: newValue });
    },
    [onResetPage, updateFilters, currentFilters.kycStatus]
  );

  const handleReset = useCallback(() => {
    onResetPage();
    resetFilters();
  }, [onResetPage, resetFilters]);

  const kycLabelMap: Record<string, string> = {
    draft: 'Não Iniciado',
    pending: 'Pendente',
    under_review: 'Em Análise',
    approved: 'Verificado',
    rejected: 'Rejeitado',
    expired: 'Expirado'
  };

  return (
    <FiltersResult totalResults={totalResults} onReset={handleReset} sx={sx}>
      <FiltersBlock label="Status:" isShow={currentFilters.status !== 'all'}>
        <Chip
          {...chipProps}
          label={currentFilters.status}
          onDelete={handleRemoveStatus}
          sx={{ textTransform: 'capitalize' }}
        />
      </FiltersBlock>

      <FiltersBlock label="Nível de Acesso:" isShow={!!currentFilters.role.length}>
        {currentFilters.role.map((item) => (
          <Chip {...chipProps} key={item} label={item.toUpperCase()} onDelete={() => handleRemoveRole(item)} />
        ))}
      </FiltersBlock>

      <FiltersBlock label="KYC:" isShow={!!(currentFilters.kycStatus && currentFilters.kycStatus.length)}>
        {(currentFilters.kycStatus || []).map((item) => (
          <Chip {...chipProps} key={item} label={kycLabelMap[item] || item} onDelete={() => handleRemoveKyc(item)} />
        ))}
      </FiltersBlock>

      <FiltersBlock label="Busca:" isShow={!!currentFilters.name}>
        <Chip {...chipProps} label={currentFilters.name} onDelete={handleRemoveKeyword} />
      </FiltersBlock>
    </FiltersResult>
  );
}
