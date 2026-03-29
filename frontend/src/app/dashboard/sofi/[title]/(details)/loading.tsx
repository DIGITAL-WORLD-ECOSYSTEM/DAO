import { DashboardContent } from 'src/layouts/dashboard';

import { SoFiDetailsSkeleton } from 'src/sections/sofi/item/skeleton';

// ----------------------------------------------------------------------

export default function Loading() {
  return (
    <DashboardContent maxWidth={false} disablePadding>
      <SoFiDetailsSkeleton />
    </DashboardContent>
  );
}