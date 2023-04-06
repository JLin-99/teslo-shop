import { GetServerSideProps } from "next";

import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import { ShopLayout } from "@/components/layouts";
import { jwt } from "@/utils";

const AddressPage = () => {
  return (
    <ShopLayout title="Address" pageDescription="Confirm your shipping address">
      <Typography variant="h1" component="h1" marginBottom={4}>
        Address
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={6} sm={3}>
          <TextField label="First name (optional)" variant="filled" fullWidth />
        </Grid>
        <Grid item xs={6} sm={3}>
          <TextField label="Last name" variant="filled" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="Phone (optional)" variant="filled" fullWidth />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField label="Address" variant="filled" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Apartment, suite, etc. (optional)"
            variant="filled"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="City" variant="filled" fullWidth />
        </Grid>

        <Grid item xs={4} sm={2}>
          <FormControl fullWidth>
            <InputLabel>Country/Region</InputLabel>
            <Select variant="filled" value={1}>
              <MenuItem value={1}>Country 1</MenuItem>
              <MenuItem value={2}>Country 2</MenuItem>
              <MenuItem value={3}>Country 3</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={4} sm={2}>
          <FormControl fullWidth>
            <InputLabel>State</InputLabel>
            <Select variant="filled" value={1}>
              <MenuItem value={1}>State 1</MenuItem>
              <MenuItem value={2}>State 2</MenuItem>
              <MenuItem value={3}>State 3</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={4} sm={2}>
          <TextField label="ZIP code" variant="filled" fullWidth />
        </Grid>

        <Grid item xs={12} sm={6}></Grid>
      </Grid>

      <Box marginTop={5} display="flex" justifyContent="center">
        <Button color="secondary" className="circular-btn" size="large">
          Check order
        </Button>
      </Box>
    </ShopLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { token = "" } = req.cookies;
  let isValidToken = false;

  try {
    await jwt.isValidToken(token);
    isValidToken = true;
  } catch {
    isValidToken = false;
  }

  if (!isValidToken) {
    return {
      redirect: {
        destination: "/auth/login?p=/checkout/address",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default AddressPage;
