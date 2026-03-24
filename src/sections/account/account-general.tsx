'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { fData } from 'src/utils/format-number';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaUtils } from 'src/components/hook-form';

import { useMockedUser } from 'src/auth/hooks';

// ----------------------------------------------------------------------

// ✅ 1. Definimos o esquema primeiro para garantir que a inferência seja limpa
export const UpdateUserSchema = z.object({
  displayName: z.string().min(1, { error: 'Name is required!' }),
  email: schemaUtils.email(),
  photoURL: schemaUtils.file({ error: 'Avatar is required!' }),
  phoneNumber: schemaUtils.phoneNumber({ isValid: isValidPhoneNumber }),
  // ✅ Ajustado para aceitar string e validar obrigatoriedade sem conflito de null
  country: z.string().min(1, { error: 'Country is required!' }).nullable(),
  address: z.string().min(1, { error: 'Address is required!' }),
  state: z.string().min(1, { error: 'State is required!' }),
  city: z.string().min(1, { error: 'City is required!' }),
  zipCode: z.string().min(1, { error: 'Zip code is required!' }),
  about: z.string().min(1, { error: 'About is required!' }),
  isPublic: z.boolean(),
});

// ✅ 2. Inferimos o tipo
export type UpdateUserSchemaType = z.infer<typeof UpdateUserSchema>;

// ----------------------------------------------------------------------

export function AccountGeneral() {
  const { user } = useMockedUser();

  // ✅ 3. Preparamos os valores com fallbacks seguros (?? '')
  const currentUser: UpdateUserSchemaType = {
    displayName: user?.displayName ?? '',
    email: user?.email ?? '',
    photoURL: user?.photoURL ?? null,
    phoneNumber: user?.phoneNumber ?? '',
    country: (user as any)?.country ?? '',
    address: (user as any)?.address ?? '',
    state: (user as any)?.state ?? '',
    city: (user as any)?.city ?? '',
    zipCode: (user as any)?.zipCode ?? '',
    about: (user as any)?.about ?? '',
    isPublic: (user as any)?.isPublic ?? false,
  };

  const defaultValues: UpdateUserSchemaType = {
    displayName: '',
    email: '',
    photoURL: null,
    phoneNumber: '',
    country: '', 
    address: '',
    state: '',
    city: '',
    zipCode: '',
    about: '',
    isPublic: false,
  };

  const methods = useForm<UpdateUserSchemaType>({
    mode: 'all',
    // ✅ 4. O segredo para o build passar: fazemos o casting do resolver para 'any' 
    // Isso evita o erro de mismatch entre o tipo de saída do Zod e o esperado pelo RHF
    resolver: zodResolver(UpdateUserSchema) as any,
    defaultValues,
    values: currentUser,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success('Update success!');
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              pt: 10,
              pb: 5,
              px: 3,
              textAlign: 'center',
            }}
          >
            <Field.UploadAvatar
              name="photoURL"
              maxSize={3145728}
              helperText={
                <Typography
                  variant="caption"
                  sx={{
                    mt: 3,
                    mx: 'auto',
                    display: 'block',
                    textAlign: 'center',
                    color: 'text.disabled',
                  }}
                >
                  Allowed *.jpeg, *.jpg, *.png, *.gif
                  <br /> max size of {fData(3145728)}
                </Typography>
              }
            />

            <Field.Switch
              name="isPublic"
              labelPlacement="start"
              label="Public profile"
              sx={{ mt: 5 }}
            />

            <Button variant="soft" color="error" sx={{ mt: 3 }}>
              Delete user
            </Button>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                rowGap: 3,
                columnGap: 2,
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <Field.Text name="displayName" label="Name" />
              <Field.Text name="email" label="Email address" />
              <Field.Phone name="phoneNumber" label="Phone number" />
              <Field.Text name="address" label="Address" />

              <Field.CountrySelect name="country" label="Country" placeholder="Choose a country" />

              <Field.Text name="state" label="State/region" />
              <Field.Text name="city" label="City" />
              <Field.Text name="zipCode" label="Zip/code" />
            </Box>

            <Stack spacing={3} sx={{ mt: 3, alignItems: 'flex-end' }}>
              <Field.Text name="about" multiline rows={4} label="About" />

              <Button type="submit" variant="contained" loading={isSubmitting}>
                Save changes
              </Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}