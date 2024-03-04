import { Box, Stack, TableCell, TableRow, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { enqueueSnackbar } from 'notistack';
import DetailsNavBar from '../products/DetailsNavBar';
import { LoadingButton } from '@mui/lab';
import FormProvider from 'src/components/hook-form/form-provider';
import { RHFTextField } from 'src/components/hook-form';
import { useUpdatePlanMutation } from 'src/redux/store/services/api';

const PlanPrice = ({ plan, showIcons, setShowIcons }: any) => {
  const [updatePlanReq, updatePlanRes] = useUpdatePlanMutation();
  const [openChangeFeature, setOpenChangeFeature] = useState(false);
  const UpdateFeatureSchema = Yup.object().shape({
    content: Yup.object().shape({
      AED: Yup.number().required('AED Price is required'),
      BHD: Yup.number().required('BHD Price is required'),
      EGP: Yup.number().required('EGP Price is required'),
      EUR: Yup.number().required('EUR Price is required'),
      GBP: Yup.number().required('GBP Price is required'),
      KWD: Yup.number().required('KWD Price is required'),
      OMR: Yup.number().required('OMR Price is required'),
      QAR: Yup.number().required('QAR Price is required'),
      SAR: Yup.number().required('SAR Price is required'),
      USD: Yup.number().required('USD Price is required'),
    }),
  });

  const methods = useForm({
    resolver: yupResolver(UpdateFeatureSchema),
    defaultValues: {
      content: {
        AED: plan?.price.AED ?? '',
        BHD: plan?.price.BHD ?? '',
        EGP: plan?.price.EGP ?? '',
        EUR: plan?.price.EUR ?? '',
        GBP: plan?.price.GBP ?? '',
        KWD: plan?.price.KWD ?? '',
        OMR: plan?.price.OMR ?? '',
        QAR: plan?.price.QAR ?? '',
        SAR: plan?.price.SAR ?? '',
        USD: plan?.price.USD ?? '',
      },
      // availableForBasic: feature.availableForBasic,
    },
  });
  const updatePlan = methods.handleSubmit(async (data) => {
    await updatePlanReq({
      id: plan._id, // Assuming each feature has a unique ID
      data: {
        name: plan?.name,
        price: data?.content,
        ...plan?.limitAccess,
        staffNumberFeature: {
          en: 's',
          ar: '',
          es: '',
          tr: '',
          fr: '',
        },
        withFreeDomainFeature: {
          en: 's',
          ar: '',
          es: '',
          tr: '',
          fr: '',
        },
        branchNumberFeature: {
          en: 's',
          ar: '',
          es: '',
          tr: '',
          fr: '',
        },
      },
    }).unwrap();
  });
  useEffect(() => {
    if (openChangeFeature) {
      methods.reset({
        content: {
          AED: plan?.price.AED ?? '',
          BHD: plan?.price.BHD ?? '',
          EGP: plan?.price.EGP ?? '',
          EUR: plan?.price.EUR ?? '',
          GBP: plan?.price.GBP ?? '',
          KWD: plan?.price.KWD ?? '',
          OMR: plan?.price.OMR ?? '',
          QAR: plan?.price.QAR ?? '',
          SAR: plan?.price.SAR ?? '',
          USD: plan?.price.USD ?? '',
        },
      });
    }
  }, [openChangeFeature, methods.reset]);
  useEffect(() => {
    // Handle API call responses
    if (updatePlanRes.isSuccess) {
      enqueueSnackbar('Feature updated successfully', { variant: 'success' });
      setOpenChangeFeature(false); // Close the modal on successful update
    }
    if (updatePlanRes.isError) {
      enqueueSnackbar('Failed to update the feature', { variant: 'error' });
    }
  }, [updatePlanRes]);

  return (
    <TableRow
      sx={{ textAlign: 'start !important', display: 'flex', alignItems: 'center', gap: '20px' }}
    >
      <TableCell
        onMouseOver={() => setShowIcons(1)}
        sx={{
          borderBottomStyle: 'none',
          lineHeight: '25px',
          padding: '0',
          fontSize: '16px',
          fontWeight: 'bold',
          textAlign: 'start',
        }}
        align="right"
      >
        {`${plan?.price[plan?.price?.iso3c]} ${plan?.price?.iso3c}`}
      </TableCell>
      <Box component={'span'} sx={{ display: 'flex', gap: '10px' }}>
        <EditIcon
          onClick={() => {
            setOpenChangeFeature(true);
            setShowIcons(false);
          }}
          style={{ cursor: 'pointer' }}
        />
      </Box>
      <DetailsNavBar
        open={openChangeFeature}
        onClose={() => setOpenChangeFeature(false)}
        title={`Update Your Plan Price`}
        actions={
          <Stack alignItems="center" justifyContent="center" spacing="10px">
            <LoadingButton
              fullWidth
              variant="soft"
              color="success"
              size="large"
              loading={methods.formState.isSubmitting}
              onClick={() => {
                updatePlan();
                setOpenChangeFeature(false);
              }}
              sx={{ borderRadius: '30px' }}
            >
              Update
            </LoadingButton>
          </Stack>
        }
      >
        <FormProvider methods={methods} onSubmit={updatePlan}>
          <Box width="100%">
            <Typography
              component="p"
              noWrap
              variant="subtitle2"
              sx={{ opacity: 0.7, fontSize: '.9rem', maxWidth: { xs: '120px', md: '218px' } }}
            >
              AED
            </Typography>
            <RHFTextField fullWidth variant="filled" name="content.AED" />
            <Typography
              component="p"
              noWrap
              variant="subtitle2"
              sx={{ opacity: 0.7, fontSize: '.9rem', maxWidth: { xs: '120px', md: '218px' } }}
            >
              BHD
            </Typography>
            <RHFTextField fullWidth variant="filled" name="content.BHD" />
            <Typography
              component="p"
              noWrap
              variant="subtitle2"
              sx={{ opacity: 0.7, fontSize: '.9rem', maxWidth: { xs: '120px', md: '218px' } }}
            >
              EGP
            </Typography>
            <RHFTextField fullWidth variant="filled" name="content.EGP" />
            <Typography
              component="p"
              noWrap
              variant="subtitle2"
              sx={{ opacity: 0.7, fontSize: '.9rem', maxWidth: { xs: '120px', md: '218px' } }}
            >
              EUR
            </Typography>
            <RHFTextField fullWidth variant="filled" name="content.EUR" />
            <Typography
              component="p"
              noWrap
              variant="subtitle2"
              sx={{ opacity: 0.7, fontSize: '.9rem', maxWidth: { xs: '120px', md: '218px' } }}
            >
              GBP
            </Typography>
            <RHFTextField fullWidth variant="filled" name="content.GBP" />
            <Typography
              component="p"
              noWrap
              variant="subtitle2"
              sx={{ opacity: 0.7, fontSize: '.9rem', maxWidth: { xs: '120px', md: '218px' } }}
            >
              KWD
            </Typography>
            <RHFTextField fullWidth variant="filled" name="content.KWD" />
            <Typography
              component="p"
              noWrap
              variant="subtitle2"
              sx={{ opacity: 0.7, fontSize: '.9rem', maxWidth: { xs: '120px', md: '218px' } }}
            >
              OMR
            </Typography>
            <RHFTextField fullWidth variant="filled" name="content.OMR" />
            <Typography
              component="p"
              noWrap
              variant="subtitle2"
              sx={{ opacity: 0.7, fontSize: '.9rem', maxWidth: { xs: '120px', md: '218px' } }}
            >
              QAR
            </Typography>
            <RHFTextField fullWidth variant="filled" name="content.QAR" />
            <Typography
              component="p"
              noWrap
              variant="subtitle2"
              sx={{ opacity: 0.7, fontSize: '.9rem', maxWidth: { xs: '120px', md: '218px' } }}
            >
              SAR
            </Typography>
            <RHFTextField fullWidth variant="filled" name="content.SAR" />
            <Typography
              component="p"
              noWrap
              variant="subtitle2"
              sx={{ opacity: 0.7, fontSize: '.9rem', maxWidth: { xs: '120px', md: '218px' } }}
            >
              USD
            </Typography>
            <RHFTextField fullWidth variant="filled" name="content.USD" />
          </Box>
        </FormProvider>
      </DetailsNavBar>
    </TableRow>
  );
};
export default PlanPrice;
