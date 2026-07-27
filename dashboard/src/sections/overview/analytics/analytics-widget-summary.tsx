import type { CardProps } from '@mui/material/Card';
import type { PaletteColorKey } from 'src/theme/core';
import type { ChartOptions } from 'src/components/chart';

import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';

import { fPercent, fShortenNumber } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';
import { Chart, useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

type Props = CardProps & {
  title: string;
  total: string | number;
  percent: number;
  color?: PaletteColorKey;
  icon: React.ReactNode;
  chart?: {
    series: number[];
    categories: string[];
    options?: ChartOptions;
  };
};

export function AnalyticsWidgetSummary({
  sx,
  icon,
  title,
  total,
  chart,
  percent,
  color = 'primary',
  ...other
}: Props) {
  const theme = useTheme();

  const chartColors = [theme.palette[color].main];

  const chartOptions = useChart({
    chart: { sparkline: { enabled: true } },
    colors: chartColors,
    xaxis: { categories: chart?.categories },
    grid: {
      padding: {
        top: 6,
        left: 6,
        right: 6,
        bottom: 6,
      },
    },
    tooltip: {
      y: { formatter: (value: number) => value.toString(), title: { formatter: () => '' } },
    },
    markers: {
      strokeWidth: 0,
    },
    ...chart?.options,
  });

  const renderTrending = () => (
    <Box
      sx={{
        py: 0.25,
        px: 0.75,
        gap: 0.25,
        mt: 0.75,
        width: 'fit-content',
        display: 'flex',
        borderRadius: 0.75,
        alignItems: 'center',
        color: percent < 0 ? 'error.main' : 'success.main',
        bgcolor: varAlpha(theme.vars.palette[percent < 0 ? 'error' : 'success'].mainChannel, 0.08),
        typography: 'caption',
        fontWeight: 'bold',
      }}
    >
      <Iconify
        width={14}
        icon={
          percent < 0
            ? 'solar:double-alt-arrow-down-bold-duotone'
            : 'solar:double-alt-arrow-up-bold-duotone'
        }
      />
      <Box component="span">
        {percent > 0 && '+'}
        {fPercent(percent)}
      </Box>
    </Box>
  );

  return (
    <Card
      sx={[
        () => ({
          p: 2.5,
          boxShadow: theme.customShadows.z1,
          border: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.12)}`,
          position: 'relative',
          backgroundColor: 'common.white',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          transition: theme.transitions.create(['box-shadow', 'transform'], {
            duration: theme.transitions.duration.shorter,
          }),
          '&:hover': {
            boxShadow: theme.customShadows.z8,
            transform: 'translateY(-2px)',
          },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          flexShrink: 0,
          display: 'flex',
          borderRadius: 1.5,
          alignItems: 'center',
          justifyContent: 'center',
          color: `${color}.main`,
          bgcolor: varAlpha(theme.vars.palette[color].mainChannel, 0.08),
          border: `solid 1px ${varAlpha(theme.vars.palette[color].mainChannel, 0.16)}`,
        }}
      >
        {icon}
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        <Box
          sx={{
            typography: 'overline',
            color: 'text.secondary',
            mb: 0.5,
            fontWeight: 800,
            letterSpacing: 1.2,
            lineHeight: 1.5,
          }}
        >
          {title}
        </Box>
        <Box sx={{ typography: 'h4', fontWeight: 800, color: 'text.primary', letterSpacing: -0.5 }}>
          {typeof total === 'number' ? fShortenNumber(total) : total}
        </Box>
        {renderTrending()}
      </Box>

      {chart && (
        <Chart
          type="line"
          series={[{ data: chart.series }]}
          options={{
            ...chartOptions,
            stroke: { width: 3, curve: 'smooth' },
          }}
          sx={{ width: 60, height: 40 }}
        />
      )}
    </Card>
  );
}
