import * as z from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Radio from '@mui/material/Radio';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

import { updateMyProfile } from 'src/actions/identity';

import { toast } from 'src/components/snackbar';
import { Form } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const NotificationsSchema = z.object({
  quietMode: z.boolean(),
  digest: z.enum(['immediate', 'daily', 'weekly', 'monthly']),
  channels: z.object({
    email: z.boolean(),
    push: z.boolean(),
    sms: z.boolean(),
    whatsapp: z.boolean(),
  }),
  selected: z.array(z.string()),
});

type FormValuesProps = z.infer<typeof NotificationsSchema>;

// Dados Fixos das Categorias de Eventos
const NOTIFICATION_GROUPS = [
  {
    subheader: 'Comunidade',
    icon: 'solar:users-group-rounded-bold-duotone',
    color: 'primary.main',
    items: [
      { id: 'community_new_member', label: 'Novos membros na minha rede' },
      { id: 'community_invites', label: 'Convites para grupos' },
      { id: 'community_mentions', label: 'Menções ao meu perfil' },
    ],
  },
  {
    subheader: 'Eventos',
    icon: 'solar:calendar-bold-duotone',
    color: 'secondary.main',
    items: [
      { id: 'events_new', label: 'Novos eventos e competições' },
      { id: 'events_updates', label: 'Alterações em eventos inscritos' },
      { id: 'events_results', label: 'Resultados de competições' },
    ],
  },
  {
    subheader: 'Governança',
    icon: 'solar:diploma-bold-duotone',
    color: 'info.main',
    items: [
      { id: 'gov_new_vote', label: 'Novas votações DAO abertas' },
      { id: 'gov_proposals', label: 'Novas propostas em discussão' },
      { id: 'gov_results', label: 'Resultados e aprovações de propostas' },
    ],
  },
  {
    subheader: 'Financeiro',
    icon: 'solar:wallet-bold-duotone',
    color: 'success.main',
    items: [
      { id: 'finance_payments', label: 'Pagamentos e dividendos recebidos' },
      { id: 'finance_subscriptions', label: 'Assinaturas e anuidades vencendo' },
      { id: 'finance_transactions', label: 'Transações concluídas' },
    ],
  },
  {
    subheader: 'Plataforma',
    icon: 'solar:server-square-bold-duotone',
    color: 'warning.main',
    items: [
      { id: 'platform_updates', label: 'Atualizações do sistema (DevOS)' },
      { id: 'platform_features', label: 'Lançamentos de novos recursos' },
      { id: 'platform_maintenance', label: 'Avisos de manutenção programada' },
    ],
  },
];

// ----------------------------------------------------------------------

