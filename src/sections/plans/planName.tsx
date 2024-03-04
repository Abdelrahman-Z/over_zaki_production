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

const PlanName = ({ plan, setShowIcons }: any) => {
  const [updatePlanReq, updatePlanRes] = useUpdatePlanMutation();
  const [openChangeFeature, setOpenChangeFeature] = useState(false);
  const UpdateFeatureSchema = Yup.object().shape({
    content: Yup.object().shape({
      en: Yup.string().required('English content is required'),
      ar: Yup.string().required('Arabic content is required'),
      es: Yup.string().required('Spanish content is required'),
      tr: Yup.string().required('Turkish content is required'),
      fr: Yup.string().required('French content is required'),
    }),
  });

  const methods = useForm({
    resolver: yupResolver(UpdateFeatureSchema),
    defaultValues: {
      content: {
        en: plan?.name.en ?? '',
        ar: plan?.name.ar ?? '',
        es: plan?.name.es ?? '',
        fr: plan?.name.fr ?? '',
        tr: plan?.name.tr ?? '',
      },
    },
  });
  const { choosenPrice, _id, iso3c, ...price } = plan?.price;
  const updatePlan = methods.handleSubmit(async (data) => {
    await updatePlanReq({
      id: plan._id, // Assuming each feature has a unique ID
      data: {
        name: data?.content,
        price: price,
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
          en: plan?.name.en ?? '',
          ar: plan?.name.ar ?? '',
          es: plan?.name.es ?? '',
          fr: plan?.name.fr ?? '',
          tr: plan?.name.tr ?? '',
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
        sx={{
          borderBottomStyle: 'none',
          padding: '1px',
          fontSize: '20px',
          fontWeight: 'bold',
        }}
        onMouseOver={() => setShowIcons(2)}
      >
        {plan?.name?.en}
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
        title={`Update Your Plan Name`}
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
              EN
            </Typography>
            <RHFTextField fullWidth variant="filled" name="content.en" />
            <Typography
              component="p"
              noWrap
              variant="subtitle2"
              sx={{ opacity: 0.7, fontSize: '.9rem', maxWidth: { xs: '120px', md: '218px' } }}
            >
              AR
            </Typography>
            <RHFTextField fullWidth variant="filled" name="content.ar" />
            <Typography
              component="p"
              noWrap
              variant="subtitle2"
              sx={{ opacity: 0.7, fontSize: '.9rem', maxWidth: { xs: '120px', md: '218px' } }}
            >
              ES
            </Typography>
            <RHFTextField fullWidth variant="filled" name="content.es" />
            <Typography
              component="p"
              noWrap
              variant="subtitle2"
              sx={{ opacity: 0.7, fontSize: '.9rem', maxWidth: { xs: '120px', md: '218px' } }}
            >
              FR
            </Typography>
            <RHFTextField fullWidth variant="filled" name="content.fr" />
            <Typography
              component="p"
              noWrap
              variant="subtitle2"
              sx={{ opacity: 0.7, fontSize: '.9rem', maxWidth: { xs: '120px', md: '218px' } }}
            >
              TR
            </Typography>
            <RHFTextField fullWidth variant="filled" name="content.tr" />
          </Box>
        </FormProvider>
      </DetailsNavBar>
    </TableRow>
  );
};
export default PlanName;
