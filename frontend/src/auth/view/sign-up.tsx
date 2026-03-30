'use client';

import * as z from 'zod';
import { CryptoCore } from '@dao/shared';
import { useForm } from 'react-hook-form';
import { useState, useCallback } from 'react';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useAuthContext } from '../hooks';
import { Form, Field, Iconify, FormHead, SignUpTerms, schemaUtils, AnimateLogoRotate } from '../components';

// ----------------------------------------------------------------------

export type SignUpSchemaType = z.infer<typeof SignUpSchema>;

export const SignUpSchema = z.object({
  firstName: z.string().min(1, { message: 'Nome é obrigatório!' }),
  lastName: z.string().min(1, { message: 'Sobrenome é obrigatório!' }),
  email: schemaUtils.email(),
  password: z
    .string()
    .min(1, { message: 'Senha é obrigatória!' })
    .min(6, { message: 'A senha deve ter pelo menos 6 caracteres!' }),
});

// ----------------------------------------------------------------------

export function CenteredSignUpView() {
  const router = useRouter();
  const showPassword = useBoolean();
  const { signUp } = useAuthContext();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [mnemonic, setMnemonic] = useState<string | null>(null);
  const [confirmedBackup, setConfirmedBackup] = useState(false);

  const defaultValues: SignUpSchemaType = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  };

  const methods = useForm<SignUpSchemaType>({
    // @ts-ignore - Conflito de versão Zod v4 vs Resolver v3 (Handshake 2026)
    resolver: zodResolver(SignUpSchema) as any,
    defaultValues,
  });

  const {
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = methods;

  const watchedValues = watch();

  const handleGenerateKeys = async () => {
    try {
      // Gerar o Mnemonic antes de registrar para que o usuário possa salvar
      const newMnemonic = CryptoCore.generateMnemonic();
      setMnemonic(newMnemonic);
    } catch (e) {
      setErrorMessage("Erro ao gerar chaves criptográficas.");
    }
  };

  const handleCopy = useCallback(() => {
    if (mnemonic) {
      navigator.clipboard.writeText(mnemonic);
    }
  }, [mnemonic]);

  const handleDownload = useCallback(() => {
    if (mnemonic) {
      const element = document.createElement('a');
      const file = new Blob([mnemonic], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = 'asppibra-dao-mnemonic.txt';
      document.body.appendChild(element);
      element.click();
    }
  }, [mnemonic]);

  const onSubmit = handleSubmit(async (data: SignUpSchemaType) => {
    try {
      setErrorMessage(null);

      await signUp({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      }, mnemonic as string);

      router.push(paths.dashboard.root);
      
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message || 'Erro ao criar conta. Tente novamente.');
    }
  });

  const renderMnemonicStep = () => (
    <Stack spacing={3}>
      <Alert severity="warning" variant="filled">
        <strong>IMPORTANTE:</strong> Estas 24 palavras são a sua identidade soberana. 
        Se você perdê-las, perderá o acesso à sua cidadania na DAO para sempre.
      </Alert>
      
      <Box sx={{ 
        p: 3, 
        bgcolor: 'background.neutral', 
        borderRadius: 1, 
        border: '1px dashed grey',
        fontFamily: 'monospace',
        wordBreak: 'break-word',
        textAlign: 'center',
        position: 'relative'
      }}>
        {mnemonic}
      </Box>

      <Stack direction="row" spacing={2} justifyContent="center">
        <Button
          size="small"
          variant="outlined"
          color="inherit"
          startIcon={<Iconify icon="solar:copy-bold" />}
          onClick={handleCopy}
        >
          Copiar
        </Button>
        <Button
          size="small"
          variant="outlined"
          color="inherit"
          startIcon={<Iconify icon="solar:download-bold" />}
          onClick={handleDownload}
        >
          Baixar (.txt)
        </Button>
      </Stack>

      <Button
        fullWidth
        size="large"
        variant="contained"
        color="primary"
        onClick={() => setConfirmedBackup(true)}
      >
        Eu salvei minhas palavras secretas
      </Button>
    </Stack>
  );

  const renderForm = () => (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
      
      {!!errorMessage && <Alert severity="error">{errorMessage}</Alert>}

      {!mnemonic ? (
        <>
          <Box sx={{ display: 'flex', gap: { xs: 3, sm: 2 }, flexDirection: { xs: 'column', sm: 'row' } }}>
            <Field.Text name="firstName" label="Nome" slotProps={{ inputLabel: { shrink: true } }} />
            <Field.Text name="lastName" label="Sobrenome" slotProps={{ inputLabel: { shrink: true } }} />
          </Box>

          <Field.Text name="email" label="E-mail" slotProps={{ inputLabel: { shrink: true } }} />

          <Field.Text
            name="password"
            label="Senha"
            placeholder="Mínimo 6 caracteres"
            type={showPassword.value ? 'text' : 'password'}
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={showPassword.onToggle} edge="end">
                      <Iconify icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Button
            fullWidth
            color="inherit"
            size="large"
            variant="contained"
            onClick={handleGenerateKeys}
            disabled={!watchedValues.email || !watchedValues.password}
          >
            Gerar Identidade Criptográfica
          </Button>
        </>
      ) : (
        <>
          {!confirmedBackup ? (
            renderMnemonicStep()
          ) : (
            <Button
              fullWidth
              color="primary"
              size="large"
              type="submit"
              variant="contained"
              loading={isSubmitting}
            >
              Finalizar Registro na DAO
            </Button>
          )}
        </>
      )}
    </Box>
  );

  return (
    <>
      <AnimateLogoRotate sx={{ mb: 3, mx: 'auto' }} />

      <FormHead
        title="Comece agora gratuitamente"
        description={
          <>
            {`Já possui uma conta? `}
            <Link component={RouterLink} href={paths.auth.signIn} variant="subtitle2">
              Entrar
            </Link>
          </>
        }
      />

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm()}
      </Form>

      <SignUpTerms />
    </>
  );
}