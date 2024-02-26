'use client'
import { yupResolver } from '@hookform/resolvers/yup';
import { CheckCircleOutline } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Collapse, FormControl, FormHelperText, Input, List, MenuItem, Paper, Select, Stack, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';
import { useParams } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { RHFCheckbox, RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import { useGetAllFeaturesByCatQuery, useUpdatePlanMutation } from 'src/redux/store/services/api';
import * as Yup from 'yup';
import DetailsNavBar from '../products/DetailsNavBar';
import FeatureCart from './featureCart';
import DoneIcon from '@mui/icons-material/Done';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { fNumber } from 'src/utils/format-number';


const FinancialPlanCard = (
    { plan, features, onAddFeature }: any
) => {

    // const plan = {}
    const [edit, setEdit] = useState({})
    const [showIcons, setShowIcons] = useState(false)
    const [inputVal, setInputVal] = useState("")
    // get all features
    const { categoury } = useParams()
    // console.log(plan, " Plan")
    const allFeaturesRes = useGetAllFeaturesByCatQuery(categoury.toString().toLowerCase())
    // update plan
    const [upatePlanReq, updatePlanRes] = useUpdatePlanMutation()
    const [openChangePlan, setOpenChangePlan] = useState(false)
    const [data, setData] = useState([])
    // console.log(features, " features");
    // console.log(plan, " Plan")
    // const [addFeatureReq, addFeatureRes] = useAddNewFeatureMutation();

    //     const feature = [{
    //         features?.map((item, index) => 

    //             typ: item, iconNo: 9

    //         )
    // }]


    useEffect(() => {
        setData(features?.filter((it: any) => it[(plan?.type === "pro" ? 'available' : 'availableFor') + plan?.type?.charAt(0).toUpperCase() + plan?.type?.slice(1)])?.map((item: any) => ({ typ: item?.content?.en, iconNo: 0 })));
    }, [])

    // useEffect(() => {
    //     setData([
    //     { typ: "Lorem Ipsum is typesetting.", iconNo: 0 },
    //     { typ: "Lorem Ipsum is typesetting.", iconNo: 0 },
    //     { typ: "Lorem Ipsum is typesetting.", iconNo: 0 },
    //     { typ: "Lorem Ipsum is typesetting.", iconNo: 0 },
    //     { typ: "Lorem Ipsum is typesetting.", iconNo: 0 },
    //     { typ: "Lorem Ipsum is typesetting.", iconNo: 0 },
    //     ])
    //     // setData(!!features && features?.map((item, index) => {
    //     //     item.typ = item 
    //     //     item.iconNo = 0 
    //     // }))
    // }, [])
    const UpdatePlaneSchema = Yup.object().shape({
        name: Yup.object().shape({
            en: Yup.string().required(),
            ar: Yup.string().required(),
            es: Yup.string().required(),
            tr: Yup.string().required(),
            fr: Yup.string().required(),
        }),
        price: Yup.number().required(),
        branchNumber: Yup.number().required(),
        withFreeDomain: Yup.boolean().required(),
        staffNumber: Yup.number().required(),
        staffNumberFeature: Yup.object().shape({
            en: Yup.string(),
            ar: Yup.string(),
            es: Yup.string(),
            tr: Yup.string(),
            fr: Yup.string(),
        }),
        withFreeDomainFeature: Yup.object().shape({
            en: Yup.string(),
            ar: Yup.string(),
            es: Yup.string(),
            tr: Yup.string(),
            fr: Yup.string(),
        }),
        branchNumberFeature: Yup.object().shape({
            en: Yup.string(),
            ar: Yup.string(),
            es: Yup.string(),
            tr: Yup.string(),
            fr: Yup.string(),
        }),
    });

    const methods = useForm({
        resolver: yupResolver(UpdatePlaneSchema),
        defaultValues: {
            name: {
                en: plan?.name?.en,
                ar: plan?.name?.ar,
                tr: plan?.name?.tr,
                es: plan?.name?.es,
                fr: plan?.name?.fr,
            },
            price: plan?.price,
            branchNumber: plan?.limitAccess?.branchNumber,
            withFreeDomain: plan?.limitAccess?.withFreeDomain,
            staffNumber: plan?.limitAccess?.staffNumber,
            staffNumberFeature: {
                en: plan?.limitAccess?.staffNumberFeature?.en,
                ar: plan?.limitAccess?.staffNumberFeature?.ar,
                es: plan?.limitAccess?.staffNumberFeature?.es,
                tr: plan?.limitAccess?.staffNumberFeature?.tr,
                fr: plan?.limitAccess?.staffNumberFeature?.fr,
            },
            withFreeDomainFeature: {
                en: plan?.limitAccess?.withFreeDomainFeature?.en,
                ar: plan?.limitAccess?.withFreeDomainFeature?.ar,
                es: plan?.limitAccess?.withFreeDomainFeature?.es,
                tr: plan?.limitAccess?.withFreeDomainFeature?.tr,
                fr: plan?.limitAccess?.withFreeDomainFeature?.fr,
            },
            branchNumberFeature: {
                en: plan?.limitAccess?.branchNumberFeature?.en,
                ar: plan?.limitAccess?.branchNumberFeature?.ar,
                es: plan?.limitAccess?.branchNumberFeature?.es,
                tr: plan?.limitAccess?.branchNumberFeature?.tr,
                fr: plan?.limitAccess?.branchNumberFeature?.fr,
            },
        }
    });
    const {
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;
    useEffect(() => {
        if (!openChangePlan) {
            reset({
                name: {
                    en: plan?.name?.en,
                    ar: plan?.name?.ar,
                    tr: plan?.name?.tr,
                    es: plan?.name?.es,
                    fr: plan?.name?.fr,
                },
                price: plan?.price,
                branchNumber: plan?.limitAccess?.branchNumber,
                withFreeDomain: plan?.limitAccess?.withFreeDomain,
                staffNumber: plan?.limitAccess?.staffNumber,
                staffNumberFeature: {
                    en: plan?.limitAccess?.staffNumberFeature?.en,
                    ar: plan?.limitAccess?.staffNumberFeature?.ar,
                    es: plan?.limitAccess?.staffNumberFeature?.es,
                    tr: plan?.limitAccess?.staffNumberFeature?.tr,
                    fr: plan?.limitAccess?.staffNumberFeature?.fr,
                },
                withFreeDomainFeature: {
                    en: plan?.limitAccess?.withFreeDomainFeature?.en,
                    ar: plan?.limitAccess?.withFreeDomainFeature?.ar,
                    es: plan?.limitAccess?.withFreeDomainFeature?.es,
                    tr: plan?.limitAccess?.withFreeDomainFeature?.tr,
                    fr: plan?.limitAccess?.withFreeDomainFeature?.fr,
                },
                branchNumberFeature: {
                    en: plan?.limitAccess?.branchNumberFeature?.en,
                    ar: plan?.limitAccess?.branchNumberFeature?.ar,
                    es: plan?.limitAccess?.branchNumberFeature?.es,
                    tr: plan?.limitAccess?.branchNumberFeature?.tr,
                    fr: plan?.limitAccess?.branchNumberFeature?.fr,
                },
            });
        }
    }, [openChangePlan, plan, reset]);
    useEffect(() => {
        if (updatePlanRes.isSuccess) {
            enqueueSnackbar('updated successfully', { variant: "success" })
        }
        if (updatePlanRes.isError) {
            enqueueSnackbar('cannot update the plan', { variant: "error" })
        }
    }, [updatePlanRes]);

    const updatePlan = handleSubmit(async (data) => {
        await upatePlanReq({
            id: plan._id,
            data: {
                name: {
                    "en": data.name.en,
                    "ar": data.name.ar,
                    "tr": data.name.tr,
                    "es": data.name.es,
                    "fr": data.name.fr
                },
                price: data.price,
                branchNumber: data.branchNumber,
                withFreeDomain: data.withFreeDomain,
                staffNumber: data.staffNumber,
                staffNumberFeature: {
                    "en": data.staffNumberFeature.en,
                    "ar": data.staffNumberFeature.ar,
                    "tr": data.staffNumberFeature.tr,
                    "es": data.staffNumberFeature.es,
                    "fr": data.staffNumberFeature.fr,
                },
                withFreeDomainFeature: {
                    "en": data.withFreeDomainFeature.en,
                    "ar": data.withFreeDomainFeature.ar,
                    "tr": data.withFreeDomainFeature.tr,
                    "es": data.withFreeDomainFeature.es,
                    "fr": data.withFreeDomainFeature.fr,
                },
                branchNumberFeature: {
                    "en": data.branchNumberFeature.en,
                    "ar": data.branchNumberFeature.ar,
                    "tr": data.branchNumberFeature.tr,
                    "es": data.branchNumberFeature.es,
                    "fr": data.branchNumberFeature.fr,
                },
            }
        }).unwrap()
    });
    // let newData = tempData.map((item, i) => ({
    //     typ: item.typ,
    //     iconNo: item.iconNo,
    //     input: item?.typ
    // }));
    return (
        <>
            {/* // component={Paper}  */}
            <TableContainer>
                <Table aria-label="financial plan table"
                    sx={{ bgcolor: 'white', overflow: 'hidden', width: { xs: 'calc(100vw - 80px)', sm: '100vw' }, maxWidth: { xs: '420px', sm: '420px' }, minWidth: { xs: '200px', sm: '330px' }, height: { xs: "540px", sm: '580px' }, borderRadius: '20px', boxShadow: "0px 14px 20px #0F134914", mb: '20px' }}>

                    {/* <TableHead>
                        <TableRow>
                            <TableCell>Plan Type</TableCell>
                            <TableCell align="right">Price</TableCell>
                            <TableCell align="right">Duration type</TableCell>
                            <TableCell align="right">Branch Number</TableCell>
                            <TableCell align="right">Staff Number</TableCell>
                            <TableCell align="right">Free Domain</TableCell>
                            <TableCell align="right">Edit Plan</TableCell>
                        </TableRow>
                    </TableHead> */}
                    <TableBody sx={{ bgcolor: '#fff', overflow: 'hidden', p: { xs: 1.5, sm: 2.5, md: 3.75 }, boxSizing: 'border-box', display: 'flex', flexWrap: 'wrap' }}>
                        {/* <TableContainer>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    {plan.type.toUpperCase()}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align="right">{Object.values(plan.price)[0]}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align="right">{plan.durationType}</TableCell>
                            </TableRow>
                            <TableRow>
                            <TableCell align="right">{plan.limitAccess.branchNumber}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align="right">{plan.limitAccess.staffNumber}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align="right">
                                    <CheckCircleOutline color={plan.limitAccess.withFreeDomain ? "success" : 'error'} />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align="right">
                                    <IconButton edge="end" aria-label="edit" onClick={() => setOpenChangePlan(true)}>
                                        <EditIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        </TableContainer> */}
                        <TableContainer sx={{ overflowX: 'hidden !important', overflowY: 'auto'}}>
                            <TableRow sx={{ display: 'flex' }}>
                                <TableContainer>
                                    <TableRow sx={{ textAlign: 'start !important', }}>
                                        <TableCell sx={{ borderBottomStyle: 'none', padding: '1px', fontSize: '20px', fontWeight: 'bold' }} >{plan?.name?.en}</TableCell>
                                    </TableRow>
                                    <TableRow sx={{ textAlign: 'start !important', }}>
                                        <TableCell sx={{ borderBottomStyle: 'none', lineHeight: '25px', padding: '0', fontSize: '16px', fontWeight: 'bold', textAlign: 'start' }} align="right">{fNumber(plan?.price)}</TableCell>
                                    </TableRow>
                                    {/* <TableRow sx={{ textAlign: 'start !important', }}>
                                        <TableCell sx={{ borderBottomStyle: 'none', lineHeight: '22px', padding: '0', fontSize: '14px', fontWeight: '500', color: 'gray', textDecoration: 'line-through' }} component="th" scope="row">
                                            120 KWD/year
                                        </TableCell>
                                    </TableRow> */}
                                </TableContainer>
                                {<CheckCircleOutline sx={{ width: "58px", height: "47px" }} color={"success"} />}
                            </TableRow>
                            {/* <TableRow sx={{ width: '100%', display: 'flex', m: '18px 0' }}>
                                <Button sx={{
                                    fontSize: { xs: '16px', sm: '18px' }, color: '#000', width: '100%', maxWidth: '340px', height: { xs: '50px', sm: '60px' }, background: "rgb(27, 251, 182)", borderRadius: "30px",
                                    '&:hover': { backgroundColor: '#0DCC9B' },
                                }} colors={'black'}>Upgrade Now</Button>
                            </TableRow> */}
                            {/* {features?.map((item, index) => !!item && )} */}
                            {data?.map((item, index) =>
                                <TableRow onMouseOver={() => {
                                    setShowIcons(index + 1)
                                }} onMouseLeave={() => setShowIcons(false)} sx={{ display: 'flex', alignItems: 'start', height: '22.5px', m: '20px 0 !important' }}>
                                    {(edit?.no === index + 1 && edit?.status === "icon") ?
                                        <FormControl sx={{ width: '24px', height: '22px' }}>
                                            <Select sx={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: '24px', height: '22px', '& .MuiInputBase-input': {
                                                    width: '24px', height: '22px', padding: '0 !important'
                                                },
                                                '& .MuiSelect-icon': {
                                                    display: 'none', // Hide the legend element which typically contains the arrow icon
                                                },
                                            }}
                                                value={data[index]?.iconNo}
                                                onChange={(e) => {
                                                    let tempData = [...data]
                                                    tempData[index].iconNo = e?.target?.value
                                                    setData(tempData)
                                                }}
                                                displayEmpty
                                                inputProps={{ 'aria-label': 'Without label' }}
                                            >
                                                <MenuItem value={0}>
                                                    <DoneIcon onClick={() => {
                                                        setEdit(false)
                                                    }} style={{ fontSize: { xs: '23px !important', sm: '29px !important' }, color: '1BFCB6' }} />
                                                </MenuItem>
                                                <MenuItem onClick={() => {
                                                    setEdit(false)
                                                }} style={{ fontSize: { xs: '23px !important', sm: '29px !important' }, color: '1BFCB6' }} value={1}>
                                                    <CloseIcon style={{ fontSize: { xs: '23px !important', sm: '29px !important' }, color: '#1BFCB6' }} />
                                                </MenuItem>
                                            </Select>
                                            {/* <FormHelperText>Without label</FormHelperText> */}
                                        </FormControl>
                                        :
                                        //  false
                                        // {
                                        !item?.iconNo ?
                                            <DoneIcon onMouseOver={() => {
                                                setEdit({ no: index + 1, status: 'icon' })
                                            }} style={{ fontSize: { xs: '23px !important', sm: '29px !important' }, color: '#1BFCB6' }} /> :
                                            <CloseIcon onMouseOver={() => {
                                                setEdit({ no: index + 1, status: 'icon' })
                                            }} style={{ fontSize: { xs: '23px !important', sm: '29px !important' }, color: '#1BFCB6' }} />
                                        // }
                                    }
                                    <TableCell sx={{ p: 0, pl: { xs: 1, sm: 2, textAlign: 'start' }, borderBottomStyle: 'none', lineHeight: '22px', color: '#8688A3', mb: 0 }} align="right">
                                        <Box component={'span'} sx={{ width: '100%', display: 'flex', gap: '30px' }}>
                                            {
                                                edit?.no === index + 1 && edit?.status === "input" ?
                                                    <Input sx={{
                                                        fontSize: '16px', height: '22px', textAlign: 'start', '& .MuiInputBase-input': {
                                                            p: 0, fontSize: '16px'
                                                        }
                                                    }} value={inputVal} onChange={(e) => {
                                                        setInputVal(e?.target?.value)
                                                    }} />
                                                    :
                                                    <Typography onMouseOver={() => {
                                                        if (inputVal !== "")
                                                            setEdit({ no: index + 1, status: 'input' })
                                                        setInputVal(data[index].typ)
                                                    }}>
                                                        {item?.typ}
                                                    </Typography>
                                            }
                                            {
                                                showIcons === index + 1 ?
                                                    <Box component={'span'} sx={{ display: 'flex', gap: '10px' }}>
                                                        <DeleteIcon onClick={async () => {
                                                            let tempData = await [...data]
                                                            tempData = tempData?.filter((_, ind) => ind !== index)
                                                            setData(await tempData)
                                                            setEdit(false)
                                                        }} style={{ cursor: 'pointer' }} />
                                                        <CheckCircleOutlineIcon onClick={async () => {
                                                            if (edit)
                                                                onAddFeature({ content: {en: inputVal, ar: inputVal, es: inputVal, tr: inputVal, fr: inputVal, de: inputVal},
                                                            availableForBasic: plan?.type === "basic", availableForAdvance: plan?.type === "advance", availablePro: plan?.type === "pro"})
                                                            // let tempData = await [...data]
                                                            // if (edit?.no === index + 1)
                                                            //     tempData[index].typ = await inputVal
                                                            // setData(tempData)
                                                            setEdit(false)
                                                        }} style={{ cursor: 'pointer' }} />
                                                    </Box>
                                                    :
                                                    false}
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            )
                            }
                            <Box sx={{ display: 'flex', gap: '20px' }}>
                                <Button sx={{ bgcolor: '#1BFCB6', width: '50%', maxWidth: '111px', '&:hover': { bgcolor: '#15c3a7' } }} onClick={async () => {
                                    setInputVal("")
                                    let tempData = await [...data]
                                    tempData.push({ iconNo: 0, typ: '' })
                                    setData(tempData)
                                    setEdit({ no: tempData?.length, status: 'input' })
                                }}>
                                    Add
                                </Button>
                                <Button sx={{ bgcolor: '#1BFCB6', width: '50%', maxWidth: '111px', '&:hover': { bgcolor: '#15c3a7' } }}>Save</Button>
                            </Box>
                        </TableContainer>
                        {/* Collapsible row for features */}
                        {/* <TableRow>
                            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                                <Collapse in={true} timeout="auto" unmountOnExit>
                                    <Box margin={1}> */}
                        {/* <Typography variant="h6" gutterBottom component="div">
                                            Features
                                        </Typography> */}
                        {/* <List dense>
                                            {allFeaturesRes?.data?.data?.map((feature: any, index: number) => {
                                                if (plan?.durationType === 'sevenDays' && feature.availableForFree) {
                                                    return <FeatureCart key={index} feature={feature} />;
                                                }
                                                if (plan?.durationType === 'monthly' && feature.availableForMonthlyPro) {
                                                    return <FeatureCart key={index} feature={feature} />;
                                                }
                                                if (plan?.durationType === 'yearly' && feature.availableForYearlyPro) {
                                                    return <FeatureCart key={index} feature={feature} />;
                                                }
                                                return null;
                                            })}
                                        </List>
                                    </Box>
                                </Collapse>
                            </TableCell>
                        </TableRow> */}
                    </TableBody>
                </Table>
            </TableContainer>
            {/* update plan */}
            {/* <DetailsNavBar
                open={openChangePlan}
                onClose={() => setOpenChangePlan(false)}
                title={`Update Your Plan`}
                actions={
                    <Stack alignItems="center" justifyContent="center" spacing="10px">
                        <LoadingButton
                            fullWidth
                            variant="soft"
                            color="success"
                            size="large"
                            loading={isSubmitting}
                            onClick={() => {
                                updatePlan()
                                setOpenChangePlan(false)
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
                        <RHFTextField
                            fullWidth
                            variant="filled"
                            name="en"
                            defaultValue={plan?.name?.en}
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
                            name="ar"
                            defaultValue={plan?.name?.ar}
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
                            name="tr"
                            defaultValue={plan?.name?.tr}
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
                            name="es"
                            defaultValue={plan?.name?.es}
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
                            name="fr"
                            defaultValue={plan?.name?.fr}
                        />
                        <Typography
                            component="p"
                            noWrap
                            variant="subtitle2"
                            sx={{ opacity: 0.7, fontSize: '.9rem', maxWidth: { xs: '120px', md: '218px' } }}
                        >
                            Price
                        </Typography>
                        <RHFTextField
                            type='number'
                            fullWidth
                            variant="filled"
                            name="price"
                            defaultValue={plan?.price}
                        />
                        <Typography
                            component="p"
                            noWrap
                            variant="subtitle2"
                            sx={{ opacity: 0.7, fontSize: '.9rem', maxWidth: { xs: '120px', md: '218px' } }}
                        >
                            Branch Number
                        </Typography>
                        <RHFTextField
                            type='number'
                            fullWidth
                            variant="filled"
                            name="branchNumber"
                            defaultValue={plan?.limitAccess?.branchNumber}
                        />
                        <RHFCheckbox
                            name="withFreeDomain"
                            label="Add Free Domain"
                        />
                        <Typography
                            component="p"
                            noWrap
                            variant="subtitle2"
                            sx={{ opacity: 0.7, fontSize: '.9rem', maxWidth: { xs: '120px', md: '218px' } }}
                        >
                            Staff Number
                        </Typography>
                        <RHFTextField
                            type='number'
                            fullWidth
                            variant="filled"
                            name="staffNumber"
                            defaultValue={plan?.limitAccess?.staffNumber}
                        />
                        <Typography
                            component="p"
                            noWrap
                            variant="subtitle2"
                            sx={{ opacity: 0.7, fontSize: '.9rem', maxWidth: { xs: '120px', md: '218px' } }}
                        >
                            Staff Number Features
                        </Typography>
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
                            name="staffNumberFeature.en"
                            defaultValue={plan?.limitAccess?.staffNumberFeature?.en}
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
                            name="staffNumberFeature.es"
                            defaultValue={plan?.limitAccess?.staffNumberFeature?.es}
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
                            name="staffNumberFeature.fr"
                            defaultValue={plan?.limitAccess?.staffNumberFeature?.fr}
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
                            name="staffNumberFeature.tr"
                            defaultValue={plan?.limitAccess?.staffNumberFeature?.tr}
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
                            name="staffNumberFeature.ar"
                            defaultValue={plan?.limitAccess?.staffNumberFeature?.ar}
                        />
                        <Typography
                            component="p"
                            noWrap
                            variant="subtitle2"
                            sx={{ opacity: 0.7, fontSize: '.9rem', maxWidth: { xs: '120px', md: '218px' } }}
                        >
                            Free Domain Features
                        </Typography>
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
                            name="withFreeDomainFeature.en"
                            defaultValue={plan?.limitAccess?.withFreeDomainFeature?.en}
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
                            name="withFreeDomainFeature.es"
                            defaultValue={plan?.limitAccess?.withFreeDomainFeature?.es}
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
                            name="withFreeDomainFeature.fr"
                            defaultValue={plan?.limitAccess?.withFreeDomainFeature?.fr}
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
                            name="withFreeDomainFeature.tr"
                            defaultValue={plan?.limitAccess?.withFreeDomainFeature?.tr}
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
                            name="withFreeDomainFeature.ar"
                            defaultValue={plan?.limitAccess?.withFreeDomainFeature?.ar}
                        />
                        <Typography
                            component="p"
                            noWrap
                            variant="subtitle2"
                            sx={{ opacity: 0.7, fontSize: '.9rem', maxWidth: { xs: '120px', md: '218px' } }}
                        >
                            Branch Number Features
                        </Typography>
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
                            name="branchNumberFeature.en"
                            defaultValue={plan?.limitAccess?.branchNumberFeature?.en}
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
                            name="branchNumberFeature.es"
                            defaultValue={plan?.limitAccess?.branchNumberFeature?.es}
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
                            name="branchNumberFeature.fr"
                            defaultValue={plan?.limitAccess?.branchNumberFeature?.fr}
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
                            name="branchNumberFeature.tr"
                            defaultValue={plan?.limitAccess?.branchNumberFeature?.tr}
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
                            name="branchNumberFeature.ar"
                            defaultValue={plan?.limitAccess?.branchNumberFeature?.ar}
                        />
                    </Box>
                </FormProvider>
            </DetailsNavBar> */}
        </>
    );
};

export default FinancialPlanCard;