import { Box, CircularProgress, Typography } from "@mui/material";

const FullScreenLoading = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="calc(100vh - 200px)"
    >
      <Typography marginBottom={3} fontSize={20} fontWeight={200}>
        Loading...
      </Typography>
      <CircularProgress thickness={2} />
    </Box>
  );
};
export default FullScreenLoading;