export function AccountNotifications() {
  const defaultValues: FormValuesProps = {
    quietMode: false,
    digest: 'immediate',
    channels: {
      email: true,
      push: true,
      sms: false,
      whatsapp: true,
    },
    selected: [
      'community_new_member',
      'community_mentions',
      'gov_new_vote',
      'gov_results',
      'finance_payments',
    ],
  };

  const methods = useForm<FormValuesProps>({
    resolver: zodResolver(NotificationsSchema),
    defaultValues,
  });

  const {
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      // API call (simulada)
      await updateMyProfile({ notificationPreferences: data.selected });
      console.log('Payload:', data);
      toast.success('Preferências de comunicação salvas!');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao salvar preferências.');
    }
  });

  const getSelected = (selectedItems: string[], item: string) =>
    selectedItems.includes(item)
      ? selectedItems.filter((value) => value !== item)
      : [...selectedItems, item];

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {/* CABEÇALHO */}
        <Grid size={{ xs: 12 }}>
          <Card
            sx={{
              p: 4,
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              gap: 4,
              bgcolor: 'background.neutral',
            }}
          >
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h5" sx={{ mb: 1 }}>
                Central de Notificações
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Controle como deseja receber informações, alertas e comunicações da comunidade,
                governança e sistema.
              </Typography>
            </Box>
          </Card>
        </Grid>

        {/* COLUNA ESQUERDA: Configurações de Eventos */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={3}>
            {/* Notificações Críticas */}
            <Card sx={{ p: 3, border: (theme) => `solid 1px ${theme.vars.palette.error.main}` }}>
              <Stack direction="row" spacing={1.5} sx={{ mb: 3 }}>
                <Iconify
                  icon={'solar:shield-warning-bold-duotone' as any}
                  width={24}
                  color="error.main"
                />
                <Typography variant="h6" color="error.main">
                  Críticas (Segurança Obrigatória)
                </Typography>
              </Stack>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                  gap: 2,
                }}
              >
                <FormControlLabel
                  control={<Switch checked disabled />}
                  label="Alteração de senha"
                  sx={{ m: 0 }}
                />
                <FormControlLabel
                  control={<Switch checked disabled />}
                  label="Novo login em dispositivo"
                  sx={{ m: 0 }}
                />
                <FormControlLabel
                  control={<Switch checked disabled />}
                  label="MFA desativado"
                  sx={{ m: 0 }}
                />
                <FormControlLabel
                  control={<Switch checked disabled />}
                  label="Tentativa suspeita de acesso"
                  sx={{ m: 0 }}
                />
              </Box>
            </Card>

            {/* Categorias Dinâmicas */}
            {NOTIFICATION_GROUPS.map((group) => (
              <Card key={group.subheader} sx={{ p: 3 }}>
                <Stack direction="row" spacing={1.5} sx={{ mb: 2 }}>
                  <Iconify icon={group.icon as any} width={24} sx={{ color: group.color }} />
                  <Typography variant="h6">{group.subheader}</Typography>
                </Stack>
                <Divider sx={{ mb: 2 }} />

                <Controller
                  name="selected"
                  control={control}
                  render={({ field }) => (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {group.items.map((item) => (
                        <FormControlLabel
                          key={item.id}
                          label={item.label}
                          labelPlacement="start"
                          control={
                            <Switch
                              checked={field.value.includes(item.id)}
                              onChange={() => field.onChange(getSelected(values.selected, item.id))}
                            />
                          }
                          sx={{ m: 0, justifyContent: 'space-between' }}
                        />
                      ))}
                    </Box>
                  )}
                />
              </Card>
            ))}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              loading={isSubmitting}
              sx={{
                alignSelf: 'flex-start',
                px: 4,
                py: 1.5,
                fontSize: '0.95rem',
                textTransform: 'uppercase',
                letterSpacing: 1,
                boxShadow: (theme) => theme.vars.customShadows.primary,
              }}
            >
              Salvar Preferências
            </Button>
          </Stack>
        </Grid>

        {/* COLUNA DIREITA: Canais e Ferramentas */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={3}>
            {/* Modo Não Perturbe */}
            <Card
              sx={{
                p: 3,
                bgcolor: values.quietMode ? 'primary.soft' : 'background.paper',
                transition: 'all 0.3s',
              }}
            >
              <Controller
                name="quietMode"
                control={control}
                render={({ field }) => (
                  <Stack
                    direction="row"
                    sx={{ alignItems: 'center', justifyContent: 'space-between' }}
                  >
                    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                      <Iconify
                        icon={'solar:moon-sleep-bold-duotone' as any}
                        width={28}
                        sx={{ color: values.quietMode ? 'primary.main' : 'text.disabled' }}
                      />
                      <Box>
                        <Typography variant="subtitle1">Modo Silencioso</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Não perturbe (22:00 → 08:00)
                        </Typography>
                      </Box>
                    </Stack>
                    <Switch
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  </Stack>
                )}
              />
            </Card>

            {/* Resumo & Canais */}
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Canais de Entrega
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Ativos: {values.selected.length} tipos de alerta
              </Typography>

              <Stack spacing={2}>
                <Controller
                  name="channels.email"
                  control={control}
                  render={({ field }) => (
                    <Stack
                      direction="row"
                      sx={{ alignItems: 'center', justifyContent: 'space-between' }}
                    >
                      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                        <Iconify icon={'solar:letter-bold' as any} color="text.secondary" />
                        <Typography variant="body2">Email</Typography>
                      </Stack>
                      <Switch
                        size="small"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    </Stack>
                  )}
                />
                <Controller
                  name="channels.push"
                  control={control}
                  render={({ field }) => (
                    <Stack
                      direction="row"
                      sx={{ alignItems: 'center', justifyContent: 'space-between' }}
                    >
                      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                        <Iconify icon={'solar:bell-bold' as any} color="text.secondary" />
                        <Typography variant="body2">Push (App/Browser)</Typography>
                      </Stack>
                      <Switch
                        size="small"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    </Stack>
                  )}
                />
                <Controller
                  name="channels.whatsapp"
                  control={control}
                  render={({ field }) => (
                    <Stack
                      direction="row"
                      sx={{ alignItems: 'center', justifyContent: 'space-between' }}
                    >
                      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                        <Iconify icon={'logos:whatsapp-icon' as any} />
                        <Typography variant="body2">WhatsApp</Typography>
                      </Stack>
                      <Switch
                        size="small"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    </Stack>
                  )}
                />
                <Controller
                  name="channels.sms"
                  control={control}
                  render={({ field }) => (
                    <Stack
                      direction="row"
                      sx={{ alignItems: 'center', justifyContent: 'space-between' }}
                    >
                      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                        <Iconify icon={'solar:chat-line-bold' as any} color="text.secondary" />
                        <Typography variant="body2">SMS</Typography>
                      </Stack>
                      <Switch
                        size="small"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    </Stack>
                  )}
                />
              </Stack>
            </Card>

            {/* Frequência (Digest) */}
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Frequência (Digest)
              </Typography>
              <Controller
                name="digest"
                control={control}
                render={({ field }) => (
                  <RadioGroup {...field}>
                    <Stack spacing={1}>
                      <FormControlLabel
                        value="immediate"
                        control={<Radio />}
                        label="Imediato (em tempo real)"
                      />
                      <FormControlLabel value="daily" control={<Radio />} label="Resumo Diário" />
                      <FormControlLabel value="weekly" control={<Radio />} label="Resumo Semanal" />
                      <FormControlLabel value="monthly" control={<Radio />} label="Resumo Mensal" />
                    </Stack>
                  </RadioGroup>
                )}
              />
            </Card>

            {/* Preview Visual */}
            <Card sx={{ p: 3, bgcolor: 'background.neutral' }}>
              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                <Iconify icon={'solar:eye-bold-duotone' as any} color="text.secondary" />
                <Typography variant="overline" color="text.secondary">
                  Exemplo de Push
                </Typography>
              </Stack>
              <Card
                sx={{
                  p: 2,
                  display: 'flex',
                  gap: 2,
                  boxShadow: (theme) => theme.vars.customShadows.z8,
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    bgcolor: 'info.soft',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Iconify icon={'solar:diploma-bold-duotone' as any} color="info.main" />
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    Nova proposta DAO aberta
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: 'block', lineHeight: 1.2 }}
                  >
                    Uma nova votação sobre o fundo de reserva está disponível.
                  </Typography>
                  <Typography
                    variant="caption"
                    color="primary.main"
                    sx={{ display: 'block', mt: 1, fontWeight: 'bold' }}
                  >
                    Há 2 minutos
                  </Typography>
                </Box>
              </Card>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Form>
  );
}
