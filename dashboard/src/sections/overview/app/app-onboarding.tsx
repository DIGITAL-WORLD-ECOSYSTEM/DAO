import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

// ----------------------------------------------------------------------

type OnboardingStep = {
  id: string;
  label: string;
  completed: boolean;
};

const _initialSteps: OnboardingStep[] = [
  { id: 'step-1', label: 'Completar Perfil e Avatar', completed: false },
  { id: 'step-2', label: 'Entrar no Chat da Comunidade', completed: false },
  { id: 'step-3', label: 'Participar da Primeira Votação', completed: false },
  { id: 'step-4', label: 'Convidar seu primeiro Parceiro', completed: false },
];

export function AppOnboarding({ ...other }) {
  const [steps, setSteps] = useState<OnboardingStep[]>(_initialSteps);

  const completedCount = steps.filter((s) => s.completed).length;
  const progress = (completedCount / steps.length) * 100;

  const handleToggle = (id: string) => {
    setSteps((prev) =>
      prev.map((step) => (step.id === id ? { ...step, completed: !step.completed } : step))
    );
  };

  // Se tudo for concluído, o componente se oculta da Home.
  if (completedCount === steps.length) {
    return null;
  }

  return (
    <Card sx={{ p: 3 }} {...other}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Primeiros Passos na Comunidade
      </Typography>

      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
        Complete estas ações para desbloquear todos os recursos do ecossistema ASPPIBRA.
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Stack
          direction="row"
          sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 1 }}
        >
          <Typography variant="body2" sx={{ fontWeight: 'fontWeightMedium' }}>
            Progresso
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {completedCount} / {steps.length}
          </Typography>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={progress}
          color={progress === 100 ? 'success' : 'primary'}
          sx={{ height: 8, borderRadius: 1 }}
        />
      </Box>

      <Stack spacing={1}>
        {steps.map((step) => (
          <Box
            key={step.id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              p: 1,
              borderRadius: 1,
              bgcolor: step.completed ? 'action.hover' : 'transparent',
              transition: 'background-color 0.2s',
            }}
          >
            <Checkbox
              checked={step.completed}
              onChange={() => handleToggle(step.id)}
              color="success"
            />
            <Typography
              variant="body2"
              sx={{
                ...(step.completed && {
                  color: 'text.disabled',
                  textDecoration: 'line-through',
                }),
              }}
            >
              {step.label}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Card>
  );
}
