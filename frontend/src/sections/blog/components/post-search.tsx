'use client';

import type { Theme, SxProps } from '@mui/material/styles';
import type { IPostItem } from 'src/types/blog';

import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';

import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';
import { SearchNotFound } from 'src/components/search-not-found';

// ----------------------------------------------------------------------

type Props = {
  query: string;
  results: IPostItem[];
  onSearch: (value: string) => void;
  redirectPath: (title: string) => string;
  sx?: SxProps<Theme>;
};

export function PostSearch({ query, results, onSearch, redirectPath, sx }: Props) {
  const handleSearch = (event: React.SyntheticEvent, newValue: string) => {
    onSearch(newValue);
  };

  const renderOption = (props: React.HTMLAttributes<HTMLLIElement>, option: IPostItem) => {
    const { title, coverUrl } = option;
    const matches = match(title, query, { insideWords: true });
    const parts = parse(title, matches);

    return (
      <li {...props} key={option.id}>
        <Link component={RouterLink} href={redirectPath(option.title)} underline="none">
          <Avatar
            alt={title}
            src={coverUrl}
            variant="rounded"
            sx={{ width: 48, height: 48, flexShrink: 0, mr: 1.5, borderRadius: 1 }}
          />

          <Box key={query}>
            {parts.map((part, index) => (
              <Box
                key={index}
                component="span"
                sx={{
                  typography: 'body2',
                  fontWeight: part.highlight ? 'fontWeightSemiBold' : 'fontWeightMedium',
                  color: part.highlight ? 'primary.main' : 'text.primary',
                }}
              >
                {part.text}
              </Box>
            ))}
          </Box>
        </Link>
      </li>
    );
  };

  return (
    <Autocomplete
      sx={[{ width: { xs: 1, sm: 260 } }, ...(Array.isArray(sx) ? sx : [sx])]}
      popupIcon={null}
      autoHighlight
      options={results}
      inputValue={query}
      onInputChange={handleSearch}
      getOptionLabel={(option) => option.title}
      noOptionsText={<SearchNotFound query={query} />}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Search..."
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ ml: 1, color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
      )}
      renderOption={renderOption}
      slotProps={{
        paper: {
          sx: {
            [`& .${autocompleteClasses.listbox}`]: {
              [`& .${autocompleteClasses.option}`]: {
                p: 0,
                [`& .MuiAutocomplete-option`]: {
                  p: 1,
                  gap: 1.5,
                  width: 1,
                  display: 'flex',
                  alignItems: 'center',
                },
              },
            },
          },
        },
      }}
    />
  );
}