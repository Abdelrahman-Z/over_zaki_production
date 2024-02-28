'use client';
import { yupResolver } from '@hookform/resolvers/yup';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneIcon from '@mui/icons-material/Done';
import {
  Box,
  Button,
  FormControl,
  Input,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useUpdateFeatureMutation, useUpdatePlanMutation } from 'src/redux/store/services/api';
import { fNumber } from 'src/utils/format-number';
import * as Yup from 'yup';
import PlanAdvanced from '../../assets/icons/advanced@2x.png';
import PlanProIcon from '../../assets/icons/pro@2x.png';
import EditIcon from '@mui/icons-material/Edit';
import FormProvider from 'src/components/hook-form/form-provider';
import { RHFCheckbox, RHFTextField } from 'src/components/hook-form';
import { LoadingButton } from '@mui/lab';
import DetailsNavBar from '../products/DetailsNavBar';
import FeatureCart from './featureCart';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import { PlanAdvancedIcon, PlanProIcon } from 'src/assets/icons';
// import { PlanFreeIcon, PlanStarterIcon, PlanPremiumIcon } from 'src/assets/icons';

const FinancialPlanCard = ({ plan, features, onAddFeature, setFeatures }: any) => {
  const checkAvailability: any = {
    basic: 'availableForBasic',
    pro: 'availablePro',
    advance: 'availableForAdvance',
  };
  let language = 'en';
  const [edit, setEdit] = useState({});
  const [showIcons, setShowIcons] = useState(false);
  const [openChangeFeature, setOpenChangeFeature] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const { categoury } = useParams();
  const [upatePlanReq, updatePlanRes] = useUpdatePlanMutation();
  const [openChangePlan, setOpenChangePlan] = useState(false);
  const [data, setData] = useState([]);
  const [addArray, setAddArray] = useState([]);
  const [isShowMore, setIsShowMore] = useState(false);
  useEffect(() => {
    setData(
      features
        ?.filter(
          (it: any) =>
            it[
              (plan?.type === 'pro' ? 'available' : 'availableFor') +
                plan?.type?.charAt(0).toUpperCase() +
                plan?.type?.slice(1)
            ]
        )
        ?.map((item: any) => ({ typ: item?.content?.en, iconNo: 0 }))
    );
  }, []);
  const handleFeatureChange = (value: any) => {
    setFeatures((prev) => {
      return prev.map((item) => (item._id === value._id ? value : item));
    });
  };
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
    },
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
      enqueueSnackbar('updated successfully', { variant: 'success' });
    }
    if (updatePlanRes.isError) {
      enqueueSnackbar('cannot update the plan', { variant: 'error' });
    }
  }, [updatePlanRes]);

  const updatePlan = handleSubmit(async (data) => {
    await upatePlanReq({
      id: plan._id,
      data: {
        name: {
          en: data.name.en,
          ar: data.name.ar,
          tr: data.name.tr,
          es: data.name.es,
          fr: data.name.fr,
        },
        price: data.price,
        branchNumber: data.branchNumber,
        withFreeDomain: data.withFreeDomain,
        staffNumber: data.staffNumber,
        staffNumberFeature: {
          en: data.staffNumberFeature.en,
          ar: data.staffNumberFeature.ar,
          tr: data.staffNumberFeature.tr,
          es: data.staffNumberFeature.es,
          fr: data.staffNumberFeature.fr,
        },
        withFreeDomainFeature: {
          en: data.withFreeDomainFeature.en,
          ar: data.withFreeDomainFeature.ar,
          tr: data.withFreeDomainFeature.tr,
          es: data.withFreeDomainFeature.es,
          fr: data.withFreeDomainFeature.fr,
        },
        branchNumberFeature: {
          en: data.branchNumberFeature.en,
          ar: data.branchNumberFeature.ar,
          tr: data.branchNumberFeature.tr,
          es: data.branchNumberFeature.es,
          fr: data.branchNumberFeature.fr,
        },
      },
    }).unwrap();
  });
  // const [updateFeatureReq, updateFeatureRes] = useUpdateFeatureMutation();

  // useEffect(() => {
  //   // Handle API call responses
  //   if (updateFeatureRes.isSuccess) {
  //     enqueueSnackbar('Feature updated successfully', { variant: 'success' });
  //   }
  //   if (updateFeatureRes.isError) {
  //     enqueueSnackbar('Failed to update the feature', { variant: 'error' });
  //   }
  // }, [updateFeatureRes]);

  // const updateFeature = async (data: any) => {
  //   console.log('data', data);
  //   let { _id, category, __v, ...others } = data;
  //   let { content, ...updatedData } = others;
  //   let { localized, ...updatedContent } = content;
  //   await updateFeatureReq({
  //     id: _id, // Assuming each feature has a unique ID
  //     data: { ...updatedData, content: updatedContent },
  //   }).unwrap();
  // };

  return (
    <>
      <TableContainer>
        <Table
          aria-label="financial plan table"
          sx={{
            bgcolor: 'white',
            overflow: 'hidden',
            width: { xs: 'calc(100vw - 80px)', sm: '100vw' },
            maxWidth: { xs: '420px', sm: '420px' },
            minWidth: { xs: '200px', sm: '330px' },
            height: { xs: '540px', sm: '580px' },
            borderRadius: '20px',
            boxShadow: '0px 12px 10px #0F134914',
            mb: '20px',
          }}
        >
          <TableBody
            sx={{
              '&::-webkit-scrollbar-thumb': { color: '#1BFCB6' },
              height: '600px',
              bgcolor: '#fff',
              overflow: 'auto',
              scrollbarWidth: 'thin',
              p: { xs: 1.5, sm: 2.5, md: 3.75 },
              boxSizing: 'border-box',
              display: 'flex',
              flexWrap: 'wrap',
            }}
          >
            <TableContainer sx={{ overflowX: 'hidden !important', overflowY: 'auto' }}>
              <TableRow sx={{ display: 'flex' }}>
                <TableContainer>
                  <TableRow sx={{ textAlign: 'start !important' }}>
                    <TableCell
                      sx={{
                        color: 'black',
                        borderBottomStyle: 'none',
                        padding: '1px',
                        fontSize: '20px',
                        fontWeight: 'bold',
                      }}
                    >
                      {plan?.name?.en}
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ textAlign: 'start !important' }}>
                    <TableCell
                      sx={{
                        color: 'black',
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
                  </TableRow>
                </TableContainer>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Box
                    sx={{
                      width: 80,
                      height: 60,
                      boxSizing: 'border-box',
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'end',
                      justifyContent: 'end',
                    }}
                  >
                    {plan?.type === 'pro' && (
                      <Image src={PlanProIcon} style={{ width: '50px', height: '60px' }} />
                    )}
                    {plan?.type === 'advance' && (
                      <Image src={PlanAdvanced} style={{ width: '70px', height: '60px' }} />
                    )}
                  </Box>
                </Stack>
              </TableRow>
              {features
                ?.filter((_, index: number) => (!isShowMore ? index < 10 : true))
                ?.map((item: any, index: number) => (
                  <FeatureCart
                    feature={item}
                    handleFeatureChange={handleFeatureChange}
                    setShowIcons={setShowIcons}
                    index={index}
                    edit={edit}
                    setEdit={setEdit}
                    language={language}
                    showIcons={showIcons}
                    plan={plan}
                  />
                ))}
              {features?.length >= 10 && (
                <Box
                  onClick={() => setIsShowMore((check) => !check)}
                  sx={{ display: 'flex', width: '100%' }}
                >
                  <ExpandMoreIcon
                    style={{
                      color: '#8688A3',
                      fontSize: '1.5rem',
                      cursor: 'pointer',
                      transform: isShowMore && 'rotateX(180deg)',
                    }}
                  />
                  <Typography sx={{ pl: '16px', color: '#8688A3', cursor: 'pointer' }}>
                    {isShowMore ? 'Show Less' : 'Show More'}
                  </Typography>
                </Box>
              )}
            </TableContainer>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default FinancialPlanCard;
