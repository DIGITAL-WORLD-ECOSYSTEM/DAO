'use client';

import React from 'react';
import { Box, Typography, Paper, Grid, Button, Alert } from '@mui/material';
import { Iconify } from 'src/components/iconify';

interface MnemonicViewProps {
  mnemonic: string;
  onConfirm: () => void;
}

/**
 * MnemonicView: Interface de backup das 24 palavras (Elite SSI Standard)
 * Garante que o usuário anote suas chaves antes de prosseguir.
 */
export function MnemonicView({ mnemonic, onConfirm }: MnemonicViewProps) {
  const words = mnemonic.split(' ');

  return (
    <Paper sx={{ p: 4, maxWidth: 600, mx: 'auto', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(20px)' }}>
      <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
        🗝️ Suas Palavras de Recuperação
      </Typography>
      
      <Alert severity="warning" sx={{ mb: 3 }}>
        Anote estas 24 palavras em um papel e guarde em um lugar seguro. 
        **Quem tiver estas palavras tem acesso total à sua conta e seus ativos.**
      </Alert>

      <Grid container spacing={1} sx={{ mb: 4 }}>
        {words.map((word, index) => (
          <Grid item xs={4} sm={3} key={index}>
            <Box sx={{ 
              p: 1, 
              border: '1px solid rgba(255,255,255,0.1)', 
              borderRadius: 1, 
              textAlign: 'center',
              background: 'rgba(255,255,255,0.05)'
            }}>
              <Typography variant="caption" color="textSecondary" sx={{ mr: 1 }}>{index + 1}.</Typography>
              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>{word}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ p: 2, bgcolor: 'error.lighter', borderRadius: 1, mb: 3, color: 'error.darker' }}>
        <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Iconify icon="solar:danger-bold" />
          A ASPPIBRA-DAO nunca pedirá estas palavras. Nunca as digite em sites que não sejam o oficial.
        </Typography>
      </Box>

      <Button 
        fullWidth 
        variant="contained" 
        size="large" 
        color="primary"
        onClick={onConfirm}
        sx={{ py: 2 }}
      >
        Já anotei com segurança e quero continuar
      </Button>
    </Paper>
  );
}
