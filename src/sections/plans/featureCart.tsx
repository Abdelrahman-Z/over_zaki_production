'use client';
import { yupResolver } from '@hookform/resolvers/yup';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import EditIcon from '@mui/icons-material/Edit';
import { LoadingButton } from '@mui/lab';
import { Box, MenuItem, Select, Stack, TableCell, TableRow, Typography } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { RHFCheckbox, RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import { useUpdateFeatureMutation } from 'src/redux/store/services/api';
import * as Yup from 'yup';
import DetailsNavBar from '../products/DetailsNavBar';
const FeatureCart = ({
  feature,
  handleFeatureChange,
  setShowIcons,
  index,
  edit,
  setEdit,
  language,
  showIcons,
  plan,
  isFeature,
}: any) => {
  const checkAvailability: any = {
    // basic: 'availableForBasic',
    pro: 'availablePro',
    advance: 'availableForAdvance',
  };
  const [openChangeFeature, setOpenChangeFeature] = useState(false);
  const [updateFeatureReq, updateFeatureRes] = useUpdateFeatureMutation();

  const UpdateFeatureSchema = Yup.object().shape({
    content: Yup.object().shape({
      en: Yup.string().required('English content is required'),
      ar: Yup.string().required('Arabic content is required'),
      es: Yup.string().required('Spanish content is required'),
      tr: Yup.string().required('Turkish content is required'),
      fr: Yup.string().required('French content is required'),
    }),
    // availableForBasic: Yup.boolean().required('This field is required'),
    availablePro: Yup.boolean().required('This field is required'),
    availableForAdvance: Yup.boolean().required('This field is required'),
  });

  const methods = useForm({
    resolver: yupResolver(UpdateFeatureSchema),
    defaultValues: {
      content: {
        en: feature?.content?.en,
        ar: feature?.content?.ar,
        es: feature?.content?.es,
        tr: feature?.content?.tr,
        fr: feature?.content?.fr,
      },
      // availableForBasic: feature.availableForBasic,
      availablePro: feature.availablePro,
      availableForAdvance: feature.availableForAdvance,
    },
  });

  const updateFeature = methods.handleSubmit(async (data) => {
    await updateFeatureReq({
      id: feature._id, // Assuming each feature has a unique ID
      data: data,
    }).unwrap();
  });

  useEffect(() => {
    if (openChangeFeature) {
      methods.reset({
        content: {
          en: feature.content.en ?? '',
          ar: feature.content.ar ?? '',
          es: feature.content.es ?? '',
          tr: feature.content.tr ?? '',
          fr: feature.content.fr ?? '',
        },
        // availableForBasic: feature.availableForBasic ?? false,
        availablePro: feature.availablePro ?? false,
        availableForAdvance: feature.availableForAdvance ?? false,
      });
    }
  }, [openChangeFeature, feature, methods.reset]);

  useEffect(() => {
    // Handle API call responses
    if (updateFeatureRes.isSuccess) {
      enqueueSnackbar('Feature updated successfully', { variant: 'success' });
      setOpenChangeFeature(false); // Close the modal on successful update
    }
    if (updateFeatureRes.isError) {
      enqueueSnackbar('Failed to update the feature', { variant: 'error' });
    }
  }, [updateFeatureRes]);
  const valTrue: any = true;
  const valFalse: any = false;
  const fontsize: any = { xs: '23px !important', sm: '29px !important' };
  return (
    <>
      {/* Display the feature title */}

      <TableRow
        onMouseOver={() => {
          setShowIcons(index + 3);
        }}
        onMouseLeave={() => setShowIcons(false)}
        sx={{
          display: 'flex',
          alignItems: 'start',
          height: '22.5px',
          m: '20px 0 !important',
        }}
      >
        {edit?.no === index + 3 && edit?.status === 'icon' ? (
          <Select
            defaultValue={!!feature?.[checkAvailability?.[plan.type]]}
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              width: '24px',
              height: '22px',
              '& .MuiInputBase-input': {
                width: '24px',
                height: '22px',
                padding: '0 !important',
              },
              '& .MuiSelect-icon': {
                display: 'none', // Hide the legend element which typically contains the arrow icon
              },
            }}
            displayEmpty
            inputProps={{ 'aria-label': 'Without label' }}
          >
            <MenuItem value={valTrue}>
              <DoneIcon
                onClick={() => {
                  handleFeatureChange({
                    ...feature,
                    [checkAvailability?.[plan.type]]: true,
                  });
                  updateFeature({
                    ...feature,
                    [checkAvailability?.[plan.type]]: true,
                  });
                  setEdit(false);
                }}
                style={{
                  fontSize: fontsize,
                  color: '1BFCB6',
                }}
              />
            </MenuItem>
            <MenuItem value={valFalse}>
              <CloseIcon
                color="error"
                style={{
                  fontSize: fontsize,
                }}
                onClick={() => {
                  handleFeatureChange({
                    ...feature,
                    [checkAvailability?.[plan.type]]: false,
                  });
                  updateFeature({
                    ...feature,
                    [checkAvailability?.[plan.type]]: false,
                  });
                  setEdit(false);
                }}
              />
            </MenuItem>
          </Select>
        ) : !!feature?.[checkAvailability?.[plan.type]] ? (
          <DoneIcon
            onMouseOver={() => {
              setEdit({ no: index + 3, status: 'icon' });
            }}
            style={{
              fontSize: fontsize,
              color: '#1BFCB6',
            }}
          />
        ) : (
          <CloseIcon
            color="error"
            onMouseOver={() => {
              setEdit({ no: index + 3, status: 'icon' });
            }}
            style={{
              fontSize: fontsize,
            }}
          />
        )}
        <TableCell
          sx={{
            p: 0,
            pl: { xs: 1, sm: 2, textAlign: 'start' },
            borderBottomStyle: 'none',
            lineHeight: '22px',
            color: '#8688A3',
            mb: 0,
          }}
          align="right"
        >
          <Box component={'span'} sx={{ width: '100%', display: 'flex', gap: '30px' }}>
            <Typography
              onMouseOver={() => {
                setEdit({ no: index + 3, status: 'input' });
              }}
            >
              {feature?.content?.[language] || feature?.content}
            </Typography>
            {showIcons === index + 3 ? (
              <Box component={'span'} sx={{ display: 'flex', gap: '10px' }}>
                <EditIcon
                  onClick={() => setOpenChangeFeature(true)}
                  style={{ cursor: 'pointer' }}
                />
              </Box>
            ) : (
              false
            )}
          </Box>
        </TableCell>
      </TableRow>

      <DetailsNavBar
        open={openChangeFeature}
        onClose={() => setOpenChangeFeature(false)}
        title={`Update Your Plan`}
        actions={
          <Stack alignItems="center" justifyContent="center" spacing="10px">
            <LoadingButton
              fullWidth
              variant="soft"
              color="success"
              size="large"
              loading={methods.formState.isSubmitting}
              onClick={() => {
                updateFeature();
                setOpenChangeFeature(false);
              }}
              sx={{ borderRadius: '30px' }}
            >
              Update
            </LoadingButton>
          </Stack>
        }
      >
        <FormProvider methods={methods} onSubmit={updateFeature}>
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
            {isFeature && (
              <>
                <Typography
                  component="p"
                  noWrap
                  variant="subtitle2"
                  sx={{ opacity: 0.7, fontSize: '.9rem', maxWidth: { xs: '120px', md: '218px' } }}
                >
                  Avaliblity
                </Typography>
                <RHFCheckbox name="availablePro" label="available For Professional" />
                <RHFCheckbox name="availableForAdvance" label="available For Advance" />
              </>
            )}
          </Box>
        </FormProvider>
      </DetailsNavBar>
    </>
  );
};

export default FeatureCart;
