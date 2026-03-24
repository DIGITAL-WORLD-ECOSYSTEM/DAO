import { MuiOtpInput } from 'mui-one-time-password-input';

import { OutlinedInput } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledMuiOtpInput = styled(MuiOtpInput);

export const StyledCodeInput = styled(OutlinedInput)(({ theme }) => ({
  width: 40,
  height: 56,
  padding: 0,
  margin: theme.spacing(0, 0.5),
  '& input': {
    textAlign: 'center',
    padding: 0,
  },
}));
