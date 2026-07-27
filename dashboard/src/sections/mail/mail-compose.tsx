import { z as zod } from 'zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { varAlpha } from 'minimal-shared/utils';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Portal from '@mui/material/Portal';
import Backdrop from '@mui/material/Backdrop';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import useMediaQuery from '@mui/material/useMediaQuery';

import { useGetMails, sendCampaign } from 'src/actions/mail';

import { Editor } from 'src/components/editor';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const POSITION = 16;

// ----------------------------------------------------------------------

export const MailSchema = zod.object({
  to: zod.string().min(1, { message: 'Recipient is required!' }),
  subject: zod.string().min(1, { message: 'Subject is required!' }),
  message: zod.string().min(1, { message: 'Message is required!' }),
});

export type MailSchemaType = zod.infer<typeof MailSchema>;

type Props = {
  onCloseCompose: () => void;
};

export function MailCompose({ onCloseCompose }: Props) {
  const smUp = useMediaQuery((theme) => theme.breakpoints.up('sm'));

  const fullScreen = useBoolean();
  const isSubmitting = useBoolean();
  
  const { refetchMails } = useGetMails();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<MailSchemaType>({
    resolver: zodResolver(MailSchema),
    defaultValues: {
      to: '',
      subject: '',
      message: '',
    },
  });

  const messageValue = watch('message');

  const onSubmit = handleSubmit(async (data) => {
    isSubmitting.onTrue();
    try {
      // Formata o payload para o Backend via Adapter (Transparência)
      await sendCampaign({
        to: data.to,
        subject: data.subject,
        message: data.message,
      });

      toast.success('Mailing campaign started successfully!');
      
      // Atualiza a caixa de e-mails na tela
      refetchMails();
      
      reset();
      onCloseCompose();
    } catch (error: any) {
      console.error(error);
      toast.error(`Error: ${error.message}`);
    } finally {
      isSubmitting.onFalse();
    }
  });

  useEffect(() => {
    document.body.style.overflow = fullScreen.value ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [fullScreen.value]);

  return (
    <Portal>
      {(fullScreen.value || !smUp) && (
        <Backdrop open sx={[(theme) => ({ zIndex: theme.zIndex.modal - 1 })]} />
      )}

      <Paper
        sx={[
          (theme) => ({
            maxWidth: 560,
            right: POSITION,
            borderRadius: 2,
            display: 'flex',
            bottom: POSITION,
            position: 'fixed',
            overflow: 'hidden',
            flexDirection: 'column',
            zIndex: theme.zIndex.modal,
            width: `calc(100% - ${POSITION * 2}px)`,
            boxShadow: theme.vars.customShadows.dropdown,
            ...(fullScreen.value && { maxWidth: 1, height: `calc(100% - ${POSITION * 2}px)` }),
          }),
        ]}
      >
        <Box
          sx={[
            (theme) => ({
              display: 'flex',
              alignItems: 'center',
              bgcolor: 'background.neutral',
              p: theme.spacing(1.5, 1, 1.5, 2),
            }),
          ]}
        >
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            New message
          </Typography>

          <IconButton onClick={fullScreen.onToggle}>
            <Iconify icon={fullScreen.value ? 'eva:collapse-fill' : 'eva:expand-fill'} />
          </IconButton>

          <IconButton onClick={onCloseCompose}>
            <Iconify icon="mingcute:close-line" />
          </IconButton>
        </Box>

        <InputBase
          {...register('to')}
          id="mail-compose-to"
          placeholder="To"
          error={!!errors.to}
          endAdornment={
            <Box sx={{ gap: 0.5, display: 'flex', typography: 'subtitle2' }}>
              <Box sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>Cc</Box>
              <Box sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>Bcc</Box>
            </Box>
          }
          sx={[
            (theme) => ({
              px: 2,
              height: 48,
              borderBottom: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
            }),
          ]}
        />

        <InputBase
          {...register('subject')}
          id="mail-compose-subject"
          placeholder="Subject"
          error={!!errors.subject}
          sx={[
            (theme) => ({
              px: 2,
              height: 48,
              borderBottom: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
            }),
          ]}
        />

        <Box
          sx={{
            p: 2,
            gap: 2,
            display: 'flex',
            flex: '1 1 auto',
            overflow: 'hidden',
            flexDirection: 'column',
          }}
        >
          <Editor
            value={messageValue}
            onChange={(value) => setValue('message', value)}
            placeholder="Type a message"
            slotProps={{
              wrapper: { sx: { ...(fullScreen.value && { minHeight: 0, flex: '1 1 auto' }) } },
            }}
            sx={{
              maxHeight: 480,
              ...(fullScreen.value && { maxHeight: 1, flex: '1 1 auto' }),
            }}
          />

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton>
              <Iconify icon="solar:gallery-add-bold" />
            </IconButton>

            <IconButton>
              <Iconify icon="eva:attach-2-fill" />
            </IconButton>

            <Box sx={{ flexGrow: 1 }} />

            <LoadingButton
              loading={isSubmitting.value}
              variant="contained"
              color="primary"
              endIcon={<Iconify icon="custom:send-fill" />}
              onClick={onSubmit}
            >
              Send
            </LoadingButton>
          </Box>
        </Box>
      </Paper>
    </Portal>
  );
}
