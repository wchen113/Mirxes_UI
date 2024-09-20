import { Box, Button, Typography, useTheme } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import Header from "../../Components/Header";
import GeographyChart from "../../Components/GeographyChart";
import { mockTransactions, mockBOM, mockSupplier, mockPO, mockNews } from "../../data/mockData";
import { tokens } from "../../theme";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const handleBoxClick = (path) => {
    navigate(path);
  };

const blinkContentAnimation = {
  '@keyframes blinkRed': {
    '0%': { backgroundColor: colors.primary[400] },
    '50%': { backgroundColor: 'red' },
    '100%': { backgroundColor: colors.primary[400] },
  },
  animation: 'blinkRed 1s infinite',
};


  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center" marginTop="70px">
        <Header title="DASHBOARD" />
        {/* <Button
          sx={{
            backgroundColor: colors.blueAccent[700],
            color: colors.grey[100],
            fontSize: "14px",
            fontWeight: "bold",
            padding: "10px 20px",
          }}
        >
          <DownloadOutlinedIcon sx={{ mr: "10px" }} />
          Download Reports
        </Button> */}
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* Sales Order */}
      <Box
  gridColumn="span 4"
  gridRow="span 3"
  backgroundColor={colors.primary[400]}
  overflow="auto"
  sx={{ cursor: 'pointer' }}
  onClick={() => handleBoxClick('/salesorder')}
>
  {/* Header (No animation) */}
  <Box
    display="flex"
    justifyContent="space-between"
    alignItems="center"
    borderBottom={`4px solid ${colors.blueAccent[500]}`}
    color={colors.grey[100]}
    p="15px"
  >
    <Typography color={colors.blueAccent[500]} variant="h5" fontWeight="600">
      Sales Order
    </Typography>
  </Box>

  {mockTransactions.map((transaction, i) => (
    <Box
      key={`${transaction.txId}-${i}`}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      borderBottom={`4px solid ${colors.primary[500]}`}
      p="15px"
      sx={i === 0 ? blinkContentAnimation : {}} 
    >
      <Box>
        <Typography
          color={colors.greenAccent[500]}
          variant="h5"
          fontWeight="600"
        >
          {transaction.txId}
        </Typography>
        <Typography color={colors.grey[100]}>
          {transaction.user}
        </Typography>
      </Box>
      <Box color={colors.grey[100]}>
        {"Required Date: " + transaction.date}
      </Box>
                <Box color={colors.grey[100]}>
        {"Estimated Lead Time: " + transaction.leadtime}
      </Box>
                <Box color={colors.grey[100]}>
        {"Estimated Delivery Date: " + transaction.deliverytime}
      </Box>
    </Box>
  ))}
</Box>

        
          {/* Purchase Order */}
        <Box
          gridColumn="span 3"
          gridRow="span 3"
          backgroundColor={colors.primary[400]}
          overflow="auto"
          sx={{ cursor: 'pointer' }}
          onClick={() => handleBoxClick('/purchaseorders')}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.blueAccent[400]}`}
            color={colors.grey[100]}
            p="15px"
           
          >
            <Typography color={colors.blueAccent[400]} variant="h5" fontWeight="600">
              Purchase Order
            </Typography>
          </Box>
          {mockPO.map((transaction, i) => (
            <Box
              key={`${transaction.txId}-${i}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
               sx={i === 0 ? blinkContentAnimation : {}} 
            >
              <Box>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  fontWeight="600"
                >
                  {transaction.txId}
                </Typography>
                <Typography color={colors.grey[100]}>
                  {transaction.user}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

           {/* Supplier */}
        <Box
          gridColumn="span 3"
          gridRow="span 3"
          backgroundColor={colors.primary[400]}
          overflow="auto"
          sx={{ cursor: 'pointer' }}
          onClick={() => handleBoxClick('/supplierlist')}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.redAccent[500]}`}
            color={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.redAccent[500]} variant="h5" fontWeight="600">
              Supplier
            </Typography>
          </Box>
          {mockSupplier.map((transaction, i) => (
            <Box
              key={`${transaction.txId}-${i}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
               sx={i === 0 ? blinkContentAnimation : {}} 
            >
              <Box>
                <Typography color={colors.grey[100]}>
                  {transaction.user}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>


        {/* BOM */}
        <Box
          gridColumn="span 2"
          gridRow="span 3"
          backgroundColor={colors.primary[400]}
          overflow="auto"
          sx={{ cursor: 'pointer' }}
          onClick={() => handleBoxClick('/bom')}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.greenAccent[500]}`}
            color={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.greenAccent[500]} variant="h5" fontWeight="600">
              BOM
            </Typography>
          </Box>
          {mockBOM.map((transaction, i) => (
            <Box
              key={`${transaction.txId}-${i}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
              sx={i === 0 ? blinkContentAnimation : {}} 
            >
              <Box>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  fontWeight="600"
                >
                  {transaction.txId}
                </Typography>
                <Typography color={colors.grey[100]}>
                  {transaction.user}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

 <Box
      gridColumn="span 6"
      gridRow="span 2"
      backgroundColor={colors.primary[400]}
      overflow="auto"
      sx={{ cursor: 'pointer', height: '100%' }}
      onClick={() => handleBoxClick('/data-synthesizer')}
    >
      <Box
        gridColumn="span 12"
        gridRow="span 2"
        backgroundColor={colors.primary[400]}
        padding="30px"
        sx={{ height: '100%' }}
      >
        <Typography
          variant="h5"
          fontWeight="600"
          sx={{ marginBottom: "15px" }}
        >
          Data Visualization
        </Typography>
        <Box
          sx={{
            height: 'calc(100% - 45px)',
            width: '100%',
            position: 'relative',
          }}
        >
          <GeographyChart isDashboard={true} />
        </Box>
      </Box>
    </Box>
        {/* Top News */}
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          overflow="auto"
          sx={{ cursor: 'pointer' }}
          onClick={() => handleBoxClick('/portdisruptioninfo')}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.redAccent[400]}`}
            color={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.redAccent[400]} variant="h5" fontWeight="600">
              Top News
            </Typography>
          </Box>
          {mockNews.map((transaction, i) => (
            <Box
              key={`${transaction.txId}-${i}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
              sx={i === 0 ? blinkContentAnimation : {}} 
            >
              <Box>
                <Typography color={colors.grey[100]}>
                  {transaction.user}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
