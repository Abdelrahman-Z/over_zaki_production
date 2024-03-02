'use client';

import AppBar from '@mui/material/AppBar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';

import { Box, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
// theme
import { bgBlur } from 'src/theme/css';
// hooks
import { useOffSetTop } from 'src/hooks/use-off-set-top';
import { useResponsive } from 'src/hooks/use-responsive';
// components
import Logo from 'src/components/logo';
import { useSettingsContext } from 'src/components/settings';
import SvgColor from 'src/components/svg-color';
import * as Yup from 'yup';

//
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import Iconify from 'src/components/iconify/iconify';
import { UploadBox } from 'src/components/upload';
import {
  useAddNewBussinuseCategouryMutation,
  useEditBussinuseCategouryMutation,
  useGetAllBussinessCategouryQuery,
  useGetPlansByCatQuery,
} from 'src/redux/store/services/api';
import DetailsNavBar from 'src/sections/products/DetailsNavBar';
import {
  AccountPopover,
  ContactsPopover,
  LanguagePopover,
  NotificationsPopover,
  Searchbar,
  SettingsButton,
} from '../_common';
import { HEADER, NAV } from '../config-layout';
import CategouryItem from './categouryItem';

// ----------------------------------------------------------------------

type Props = {
  onOpenNav?: VoidFunction;
};
type DomainState = {
  service: string;
  open: HTMLElement | null;
};

export default function Header({ onOpenNav }: Props) {
  const pathName = usePathname();
  const router = useRouter();
  const { categoury } = useParams();
  const allBussinessCategouryRes = useGetAllBussinessCategouryQuery('');
  const selectedCat = allBussinessCategouryRes?.data?.data?.data?.find(
    (el: any) => el.uniqueName?.toLowerCase() === categoury?.toString()?.toLowerCase()
  );
  const [openAddCategoury, setOpenAddCategoury] = useState(false);
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const dispatch = useDispatch();
  const [select, setSelect] = useState(0);
  const response = useGetPlansByCatQuery(
    allBussinessCategouryRes.data?.data?.data[select]?.name?.en
  );
  const [openItems, setOpenItems] = React.useState<any>({
    open: false,
    item: null,
  });
  const [categouryData, setCategouryData] = useState<any>(null);
  const handleOpen = React.useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    setOpenItems({
      item: event.currentTarget,
      open: true,
    });
  }, []);
  const handleClose = (categoury: any, number?: Number) => {
    if (categoury) {
      setSelect(number as any);
      const arr = pathName.split('/');
      arr[2] = categoury.uniqueName.toLowerCase();
      window.location.href = arr.join('/');
    }
    setOpenItems({
      item: null,
      open: false,
    });
  };
  // add new categoury
  const [addCategouryReq, addCategouryRes] = useAddNewBussinuseCategouryMutation();
  const addCategourySchema = Yup.object().shape({
    en: Yup.string().required('English content is required'),
    ar: Yup.string().required('Arabic content is required'),
    es: Yup.string().required('Spanish content is required'),
    tr: Yup.string().required('Turkish content is required'),
    fr: Yup.string().required('France content is required'),
  });
  const addCategouryMethods = useForm({
    resolver: yupResolver(addCategourySchema),
    defaultValues: {
      en: '', // Default value for English content
      ar: '', // Default value for Arabic content
      es: '', // Default value for Spanish content
      tr: '', // Default value for Spanish content
      fr: '', // Default value for Spanish content
    },
  });
  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
    control,
  } = addCategouryMethods;

  const handleAddImage = (files: any) => {
    setCategouryData({
      ...categouryData,
      image: files[0],
    });
  };
  const handleRemoveImage = () => {
    setCategouryData({
      ...categouryData,
      image: null,
    });
  };

  const addNewCategoury = handleSubmit(async (data) => {
    const formData = new FormData();
    formData.append('name[en]', data.en);
    formData.append('name[ar]', data.ar);
    formData.append('name[tr]', data.tr);
    formData.append('name[fr]', data.fr);
    formData.append('name[es]', data.es);
    formData.append('image', categouryData?.image);
    await addCategouryReq(formData).unwrap();
  });
  useEffect(() => {
    if (!openAddCategoury) {
      reset({
        en: '', // Default value for English content
        ar: '', // Default value for Arabic content
        es: '', // Default value for Spanish content
        tr: '', // Default value for Spanish content
        fr: '', // Default value for Spanish content
      }); // Reset the form when the modal is closed
      handleRemoveImage();
    }
  }, [openAddCategoury, reset]);

  useEffect(() => {
    if (addCategouryRes.isSuccess) {
      enqueueSnackbar('categoury added successfully', { variant: 'success' });
    }
    if (addCategouryRes.isError) {
      enqueueSnackbar('Cannot add the categoury', { variant: 'error' });
    }
  }, [addCategouryRes]);
  // #########

  // edit categoury
  const [catIndex, setCatIndex] = useState(0);
  const editCategourySchema = Yup.object().shape({
    name: Yup.object().shape({
      en: Yup.string().required('English content is required'),
      ar: Yup.string().required('Arabic content is required'),
      es: Yup.string().required('Spanish content is required'),
      tr: Yup.string().required('Turkish content is required'),
      fr: Yup.string().required('France content is required'),
    }),
    sort: Yup.number().required().positive(),
  });
  const [openEditCat, setOpenEditCat] = useState(false);
  const [editCategouryData, setEditCategouryData] = useState<any>(null);
  useEffect(() => {
    setEditCategouryData(allBussinessCategouryRes.data?.data?.data[catIndex]);
  }, [catIndex]);

  const [editCategouryReq, editCategouryRes] = useEditBussinuseCategouryMutation();

  const editCatmethods = useForm({
    resolver: yupResolver(editCategourySchema),
    defaultValues: {
      name: {
        en: allBussinessCategouryRes.data?.data?.data[catIndex]?.name.en,
        ar: allBussinessCategouryRes.data?.data?.data[catIndex]?.name.ar,
        es: allBussinessCategouryRes.data?.data?.data[catIndex]?.name.es,
        tr: allBussinessCategouryRes.data?.data?.data[catIndex]?.name.tr,
        fr: allBussinessCategouryRes.data?.data?.data[catIndex]?.name.fr,
      },
      sort: allBussinessCategouryRes.data?.data?.data[catIndex]?.sort,
    },
  });
  const {
    reset: resetUpdate,
    handleSubmit: handleSubmitUpdate,
    formState: { isSubmitting: isSubmittingUpdate },
  } = editCatmethods;

  useEffect(() => {
    if (openEditCat) {
      resetUpdate({
        name: {
          en: allBussinessCategouryRes.data?.data?.data[catIndex]?.name.en,
          ar: allBussinessCategouryRes.data?.data?.data[catIndex]?.name.ar,
          es: allBussinessCategouryRes.data?.data?.data[catIndex]?.name.es,
          tr: allBussinessCategouryRes.data?.data?.data[catIndex]?.name.tr,
          fr: allBussinessCategouryRes.data?.data?.data[catIndex]?.name.fr,
        },
        sort: allBussinessCategouryRes.data?.data?.data[catIndex]?.sort,
      });
    }
  }, [openEditCat, allBussinessCategouryRes.data?.data?.data[catIndex], reset]);

  const handleEditImage = (files: any) => {
    setEditCategouryData({
      ...editCategouryData,
      image: files[0],
    });
  };

  const handleRemoveEditImage = () => {
    setEditCategouryData({
      ...editCategouryData,
      image: null,
    });
  };
  const editCategoury = handleSubmitUpdate(async (data: any) => {
    const formData = new FormData();
    formData.append('name[en]', data.name.en);
    formData.append('name[ar]', data.name.ar);
    formData.append('name[es]', data.name.es);
    formData.append('name[tr]', data.name.tr);
    formData.append('name[fr]', data.name.fr);
    formData.append('sort', data.sort);
    if (editCategouryData?.image instanceof File) {
      formData.append('image', editCategouryData.image);
    }

    await editCategouryReq({
      id: allBussinessCategouryRes.data?.data?.data[catIndex]._id,
      data: formData,
    }).unwrap();
  });
  useEffect(() => {
    if (editCategouryRes.isSuccess) {
      enqueueSnackbar('categoury updated successfully', { variant: 'success' });
    }
    if (editCategouryRes.isError) {
      enqueueSnackbar('Cannot update the categoury', { variant: 'error' });
    }
  }, [editCategouryRes]);
  // #################
  const settings = useSettingsContext();

  const isNavHorizontal = settings.themeLayout === 'horizontal';

  const isNavMini = settings.themeLayout === 'mini';

  const lgUp = useResponsive('up', 'lg');

  const smUp = useResponsive('up', 'sm');

  const offset = useOffSetTop(HEADER.H_DESKTOP);

  const offsetTop = offset && !isNavHorizontal;

  // ----------------------------------------------------

  // ----------------------------------------------------
  const renderContent = (
    <>
      {lgUp && isNavHorizontal && <Logo full={isNavHorizontal} sx={{ mr: 2.5 }} />}

      {!lgUp && (
        <IconButton onClick={onOpenNav}>
          <SvgColor src="/assets/icons/navbar/ic_menu_item.svg" />
        </IconButton>
      )}

      {smUp && (
        <Box sx={{ transition: 'all .5s', minWidth: '160px', height: '80px' }} onClick={handleOpen}>
          {selectedCat && (
            <Stack direction="row" alignItems="center" spacing="4px" sx={{ cursor: 'pointer' }}>
              <Box
                component="img"
                src={selectedCat?.image}
                sx={{
                  width: '40px',
                  filter: isDarkMode ? 'invert(100%)' : 'none',
                }}
              />
              <Box>
                <Typography
                  component="p"
                  variant="subtitle2"
                  sx={{
                    opacity: 0.8,
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '0.775rem',
                    fontWeight: 900,
                    gap: '3px',
                  }}
                >
                  {' '}
                  <span>{selectedCat?.name?.en}</span>
                  <Box component="img" src="/raw/shopi2.svg" sx={{ color: '#FFFFFF' }} />{' '}
                </Typography>
                <Typography
                  component="p"
                  variant="subtitle2"
                  sx={{ opacity: 0.6, fontSize: '0.675rem' }}
                >
                  {' '}
                  <span>{selectedCat?.name?.en}</span>{' '}
                </Typography>
              </Box>
            </Stack>
          )}
        </Box>
      )}
      <Menu
        id="domain-menu"
        anchorEl={openItems?.item}
        sx={{}}
        onClose={() => handleClose(null)}
        open={Boolean(openItems.open)}
      >
        {allBussinessCategouryRes.data?.data?.data?.map((categoury: any, index: any) => (
          <CategouryItem
            key={index}
            number={index}
            setCatIndex={setCatIndex}
            setOpenEditCat={setOpenEditCat}
            categoury={categoury}
            handleClose={handleClose}
          />
        ))}

        <MenuItem
          onClick={() => {
            handleClose(null);
            setOpenAddCategoury(true);
          }}
        >
          <Stack direction="row" alignItems="center" spacing="20px">
            <Box
              sx={{
                fontSize: '34px',
                color: '#8688A3',
                width: '40px',
                height: '40px',
                borderRadius: '40px',
                border: '2px dashed #8688A3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              +
            </Box>
            <Typography
              component="p"
              variant="subtitle2"
              sx={{ opacity: 0.6, fontSize: '0.675rem' }}
            >
              {' '}
              Add new Project{' '}
            </Typography>
          </Stack>
        </MenuItem>
      </Menu>
      <DetailsNavBar
        open={openAddCategoury}
        onClose={() => setOpenAddCategoury(false)}
        title={`Add New Categoury`}
        actions={
          <Stack alignItems="center" justifyContent="center" spacing="10px">
            <LoadingButton
              fullWidth
              variant="soft"
              color="success"
              size="large"
              loading={isSubmitting}
              onClick={() => {
                addNewCategoury();
                setOpenAddCategoury(false);
              }}
              sx={{ borderRadius: '30px' }}
            >
              Add
            </LoadingButton>
          </Stack>
        }
      >
        <FormProvider methods={addCategouryMethods} onSubmit={addNewCategoury}>
          <Box width="100%">
            <Box>
              {categouryData?.image ? (
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
                      typeof categouryData?.image === 'string'
                        ? categouryData?.image
                        : URL.createObjectURL(categouryData?.image)
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
                      <span style={{ color: '#8688A3', fontSize: '.6rem' }}>Upload Image</span>
                    </Box>
                  }
                />
              )}
            </Box>
            <Typography
              component="p"
              noWrap
              variant="subtitle2"
              sx={{ opacity: 0.7, fontSize: '.9rem', maxWidth: { xs: '120px', md: '218px' } }}
            >
              EN
            </Typography>
            <RHFTextField fullWidth variant="filled" name="en" multiline rows={5} />
            <Typography
              component="p"
              noWrap
              variant="subtitle2"
              sx={{ opacity: 0.7, fontSize: '.9rem', maxWidth: { xs: '120px', md: '218px' } }}
            >
              AR
            </Typography>
            <RHFTextField fullWidth variant="filled" name="ar" multiline rows={5} />
            <Typography
              component="p"
              noWrap
              variant="subtitle2"
              sx={{ opacity: 0.7, fontSize: '.9rem', maxWidth: { xs: '120px', md: '218px' } }}
            >
              ES
            </Typography>
            <RHFTextField fullWidth variant="filled" name="es" multiline rows={5} />
            <Typography
              component="p"
              noWrap
              variant="subtitle2"
              sx={{ opacity: 0.7, fontSize: '.9rem', maxWidth: { xs: '120px', md: '218px' } }}
            >
              FR
            </Typography>
            <RHFTextField fullWidth variant="filled" name="fr" multiline rows={5} />
            <Typography
              component="p"
              noWrap
              variant="subtitle2"
              sx={{ opacity: 0.7, fontSize: '.9rem', maxWidth: { xs: '120px', md: '218px' } }}
            >
              TR
            </Typography>
            <RHFTextField fullWidth variant="filled" name="tr" multiline rows={5} />
          </Box>
        </FormProvider>
      </DetailsNavBar>

      {/* edit cat */}

      <DetailsNavBar
        open={openEditCat}
        onClose={() => {
          setOpenEditCat(false);
        }}
        title={`Add New Categoury`}
        actions={
          <Stack alignItems="center" justifyContent="center" spacing="10px">
            <LoadingButton
              fullWidth
              variant="soft"
              color="success"
              size="large"
              loading={isSubmittingUpdate}
              onClick={() => {
                editCategoury();
                setOpenEditCat(false);
              }}
              sx={{ borderRadius: '30px' }}
            >
              Edit
            </LoadingButton>
          </Stack>
        }
      >
        <FormProvider methods={editCatmethods} onSubmit={editCategoury}>
          <Box width="100%">
            <Box>
              {editCategouryData?.image ? (
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
                      typeof editCategouryData?.image === 'string'
                        ? editCategouryData?.image
                        : URL.createObjectURL(editCategouryData?.image)
                    }
                    alt=""
                    sx={{ maxHeight: '95px' }}
                  />
                  <Box
                    onClick={() => handleRemoveEditImage()}
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
                  onDrop={handleEditImage}
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
                      <span style={{ color: '#8688A3', fontSize: '.6rem' }}>Upload Image</span>
                    </Box>
                  }
                />
              )}
            </Box>
            <Typography
              component="p"
              noWrap
              variant="subtitle2"
              sx={{ opacity: 0.7, fontSize: '.9rem', maxWidth: { xs: '120px', md: '218px' } }}
            >
              EN
            </Typography>
            <RHFTextField fullWidth variant="filled" name="name.en" />
            <Typography
              component="p"
              noWrap
              variant="subtitle2"
              sx={{ opacity: 0.7, fontSize: '.9rem', maxWidth: { xs: '120px', md: '218px' } }}
            >
              AR
            </Typography>
            <RHFTextField fullWidth variant="filled" name="name.ar" />
            <Typography
              component="p"
              noWrap
              variant="subtitle2"
              sx={{ opacity: 0.7, fontSize: '.9rem', maxWidth: { xs: '120px', md: '218px' } }}
            >
              ES
            </Typography>
            <RHFTextField fullWidth variant="filled" name="name.es" />
            <Typography
              component="p"
              noWrap
              variant="subtitle2"
              sx={{ opacity: 0.7, fontSize: '.9rem', maxWidth: { xs: '120px', md: '218px' } }}
            >
              FR
            </Typography>
            <RHFTextField fullWidth variant="filled" name="name.fr" />
            <Typography
              component="p"
              noWrap
              variant="subtitle2"
              sx={{ opacity: 0.7, fontSize: '.9rem', maxWidth: { xs: '120px', md: '218px' } }}
            >
              TR
            </Typography>
            <RHFTextField fullWidth variant="filled" name="name.tr" />
            <Typography
              component="p"
              noWrap
              variant="subtitle2"
              sx={{ opacity: 0.7, fontSize: '.9rem', maxWidth: { xs: '120px', md: '218px' } }}
            >
              Sort
            </Typography>
            <RHFTextField fullWidth type="number" variant="filled" name="sort" />
          </Box>
        </FormProvider>
      </DetailsNavBar>

      <Searchbar />

      <Stack
        flexGrow={1}
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        spacing={{ xs: 0.5, sm: 1 }}
      >
        <LanguagePopover />

        <NotificationsPopover />

        <ContactsPopover />

        <SettingsButton />

        <AccountPopover />
      </Stack>
    </>
  );

  return (
    <AppBar
      sx={{
        boxShadow: '0px 3px 20px #00000014 ',
        height: HEADER.H_MOBILE,
        zIndex: theme.zIndex.appBar + 1,
        ...bgBlur({
          color: theme.palette.background.default,
        }),
        transition: theme.transitions.create(['height'], {
          duration: theme.transitions.duration.shorter,
        }),
        ...(lgUp && {
          width: `calc(100% - ${NAV.W_VERTICAL + 1}px)`,
          height: HEADER.H_DESKTOP,
          ...(offsetTop && {
            height: HEADER.H_DESKTOP_OFFSET,
          }),
          ...(isNavHorizontal && {
            width: 1,
            bgcolor: 'background.default',
            height: HEADER.H_DESKTOP_OFFSET,
            borderBottom: `dashed 1px ${theme.palette.divider}`,
          }),
          ...(isNavMini && {
            width: `calc(100% - ${NAV.W_MINI + 1}px)`,
          }),
        }),
      }}
    >
      <Toolbar
        sx={{
          height: 1,
          px: { lg: 5 },
        }}
      >
        {renderContent}
      </Toolbar>
    </AppBar>
  );
}
