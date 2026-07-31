import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { createCitizen } from 'src/actions/identity';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field, schemaUtils } from 'src/components/hook-form';

import { useUserProfile } from 'src/auth/facades';

// ----------------------------------------------------------------------

export const UserProvisionSchema = z.object({
  name: z.string().min(1, { message: 'O nome completo é obrigatório' }),
  email: schemaUtils.email({ message: { invalid: 'E-mail inválido', required: 'E-mail obrigatório' } }),
  phoneNumber: schemaUtils.phoneNumber({
    isValid: isValidPhoneNumber,
    message: { invalid: 'Telefone inválido', required: 'Telefone obrigatório' },
  }),
  cargo: z.string().min(1, { message: 'A função/cargo é obrigatória' }),
  role: z.enum(['citizen', 'admin', 'dev', 'partner'], {
    required_error: 'O nível de acesso é obrigatório',
  }),
  temporaryPassword: z.string().min(8, { message: 'A senha deve ter no mínimo 8 caracteres' }),
});

export type UserProvisionSchemaType = z.infer<typeof UserProvisionSchema>;

// ----------------------------------------------------------------------

export function UserCreateForm() {
  const router = useRouter();
  const { role: userRole } = useUserProfile();

  const defaultValues: UserProvisionSchemaType = {
    name: '',
    email: '',
    phoneNumber: '',
    cargo: '',
    role: 'citizen',
    temporaryPassword: '',
  };

  const methods = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(UserProvisionSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const nameParts = data.name.trim().split(/\s+/);
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const payload = {
        email: data.email,
        firstName,
        lastName,
        cargoOsc: data.cargo,
        phoneNumber: data.phoneNumber || '',
        nacionalidade: 'Brasileira',
        role: data.role,
        kycStatus: 'pending',
        avatarUrl: '',
        password: data.temporaryPassword,
        username: data.email.split('@')[0],
      };

      await createCitizen(payload);

      reset();
      toast.success('Credencial de acesso criada com sucesso!');
      router.push(paths.dashboard.general.analytics.user.users);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Erro ao provisionar acesso');
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Card sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
        <Stack spacing={4}>
          <Box>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Dados de Acesso
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Provisione uma nova credencial para um membro da equipe ou comunidade.
            </Typography>
          </Box>

          <Box
            sx={{
              rowGap: 3,
              columnGap: 2,
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
            }}
          >
            <Field.Text
              name="name"
              label="Nome Completo"
              placeholder="Ex: João da Silva"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon="solar:user-id-bold" width={24} sx={{ color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                }
              }}
            />
            <Field.Text
              name="email"
              label="Endereço de E-mail"
              placeholder="Ex: joao@asppibra.org"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon="solar:letter-bold" width={24} sx={{ color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                }
              }}
            />
            <Field.Phone name="phoneNumber" label="WhatsApp / Telefone" defaultCountry="BR" />
            
            <Field.Text
              name="cargo"
              label="Cargo / Função"
              placeholder="Ex: Assessor de Comunicação"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon="solar:case-minimalistic-bold" width={24} sx={{ color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                }
              }}
            />

            <Field.Select slotProps={{ select: { native: true } }} name="role" label="Nível de Acesso">
              <option value="citizen">Cidadão (Acesso Padrão)</option>
              <option value="partner">Parceiro (Institucional)</option>
              {userRole === 'dev' && (
                <>
                  <option value="admin">Administrador (Master)</option>
                  <option value="dev">Desenvolvedor (DevOS)</option>
                </>
              )}
            </Field.Select>

            <Field.Text
              name="temporaryPassword"
              label="Senha Inicial (Temporária)"
              placeholder="Defina a senha de primeiro acesso"
              type="text"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon={'solar:shield-keyhole-bold' as any} width={24} sx={{ color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                }
              }}
            />
          </Box>

          <Stack sx={{ alignItems: 'flex-end', pt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              loading={isSubmitting}
              startIcon={<Iconify icon="solar:shield-check-bold" />}
            >
              Criar Credencial
            </Button>
          </Stack>
        </Stack>
      </Card>
    </Form>
  );
}
