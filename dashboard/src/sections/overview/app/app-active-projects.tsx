import type { ActiveProject } from 'src/types/home';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  list: ActiveProject[];
};

export function AppActiveProjects({ list, ...other }: Props) {
  return (
    <Card {...other}>
      <CardHeader title="Projetos em Evidência" sx={{ mb: 2 }} />

      <Stack spacing={3} sx={{ p: 3, pt: 0 }}>
        {list.map((project) => (
          <ProjectItem key={project.id} project={project} />
        ))}
      </Stack>
    </Card>
  );
}

// ----------------------------------------------------------------------

function ProjectItem({ project }: { project: ActiveProject }) {
  const getStatusColor = () => {
    switch (project.status) {
      case 'completed':
        return 'success';
      case 'planning':
        return 'warning';
      default:
        return 'primary';
    }
  };

  return (
    <Stack spacing={1}>
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Iconify
            icon={'solar:rocket-bold-duotone' as any}
            sx={{ color: `${getStatusColor()}.main` }}
          />
          <Typography variant="subtitle2">{project.name}</Typography>
        </Stack>
        <Typography
          variant="body2"
          sx={{ color: 'text.secondary', fontWeight: 'fontWeightMedium' }}
        >
          {project.progress}%
        </Typography>
      </Stack>

      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {project.description}
      </Typography>

      <LinearProgress
        variant="determinate"
        value={project.progress}
        color={getStatusColor()}
        sx={{ height: 6, borderRadius: 1 }}
      />
    </Stack>
  );
}
