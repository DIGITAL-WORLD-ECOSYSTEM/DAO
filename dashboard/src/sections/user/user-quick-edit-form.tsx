import type { IUserItem } from 'src/types/user';

import * as z from 'zod';
import { mutate } from 'swr';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { endpoints } from 'src/lib/axios';
import { updateCitizen } from 'src/actions/identity';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaUtils } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export type UserQuickEditSchemaType = z.infer<typeof UserQuickEditSchema>;

export const UserQuickEditSchema = z.object({
  name: z.string().min(1, { message: 'Nome é obrigatório!' }),
  email: schemaUtils.email(),
  phoneNumber: z
    .string()
    .refine((val) => !val || !val.startsWith('+') || isValidPhoneNumber(val), {
      message: 'Número de telefone inválido!',
    })
    .optional()
    .or(z.literal('')),
  status: z.string(),
  statusReason: z.string().min(5, { message: 'Justificativa obrigatória (mínimo 5 caracteres).' }),
  kycStatus: z.string(),
  kycReason: z.string().min(5, { message: 'Justificativa obrigatória (mínimo 5 caracteres).' }),
});

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'active', label: 'Ativo' },
  { value: 'pending', label: 'Pendente' },
  { value: 'suspended', label: 'Suspenso' },
  { value: 'inactive', label: 'Inativo' },
  { value: 'blocked', label: 'Bloqueado' },
];

const KYC_STATUS_OPTIONS = [
  { value: 'draft', label: 'Não Iniciado' },
  { value: 'pending', label: 'Pendente' },
  { value: 'under_review', label: 'Em Análise' },
  { value: 'approved', label: 'Verificado' },
  { value: 'rejected', label: 'Rejeitado' },
  { value: 'expired', label: 'Expirado' },
];

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: () => void;
  currentUser?: IUserItem;
};

export function UserQuickEditForm({ currentUser, open, onClose }: Props) {
  const defaultValues: UserQuickEditSchemaType = {
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phoneNumber: currentUser?.phoneNumber || '',
    status: currentUser?.status || 'pending',
    statusReason: '',
    kycStatus: currentUser?.kycStatus || 'pending',
    kycReason: '',
  };

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(UserQuickEditSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(
    async (data) => {
      try {
        if (!currentUser) return;

        const nameParts = data.name.trim().split(/\s+/);
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        const payload = {
          firstName,
          lastName,
          phoneNumber: data.phoneNumber || '',
          kycStatus: data.kycStatus === 'draft' ? 'none' : data.kycStatus,
          // Neste cenário real, statusReason e kycReason iriam para uma tabela de Audit Trail
          // auditTrail: { statusReason: data.statusReason, kycReason: data.kycReason }
        };

        const updatePromise = updateCitizen(currentUser.id, payload);

        toast.promise(updatePromise, {
          loading: 'Atualizando...',
          success: 'Identidade atualizada com sucesso!',
          error: 'Erro ao atualizar.',
        });

        await updatePromise;

        await mutate(endpoints.platform.identity.list);
        onClose();
      } catch (error: any) {
        console.error(error);
        toast.error(error.message || 'Erro ao salvar no servidor.');
      }
    },
    (errors) => {
      console.error('Validation errors:', errors);
      const firstErrorKey = Object.keys(errors)[0];
      if (firstErrorKey) {
        const error = errors[firstErrorKey as keyof typeof errors];
        toast.error(`Erro de Validação (${firstErrorKey}): ${error?.message}`);
      }
    }
  );

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: { maxWidth: 600 },
        },
      }}
    >
      <DialogTitle>Edição Rápida (Administrativo)</DialogTitle>

      <Form methods={methods} onSubmit={onSubmit}>
        <DialogContent>
          <Alert variant="outlined" severity="warning" sx={{ mb: 3 }}>
            Toda alteração de Status ou KYC gera um log inalterável na trilha de auditoria.
          </Alert>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <Field.Text name="name" label="Nome Completo" />
              <Field.Phone name="phoneNumber" label="Número de Telefone" />
            </Box>

            <Field.Text name="email" label="Endereço de E-mail" disabled />

            <Box sx={{ p: 2.5, bgcolor: 'background.neutral', borderRadius: 1.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Field.Select name="status" label="Status Institucional">
                {STATUS_OPTIONS.map((status) => (
                  <MenuItem key={status.value} value={status.value}>
                    {status.label}
                  </MenuItem>
                ))}
              </Field.Select>
              
              <Field.Text 
                name="statusReason" 
                label="Motivo da alteração de Status" 
                placeholder="Ex: Conta inativa por solicitação do usuário." 
              />
            </Box>

            <Box sx={{ p: 2.5, bgcolor: 'background.neutral', borderRadius: 1.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Field.Select name="kycStatus" label="Situação Documental (KYC)">
                {KYC_STATUS_OPTIONS.map((status) => (
                  <MenuItem key={status.value} value={status.value}>
                    {status.label}
                  </MenuItem>
                ))}
              </Field.Select>

              <Field.Text 
                name="kycReason" 
                label="Parecer / Justificativa (KYC)" 
                placeholder="Ex: Documento CNH ilegível, solicitando reenvio." 
              />
            </Box>

          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" loading={isSubmitting}>
            Salvar e Auditar
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
