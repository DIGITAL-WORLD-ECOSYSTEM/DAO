import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect, useCallback } from 'react';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

import { fData } from 'src/utils/format-number';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field, schemaUtils } from 'src/components/hook-form';

import { useAccountFacade } from 'src/auth/facades/use-account-facade';

// ----------------------------------------------------------------------

export type UpdateUserSchemaType = z.infer<typeof UpdateUserSchema>;

export const UpdateUserSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required!' }),
  lastName: z.string().min(1, { message: 'Last name is required!' }),
  username: z
    .string()
    .min(3, { message: 'Username must be at least 3 characters' })
    .max(30, { message: 'Username must be at most 30 characters' })
    .regex(/^[a-z0-9_]+$/, {
      message: 'Only lowercase letters, numbers, and underscores are allowed',
    }),
  email: schemaUtils.email(),
  photoURL: z.any().optional(),
  coverURL: z.any().optional(),
  phoneNumber: schemaUtils.phoneNumber({ isValid: isValidPhoneNumber }),
  cpf: z.string().optional(),
  rg: z.string().optional(),
  cnh: z.string().optional(),
  cnhCategory: z.string().optional(),
  motherName: z.string().optional(),
  fatherName: z.string().optional(),
  birthDate: z.any().nullable(),
  gender: z.string().optional(),
  maritalStatus: z.string().optional(),

  country: schemaUtils.nullableInput(z.string().min(1, { message: 'Country is required!' }), {
    message: 'Country is required!',
  }),
  address: z.string().min(1, { message: 'Address is required!' }),
  neighborhood: z.string().optional(),
  state: z.string().min(1, { message: 'State is required!' }),
  city: z.string().min(1, { message: 'City is required!' }),
  zipCode: z.string().min(1, { message: 'Zip code is required!' }),

  occupation: z.string().optional(),
  company: z.string().optional(),
  website: z.string().optional(),
  about: z.string().optional(),
  isPublic: z.boolean(),
});

// ----------------------------------------------------------------------

