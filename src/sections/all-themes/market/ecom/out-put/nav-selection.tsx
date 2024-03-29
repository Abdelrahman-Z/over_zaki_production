import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { TextField, Typography, Box, RadioGroup, FormControlLabel, Radio, Stack, Tabs, Tab, Slider } from '@mui/material';
import ComponentBlock from 'src/sections/_examples/component-block';
import Iconify from 'src/components/iconify';
import { MuiColorInput } from 'mui-color-input';
import { socketClient } from 'src/sections/all-themes/utils/helper-functions';
import { VisuallyHiddenInput } from './logo-part';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/redux/store/store';
import { saveLogo } from 'src/redux/store/thunks/builder';

// ----------------------------------------------------------------------

const TABS = [
    {
        value: 'Layout',
        label: 'Layout',
    },
    {
        value: 'Style',
        label: 'Style',
    },
    {
        value: 'Components',
        label: 'Components',
    },
];
interface NavProps {
    themeConfig: {
        navLogoPosition: string;
    };
    handleThemeConfig: (key: string, value: any) => void; // Adjust 'value' type as needed
    mobile?: boolean;
    builder_Id: any
}

export default function NavDealer({ themeConfig, handleThemeConfig, mobile = false, builder_Id }: NavProps) {

    const [currentTab, setCurrentTab] = useState('Layout');
    const [appBar, setAppBar] = useState<any>({});
    const [mainAppBar, setMainAppBar] = useState<any>({});
    const socket = socketClient();
    const dispatch = useDispatch<AppDispatch>();




    const debounce = (func: any, delay: any) => {
        let timeoutId: any;
        return (...args: any) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func(...args);
            }, delay);
        };
    };


    const handleChangeEvent = debounce((key: string, newValue: any, parentClass: string, subchild: string = "") => {
        let _socketKey = '';
        let valueToShare = '';


        if (subchild === "mobileView") {

            const nestedAppbar = appBar?.[parentClass]?.[subchild] ?? {};
            setAppBar({ ...appBar, [parentClass]: { [subchild]: { ...nestedAppbar, [key]: newValue } } });

        } else {
            const nestedAppbar = appBar?.[parentClass] ?? {};
            setAppBar({ ...appBar, [parentClass]: { ...nestedAppbar, [key]: newValue } });

        }



        _socketKey = parentClass ? parentClass + '.' + (subchild ? subchild + "." : "") + key : key;
        // valueToShare = typeof newValue === 'number' ? `${newValue}px` : newValue;
        valueToShare = newValue;

        const targetHeader = 'appBar.';
        const data = {
            builderId: builder_Id,
            key: targetHeader + _socketKey,
            value: valueToShare,
        };

        console.log(data);


        if (socket) {
            socket.emit('website:cmd', data);
        }


    }, 500);


    const isColorValid = (color: string) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$|^rgb\(\d{1,3}, \d{1,3}, \d{1,3}\)$|^rgba\(\d{1,3}, \d{1,3}, \d{1,3}, (0(\.\d{1,2})?|1(\.0{1,2})?)\)$|^hsl\(\d{1,3}, \d{1,3}%, \d{1,3}%\)$|^hsla\(\d{1,3}, \d{1,3}%, \d{1,3}%, (0(\.\d{1,2})?|1(\.0{1,2})?)\)$/.test(color);
    const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
        setCurrentTab(newValue);
    }, []);


    const handleImageChange64 = (key: string) => (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result?.toString().split(',')[1]; // Get the base64 data
                // console.log('Base64:', base64); // Log the base64 data
                // setImagePreview(reader.result?.toString() || null);
                // handleThemeConfig(key, reader.result?.toString() || "");

                const newLogoObj = {
                    ...appBar,
                    logoObj: {
                        ...appBar.logoObj,
                        logo: reader.result?.toString(),
                    },
                }
                setAppBar(newLogoObj)

                saveTempData(file);


            };

            reader.readAsDataURL(file); // Read the file as data URL
        } else {
            alert('Please select a valid image file.');
        }
    };
    const saveTempData = (file: any) => {
        const formDataToSend = new FormData();
        formDataToSend.append('image', file);

        dispatch(saveLogo({ builderId: builder_Id, data: formDataToSend })).then((response: any) => {
            // console.log("response", response);
        });
    }
    // const appBar = {
    //     app_bar: [],
    //     container: {
    //         show: true,
    //         isShadow: false,
    //         startColor: 'empty value',
    //         finalColor: 'empty value',
    //         width: 'empty value',
    //         ...
    //     } 
    //     icon: {
    //         borderRaduis: 0,
    //         backgroundColor: 'empty value',
    //         backgroundColorDark: 'empty value',
    //         hasBackground: true,
    //         tintColor: 'empty value',
    //         ...
    //     },
    //     position: "top",
    //     text: {
    //         size: '18',
    //         isBold: false,
    //         color: '#2b2bd0',
    //         colorDark: 'empty value',
    //         numberOfLines: 0,
    //         ....
    //     },
    //     _id: "65c35be1e2b047cbfa36a696",
    // }


    return (
        <div>

            <Stack spacing={2} sx={{
                width: 1, maxHeight: "700px", overflow: "auto",
                scrollbarWidth: "none", // Hide the scrollbar for firefox
                '&::-webkit-scrollbar': {
                    display: 'none', // Hide the scrollbar for WebKit browsers (Chrome, Safari, Edge, etc.)
                },
                '&-ms-overflow-style:': {
                    display: 'none', // Hide the scrollbar for IE
                },
            }}>
                <Tabs value={currentTab} onChange={handleChangeTab}>
                    {TABS.map((tab) => (
                        <Tab key={tab.value} value={tab.value} label={tab.label} />
                    ))}
                </Tabs>

                {currentTab == "Layout" && (
                    <Box>
                        <Typography variant='caption' color='#8688A3'>
                            Container
                        </Typography>
                        <Stack direction='column' gap={2} alignItems='center' justifyContent='space-between' sx={{
                            width: '100%',
                            minHeight: '61px',
                            border: '4px solid #8688A333',
                            borderRadius: '8px',
                            px: 2,
                            py: 3,
                        }}>
                            <Box sx={{ width: "100%" }} >
                                <Typography variant='caption' color='#8688A3'>Show</Typography>
                                <RadioGroup row value={appBar?.container?.show || "true"} onChange={(event: any) => handleChangeEvent('show', event?.target?.value, 'container')}>
                                    <FormControlLabel value="true" control={<Radio size="medium" />} label="true" />
                                    <FormControlLabel value="false" control={<Radio size="medium" />} label="false" />
                                </RadioGroup>
                            </Box>
                            <Box sx={{ width: "100%" }} >
                                <Typography variant='caption' color='#8688A3'>Shadow</Typography>
                                <RadioGroup row value={appBar?.container?.isShadow || "true"} onChange={(event: any) => handleChangeEvent('isShadow', event?.target?.value, 'container')}>
                                    <FormControlLabel value={"true"} control={<Radio size="medium" />} label="Show" />
                                    <FormControlLabel value={"false"} control={<Radio size="medium" />} label="Hide" />
                                </RadioGroup>
                            </Box>
                            <Box sx={{ width: "100%" }} >
                                <Typography variant='caption' color='#8688A3'>Background Color</Typography>
                                <Stack direction='row' alignItems='center' spacing='18px'>
                                    <MuiColorInput sx={{ width: "100%", margin: "auto", }} variant="outlined"
                                        value={appBar?.container?.backgroundColor ?? "#000001"}
                                        format="hex"
                                        onChange={event => isColorValid(event) ? handleChangeEvent('backgroundColor', event, 'container') : null}
                                    />
                                </Stack>
                            </Box>
                            <Box sx={{ width: "100%" }} >
                                <Typography variant='caption' color='#8688A3'>Background Color(Dark)</Typography>
                                <Stack direction='row' alignItems='center' spacing='18px'>
                                    <MuiColorInput sx={{ width: "100%", margin: "auto", }} variant="outlined"
                                        value={appBar?.container?.backgroundColorDark ?? "#000001"}
                                        format="hex"
                                        onChange={event => isColorValid(event) ? handleChangeEvent('backgroundColorDark', event, 'container') : null}
                                    />
                                </Stack>
                            </Box>
                            <Box sx={{ width: "100%" }} >
                                <Typography variant='caption' color='#8688A3'>Border Bottom Width</Typography>
                                <Stack direction='row' alignItems='center' spacing='18px'>
                                    <Stack direction="row" alignItems="center" spacing={1} width={1}>
                                        <Slider
                                            value={appBar?.container?.borderBottomWidth || 0}
                                            onChange={(_event: Event, newValue: number | number[]) => {
                                                console.log(newValue);

                                                handleChangeEvent('borderBottomWidth', newValue, 'container')
                                            }
                                            }
                                            valueLabelDisplay="auto"
                                            marks
                                            step={5}
                                            min={0}
                                            max={20}
                                        />
                                    </Stack>
                                </Stack>
                            </Box>
                            <Box sx={{ width: "100%" }} >
                                <Typography variant='caption' color='#8688A3'>Border Bottom Color</Typography>
                                <Stack direction='row' alignItems='center' spacing='18px'>
                                    <MuiColorInput sx={{ width: "100%", margin: "auto", }} variant="outlined"
                                        value={appBar?.container?.borderBottomColor ?? "#000001"}
                                        format="hex"
                                        // onChange={event => isColorValid(event) ? setAppBar({ ...appBar, borderBottomColor: event }) : null}
                                        onChange={event => isColorValid(event) ? handleChangeEvent('borderBottomColor', event, 'container') : null}
                                    />
                                </Stack>
                            </Box>
                            <Box sx={{ width: "100%" }} >
                                <Typography variant='caption' color='#8688A3'>Margin Bottom</Typography>
                                <Stack direction='row' alignItems='center' spacing='18px'>
                                    <Stack direction="row" alignItems="center" spacing={1} width={1}>
                                        <Slider
                                            value={appBar?.container?.marginBottom || 0}
                                            onChange={(_event: Event, newValue: number | number[]) => handleChangeEvent('marginBottom', newValue, 'container', 'containerViewStyle')}
                                            valueLabelDisplay="auto"
                                            marks
                                            min={0}
                                            max={20}
                                        />
                                    </Stack>
                                </Stack>
                            </Box>

                        </Stack>
                    </Box>
                )}

                {currentTab == "Style" && (
                    <Box>
                        <Box>
                            <Typography variant='caption' color='#8688A3'>
                                Text
                            </Typography>
                            <Stack direction='column' gap={2} alignItems='start' justifyContent='space-between' sx={{
                                width: '100%',
                                minHeight: '61px',
                                border: '4px solid #8688A333',
                                borderRadius: '8px',
                                px: 2,
                                py: 3,
                            }}>

                                <Box sx={{ width: "100%" }} >
                                    <Typography variant='caption' color='#8688A3'>Size</Typography>
                                    <Stack direction='row' alignItems='start' spacing='18px'>
                                        <Stack direction="row" alignItems="start" spacing={1} width={1}>
                                            <TextField variant='filled'
                                                type='number'
                                                value={appBar?.text?.size ?? ""}
                                                // onChange={event => setAppBar({ ...appBar, width: event.target.value })}
                                                onChange={event => handleChangeEvent('size', event.target.value, 'text')}
                                            />
                                        </Stack>
                                    </Stack>
                                </Box>

                                <Box sx={{ width: "100%" }} >
                                    <Typography variant='caption' color='#8688A3'>Is Bold</Typography>
                                    <RadioGroup row value={appBar?.text?.isBold || "true"} onChange={(event: any) => handleChangeEvent('isBold', event?.target?.value, 'text')}>
                                        <FormControlLabel value="true" control={<Radio size="medium" />} label="Show" />
                                        <FormControlLabel value="false" control={<Radio size="medium" />} label="Hide" />
                                    </RadioGroup>
                                </Box>
                                <Box sx={{ width: "100%" }} >
                                    <Typography variant='caption' color='#8688A3'>Color</Typography>
                                    <Stack direction='row' alignItems='center' spacing='18px'>
                                        <MuiColorInput sx={{ width: "100%", margin: "auto", }} variant="outlined"
                                            value={appBar?.text?.color ?? "#000001"}
                                            format="hex"
                                            // onChange={event => isColorValid(event) ? setAppBar({ ...appBar, color: event }) : null}
                                            onChange={event => isColorValid(event) ? handleChangeEvent('color', event, 'text') : null}
                                        />
                                    </Stack>
                                </Box>

                            </Stack>
                        </Box>
                        <Box mt='20px'>
                            <Typography variant='caption' color='#8688A3'>
                                Icons
                            </Typography>
                            <Stack direction='column' gap={2} alignItems='center' justifyContent='space-between' sx={{
                                width: '100%',
                                minHeight: '61px',
                                border: '4px solid #8688A333',
                                borderRadius: '8px',
                                px: 2,
                                py: 3,
                            }}>

                                <Box sx={{ width: "100%" }} >
                                    <Typography variant='caption' color='#8688A3'>Has Background</Typography>
                                    <RadioGroup row value={appBar?.icon?.hasBackground || "true"} onChange={(event: any) => handleChangeEvent('hasBackground', event?.target?.value, 'icon')}>
                                        <FormControlLabel value="true" control={<Radio size="medium" />} label="Show" />
                                        <FormControlLabel value="false" control={<Radio size="medium" />} label="Hide" />
                                    </RadioGroup>
                                </Box>
                                <Box sx={{ width: "100%" }} >
                                    <Typography variant='caption' color='#8688A3'>Background Color</Typography>
                                    <Stack direction='row' alignItems='center' spacing='18px'>
                                        <MuiColorInput sx={{ width: "100%", margin: "auto", }} variant="outlined"
                                            value={appBar?.icon?.backgroundColor ?? "#000001"}
                                            format="hex"
                                            // onChange={event => isColorValid(event) ? setAppBar({ ...appBar, backgroundColor: event }) : null}
                                            onChange={event => isColorValid(event) ? handleChangeEvent('backgroundColor', event, 'icon') : null}
                                        />
                                    </Stack>
                                </Box>
                                <Box sx={{ width: "100%" }} >
                                    <Typography variant='caption' color='#8688A3'>Color</Typography>
                                    <Stack direction='row' alignItems='center' spacing='18px'>
                                        <MuiColorInput sx={{ width: "100%", margin: "auto", }} variant="outlined"
                                            value={appBar?.icon?.tintColor ?? "#000001"}
                                            format="hex"
                                            // onChange={event => isColorValid(event) ? setAppBar({ ...appBar, tintColor: event }) : null}
                                            onChange={event => isColorValid(event) ? handleChangeEvent('tintColor', event, 'icon') : null}
                                        />
                                    </Stack>
                                </Box>

                                <Box sx={{ width: "100%" }} >
                                    <Typography variant='caption' color='#8688A3'>Shadow</Typography>
                                    <RadioGroup row value={appBar?.icon?.shadow || "true"} onChange={(event: any) => handleChangeEvent('shadow', event?.target?.value, 'icon')}>
                                        <FormControlLabel value={"true"} control={<Radio size="medium" />} label="Show" />
                                        <FormControlLabel value={"false"} control={<Radio size="medium" />} label="Hide" />
                                    </RadioGroup>
                                </Box>

                                <Box sx={{ width: "100%" }} >
                                    <Typography variant='caption' color='#8688A3'>Border Radius (%)</Typography>
                                    <Stack direction='row' alignItems='center' spacing='18px'>
                                        <Stack direction="row" alignItems="center" spacing={1} width={1}>
                                            <Slider
                                                value={appBar?.icon?.borderRaduis || 0}
                                                onChange={(_event: Event, newValue: number | number[]) => handleChangeEvent('borderRaduis', newValue, 'icon')}
                                                valueLabelDisplay="auto"
                                                marks
                                                step={5}
                                                min={0}
                                                max={100}
                                            />
                                        </Stack>
                                    </Stack>
                                </Box>
                                <Box sx={{ width: "100%" }} >
                                    <Typography variant='caption' color='#8688A3'>Border Color</Typography>
                                    <Stack direction='row' alignItems='center' spacing='18px'>
                                        <MuiColorInput sx={{ width: "100%", margin: "auto", }} variant="outlined"
                                            value={appBar?.icon?.borderColor ?? "#000001"}
                                            format="hex"
                                            // onChange={event => isColorValid(event) ? setAppBar({ ...appBar, borderColor: event }) : null}
                                            onChange={event => isColorValid(event) ? handleChangeEvent('borderColor', event, 'icon') : null}
                                        />
                                    </Stack>
                                </Box>
                                <Box sx={{ width: "100%", display: 'flex', gap: 2 }} >
                                    <Box>
                                        <Typography variant='caption' color='#8688A3'>Width</Typography>
                                        <Stack direction='row' alignItems='center' spacing='18px'>
                                            <Stack direction="row" alignItems="center" spacing={1} width={1}>
                                                <TextField variant='filled'
                                                    type='number'
                                                    value={appBar?.icon?.width}
                                                    // onChange={event => setAppBar({ ...appBar, width: event.target.value })}
                                                    onChange={event => handleChangeEvent('width', event.target.value, 'icon')}
                                                />
                                            </Stack>
                                        </Stack>
                                    </Box>
                                    <Box>
                                        <Typography variant='caption' color='#8688A3'>Height</Typography>
                                        <Stack direction='row' alignItems='center' spacing='18px'>
                                            <Stack direction="row" alignItems="center" spacing={1} width={1}>
                                                <TextField variant='filled'
                                                    type='number'
                                                    value={appBar?.icon?.height}
                                                    // onChange={event => setAppBar({ ...appBar, height: event.target.value })}
                                                    onChange={event => handleChangeEvent('height', event.target.value, 'icon')}
                                                />
                                            </Stack>
                                        </Stack>
                                    </Box>
                                </Box>

                            </Stack>
                        </Box>
                    </Box>
                )}
                {currentTab == "Components" && (
                    <Box>
                        <Box>
                            <Typography variant='caption' color='#8688A3'>
                                Logo
                            </Typography>
                            <Stack direction='column' gap={2} alignItems='start' justifyContent='space-between' sx={{
                                width: '100%',
                                minHeight: '61px',
                                border: '4px solid #8688A333',
                                borderRadius: '8px',
                                px: 2,
                                py: 3,
                            }}>

                                <Box sx={{ width: "100%" }} >
                                    <Typography variant='caption' color='#8688A3'>Show</Typography>
                                    <RadioGroup row value={appBar?.logoObj?.status || "true"} onChange={(event: any) => handleChangeEvent('status', event?.target?.value, 'logoObj')}>
                                        <FormControlLabel value="true" control={<Radio size="medium" />} label="true" />
                                        <FormControlLabel value="false" control={<Radio size="medium" />} label="false" />
                                    </RadioGroup>
                                </Box>


                                <Box sx={{ width: "100%" }} >
                                    <Typography variant='caption' color='#8688A3'>Position</Typography>
                                    <RadioGroup row value={appBar?.logoObj?.position || "center"} onChange={(event: any) => handleChangeEvent('position', event?.target?.value, 'logoObj')}>
                                        <FormControlLabel value="left  " control={<Radio size="medium" />} label="Left" />
                                        <FormControlLabel value="center " control={<Radio size="medium" />} label="Center " />
                                        <FormControlLabel value="right" control={<Radio size="medium" />} label="Right" />
                                    </RadioGroup>
                                </Box>



                                <Box sx={{ width: "100%" }} >
                                    <Typography variant='caption' color='#8688A3' mb={2}>Upload Image</Typography>
                                    <Box sx={{
                                        width: "80px",
                                        height: "80px",
                                        outline: "#EBEBF0 dashed 4px",
                                        borderRadius: "20px",
                                        display: 'flex',
                                        marginTop: "10px",
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundImage: `url(${appBar?.logoObj?.logo})`,
                                        backgroundSize: '100% 100%',
                                    }} component="label" >

                                        <VisuallyHiddenInput type='file' onChange={handleImageChange64('logo')} />
                                        <Iconify icon='bi:image' style={{ color: '#C2C3D1', display: appBar?.logoObj?.logo ? 'none' : 'block' }} />
                                    </Box>
                                </Box>
                                <Box sx={{ width: "100%" }} >
                                    <Typography variant='caption' color='#8688A3'>Logo Text</Typography>
                                    <Stack direction="row" alignItems="center" spacing={1} width={1}>
                                        <TextField variant='filled'
                                            type='text'
                                            fullWidth
                                            value={appBar?.logoObj?.text}
                                            onChange={event => handleChangeEvent('text', event.target.value, 'logoObj')}
                                        />
                                    </Stack>
                                </Box>

                                <Box sx={{ width: "100%" }} >
                                    <Typography variant='caption' color='#8688A3'>Text Background</Typography>
                                    <Stack direction='row' alignItems='center' spacing='18px'>
                                        <MuiColorInput sx={{ width: "100%", margin: "auto", }} variant="outlined"
                                            value={appBar?.logoObj?.textBg ?? "#000001"}
                                            format="hex"
                                            onChange={event => isColorValid(event) ? handleChangeEvent('textBg', event, 'logoObj') : null}
                                        />
                                    </Stack>
                                </Box>
                                <Box sx={{ width: "100%" }} >
                                    <Typography variant='caption' color='#8688A3'>Text Color</Typography>
                                    <Stack direction='row' alignItems='center' spacing='18px'>
                                        <MuiColorInput sx={{ width: "100%", margin: "auto", }} variant="outlined"
                                            value={appBar?.logoObj?.color ?? "#000001"}
                                            format="hex"
                                            onChange={event => isColorValid(event) ? handleChangeEvent('color', event, 'logoObj') : null}
                                        />
                                    </Stack>
                                </Box>
                                <Box sx={{ width: "100%" }} >
                                    <Typography variant='caption' color='#8688A3'>Border Width (%)</Typography>
                                    <Stack direction='row' alignItems='center' spacing='18px'>
                                        <Stack direction="row" alignItems="center" spacing={1} width={1}>
                                            <Slider
                                                value={appBar?.logoObj?.borderWidth || 0}
                                                onChange={(_event: Event, newValue: number | number[]) => handleChangeEvent('borderWidth', newValue, 'logoObj')}
                                                valueLabelDisplay="auto"
                                                marks
                                                step={1}
                                                min={0}
                                                max={5}
                                            />
                                        </Stack>
                                    </Stack>
                                </Box>

                                <Box sx={{ width: "100%", display: 'flex', gap: 2 }} >
                                    <Box>
                                        <Typography variant='caption' color='#8688A3'>Width</Typography>
                                        <Stack direction='row' alignItems='center' spacing='18px'>
                                            <Stack direction="row" alignItems="center" spacing={1} width={1}>
                                                <TextField variant='filled'
                                                    type='number'
                                                    value={appBar?.logoObj?.width}
                                                    onChange={event => handleChangeEvent('width', event.target.value, 'logoObj')}
                                                />
                                            </Stack>
                                        </Stack>
                                    </Box>
                                    <Box>
                                        <Typography variant='caption' color='#8688A3'>Height</Typography>
                                        <Stack direction='row' alignItems='center' spacing='18px'>
                                            <Stack direction="row" alignItems="center" spacing={1} width={1}>
                                                <TextField variant='filled'
                                                    type='number'
                                                    value={appBar?.logoObj?.height}
                                                    onChange={event => handleChangeEvent('height', event.target.value, 'logoObj')}
                                                />
                                            </Stack>
                                        </Stack>
                                    </Box>
                                </Box>

                            </Stack>
                        </Box>
                        <Box mt='20px'>
                            <Typography variant='caption' color='#8688A3'>
                                Search
                            </Typography>
                            <Stack direction='column' gap={2} alignItems='center' justifyContent='space-between' sx={{
                                width: '100%',
                                minHeight: '61px',
                                border: '4px solid #8688A333',
                                borderRadius: '8px',
                                px: 2,
                                py: 3,
                            }}>


                                <Box sx={{ width: "100%" }} >
                                    <Typography variant='caption' color='#8688A3'>Show</Typography>
                                    <RadioGroup row value={appBar?.search?.status || "true"} onChange={(event: any) => handleChangeEvent('status', event?.target?.value, 'search')}>
                                        <FormControlLabel value="true" control={<Radio size="medium" />} label="true" />
                                        <FormControlLabel value="false" control={<Radio size="medium" />} label="false" />
                                    </RadioGroup>
                                </Box>


                                <Box sx={{ width: "100%" }} >
                                    <Typography variant='caption' color='#8688A3'>Position</Typography>
                                    <RadioGroup row value={appBar?.search?.position || "center"} onChange={(event: any) => handleChangeEvent('position', event?.target?.value, 'search')}>
                                        <FormControlLabel value="left  " control={<Radio size="medium" />} label="Left" />
                                        <FormControlLabel value="center " control={<Radio size="medium" />} label="Center " />
                                        <FormControlLabel value="right" control={<Radio size="medium" />} label="Right" />
                                    </RadioGroup>
                                </Box>

                                <Box sx={{ width: "100%" }} >
                                    <Typography variant='caption' color='#8688A3'>Show Input</Typography>
                                    <RadioGroup row value={appBar?.search?.input || "true"} onChange={(event: any) => handleChangeEvent('input', event?.target?.value, 'search')}>
                                        <FormControlLabel value="true" control={<Radio size="medium" />} label="true" />
                                        <FormControlLabel value="false" control={<Radio size="medium" />} label="false" />
                                    </RadioGroup>
                                </Box>


                                <Box sx={{ width: "100%" }} >
                                    <Typography variant='caption' color='#8688A3'>Text Color</Typography>
                                    <Stack direction='row' alignItems='center' spacing='18px'>
                                        <MuiColorInput sx={{ width: "100%", margin: "auto", }} variant="outlined"
                                            value={appBar?.search?.textColor ?? "#000001"}
                                            format="hex"
                                            onChange={event => isColorValid(event) ? handleChangeEvent('textColor', event, 'search') : null}
                                        />
                                    </Stack>
                                </Box>

                                <Box sx={{ width: "100%" }} >
                                    <Typography variant='caption' color='#8688A3'>Text Background Color</Typography>
                                    <Stack direction='row' alignItems='center' spacing='18px'>
                                        <MuiColorInput sx={{ width: "100%", margin: "auto", }} variant="outlined"
                                            value={appBar?.search?.textBg ?? "#000001"}
                                            format="hex"
                                            onChange={event => isColorValid(event) ? handleChangeEvent('textBg', event, 'search') : null}
                                        />
                                    </Stack>
                                </Box>

                                <Box sx={{ width: "100%" }} >
                                    <Typography variant='caption' color='#8688A3'>Border Color</Typography>
                                    <Stack direction='row' alignItems='center' spacing='18px'>
                                        <MuiColorInput sx={{ width: "100%", margin: "auto", }} variant="outlined"
                                            value={appBar?.search?.borderColor ?? "#000001"}
                                            format="hex"
                                            onChange={event => isColorValid(event) ? handleChangeEvent('borderColor', event, 'search') : null}
                                        />
                                    </Stack>
                                </Box>
                                {/* borderWidth */}
                                <Box sx={{ width: "100%" }} >
                                    <Typography variant='caption' color='#8688A3'>Border Width (%)</Typography>
                                    <Stack direction='row' alignItems='center' spacing='18px'>
                                        <Stack direction="row" alignItems="center" spacing={1} width={1}>
                                            <Slider
                                                value={appBar?.search?.borderWidth || 0}
                                                onChange={(_event: Event, newValue: number | number[]) => handleChangeEvent('borderWidth', newValue, 'search')}
                                                valueLabelDisplay="auto"
                                                marks
                                                step={1}
                                                min={0}
                                                max={5}
                                            />
                                        </Stack>
                                    </Stack>
                                </Box>

                                <Box sx={{ width: "100%" }} >
                                    <Typography variant='caption' color='#8688A3'>Mobile View</Typography>
                                    <RadioGroup row value={appBar?.search?.mobileView?.status || "true"} onChange={(event: any) => handleChangeEvent('status', event?.target?.value, 'search', 'mobileView')}>
                                        <FormControlLabel value="true" control={<Radio size="medium" />} label="Show" />
                                        <FormControlLabel value="false" control={<Radio size="medium" />} label="hide" />
                                    </RadioGroup>
                                </Box>







                            </Stack>
                        </Box>
                    </Box>
                )}

            </Stack>
        </div>
    );
}
