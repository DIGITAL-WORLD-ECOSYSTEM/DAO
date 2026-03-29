import vinext from "vinext";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [vinext()],
  ssr: {
    noExternal: [
      '@mui/material',
      '@mui/system',
      '@mui/x-data-grid',
      '@mui/x-date-pickers',
      '@mui/x-tree-view',
      '@mui/utils',
      '@mui/material-nextjs'
    ]
  },
  optimizeDeps: {
    include: [
      '@mui/material',
      '@mui/system',
      '@mui/x-data-grid',
      '@mui/x-date-pickers',
      '@mui/x-tree-view',
      '@mui/utils',
      'dayjs',
      'dayjs/plugin/advancedFormat',
      'dayjs/plugin/duration',
      'dayjs/plugin/relativeTime',
      'dayjs/plugin/utc',
      'dayjs/plugin/timezone',
      'dayjs/plugin/isBetween',
      'dayjs/plugin/customParseFormat',
      'dayjs/plugin/isSameOrAfter',
      'dayjs/plugin/isSameOrBefore',
      'dayjs/plugin/minMax',
      'frame-ticker'
    ]
  }
});
