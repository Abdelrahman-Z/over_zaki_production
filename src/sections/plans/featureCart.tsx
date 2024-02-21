'use client'
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { enqueueSnackbar } from 'notistack';
import { useUpdateFeatureMutation } from 'src/redux/store/services/api';
import DetailsNavBar from '../products/DetailsNavBar';
import { IconButton, ListItem, ListItemIcon, ListItemText, Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import FormProvider from 'src/components/hook-form/form-provider';
import { RHFCheckbox, RHFTextField } from 'src/components/hook-form';
import { CheckCircleOutline } from '@mui/icons-material';


const FeatureCart = ({ feature }: any) => {
    const [openChangeFeature, setOpenChangeFeature] = useState(false);
    const [updateFeatureReq, updateFeatureRes] = useUpdateFeatureMutation()

    const UpdateFeatureSchema = Yup.object().shape({
        content: Yup.object().shape({
            en: Yup.string().required('English content is required'),
            ar: Yup.string().required('Arabic content is required'),
            es: Yup.string().required('Spanish content is required'),
            tr: Yup.string().required('Turkish content is required'),
            fr: Yup.string().required('French content is required'),
        }),
        availableForYearlyPro: Yup.boolean().required('This field is required'),
        availableForMonthlyPro: Yup.boolean().required('This field is required'),
        availableForFree: Yup.boolean().required('This field is required'),
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
            availableForYearlyPro: feature.availableForYearlyPro,
            availableForMonthlyPro: feature.availableForMonthlyPro,
            availableForFree: feature.availableForFree,
        }
    });


    const updateFeature = methods.handleSubmit(async (data) => {
        await updateFeatureReq({
            id: feature._id, // Assuming each feature has a unique ID
            data: data
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
                availableForYearlyPro: feature.availableForYearlyPro ?? false,
                availableForMonthlyPro: feature.availableForMonthlyPro ?? false,
                availableForFree: feature.availableForFree ?? false,
            });
        }
    }, [openChangeFeature, feature, methods.reset]);



    useEffect(() => {
        // Handle API call responses
        if (updateFeatureRes.isSuccess) {
            enqueueSnackbar('Feature updated successfully', { variant: "success" });
            setOpenChangeFeature(false); // Close the modal on successful update
        }
        if (updateFeatureRes.isError) {
            enqueueSnackbar('Failed to update the feature', { variant: "error" });
        }
    }, [updateFeatureRes]);

    return (
        <>
            {/* Display the feature title */}
            <ListItem>
                <ListItemIcon>
                    <CheckCircleOutline color="success" />
                </ListItemIcon>
                <ListItemText primary={feature.content.en} />
                <IconButton edge="end" aria-label="edit"  onClick={() => setOpenChangeFeature(true)}>
                    <EditIcon />
                </IconButton>
            </ListItem>
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
                                updateFeature()
                                setOpenChangeFeature(false)
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
                        <RHFTextField
                            fullWidth
                            variant="filled"
                            name="content.en"

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
                            label="Available for yearly Pro" // Assuming your RHFCheckbox supports a label prop
                        />
                        <RHFCheckbox
                            name="availableForMonthlyPro"
                            label="available For Monthly Pro"
                        />
                        <RHFCheckbox
                            name="availableForFree"
                            label="available For Free"
                        />
                    </Box>
                </FormProvider>
            </DetailsNavBar>
        </>
    );
};

export default FeatureCart;
