'use client';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Container,
  Grid,
  Paper,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import CustomCrumbs from 'src/components/custom-crumbs/custom-crumbs';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import * as React from 'react';
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
// import OutlinedInput from '@mui/material/OutlinedInput';
// import InputLabel from '@mui/material/InputLabel';
// import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
// import Select from '@mui/material/Select';
// import Chip from '@mui/material/Chip';
import { useGetAllCurrencyQuery } from 'src/redux/store/services/api';
import CurrencyContent from 'src/sections/currency/currencyContent';

const Currency = () => {
  let language = 'en';
  // const ITEM_HEIGHT = 48;
  // const ITEM_PADDING_TOP = 8;
  const allCurrencyRes = useGetAllCurrencyQuery('currency');
  const allCurrencyData = allCurrencyRes?.data?.data?.data;
  console.log('allCurrencyData: ', allCurrencyData);
  console.log('All Currency: ', allCurrencyRes);
  const [expanded, setExpanded] = useState(1);

  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between', // Adjust as needed for layout
          mt: 2, // Margin top for spacing
          gap: 5,
          alignItems: 'center',
        }}
      >
        <Grid xs={12} md="auto">
          <CustomCrumbs heading="Currency" crums={false} />
        </Grid>
      </Box>
      <Box
        component={Paper}
        sx={{
          boxShadow: '0px 4px 20px #0F134914',
          overflow: 'hidden',
          borderRadius: '20px',
        }}
      >
        {allCurrencyData?.map((item: any, index: number) => (
          <CurrencyContent
            expanded={expanded}
            setExpanded={setExpanded}
            item={item}
            index={index}
            language={language}
          />
        ))}
      </Box>
    </Container>
  );
};
export default Currency;
