'use client';
import { yupResolver } from '@hookform/resolvers/yup';
import AddIcon from '@mui/icons-material/Add';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Container, Grid, Stack, Switch, Typography } from '@mui/material';
import { useParams } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { RHFCheckbox, RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import { useSettingsContext } from 'src/components/settings';
import {
  useAddNewFeatureMutation,
  useGetAllBussinessCategouryQuery,
  useGetPlansByCatQuery,
} from 'src/redux/store/services/api';
import FinancialPlanCard from 'src/sections/plans/FinancialCard';
import DetailsNavBar from 'src/sections/products/DetailsNavBar';
import * as Yup from 'yup';

const page = () => {
  const settings = useSettingsContext();
  const { categoury } = useParams();
  const [openAddFeature, setOpenAddFeature] = useState(false);
  const [addFeatureReq, addFeatureRes] = useAddNewFeatureMutation();
  const allBussinessCategouryRes = useGetAllBussinessCategouryQuery();
  const select =
    !!allBussinessCategouryRes?.data?.data?.data &&
    Object?.values(allBussinessCategouryRes?.data?.data?.data)?.findIndex(
      (item, index) => item?.uniqueName?.toLowerCase() === categoury
    );
  const response = useGetPlansByCatQuery(
    allBussinessCategouryRes.data?.data?.data[select]?.uniqueName
  );
  const [features, setFeatures] = useState(response?.data?.data?.feature);
  const [isMonthly, setIsMonthly] = useState(true);
  const AddFeatureSchema = Yup.object().shape({
    content: Yup.object().shape({
      en: Yup.string().required('English content is required'),
      ar: Yup.string().required('Arabic content is required'),
      es: Yup.string().required('Spanish content is required'),
      tr: Yup.string().required('Turkish content is required'),
      fr: Yup.string().required('France content is required'),
    }),
    availableForAdvance: Yup.boolean(),
    availablePro: Yup.boolean(),
    // availableForBasic: Yup.boolean(),
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
      availableForAdvance: false, // Default value for availableForPro
      availablePro: false, // Default value for availableForBasic
      // availableForBasic: false, // Default value for availableForBasic
    },
  });
  const {
    reset: resetAddFeatureForm,
    handleSubmit: handleAddFeatureSubmit,
    formState: { isSubmitting: isSubmittingAddFeature },
    control,
  } = addFeatureMethods;

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
        // availableForBasic: false, // Default value for availableForPro
        availableForAdvance: false, // Default value for availableForBasic
        availablePro: false, // Default value for availableForBasic
      }); // Reset the form when the modal is closed
    }
  }, [openAddFeature, resetAddFeatureForm]);

  useEffect(() => {
    if (addFeatureRes.isSuccess) {
      enqueueSnackbar('Feature added successfully', { variant: 'success' });
    }
    if (addFeatureRes.isError) {
      enqueueSnackbar('Cannot add the feature', { variant: 'error' });
    }
  }, [addFeatureRes, resetAddFeatureForm]);

  const onAddFeature = handleAddFeatureSubmit(async (data) => {
    const link = categoury.toString();
    await addFeatureReq({
      category: link[0]?.toUpperCase() + link.slice(1),
      features: [data],
    }).unwrap();
    setOpenAddFeature(false);
  });
  useEffect(() => {
    setFeatures(response?.data?.data?.feature);
  }, [response?.data?.data?.feature]);
  return (
    <>
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography
            sx={{
              fontSize: '24px',
              fontWeight: 900,
              color: settings?.themeMode === 'dark' ? '#fff' : '#0F1349',
              mt: 1.5,
            }}
          >
            Subscription Plan
          </Typography>
          <Typography sx={{ color: '#8688A3', mt: 0.7, height: { xs: '48px', sm: '24px' } }}>
            Choose your subscription plan that fit your business.
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', m: '15px 0' }}>
            <Typography>Monthly</Typography>
            <Switch
              inputProps={{ 'aria-label': 'Month' }}
              checked={!isMonthly}
              onChange={() => setIsMonthly((val) => !val)}
              style={{ '& .MuiSwitch-track': { backgroundColor: '#1BFCB6' } }}
            />
            <Typography>Yearly</Typography>
          </Box>
          <Button
            sx={{
              heigth: '60px',
              borderRadius: '20px',
              alignSelf: 'flex-end',
              gap: '10px',
              background: '#1BFCB6',
              '&:hover': {
                background: '#19c6a0',
              },
              p: { xs: '4px 8px', sm: '6px 10px', md: '8px 16px' },
              top: { xs: '120px', sm: '90px' },
              minWidth: '32px',
              right: { xs: '10px', sm: '20px' },
              position: 'absolute',
            }}
            onClick={() => setOpenAddFeature(true)}
          >
            <Typography sx={{ display: { xs: 'none', sm: 'flex' } }}>Add New Feature</Typography>
            <AddIcon />
          </Button>
        </Box>
        <Grid
          container
          spacing={4}
          sx={{
            pt: 2,
            height: '660px',
            boxSizing: 'border-box',
            display: 'flex',
            justifyContent: {
              sm: 'start',
              md:
                response?.data?.data?.plans?.filter(
                  (item: any) =>
                    item?.type != 'basic' &&
                    (isMonthly ? item?.durationType == 'monthly' : item?.durationType != 'monthly')
                )?.length > 2
                  ? 'start !important'
                  : 'center !important',
            },
            ml: 0,
            margin: '0 !important',
            overflowX: 'auto',
            width: '100%',
            overflowY: 'hidden',
            scrollbarWidth: 'thin',
          }}
        >
          <Box
            sx={{
              position: 'relative',
              boxSizing: 'border-box',
              gap: { xs: 2, sm: 3 },
              padding: '10px',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: {
                sm: 'start',
                md:
                  response?.data?.data?.plans?.filter(
                    (item: any) =>
                      item?.type != 'basic' &&
                      (isMonthly
                        ? item?.durationType == 'monthly'
                        : item?.durationType != 'monthly')
                  )?.length > 2
                    ? 'start !important'
                    : 'center !important',
              },
              alignItems: 'center',
              width: '100%',
            }}
          >
            {response?.data?.data?.plans
              ?.filter(
                (item: any) =>
                  item?.type != 'basic' &&
                  (isMonthly ? item?.durationType == 'monthly' : item?.durationType != 'monthly')
              )
              ?.map((el: any) => (
                <Box sx={{ mb: '30px' }}>
                  <FinancialPlanCard
                    onAddFeature={onAddFeature}
                    plan={el}
                    features={features}
                    setFeatures={setFeatures}
                  />
                </Box>
              ))}
          </Box>
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
                onAddFeature();
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
            <RHFTextField fullWidth variant="filled" name="content.en" multiline rows={5} />
            <Typography
              component="p"
              noWrap
              variant="subtitle2"
              sx={{ opacity: 0.7, fontSize: '.9rem', maxWidth: { xs: '120px', md: '218px' } }}
            >
              AR
            </Typography>
            <RHFTextField fullWidth variant="filled" name="content.ar" multiline rows={5} />
            <Typography
              component="p"
              noWrap
              variant="subtitle2"
              sx={{ opacity: 0.7, fontSize: '.9rem', maxWidth: { xs: '120px', md: '218px' } }}
            >
              ES
            </Typography>
            <RHFTextField fullWidth variant="filled" name="content.es" multiline rows={5} />
            <Typography
              component="p"
              noWrap
              variant="subtitle2"
              sx={{ opacity: 0.7, fontSize: '.9rem', maxWidth: { xs: '120px', md: '218px' } }}
            >
              FR
            </Typography>
            <RHFTextField fullWidth variant="filled" name="content.fr" multiline rows={5} />
            <Typography
              component="p"
              noWrap
              variant="subtitle2"
              sx={{ opacity: 0.7, fontSize: '.9rem', maxWidth: { xs: '120px', md: '218px' } }}
            >
              TR
            </Typography>
            <RHFTextField fullWidth variant="filled" name="content.tr" multiline rows={5} />
            <Typography
              component="p"
              noWrap
              variant="subtitle2"
              sx={{ opacity: 0.7, fontSize: '.9rem', maxWidth: { xs: '120px', md: '218px' } }}
            >
              Avaliblity
            </Typography>
            <RHFCheckbox
              name="availableForAdvance"
              label="Available For Advance" // Assuming your RHFCheckbox supports a label prop
            />
            <RHFCheckbox name="availablePro" label="Available For Professional" />
            {/* <RHFCheckbox name="availableForBasic" label="Available For Basic" /> */}
          </Box>
        </FormProvider>
      </DetailsNavBar>
    </>
  );
};

export default page;
