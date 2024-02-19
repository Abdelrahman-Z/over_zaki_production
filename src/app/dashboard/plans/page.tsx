'use client'
import { Icon } from '@iconify/react'
import { Box, Grid, Typography } from '@mui/material'
import React, { useState } from 'react'
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import { useRouter } from 'next/navigation'
import { paths } from 'src/routes/paths'
import { useGetAllBussinessCategouryQuery } from 'src/redux/store/services/api'


const page = () => {
    const [selectedItem, setSelectedItem] = useState<string>("");
    const allBussinessCategouryRes = useGetAllBussinessCategouryQuery('')
    const router = useRouter()
    const handleNext = () => {
        router.push(`${paths.dashboard.plans}/${selectedItem}`)
    }

    return (
        <Box sx={{ transition: 'all .5', paddingBottom: '30px' }}>
            <Typography variant="h3" sx={{ textAlign: 'center', padding: { xs: '5px', sm: '13px' } }}>
                What is the type of your business?
            </Typography>
            <Typography variant="h6" sx={{ textAlign: 'center', padding: { xs: '5px', sm: '13px' } }}>
                Select your story type
            </Typography>

            <Grid container spacing={2} mt={2} px={2}>
                {allBussinessCategouryRes.data?.data?.data?.map((item:any, indx:any) => (
                    <Grid onClick={() => setSelectedItem(item.name.en)} item key={indx} xs={6} sm={4} md={3}>
                        <Box
                            sx={{
                                width: '100%',
                                height: '120px',
                                backgroundColor:
                                    selectedItem === item.name. en ? 'rgb(27, 252, 182)' : 'rgb(134, 136, 163,.09)',
                                borderRadius: '16px',
                                textAlign: 'center',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '15px',
                                flexDirection: 'column',
                                transition: 'all .5s',
                                cursor: { xs: 'default', sm: 'pointer' },
                            }}
                        >
                            <Box component={'img'} width={24} src={item.image} />
                            <Typography
                                component="h5"
                                variant="subtitle2"
                                sx={{ whiteSpace: 'pre-line', fontSize: '14px', fontWeight: 700 }}
                            >
                                {item.name.en}{' '}
                            </Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>
            {selectedItem !== '' && (
                <Box
                    onClick={handleNext}
                    style={{
                        color: 'black',
                        width: '100%',
                        display: selectedItem ? 'flex' : 'none',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <ArrowForwardIosOutlinedIcon
                        sx={{
                            fontSize: 40,
                            backgroundColor: '#1BFDB7',
                            borderRadius: '50%',
                            padding: '7px',
                            mt: 5,
                            // position: 'fixed',
                            bottom: '20px',
                        }}
                    />
                </Box>
            )}
        </Box>
    )
}

export default page