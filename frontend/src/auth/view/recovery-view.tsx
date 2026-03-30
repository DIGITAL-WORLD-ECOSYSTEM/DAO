'use client';

import * as z from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { Form, Field } from 'src/auth/components';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

const RecoverySchema = z.object({
  email: z.string().min(1, { message: 'E-mail é obrigatório' }).email({ message: 'E-mail inválido' }),
  mnemonic: z.string().min(1, { message: 'As 24 palavras são obrigatórias' }),
});

export type RecoverySchemaType = z.infer<typeof RecoverySchema>;

export function RecoveryView() {
  const router = useRouter();
  const { reclaimIdentity } = useAuthContext();
  const [errorMsg, setErrorMsg] = useState('');

  const defaultValues = {
    email: '',
    mnemonic: '',
  };

  const methods = useForm<RecoverySchemaType>({
    // @ts-ignore - Conflito de versão Zod v4 vs Resolver v3 (Handshake 2026)
    resolver: zodResolver(RecoverySchema) as any,
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      setErrorMsg('');
      await reclaimIdentity(data.email, data.mnemonic);
      router.push(paths.dashboard.root);
    } catch (error: any) {
      console.error(error);
      setErrorMsg(typeof error === 'string' ? error : error.message || 'Falha na recuperação da identidade.');
    }
  });

  return (
    <>
      <Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
        <Typography variant="h4">Recuperação Soberana</Typography>

        <Stack direction="row" spacing={0.5}>
          <Typography variant="body2">Lembrou sua senha?</Typography>

          <Link component={RouterLink} href={paths.auth.signIn} variant="subtitle2">
            Fazer Login
          </Link>
        </Stack>
      </Stack>

      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        <Stack spacing={3}>
          <Alert severity="info">
            Insira seu e-mail e as 24 palavras secretas geradas no cadastro para recuperar o acesso total à sua cidadania.
          </Alert>

          <Field.Text name="email" label="E-mail de Cadastro" />

          <Field.Text
            name="mnemonic"
            label="Chave Mestra (24 Palavras)"
            multiline
            rows={4}
            placeholder="Ex: legal winner thank year wave sausage..."
          />

          <LoadingButton
            fullWidth
            color="primary"
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Reclamar Identidade
          </LoadingButton>
        </Stack>
      </Form>
    </>
  );
}
