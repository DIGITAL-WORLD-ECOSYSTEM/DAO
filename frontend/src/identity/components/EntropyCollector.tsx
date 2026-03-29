'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, LinearProgress, Paper } from '@mui/material';

interface EntropyCollectorProps {
  onComplete: (entropy: string) => void;
  requiredPoints?: number;
}

/**
 * Componente de Captura de Entropia Real (Elite SSI Standard)
 * Coleta movimentos do mouse para gerar aleatoriedade imprevisível.
 */
export function EntropyCollector({ onComplete, requiredPoints = 100 }: EntropyCollectorProps) {
  const [points, setPoints] = useState<number>(0);
  const [entropyData, setEntropyData] = useState<string>('');

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (points >= requiredPoints) return;

    const data = `${e.clientX}${e.clientY}${Date.now()}`;
    setEntropyData((prev) => prev + data);
    setPoints((prev) => prev + 1);
  }, [points, requiredPoints]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  useEffect(() => {
    if (points >= requiredPoints) {
      onComplete(entropyData);
    }
  }, [points, requiredPoints, entropyData, onComplete]);

  return (
    <Paper sx={{ p: 3, textAlign: 'center', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)' }}>
      <Typography variant="h6" gutterBottom>
        🛡️ Gerando seu Cofre Pessoal
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
        Mova o mouse sobre a tela para gerar entropia criptográfica real.
      </Typography>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" value={(points / requiredPoints) * 100} sx={{ height: 10, borderRadius: 5 }} />
      </Box>
      <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
        Status do Vault: {points < requiredPoints ? `Coletando Dados (${Math.round((points / requiredPoints) * 100)}%)` : 'Entropia Gerada com Sucesso!'}
      </Typography>
    </Paper>
  );
}
