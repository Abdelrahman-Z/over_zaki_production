'use client'
import Button from '@mui/material/Button'
import { Box, Grid, MenuItem, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import React, { useState } from 'react'
import { RoleBasedGuard } from 'src/auth/guard'
import { BottomActions } from 'src/components/bottom-actions'
import Container from '@mui/material/Container';
import DetailsNavBar from 'src/sections/products/DetailsNavBar'
import { LoadingButton } from '@mui/lab'
import { RHFSelect, RHFTextField } from 'src/components/hook-form'
import FormProvider from 'src/components/hook-form/form-provider'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup';
import { useAddNewThemeMutation, useDeleteThemeMutation, useGetAllThemesQuery } from 'src/redux/store/services/api'
import CustomCrumbs from 'src/components/custom-crumbs/custom-crumbs'
import { isValidJSON } from 'src/utils/functions'
import Iconify from 'src/components/iconify/iconify'
import { UploadBox } from 'src/components/upload'
import { types } from 'src/sections/themes/catigories/theme-types'
import ThemeCard from 'src/sections/themes/view/themeCard'



const page = () => {
    const [addTheme] = useAddNewThemeMutation()
    const { data: allThemes } = useGetAllThemesQuery('')
    const [openDetails, setOpenDetails] = useState(false)
    const [themeData, setThemeData] = useState<any>(null)
    const ProductSchema = Yup.object().shape({
        title: Yup.string().required(),
        type: Yup.string().required(),
        json: Yup.string().test(
            'is-json',
            'json must be a valid JSON string',
            value => isValidJSON(value)
        ).required(),
    });
    const methods = useForm({
        resolver: yupResolver(ProductSchema),
    });

    const handleTheme = (e: any) => {
        const { name, value } = e.target
        setThemeData({
            ...themeData,
            [name]: value
        })
    }
    const handleCloseDetails = () => {
        setOpenDetails(false)
        setThemeData(null)
    }

    const {
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = handleSubmit(async (data) => {
        console.log(data)
        try {
            const newData = new FormData()
            newData.append('title', data.title)
            newData.append('type', data.type)
            newData.append('json', data.json)
            newData.append('image', themeData?.image)
            await addTheme(newData).unwrap()
        } catch (error) {
            reset()
        }
        setOpenDetails(false)
        setThemeData(null)
    });
    const handleAddImage = (files: any) => {
        setThemeData({
            ...themeData,
            image: files[0]
        })
    };
    const handleRemoveImage = () => {
        setThemeData({
            ...themeData,
            image: null
        })
    };
    return (
        <Container>
            <RoleBasedGuard permission="CREATE_PRODUCT">
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between', // Adjust as needed for layout
                    mt: 2, // Margin top for spacing
                    gap: 5,
                    alignItems: 'center',
                }}>
                    <Grid xs={12} md="auto">
                        <CustomCrumbs heading="Themes" crums={false} />
                    </Grid>
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
                                onClick={() => setOpenDetails(true)}
                            >
                                Add New Theme
                            </Button>
                        </Stack>
                    </BottomActions>
                </Box>
            </RoleBasedGuard>
            <DetailsNavBar
                open={openDetails}
                onClose={handleCloseDetails}
                title={'Add New theme'}
                actions={
                    <Stack alignItems="center" justifyContent="center" spacing="10px">
                        <LoadingButton
                            fullWidth
                            variant="soft"
                            color="success"
                            size="large"
                            // onClick={editProductId ? editProductFun : createProductFun}
                            loading={isSubmitting}
                            onClick={() => {

                                methods.handleSubmit(onSubmit as any)()
                            }}
                            sx={{ borderRadius: '30px' }}
                        >
                            Add
                        </LoadingButton>
                    </Stack>
                }
            >
                <FormProvider methods={methods} onSubmit={onSubmit}>
                    <Box width="100%">
                        <Typography
                            component="p"
                            noWrap
                            variant="subtitle2"
                            sx={{ opacity: 0.7, fontSize: '.9rem', maxWidth: { xs: '120px', md: '218px' } }}
                        >
                            image
                        </Typography>

                        <Box mt="10px" sx={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>

                            <Box>
                                {themeData?.image ? (
                                    <Box
                                        sx={{
                                            width: '100px',
                                            height: '100px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '10px',
                                            flexDirection: 'column',
                                            border: '1px dashed rgb(134, 136, 163,.5)',
                                            borderRadius: '16px',
                                            position: 'relative',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        <Box
                                            component="img"
                                            src={
                                                typeof themeData?.image === 'string'
                                                    ? themeData?.image
                                                    : URL.createObjectURL(themeData?.image)
                                            }
                                            alt=""
                                            sx={{ maxHeight: '95px' }}
                                        />
                                        <Box
                                            onClick={() => handleRemoveImage()}
                                            sx={{
                                                backgroundColor: 'rgb(134, 136, 163,.09)',
                                                padding: '10px 11px 7px 11px',
                                                borderRadius: '36px',
                                                cursor: 'pointer',
                                                position: 'absolute',
                                                top: 0,
                                                right: 0,
                                            }}
                                        >
                                            <Iconify icon="ic:round-delete" style={{ color: '#8688A3' }} />
                                        </Box>
                                    </Box>
                                ) : (
                                    <UploadBox
                                        sx={{
                                            width: '100px!important',
                                            height: '100px!important',
                                            textAlign: 'center',
                                            padding: '20px',
                                        }}
                                        onDrop={handleAddImage}
                                        maxFiles={1}
                                        maxSize={5242880}
                                        accept={{
                                            'image/jpeg': [],
                                            'image/png': [],
                                        }}
                                        placeholder={
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '10px',
                                                    flexDirection: 'column',
                                                }}
                                            >
                                                <Iconify icon="system-uicons:picture" style={{ color: '#8688A3' }} />
                                                <span style={{ color: '#8688A3', fontSize: '.6rem' }}>
                                                    Upload Image
                                                </span>
                                            </Box>
                                        }
                                    />
                                )}
                            </Box>

                        </Box>
                        <Typography
                            component="p"
                            noWrap
                            variant="subtitle2"
                            sx={{ opacity: 0.7, fontSize: '.9rem', maxWidth: { xs: '120px', md: '218px' } }}
                        >
                            title
                        </Typography>

                        <RHFTextField
                            fullWidth
                            variant="filled"
                            settingStateValue={handleTheme}
                            name="title"
                            value={themeData?.title || ''}
                        />
                        <Typography
                            component="p"
                            noWrap
                            variant="subtitle2"
                            sx={{ opacity: 0.7, fontSize: '.9rem', maxWidth: { xs: '120px', md: '218px' } }}
                        >
                            type
                        </Typography>

                        <RHFSelect
                            fullWidth
                            variant="filled"
                            name="type"
                            id="demo-simple-select2"
                            value={themeData?.type || types[0]}
                            settingStateValue={handleTheme}
                        >
                            {types.map((type: string, index: any) => (
                                <MenuItem key={index} value={type}>
                                    {type}
                                </MenuItem>
                            ))}
                        </RHFSelect>
                        <Typography
                            component="p"
                            noWrap
                            variant="subtitle2"
                            sx={{ opacity: 0.7, fontSize: '.9rem', maxWidth: { xs: '120px', md: '218px' } }}
                        >
                            Json
                        </Typography>

                        <RHFTextField
                            variant="filled"
                            multiline
                            fullWidth
                            rows={5}
                            sx={{ fontWeight: 900, fontSize: '26px' }}
                            settingStateValue={handleTheme}
                            name="json"
                            value={themeData?.json || ''}
                        />
                    </Box>
                </FormProvider>
            </DetailsNavBar>
            <Grid container spacing={2} sx={{ padding: '16px' }}>
                {allThemes?.data?.data?.map((el: any) =>
                    <ThemeCard title={el?.title} type={el.type} image={el.image} id={el._id} />)}
            </Grid>
        </Container>
    )
}

export default page