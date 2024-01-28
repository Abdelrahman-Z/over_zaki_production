import { useCallback } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { Box } from '@mui/material';
// types
import { IOrderTableFilters, IOrderTableFilterValue } from 'src/types/order';
// components
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

type Props = {
  filters: IOrderTableFilters;
  onFilters: (name: string, value: IOrderTableFilterValue) => void;
  query: string;
  setQuery: any;
  canReset: boolean;
  onResetFilters: VoidFunction;
};

export default function CustomersTableToolbar({
  filters,
  onFilters,
  query,
  setQuery,
  canReset,
  onResetFilters,
}: Props) {
  const popover = usePopover();

  const handleFilterName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFilters('name', event.target.value);
    },
    [onFilters]
  );

  return (
    <>
      <Stack
        spacing={2}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        direction={{
          xs: 'column',
          md: 'row',
        }}
        sx={{
          p: 2.5,
          pr: { xs: 2.5, md: 1 },
          pl: { xs: 2.5, md: 1 },
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
          <TextField
            placeholder="Search by order ID, phone or customer..."
            fullWidth
            variant="filled"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Box component="img" src="/raw/search.svg" sx={{ width: '15px' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              borderRadius: '16px',
              '& .MuiFilledInput-root': {
                borderRadius: '16px',
              },
              '& .MuiInputAdornment-root': {
                marginTop: '0px !important',
                paddingLeft: '10px',
              },
              '& input': {
                color: '#8898AA',
                paddingLeft: '10px',
                fontSize: '14px',
                padding: '15px 20px 15px 0px !important',
              },
            }}
          />

          <Button
            variant="contained"
            sx={{
              backgroundColor: 'rgb(15, 19, 73,.04)',
              borderRadius: '16px',
              padding: '15px 15px',
            }}
          >
            <Box component="img" src="/raw/sort.svg" />
          </Button>

          <Button
            variant="contained"
            sx={{
              backgroundColor: 'rgb(15, 19, 73,.04)',
              borderRadius: '16px',
              padding: '15px 15px',
            }}
          >
            <Box component="img" src="/raw/filter.svg" />
          </Button>
          <IconButton onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </Stack>

        {canReset && (
          <Button
            color="error"
            sx={{ flexShrink: 0 }}
            onClick={onResetFilters}
            startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
          >
            Clear
          </Button>
        )}
      </Stack>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon="solar:printer-minimalistic-bold" />
          Print
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon="solar:import-bold" />
          Import
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon="solar:export-bold" />
          Export
        </MenuItem>
      </CustomPopover>
    </>
  );
}
