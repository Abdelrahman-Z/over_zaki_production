'use client';
import React, { useEffect, useState } from 'react';
// import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { enqueueSnackbar } from 'notistack';
import { useUpdateFeatureMutation } from 'src/redux/store/services/api';
import DetailsNavBar from '../products/DetailsNavBar';
import { IconButton, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import FormProvider from 'src/components/hook-form/form-provider';
import { RHFCheckbox, RHFTextField } from 'src/components/hook-form';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import {
  Box,
  FormControl,
  MenuItem,
  Select,
  Stack,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
const FeatureCart = ({
  feature,
  type,
  handleFeatureChange,
  setShowIcons,
  index,
  edit,
  setEdit,
  language,
  showIcons,
  plan,
}: any) => {
  const checkAvailability: any = {
    basic: 'availableForBasic',
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
    availableForBasic: Yup.boolean().required('This field is required'),
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
      availableForBasic: feature.availableForBasic,
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
        availableForBasic: feature.availableForBasic ?? false,
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
  return (
    <>
      {/* Display the feature title */}

      {/* <ListItem>
        <ListItemIcon>
          <Select
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              //   width: '24px',
              //   height: '22px',
              '& .MuiInputBase-input': {
                width: '24px',
                height: '22px',
                padding: '5px !important',
              },
              '& .MuiSelect-icon': {
                display: 'none', // Hide the legend element which typically contains the arrow icon
              },
            }}
            displayEmpty
            inputProps={{ 'aria-label': 'Without label' }}
            defaultValue={!!feature?.[checkAvailability?.[type]]}
          >
            <MenuItem value={true}>
              <DoneIcon
                // onClick={() => {
                //   handleFeatureChange({
                //     ...feature,
                //     [checkAvailability?.[plan.type]]: true,
                //   });
                //   updateFeature({
                //     ...feature,
                //     [checkAvailability?.[plan.type]]: true,
                //   });
                //   setEdit(false);
                // }}
                sx={{
                  fontSize: { xs: '25px', sm: '24px' },
                  color: '#1BFCB6',
                }}
              />
            </MenuItem>
            <MenuItem
              //   onClick={() => {
              //     handleFeatureChange({
              //       ...feature,
              //       [checkAvailability?.[plan.type]]: false,
              //     });
              //     updateFeature({
              //       ...feature,
              //       [checkAvailability?.[plan.type]]: false,
              //     });
              //     setEdit(false);
              //   }}
              // style={{
              //   fontSize: { xs: '23px !important', sm: '29px !important' },
              //   color: '1BFCB6',
              // }}
              value={false}
            >
              <CloseIcon
                color="error"
                style={{
                  fontSize: { xs: '23px !important', sm: '29px !important' },
                }}
              />
            </MenuItem>
          </Select>
        </ListItemIcon>
        <ListItemText primary={feature.content.en} />
        <IconButton edge="end" aria-label="edit" onClick={() => setOpenChangeFeature(true)}>
          <EditIcon />
        </IconButton>
      </ListItem> */}

      <TableRow
        onMouseOver={() => {
          setShowIcons(index + 1);
        }}
        onMouseLeave={() => setShowIcons(false)}
        sx={{
          display: 'flex',
          alignItems: 'start',
          height: '22.5px',
          m: '20px 0 !important',
        }}
      >
        {edit?.no === index + 1 && edit?.status === 'icon' ? (
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
            <MenuItem value={true}>
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
                  fontSize: { xs: '23px !important', sm: '29px !important' },
                  color: '1BFCB6',
                }}
              />
            </MenuItem>
            <MenuItem
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
              style={{
                fontSize: { xs: '23px !important', sm: '29px !important' },
                color: '1BFCB6',
              }}
              value={false}
            >
              <CloseIcon
                color="error"
                style={{
                  // color: 'red !important',
                  fontSize: { xs: '23px !important', sm: '29px !important' },
                }}
              />
            </MenuItem>
          </Select>
        ) : !!feature?.[checkAvailability?.[plan.type]] ? (
          <DoneIcon
            onMouseOver={() => {
              setEdit({ no: index + 1, status: 'icon' });
            }}
            style={{
              fontSize: { xs: '23px !important', sm: '29px !important' },
              color: '#1BFCB6',
            }}
          />
        ) : (
          <CloseIcon
            color="error"
            onMouseOver={() => {
              setEdit({ no: index + 1, status: 'icon' });
            }}
            style={{
              fontSize: { xs: '23px !important', sm: '29px !important' },
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
                setEdit({ no: index + 1, status: 'input' });
              }}
            >
              {feature?.content?.[language] || feature?.content}
            </Typography>
            {showIcons === index + 1 ? (
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
            <Typography
              component="p"
              noWrap
              variant="subtitle2"
              sx={{ opacity: 0.7, fontSize: '.9rem', maxWidth: { xs: '120px', md: '218px' } }}
            >
              Avaliblity
            </Typography>
            <RHFCheckbox
              name="availableForBasic"
              label="Available For Basic" // Assuming your RHFCheckbox supports a label prop
            />
            <RHFCheckbox name="availablePro" label="available For Professional" />
            <RHFCheckbox name="availableForAdvance" label="available For Advance" />
          </Box>
        </FormProvider>
      </DetailsNavBar>
    </>
  );
};

export default FeatureCart;
