// @ts-nocheck
'use client';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect } from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import * as Yup from 'yup';
import { countries } from 'countries-list';
import { useUpdateCurrencyMutation } from 'src/redux/store/services/api';
import { enqueueSnackbar } from 'notistack';

const CurrencyContent = ({ item, index, language, expanded, setExpanded }: any) => {
  const [currencyFeatureReq, currencyFeatureRes] = useUpdateCurrencyMutation();
  useEffect(() => {
    // Handle API call responses
    if (currencyFeatureRes.isSuccess) {
      enqueueSnackbar('Feature updated successfully', { variant: 'success' });
    }
    if (currencyFeatureRes.isError) {
      enqueueSnackbar('Failed to update the feature', { variant: 'error' });
    }
  }, [currencyFeatureRes]);
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };
  const { iso3c, __v, _id, ProtoType, ...val } = item;
  const value = Object.fromEntries(
    Object.entries(val).filter(([key]) => key !== '[[ProtoType]]')
  ) as any;
  const [isPositionLeft, setIsPositionLeft] = useState('lift');
  const [isSpacing, setIsSpacing] = useState(true);
  const theme = useTheme();
  const [personName, setPersonName] = useState(value?.name);
  const [personSymbol, setPersonSymbol] = useState(value?.name);
  const [personCountry, setPersonCountry] = useState(value?.countries);
  const { localized: localizedName, ...filteredVal } = personName;
  const { localized: localizedSymbol, ...filteredSymbolVal } = personSymbol;
  const [formValues, setFormValues] = useState({
    countries: personCountry,
    name: filteredVal,
    position: isPositionLeft,
    space: isSpacing,
    symbol: filteredSymbolVal,
  });
  const changeFormValues = () => {
    setFormValues({
      countries: personCountry,
      name: filteredVal,
      position: !!isPositionLeft ? 'lift' : 'right',
      space: isSpacing,
      symbol: filteredSymbolVal,
    });
  };
  const changePersonName = (val, key) => {
    let tempData = { ...personName };
    tempData[key] = val;
    setPersonName(tempData);
  };
  const changeSymbol = (val, key) => {
    let tempData = { ...personSymbol };
    tempData[key] = val;
    setPersonSymbol(tempData);
  };
  const handleExpandedChange = (panel: number) => {
    setExpanded(!!panel && panel !== expanded ? panel : false);
  };
  const names = { ...countries };

  function getStyles(name: string, personCountry: string, theme: any) {
    return {
      fontWeight:
        personCountry.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }

  const UpdateCurrencySchema = Yup.object().shape({
    name: Yup.object().shape({
      en: Yup.string().required(),
      ar: Yup.string().required(),
      es: Yup.string().required(),
      tr: Yup.string().required(),
      fr: Yup.string().required(),
      de: Yup.string().required(),
    }),
    space: Yup.boolean().required(),
    position: Yup.string().required(),
    countries: Yup.array().of(Yup.string()).required(),
    symbol: Yup.object().shape({
      en: Yup.string(),
      ar: Yup.string(),
      es: Yup.string(),
      tr: Yup.string(),
      fr: Yup.string(),
      de: Yup.string(),
    }),
  });
  const submit = () => {
    UpdateCurrencySchema?.validate(formValues)
      .then((data) =>
        currencyFeatureReq({
          id: _id,
          data: data,
        })
      )
      .catch((error) => {
        console.log('Validation error:', error);
      });
  };
  const handleChange = (event: any) => {
    const {
      target: { value },
    } = event;
    setPersonCountry(typeof value === 'string' ? value.split(',') : value);
    changeFormValues();
  };

  return (
    <Accordion
      onSubmit={submit}
      expanded={index + 1 === expanded}
      onChange={() => handleExpandedChange(index + 1)}
      sx={{ p: { xs: 0, sm: '15px' } }}
    >
      <AccordionSummary
        aria-controls="panel1d-content"
        id="panel1d-header"
        expandIcon={<ExpandMoreIcon />}
      >
        <Typography>{item?.name?.[language]}</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ pb: 0, mt: 1 }}>
        <Typography>Name</Typography>
        <Box sx={{ my: 2, gap: '20px 20px', display: 'flex', flexWrap: 'wrap' }}>
          {!!value?.name &&
            Object?.entries(value?.name)
              ?.filter((item) => item[0] !== 'localized')
              ?.map((it: string, index: number) => (
                <TextField
                  label={it[0]}
                  value={Object?.values(personName)[index]}
                  onChange={(e) => {
                    changePersonName(e?.target?.value, it[0]);
                    changeFormValues();
                  }}
                  sx={{ width: { xs: '100%', sm: 'calc(50% - 10px)' } }}
                  fullWidth
                  id="fullWidth"
                />
              ))}
        </Box>
      </AccordionDetails>
      <AccordionDetails sx={{ pb: 0, mt: 1 }}>
        <Typography>Symbol</Typography>
        <Box sx={{ my: 2, gap: '20px 20px', display: 'flex', flexWrap: 'wrap' }}>
          {!!personSymbol &&
            Object?.entries(personSymbol)
              ?.filter((item) => item[0] !== 'localized')
              ?.map((it: string, index: number) => (
                <TextField
                  label={it[0]}
                  value={Object?.values(personSymbol)[index]}
                  onChange={(e) => {
                    changeSymbol(e?.target?.value, it[0]);
                    changeFormValues();
                  }}
                  sx={{ width: { xs: '100%', sm: 'calc(50% - 10px)' } }}
                  fullWidth
                  id="fullWidth"
                />
              ))}
        </Box>
      </AccordionDetails>
      <Box
        sx={{
          width: { xs: 'calc(100% - 16px)', sm: '100%' },
          pl: '16px',
          pr: { xs: 0, sm: '16px' },
          my: 1,
          boxSizing: 'border-box',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            width: '100%',
            alignItems: { xs: 'start', sm: 'center' },
            justifyContent: 'space-between',
            gap: { xs: 0, sm: '30px' },
          }}
        >
          <Box sx={{ width: '120px', display: 'flex', alignItems: 'center', m: '15px 0' }}>
            <Typography>Space</Typography>
            <Switch
              inputProps={{ 'aria-label': 'Month' }}
              checked={!isSpacing}
              onChange={() => {
                setIsSpacing((val) => !val);
                changeFormValues();
              }}
              style={{ '& .MuiSwitch-track': { backgroundColor: '#1BFCB6' } }}
            />
          </Box>
          <FormControl sx={{ width: `calc(50% - 150px)` }}>
            <InputLabel id="demo-simple-select-label">Position</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={isPositionLeft}
              label="Age"
              onChange={(val) => {
                setIsPositionLeft(val?.target?.value);
                changeFormValues();
              }}
            >
              <MenuItem value={'lift'}>left</MenuItem>
              <MenuItem value={'right'}>right</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ width: { xs: '100%', sm: 'calc(50% - 10px)' } }}>
            <InputLabel id="demo-multiple-chip-label">Countries</InputLabel>
            <Select
              labelId="demo-multiple-chip-label"
              id="demo-multiple-chip"
              multiple
              value={personCountry}
              onChange={handleChange}
              input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {Object?.keys(names)?.map((name) => (
                <MenuItem key={name} value={name} style={getStyles(name, personCountry, theme)}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>
      <Box sx={{ width: 'calc(100% - 15px)', display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          sx={{
            heigth: '54px',
            borderRadius: '20px',
            gap: '10px',
            background: '#1BFCB6',
            '&:hover': {
              background: '#19c6a0',
            },
            p: { xs: '4px 8px', sm: '6px 10px', md: '8px 16px' },
            minWidth: '32px',
          }}
          onClick={submit}
        >
          Update
        </Button>
      </Box>
    </Accordion>
  );
};

export default CurrencyContent;
