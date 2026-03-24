'use client';

import * as z from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import axios, { endpoints } from 'src/lib/axios';
import { EmailInboxIcon } from 'src/assets/icons';

// CORREÇÃO 1: Importação ajustada
import { toast } from 'src/auth/components';

import { Form, Field, FormHead, schemaUtils, FormResendCode, FormReturnLink } from '../components';

// ----------------------------------------------------------------------

export type VerifySchemaType = z.infer<typeof VerifySchema>;

export const VerifySchema = z.object({
  code: z
    .string()
    .min(1, { message: 'O código é obrigatório!' })
    .min(6, { message: 'O código deve ter pelo menos 6 caracteres!' }),
  email: schemaUtils.email(),
});

// ----------------------------------------------------------------------

export function CenteredVerifyView() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const defaultValues: VerifySchemaType = {
    code: '',
    email: '',
  };

  const methods = useForm<VerifySchemaType>({
    resolver: zodResolver(VerifySchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // CORREÇÃO 2: Tipo explícito adicionado
  const onSubmit = handleSubmit(async (data: VerifySchemaType) => {
    try {
      setErrorMessage(null);

      // Chamada real para o seu Worker na Cloudflare
      await axios.post(endpoints.auth.verify || '/api/core/auth/verify', {
        email: data.email,
        code: data.code,
      });

      toast.success('E-mail verificado com sucesso!');
      router.push(paths.auth.signIn);
      
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message || 'Código de verificação inválido ou expirado.');
    }
  });

  const handleResendCode = async () => {
    try {
      const email = methods.getValues('email');
      if (!email) {
        toast.error('Insira o e-mail para reenviar o código.');
        return;
      }
      await axios.post('/api/core/auth/resend-code', { email });
      toast.success('Novo código enviado!');
    } catch (error: any) {
      // CORREÇÃO 3: Usamos a variável error para satisfazer o linter e ajudar no debug
      console.error(error);
      toast.error('Erro ao reenviar código.');
    }
  };

  const renderForm = () => (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
      
      {!!errorMessage && <Alert severity="error">{errorMessage}</Alert>}

      <Field.Text
        name="email"
        label="Endereço de e-mail"
        placeholder="exemplo@asppibra.com.br"
        slotProps={{ inputLabel: { shrink: true } }}
      />

      <Field.Code name="code" />

      <Button
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Verificar Conta
      </Button>
    </Box>
  );

  return (
    <>
      <FormHead
        icon={<EmailInboxIcon />}
        title="Verifique seu e-mail!"
        description={`Enviamos um código de confirmação de 6 dígitos. \nPor favor, insira o código abaixo para validar seu acesso.`}
      />

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm()}
      </Form>

      <FormResendCode onResendCode={handleResendCode} value={0} disabled={false} />

      <FormReturnLink href={paths.auth.signIn} />
    </>
  );
}