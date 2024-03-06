'use client';
import { Box, Button, Container, Grid, Paper, Switch, Typography } from '@mui/material';
import CustomCrumbs from 'src/components/custom-crumbs/custom-crumbs';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { useParams, usePathname } from 'next/navigation';
import {
  useGetProductConfigurationQuery,
  useUpdateProductConfigurationMutation,
} from 'src/redux/store/services/api';
import { enqueueSnackbar } from 'notistack';

const Product = () => {
  const [productConfigReq, productConfigRes] = useUpdateProductConfigurationMutation();
  const pathname = usePathname().split('/')[2];
  const id = pathname[0].toUpperCase() + pathname?.slice(1);
  const tempData = useGetProductConfigurationQuery(id);
  const [formValues, setFormValues] = useState({ ...tempData?.data?.data });
  const [isUpdate, setIsUpdate] = useState(false);
  useEffect(() => {
    if (!isUpdate) setFormValues({ ...tempData?.data?.data });
  }, [tempData]);
  useEffect(() => {
    // Handle API call responses
    if (productConfigRes.isSuccess) {
      enqueueSnackbar('Feature updated successfully', { variant: 'success' });
    }
    if (productConfigRes.isError) {
      enqueueSnackbar('Failed to update the feature', { variant: 'error' });
    }
  }, [productConfigRes]);

  const data = [
    'Images',
    'Title',
    'Description',
    'Category',
    'Sub category',
    'Brand',
    'Sort',
    'Preparation Time',
    'Peparation Time Unit',
    'Ingredients',
    'Calories',
    'Style',
    'Season',
    'Occasion',
    'Fit',
    'Care Instructions',
    'Format',
    'File Size',
    'Author',
    'Duration',
    'Genre',
    'Release Date',
    'Quantity',
    'Sell Price',
    'Purchase Price',
    'Purchase Limit',
    'Barcode',
    'Sku',
    'Discount Type',
    'Discount Value',
    'Is Available On All Branhces',
    'Branches',
    'Varient Section',
  ];

  const changeFormValues = (key: any) => {
    let formData: any = { ...formValues };
    formData[key] = !formData[key];
    setFormValues(formData);
  };
  const updateProduct = () => {
    setIsUpdate(true);
    const { _id, businessCategory, __v, ...data } = formValues;
    productConfigReq({
      product: id,
      data: data,
    });
  };
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
        <Grid xs={12} md="auto" mb={2}>
          <CustomCrumbs heading="Product Configuration" crums={false} />
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
        <Box
          sx={{
            overflow: 'hidden',
            borderRadius: '20px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: '20px',
            boxSizing: 'border-box',
          }}
        >
          {data?.map((item): any => (
            <Box
              sx={{
                width: { xs: 'calc(100% - 30px)', sm: '235px' },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                m: '15px 20px',
              }}
            >
              <Typography sx={{ width: '220px' }}>{item}</Typography>
              <Switch
                inputProps={{ 'aria-label': 'Month' }}
                checked={formValues[`with${item?.replaceAll(' ', '')}`]}
                onChange={() => {
                  changeFormValues(`with${item?.replaceAll(' ', '')}`);
                }}
              />
            </Box>
          ))}
        </Box>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'end', p: '30px', pt: '15px' }}>
          <Button
            sx={{
              heigth: '54px',
              borderRadius: '20px',
              gap: '10px',
              background: '#1BFCB6',
              '&:hover': {
                background: '#19c6a0',
              },
              my: { xs: '15px', sm: 0 },
              p: { xs: '4px 8px', sm: '6px 10px', md: '8px 16px' },
              minWidth: '32px',
            }}
            onClick={() => {
              updateProduct();
            }}
          >
            Update
          </Button>
        </Box>
      </Box>
    </Container>
  );
};
export default Product;
