'use client';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { useGetMyMembershipCard } from 'src/actions/citizen';

import { MembershipCard } from '../membership-card';

// ----------------------------------------------------------------------

export function UserIdCardView() {
  const { cardInfo, cardLoading, cardError } = useGetMyMembershipCard();

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Carterinha de Identidade"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Usuário', href: paths.dashboard.user.root },
          { name: 'Identidade' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Container maxWidth="lg">
        {cardLoading && (
          <Stack alignItems="center" justifyContent="center" sx={{ py: 10 }}>
            <CircularProgress />
            <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
              Carregando sua Identidade Soberana...
            </Typography>
          </Stack>
        )}

        {cardError && (
          <EmptyContent
            filled
            title="Sessão não encontrada"
            description="Não conseguimos recuperar sua carterinha. Verifique se você está logado ou se sua identidade foi emitida."
            action={
              <Button
                variant="soft"
                color="primary"
                startIcon={<Iconify icon="solar:restart-bold" />}
                onClick={() => window.location.reload()}
              >
                Recarregar
              </Button>
            }
          />
        )}

        {!cardLoading && !cardError && cardInfo && (
          <Stack spacing={5} alignItems="center">
            <Typography variant="h4" sx={{ textAlign: 'center' }}>
               Sua Carterinha Digital (ID Card)
            </Typography>
            
            <MembershipCard 
              citizen={cardInfo.citizen} 
              card={cardInfo.card} 
            />

            <Stack spacing={1} sx={{ textAlign: 'center', maxWidth: 480 }}>
               <Typography variant="subtitle1" color="primary">
                 Sincronizado via Cloudflare D1
               </Typography>
               <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                 Toque/Clique na carterinha para ver o verso com os dados da sua **Ficha Cadastral**. 
                 Seu DID é verificado criptograficamente pela rede ASPPIBRA.
               </Typography>
            </Stack>
          </Stack>
        )}

        {!cardLoading && !cardError && !cardInfo && (
           <EmptyContent
            filled
            title="Nenhuma Carterinha"
            description="Você ainda não possui uma carterinha de membro vinculada. Entre em contato com a administração da DAO."
          />
        )}
      </Container>
    </DashboardContent>
  );
}
