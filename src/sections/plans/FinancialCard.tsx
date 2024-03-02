'use client';
import {
  Box,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import { useState } from 'react';
import PlanAdvanced from '../../assets/icons/advanced@2x.png';
import PlanProIcon from '../../assets/icons/pro@2x.png';
import FeatureCart from './featureCart';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const FinancialPlanCard = ({ plan, features, setFeatures }: any) => {
  let language = 'en';
  const [edit, setEdit] = useState({});
  const [showIcons, setShowIcons] = useState(false);
  const [isShowMore, setIsShowMore] = useState(false);
 
  const handleFeatureChange = (value: any) => {
    setFeatures((prev: any) => {
      return prev.map((item: any) => (item._id === value._id ? value : item));
    });
  };

  return (
    <Box
      component={Paper}
      sx={{
        boxShadow: '0px 4px 20px #0F134914',
        overflow: 'hidden',
        borderRadius: '20px',
      }}
    >
      <TableContainer>
        <Table
          aria-label="financial plan table"
          sx={{
            width: { xs: 'calc(100vw - 80px)', sm: '100vw' },
            maxWidth: { xs: '410px', sm: '410px' },
            minWidth: { xs: '200px', sm: '330px' },
            height: { xs: '540px', sm: '580px' },
          }}
        >
          <TableBody
            sx={{
              '&::-webkit-scrollbar-thumb': { color: '#1BFCB6' },
              height: '600px',
              overflow: 'auto',
              scrollbarWidth: 'thin',
              p: { xs: 1.5, sm: 2.5, md: 3.75 },
              boxSizing: 'border-box',
              display: 'flex',
              flexWrap: 'wrap',
            }}
          >
            <TableContainer sx={{ overflowX: 'hidden', overflowY: 'auto' }}>
              <TableRow sx={{ display: 'flex' }}>
                <TableContainer>
                  <TableRow sx={{ textAlign: 'start !important' }}>
                    <TableCell
                      sx={{
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
    </Box>
  );
};

export default FinancialPlanCard;
