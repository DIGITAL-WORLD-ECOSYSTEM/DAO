/**
 * Copyright 2026 ASPPIBRA – Associação dos Proprietários e Possuidores de Imóveis no Brasil.
 * Project: Governance System (ASPPIBRA DAO)
 * Role: SoFi Comment Form (User Interaction)
 * Version: 1.4.9 - Refactored: UX, Accessibility & Error Handling
 */

'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

/**
 * 🛡️ SCHEMA DE VALIDAÇÃO (ZOD):
 * Centralizamos a lógica de validação fora do componente para garantir
 * performance e facilitar a reutilização em outros módulos.
 */
export const CommentSchema = z.object({
  comment: z.string().min(1, { message: 'O comentário não pode estar vazio!' }),
});

export type CommentSchemaType = z.infer<typeof CommentSchema>;

// ----------------------------------------------------------------------

export function SoFiCommentForm() {
  /**
   * ⚙️ CONFIGURAÇÃO DO FORMULÁRIO:
   * Inicialização com React Hook Form e integração com Zod.
   */
  const defaultValues: CommentSchemaType = {
    comment: '',
  };

  const methods = useForm<CommentSchemaType>({
    resolver: zodResolver(CommentSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  /**
   * 🚀 LÓGICA DE SUBMISSÃO:
   * Processa os dados do comentário. Em produção, este bloco será
   * conectado à API do ecossistema ASPPIBRA.
   */
  const onSubmit = handleSubmit(async (data) => {
    try {
      // Simulação de latência de rede para feedback visual de loading
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      reset();
      console.info('Comentário processado com sucesso:', data);
      
      // Nota: Futura integração com Toaster (ex: toast.success('Comentário enviado!'))
    } catch (error) {
      console.error('Falha ao enviar comentário:', error);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
        
        {/* 📝 CAMPO DE TEXTO: Suporta múltiplas linhas para comentários detalhados */}
        <Field.Text
          name="comment"
          placeholder="Escreva seu comentário sobre este projeto RWA..."
          multiline
          rows={4}
          helperText="Mantenha o tom profissional e focado em governança agroecológica."
        />

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          
          {/* 📎 BARRA DE FERRAMENTAS: Opções de anexo e mídia */}
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <IconButton aria-label="Adicionar imagem do projeto">
              <Iconify icon="solar:gallery-add-bold" />
            </IconButton>

            <IconButton aria-label="Anexar documento PDF/Legal">
              <Iconify icon="eva:attach-2-fill" />
            </IconButton>

            <IconButton aria-label="Adicionar reação">
              <Iconify icon="eva:smiling-face-fill" />
            </IconButton>
          </Box>

          {/* 📤 BOTÃO DE AÇÃO: Gerencia estados de carregamento e desativação */}
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            SoFiar comentário
          </Button>
        </Box>
      </Box>
    </Form>
  );
}