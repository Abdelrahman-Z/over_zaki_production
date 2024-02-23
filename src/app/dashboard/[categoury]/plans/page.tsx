'use client'
import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import { Box, Button, Container, Grid, Stack, Switch, Typography } from '@mui/material'
import { useParams } from 'next/navigation'
import { enqueueSnackbar } from 'notistack'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { RoleBasedGuard } from 'src/auth/guard'
import { BottomActions } from 'src/components/bottom-actions'
import CustomCrumbs from 'src/components/custom-crumbs/custom-crumbs'
import { RHFCheckbox, RHFTextField } from 'src/components/hook-form'
import FormProvider from 'src/components/hook-form/form-provider'
import { useAddNewFeatureMutation, useGetPlansByCatQuery } from 'src/redux/store/services/api'
import FinancialPlanCard from 'src/sections/plans/FinancialCard'
import DetailsNavBar from 'src/sections/products/DetailsNavBar'
import * as Yup from 'yup';


const page = () => {
  const { categoury } = useParams()
  const response = useGetPlansByCatQuery(categoury.toString().toLowerCase())
  const [openAddFeature, setOpenAddFeature] = useState(false)
  const [addFeatureReq, addFeatureRes] = useAddNewFeatureMutation();

  // console.log(response)
  const AddFeatureSchema = Yup.object().shape({
    content: Yup.object().shape({
      en: Yup.string().required('English content is required'),
      ar: Yup.string().required('Arabic content is required'),
      es: Yup.string().required('Spanish content is required'),
      tr: Yup.string().required('Turkish content is required'),
      fr: Yup.string().required('France content is required'),
    }),
    availableForYearlyPro: Yup.boolean(),
    availableForMonthlyPro: Yup.boolean(),
    availableForFree: Yup.boolean(),
  });
  const addFeatureMethods = useForm({
    resolver: yupResolver(AddFeatureSchema),
    defaultValues: {
      content: {
        en: '', // Default value for English content
        ar: '', // Default value for Arabic content
        es: '', // Default value for Spanish content
        tr: '', // Default value for Spanish content
        fr: '', // Default value for Spanish content
      },
      availableForYearlyPro: false, // Default value for availableForPro
      availableForMonthlyPro: false, // Default value for availableForFree
      availableForFree: false, // Default value for availableForFree
    }
  });
  const {
    reset: resetAddFeatureForm,
    handleSubmit: handleAddFeatureSubmit,
    formState: { isSubmitting: isSubmittingAddFeature },
    control,
  } = addFeatureMethods

  useEffect(() => {
    if (!openAddFeature) {
      resetAddFeatureForm({
        content: {
          en: '', // Default value for English content
          ar: '', // Default value for Arabic content
          es: '', // Default value for Spanish content
          tr: '', // Default value for Spanish content
          fr: '', // Default value for Spanish content
        },
        availableForFree: false, // Default value for availableForPro
        availableForYearlyPro: false, // Default value for availableForFree
        availableForMonthlyPro: false, // Default value for availableForFree
      }); // Reset the form when the modal is closed
    }
  }, [openAddFeature, resetAddFeatureForm]);

  useEffect(() => {
    if (addFeatureRes.isSuccess) {
      enqueueSnackbar('Feature added successfully', { variant: "success" });
    }
    if (addFeatureRes.isError) {
      enqueueSnackbar('Cannot add the feature', { variant: "error" });
    }
  }, [addFeatureRes, resetAddFeatureForm]);

  const onAddFeature = handleAddFeatureSubmit(async (data) => {
    await addFeatureReq({
      category: categoury.toString().toLowerCase(),
      features: [data]
    }).unwrap();
  });


  return (
    <>
      <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between', // Adjust as needed for layout
            mt: 2, // Margin top for spacing
            gap: 5,
            alignItems: 'center',
          }}
        >
          <Grid xs={12} md="auto">
            <CustomCrumbs heading="Plans" crums={false} />
          </Grid>
          <Grid sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <BottomActions>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                alignItems="center"
                justifyContent={{ xs: 'flex-start', sm: 'flex-end' }}
                spacing="20px"
                sx={{ width: '100%', maxWidth: { xs: '100%', md: '250px' } }}
              >
                <Button
                  startIcon="+"
                  fullWidth
                  sx={{ borderRadius: '30px', color: '#0F1349' }}
                  component="button"
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setOpenAddFeature(true)
                  }}
                >
                  Add New Feature
                </Button>
              </Stack>
            </BottomActions>
          </Grid>
        </Box> */}
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography sx={{ fontSize: '24px', fontWeight: 900, color: '#0F1349', mt: 1.5 }}>Subscription Plan</Typography>
          <Typography sx={{ color: '#8688A3', mt: 0.7 }}>Choose your subscription plan that fit your business.</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', m: '15px 0' }}>
            <Typography>Monthly</Typography>
            <Switch inputProps={{ 'aria-label': 'Month' }} defaultChecked style={{ '& .MuiSwitch-track': { backgroundColor: '#1BFCB6' } }} />
            <Typography>Yearly</Typography>
          </Box>
        </Box>
        <Grid container spacing={4} sx={{
          marginTop: '15px',
          height: '610px',
          boxSizing: 'border-box',
          display: 'flex',
          ml: 0,
          overflowX: 'auto', width: '100%',
          overflowY: 'noScroll'
        }}>
          <Box sx={{
            position: 'relative',
            boxSizing: 'border-box',
            gap: { xs: 2, sm: 3 },
            display: 'flex', height: '610px',
            flexDirection: 'row',
            justifyContent: { sm: 'start', md: 'center' },
            alignItems: 'center',
            width: { xs: '820px', sm: '850px' }
          }}>
            {/* {!!response?.data?.data?.plans && Object.values(response?.data?.data?.plans)?.filter((item, index) => index < 2)?.map((el: any) =>  */}
            <FinancialPlanCard />
            <FinancialPlanCard />
          </Box>
        {/* )} */}
        </Grid>
      </Container>
      <DetailsNavBar
        open={openAddFeature}
        onClose={() => setOpenAddFeature(false)}
        title={`Add Feature To Your Plan`}
        actions={
          <Stack alignItems="center" justifyContent="center" spacing="10px">
            <LoadingButton
              fullWidth
              variant="soft"
              color="success"
              size="large"
              loading={isSubmittingAddFeature}
              onClick={() => {
                onAddFeature()
                setOpenAddFeature(false)
              }}
              sx={{ borderRadius: '30px' }}
            >
              Add
            </LoadingButton>
          </Stack>
        }
      >
        <FormProvider methods={addFeatureMethods} onSubmit={onAddFeature}>
          <Box width="100%">
            <Typography
              component="p"
              noWrap
              variant="subtitle2"
              sx={{ opacity: 0.7, fontSize: '.9rem', maxWidth: { xs: '120px', md: '218px' } }}
            >
              EN
            </Typography>
            <RHFTextField
              fullWidth
              variant="filled"
              name="content.en"
              multiline
              rows={5}
            />
            <Typography
              component="p"
              noWrap
              variant="subtitle2"
              sx={{ opacity: 0.7, fontSize: '.9rem', maxWidth: { xs: '120px', md: '218px' } }}
            >
              AR
            </Typography>
            <RHFTextField
              fullWidth
              variant="filled"
              name="content.ar"
              multiline
              rows={5}
            />
            <Typography
              component="p"
              noWrap
              variant="subtitle2"
              sx={{ opacity: 0.7, fontSize: '.9rem', maxWidth: { xs: '120px', md: '218px' } }}
            >
              ES
            </Typography>
            <RHFTextField
              fullWidth
              variant="filled"
              name="content.es"
              multiline
              rows={5}
            />
            <Typography
              component="p"
              noWrap
              variant="subtitle2"
              sx={{ opacity: 0.7, fontSize: '.9rem', maxWidth: { xs: '120px', md: '218px' } }}
            >
              FR
            </Typography>
            <RHFTextField
              fullWidth
              variant="filled"
              name="content.fr"
              multiline
              rows={5}
            />
            <Typography
              component="p"
              noWrap
              variant="subtitle2"
              sx={{ opacity: 0.7, fontSize: '.9rem', maxWidth: { xs: '120px', md: '218px' } }}
            >
              TR
            </Typography>
            <RHFTextField
              fullWidth
              variant="filled"
              name="content.tr"
              multiline
              rows={5}
            />
            <Typography
              component="p"
              noWrap
              variant="subtitle2"
              sx={{ opacity: 0.7, fontSize: '.9rem', maxWidth: { xs: '120px', md: '218px' } }}
            >
              Avaliblity
            </Typography>
            <RHFCheckbox
              name="availableForYearlyPro"
              label="Available for Yearly Pro" // Assuming your RHFCheckbox supports a label prop
            />
            <RHFCheckbox
              name="availableForMonthlyPro"
              label="Available For MonthlyPro"
            />
            <RHFCheckbox
              name="availableForFree"
              label="Available For Free"
            />
          </Box>
        </FormProvider>
      </DetailsNavBar>
    </>
  )
}

export default page