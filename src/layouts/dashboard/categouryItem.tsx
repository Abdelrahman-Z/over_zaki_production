import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Button, MenuItem, Stack, Typography } from '@mui/material'
import { truncate } from 'lodash';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import Iconify from 'src/components/iconify/iconify';
import { UploadBox } from 'src/components/upload';
import { useEditBussinuseCategouryMutation } from 'src/redux/store/services/api';
import { RootState } from 'src/redux/store/store';
import DetailsNavBar from 'src/sections/products/DetailsNavBar';
import * as Yup from 'yup';





const CategouryItem = ({ categoury, handleClose , number , setCatIndex , setOpenEditCat}: any) => {
    const selectedDomain = useSelector((state: RootState) => state.selectedDomain.data);

    return (
        <>
            <MenuItem selected={categoury?._id === selectedDomain?._id} sx={{ marginBottom: "20px", minWidth: 250 }} >
                <Stack direction='row' display={'flex'} width={'100%'} justifyContent={'space-between'} alignItems='center' >
                    <Stack direction='row' flex={1} alignItems='center' spacing="4px" onClick={() => handleClose(categoury)} >
                        <Box component='img' src={categoury?.image} sx={{ width: '40px' }} />
                        <Box>
                            <Typography
                                component='p'
                                variant="subtitle2"
                                sx={{ opacity: 0.8, display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '0.775rem', fontWeight: 900, gap: '3px' }}
                            > <span style={{ cursor: 'pointer' }}>{categoury?.name?.en || ""}</span> </Typography>
                            <Typography
                                component='p'
                                variant="subtitle2"
                                sx={{ opacity: 0.6, fontSize: '0.675rem', cursor: 'pointer' }}
                            > <span style={{ cursor: 'pointer' }}>{categoury?.name?.en || ""}</span>  </Typography>
                        </Box>
                    </Stack>
                    {categoury?._id && (
                        <Button sx={{
                            color: "#21CE99",
                            backgroundColor: 'rgb(33, 206, 153,.1)',
                            padding: '4px 6px',
                            fontSize: '10px',
                            borderRadius: '10px'
                        }}
                            onClick={() => {
                                setOpenEditCat(true)
                                setCatIndex(number)
                            }}
                        >
                            edit
                        </Button>
                    )}

                </Stack>
            </MenuItem>
        </>
    )
}

export default CategouryItem