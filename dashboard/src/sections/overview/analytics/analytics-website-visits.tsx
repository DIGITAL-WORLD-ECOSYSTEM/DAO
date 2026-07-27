import type { CardProps } from '@mui/material/Card';
import type { ChartOptions } from 'src/components/chart';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { useTheme, alpha as hexAlpha } from '@mui/material/styles';

import { Chart, useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  subheader?: string;
  chart: {
    colors?: string[];
    categories?: string[];
    series: {
      name: string;
      data: number[];
    }[];
    options?: ChartOptions;
  };
};

export function AnalyticsWebsiteVisits({ title, subheader, chart, sx, ...other }: Props) {
  const theme = useTheme();

  const chartColors = chart.colors ?? [
    hexAlpha(theme.palette.primary.dark, 0.8),
    hexAlpha(theme.palette.warning.main, 0.8),
  ];

  const chartOptions = useChart({
    colors: chartColors,
    stroke: {
      width: 3,
      curve: 'smooth',
    },
    xaxis: { categories: chart.categories },
    legend: { show: true, position: 'bottom', horizontalAlign: 'center' },
    tooltip: { y: { formatter: (value: number) => `R$ ${value.toLocaleString('pt-BR')}` } },
    ...chart.options,
  });

  return (
    <Card
      sx={{
        height: 1,
        display: 'flex',
        flexDirection: 'column',
        ...sx,
      }}
      {...other}
    >
      <CardHeader title={title} subheader={subheader} />

      <Box sx={{ flexGrow: 1, py: 2.5, pr: 2.5, pl: 1 }}>
        <Chart
          type="line"
          series={chart.series}
          options={chartOptions}
          slotProps={{ loading: { p: 2.5 } }}
          sx={{
            height: 1,
            minHeight: 364,
          }}
        />
      </Box>
    </Card>
  );
}