export function AccountGeneral() {
  const { user, updateProfile } = useAccountFacade();

  const defaultValues: UpdateUserSchemaType = {
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    photoURL: null,
    coverURL: null,
    phoneNumber: '',
    cpf: '',
    rg: '',
    cnh: '',
    cnhCategory: '',
    motherName: '',
    fatherName: '',
    birthDate: null,
    gender: '',
    maritalStatus: '',
    country: '',
    address: '',
    neighborhood: '',
    state: '',
    city: '',
    zipCode: '',
    occupation: '',
    company: '',
    website: '',
    about: '',
    isPublic: false,
  };

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting, isDirty },
  } = methods;

  const values = watch();

  const coverURL = values.coverURL;
  const coverPreview = coverURL instanceof File ? URL.createObjectURL(coverURL) : coverURL;

  const photoURL = values.photoURL;
  const photoPreview = photoURL instanceof File ? URL.createObjectURL(photoURL) : photoURL;

  // Lógica do Completeness Score
  const getScore = () => {
    let score = 0;
    if (values.photoURL) score += 15;
    if (values.firstName && values.lastName) score += 15;
    if (values.email) score += 10;
    if (values.phoneNumber) score += 10;
    if (values.address && values.zipCode) score += 10;
    if (values.cpf) score += 15;
    if (values.about) score += 5;
    if (values.occupation) score += 5;
    // TODO: Adicionar +15 quando a biometria for concluída
    return score;
  };

  const completenessScore = getScore();

  const handleCoverChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        setValue('coverURL', file, { shouldValidate: true });
      }
    },
    [setValue]
  );

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        username: user.username || '',
        email: user.email || '',
        photoURL: user.avatarUrl || null,
        phoneNumber: user.phoneNumber || '',
        cpf: user.cpf || '',
        rg: user?.rg || '',
        cnh: user?.cnh || '',
        cnhCategory: user?.cnhCategory || '',
        motherName: user?.motherName || '',
        fatherName: user?.fatherName || '',
        birthDate: user?.birthDate ? new Date(user.birthDate) : null,
        gender: user?.gender || '',
        maritalStatus: user?.maritalStatus || '',
        country: user.country || 'BR',
        address: user.physicalAddress || '',
        neighborhood: user.neighborhood || '',
        state: user.state || '',
        city: user.city || '',
        zipCode: user.zipCode || '',
        occupation: user.occupation || '',
        company: user.company || '',
        website: user.website || '',
        about: user.about || '',
        isPublic: user.isPublic || false,
      });
    }
  }, [user, reset]);

  // ViaCEP Condicional
  const zipCode = values.zipCode;
  const country = values.country;

  useEffect(() => {
    if (country === 'BR' && zipCode && zipCode.replace(/\D/g, '').length === 8) {
      const fetchCep = async () => {
        try {
          const cleanCep = zipCode.replace(/\D/g, '');
          const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
          const data = await response.json();
          if (!data.erro) {
            setValue('state', data.uf, { shouldValidate: true });
            setValue('city', data.localidade, { shouldValidate: true });
            if (data.bairro) setValue('neighborhood', data.bairro, { shouldValidate: true });
            if (!values.address || values.address.length < 5) {
              setValue('address', `${data.logradouro}, `, { shouldValidate: false });
            }
            toast.success('Endereço preenchido via CEP!');
          }
        } catch (error) {
          console.error('Erro ao buscar CEP', error);
        }
      };
      fetchCep();
    }
  }, [zipCode, country, setValue, values.address]);

  const [lastSaved, setLastSaved] = useState<Date>(new Date());

  const onSubmit = handleSubmit(async (data) => {
    try {
      const payload = {
        ...data,
        birthDate: data.birthDate ? data.birthDate.toISOString() : null,
        country: data.country || undefined,
      };

      console.info('Submetendo atualização de perfil:', payload);
      await updateProfile(payload);
      setLastSaved(new Date());
      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao atualizar perfil.');
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {/* COMPLETENESS SCORE PROGRESS BAR */}
        <Grid component="div" size={{ xs: 12 }}>
          <Card
            sx={{
              p: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 3,
              boxShadow: (theme) => theme.vars.customShadows.z4,
              border: (theme) => `solid 1px ${theme.vars.palette.divider}`,
              bgcolor: (theme) => (completenessScore === 100 ? 'success.soft' : 'background.paper'),
            }}
          >
            <Box sx={{ flexGrow: 1 }}>
              <Stack
                direction="row"
                sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 1 }}
              >
                <Typography variant="h6">
                  {completenessScore === 100
                    ? 'Identidade Digital Completa!'
                    : 'Progresso da sua Identidade'}
                </Typography>
                <Typography
                  variant="subtitle2"
                  color={completenessScore === 100 ? 'success.main' : 'primary.main'}
                >
                  {completenessScore}%
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={completenessScore}
                color={completenessScore === 100 ? 'success' : 'primary'}
                sx={{
                  height: 10,
                  borderRadius: 1,
                  bgcolor: (theme) => theme.vars.palette.background.neutral,
                }}
              />
            </Box>

            <Stack direction="row" spacing={2} sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Stack spacing={0.5}>
                <Typography
                  variant="caption"
                  sx={{
                    color: values.photoURL ? 'success.main' : 'text.disabled',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                  }}
                >
                  <Iconify
                    icon={
                      (values.photoURL
                        ? 'solar:check-circle-bold'
                        : 'solar:close-circle-bold') as any
                    }
                    width={14}
                  />{' '}
                  Foto (+15)
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: values.cpf ? 'success.main' : 'text.disabled',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                  }}
                >
                  <Iconify
                    icon={
                      (values.cpf ? 'solar:check-circle-bold' : 'solar:close-circle-bold') as any
                    }
                    width={14}
                  />{' '}
                  CPF (+15)
                </Typography>
              </Stack>
              <Stack spacing={0.5}>
                <Typography
                  variant="caption"
                  sx={{
                    color: values.address && values.zipCode ? 'success.main' : 'text.disabled',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                  }}
                >
                  <Iconify
                    icon={
                      (values.address && values.zipCode
                        ? 'solar:check-circle-bold'
                        : 'solar:close-circle-bold') as any
                    }
                    width={14}
                  />{' '}
                  Endereço (+10)
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: values.about ? 'success.main' : 'text.disabled',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                  }}
                >
                  <Iconify
                    icon={
                      (values.about ? 'solar:check-circle-bold' : 'solar:close-circle-bold') as any
                    }
                    width={14}
                  />{' '}
                  Biografia (+5)
                </Typography>
              </Stack>
              <Stack spacing={0.5}>
                <Typography
                  variant="caption"
                  sx={{ color: 'text.disabled', display: 'flex', alignItems: 'center', gap: 0.5 }}
                >
                  <Iconify icon={'solar:close-circle-bold' as any} width={14} /> Biometria (+15)
                </Typography>
              </Stack>
            </Stack>
          </Card>
        </Grid>

        <Grid component="div" size={{ xs: 12, md: 4 }}>
          <Stack spacing={4}>
            {/* CARD: AVATAR & PERFIL PÚBLICO */}
            <Card
              sx={{
                textAlign: 'center',
                boxShadow: (theme) => theme.vars.customShadows.z4,
                border: (theme) => `solid 1px ${theme.vars.palette.divider}`,
                overflow: 'hidden',
                pb: 4,
              }}
            >
              <Box
                sx={{
                  height: 140,
                  position: 'relative',
                  bgcolor: 'background.neutral',
                  ...(coverPreview
                    ? {
                        backgroundImage: `url(${coverPreview})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }
                    : {
                        backgroundImage: `url(/assets/background/background-5.webp)`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }),
                }}
              >
                <input
                  type="file"
                  id="cover-upload"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleCoverChange}
                />
                <label htmlFor="cover-upload">
                  <IconButton
                    component="span"
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      bgcolor: 'rgba(0,0,0,0.4)',
                      color: 'common.white',
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.6)' },
                    }}
                  >
                    <Iconify icon="solar:camera-add-bold" />
                  </IconButton>
                </label>
              </Box>

              <Box sx={{ mt: -6, mb: 4, position: 'relative', zIndex: 9, display: 'inline-flex' }}>
                <Field.UploadAvatar
                  name="photoURL"
                  maxSize={3145728}
                  sx={{
                    border: (theme) => `solid 4px ${theme.vars.palette.background.paper}`,
                    bgcolor: 'background.default',
                    ...(!photoPreview && {
                      backgroundImage: `url(/assets/images/avatar/default-avatar.png)`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }),
                  }}
                />
              </Box>

              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  textAlign: 'center',
                  color: 'text.disabled',
                  mb: 4,
                }}
              >
                Avatar: *.jpeg, *.jpg, *.png
                <br /> Max size of {fData(3145728)}
              </Typography>

              <Field.Switch
                name="isPublic"
                labelPlacement="start"
                label="Perfil Público"
                sx={{ justifyContent: 'center' }}
              />
            </Card>

            {/* CARD: IDENTIDADE NA DAO */}
            {user && (
              <Card
                sx={{
                  p: 3,
                  textAlign: 'left',
                  borderRadius: 2,
                  boxShadow: (theme) =>
                    `inset 0px 4px 20px ${theme.vars.palette.action.hover}, ${theme.vars.customShadows.z4}`,
                  border: (theme) => `solid 1px ${theme.vars.palette.divider}`,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Efeito visual sutil de cartão no fundo */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    width: 100,
                    height: 100,
                    opacity: 0.05,
                    bgcolor: 'primary.main',
                    filter: 'blur(24px)',
                  }}
                />

                <Stack spacing={2}>
                  <Box>
                    <Typography
                      variant="overline"
                      sx={{ color: 'text.disabled', display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                      <Iconify icon="solar:shield-check-bold" width={16} /> Member ID
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontFamily: 'monospace', mt: 0.5 }}>
                      ASP-{String(user.id || '0').padStart(6, '0')}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography
                      variant="overline"
                      sx={{ color: 'text.disabled', display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                      <Iconify icon="solar:flag-bold" width={16} /> Status Associativo
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mt: 0.5 }}>
                      <Iconify
                        icon={
                          (user.kycStatus === 'approved'
                            ? 'solar:verified-check-bold'
                            : 'solar:hourglass-bold') as any
                        }
                        width={20}
                        sx={{
                          color: user.kycStatus === 'approved' ? 'success.main' : 'warning.main',
                        }}
                      />
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: user.kycStatus === 'approved' ? 'success.main' : 'warning.main',
                        }}
                      >
                        {user.kycStatus === 'approved' ? 'Associado Oficial' : 'Pré-Credenciado'}
                      </Typography>
                    </Stack>
                  </Box>
                </Stack>
              </Card>
            )}

            {/* CARD: SEGURANÇA BIOMÉTRICA */}
            <Card
              sx={{
                p: 3,
                textAlign: 'center',
                boxShadow: (theme) => theme.vars.customShadows.z4,
                border: (theme) => `solid 1px ${theme.vars.palette.divider}`,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: -20,
                  left: -20,
                  width: 100,
                  height: 100,
                  opacity: 0.04,
                  bgcolor: 'success.main',
                  filter: 'blur(24px)',
                }}
              />
              <Iconify
                icon={'solar:scanner-bold-duotone' as any}
                width={48}
                sx={{ color: 'primary.main', mb: 2 }}
              />
              <Typography variant="h6" sx={{ mb: 1, fontSize: '1.1rem' }}>
                Face ID & Biometria
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                Ative o reconhecimento facial para assinar contratos, autorizar pagamentos e emitir
                sua carteirinha com segurança máxima.
              </Typography>
              <Button
                variant="soft"
                color="primary"
                fullWidth
                onClick={() =>
                  toast.info(
                    'A captura biométrica será ativada na próxima fase de desenvolvimento.'
                  )
                }
              >
                Cadastrar Biometria
              </Button>
            </Card>
          </Stack>
        </Grid>

        <Grid component="div" size={{ xs: 12, md: 8 }}>
          <Stack spacing={4}>
            {/* CARD 1: IDENTIDADE */}
            <Card
              sx={{
                p: 4,
                boxShadow: (theme) => theme.vars.customShadows.z8,
                border: (theme) => `solid 1px ${theme.vars.palette.primary.dark}`,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  fontWeight: 'fontWeightSemiBold',
                }}
              >
                <Iconify
                  icon={'solar:user-id-linear' as any}
                  width={24}
                  sx={{ color: 'primary.main' }}
                />
                Sua Identidade
              </Typography>
              <Box
                sx={{
                  rowGap: 3,
                  columnGap: 2,
                  display: 'grid',
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                }}
              >
                <Field.Text name="firstName" label="Nome" />
                <Field.Text name="lastName" label="Sobrenome" />

                <Box sx={{ gridColumn: '1 / -1' }}>
                  <Field.Text name="email" label="Email de Acesso" disabled />
                </Box>

                <Field.Text name="username" label="@username (Identificador Único)" />
                <Field.Phone name="phoneNumber" label="Telefone" />

                <Field.Text name="cpf" label="CPF" />
                <Field.Text name="rg" label="RG" />

                <Field.Text name="cnh" label="Nº Registro CNH" />
                <Field.Select name="cnhCategory" label="Categoria da CNH">
                  <MenuItem value="A">A (Moto)</MenuItem>
                  <MenuItem value="B">B (Carro)</MenuItem>
                  <MenuItem value="AB">AB (Moto e Carro)</MenuItem>
                  <MenuItem value="C">C (Caminhão)</MenuItem>
                  <MenuItem value="D">D (Ônibus/Micro)</MenuItem>
                  <MenuItem value="E">E (Carreta)</MenuItem>
                  <MenuItem value="Não Possui">Não Possui</MenuItem>
                </Field.Select>

                <Box sx={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                  <Field.Text name="motherName" label="Nome da Mãe" />
                  <Field.Text name="fatherName" label="Nome do Pai" />
                </Box>

                <Field.DatePicker name="birthDate" label="Data de Nascimento" />
                
                <Field.Select name="gender" label="Gênero">
                  <MenuItem value="Masculino">Masculino</MenuItem>
                  <MenuItem value="Feminino">Feminino</MenuItem>
                  <MenuItem value="Outro">Outro</MenuItem>
                  <MenuItem value="Prefiro não informar">Prefiro não informar</MenuItem>
                </Field.Select>

                <Field.Select name="maritalStatus" label="Estado Civil">
                  <MenuItem value="Solteiro(a)">Solteiro(a)</MenuItem>
                  <MenuItem value="Casado(a)">Casado(a)</MenuItem>
                  <MenuItem value="Divorciado(a)">Divorciado(a)</MenuItem>
                  <MenuItem value="Viúvo(a)">Viúvo(a)</MenuItem>
                  <MenuItem value="União Estável">União Estável</MenuItem>
                </Field.Select>
              </Box>
            </Card>

            {/* CARD 2: LOCALIZAÇÃO */}
            <Card
              sx={{
                p: 4,
                boxShadow: (theme) => theme.vars.customShadows.z4,
                border: (theme) => `solid 1px ${theme.vars.palette.divider}`,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  fontWeight: 'fontWeightSemiBold',
                }}
              >
                <Iconify
                  icon={'solar:map-point-linear' as any}
                  width={24}
                  sx={{ color: 'primary.main' }}
                />
                Localização
              </Typography>
              <Box
                sx={{
                  rowGap: 3,
                  columnGap: 2,
                  display: 'grid',
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                }}
              >
                <Field.CountrySelect name="country" label="País" placeholder="Escolha um país" />
                <Field.Text name="zipCode" label="CEP" />
                <Field.Text name="state" label="Estado / Região" />
                <Field.Text name="city" label="Cidade" />
                <Field.Text name="neighborhood" label="Bairro" />
                <Box sx={{ gridColumn: '1 / -1' }}>
                  <Field.Text name="address" label="Endereço Completo" />
                </Box>
              </Box>
            </Card>

            {/* CARD 3: PERFIL PROFISSIONAL */}
            <Card
              sx={{
                p: 4,
                boxShadow: (theme) => theme.vars.customShadows.z1,
                bgcolor: 'background.neutral',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  fontWeight: 'fontWeightSemiBold',
                }}
              >
                <Iconify
                  icon={'solar:case-linear' as any}
                  width={24}
                  sx={{ color: 'primary.main' }}
                />
                Perfil Profissional
              </Typography>
              <Box
                sx={{
                  rowGap: 3,
                  columnGap: 2,
                  display: 'grid',
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                }}
              >
                <Field.Text name="occupation" label="Profissão / Especialidade" />
                <Field.Text name="company" label="Empresa Atual" />
                <Box sx={{ gridColumn: '1 / -1' }}>
                  <Field.Text name="website" label="Website Pessoal (ou LinkedIn/GitHub)" />
                </Box>
                <Box sx={{ gridColumn: '1 / -1' }}>
                  <Field.Text name="about" multiline rows={4} label="Biografia Resumida" />
                </Box>
              </Box>
            </Card>

            {/* ACTION BAR */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              sx={{
                justifyContent: 'space-between',
                alignItems: { xs: 'stretch', sm: 'center' },
                mt: 4,
                p: 2,
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: (theme) => theme.vars.customShadows.z4,
                border: (theme) => `solid 1px ${theme.vars.palette.divider}`,
              }}
            >
              <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                {isDirty ? (
                  <Typography
                    variant="body2"
                    color="warning.main"
                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    <Iconify icon={'solar:danger-circle-bold' as any} sx={{ flexShrink: 0 }} />{' '}
                    Alterações não salvas
                  </Typography>
                ) : (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    <Iconify icon={'solar:check-read-linear' as any} sx={{ flexShrink: 0 }} />
                    <Box
                      component="span"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      Salvo em:{' '}
                      {lastSaved.toLocaleString('pt-BR', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                      })}
                    </Box>
                  </Typography>
                )}
              </Stack>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                loading={isSubmitting}
                disabled={!isDirty}
                size="large"
                sx={{
                  boxShadow: (theme) => (isDirty ? theme.vars.customShadows.primary : 'none'),
                  px: 4,
                  py: 1.5,
                  fontSize: '0.95rem',
                  borderRadius: 2,
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  flexShrink: 0,
                  whiteSpace: 'nowrap',
                }}
              >
                Salvar
              </Button>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </Form>
  );
}
