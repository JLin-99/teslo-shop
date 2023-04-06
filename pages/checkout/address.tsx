import { useRouter } from "next/router";

import {
  Box,
  Button,
  FormControl,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";

import { ShopLayout } from "@/components/layouts";
import { countries } from "@/utils";

type FormData = {
  firstName: string;
  lastName: string;
  phone?: string;
  address: string;
  address2?: string;
  city: string;
  country: string;
  state: string;
  zipCode: string;
};

const AddressPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      address: "",
      address2: "",
      city: "",
      country: "US",
      state: "",
      zipCode: "",
    },
  });

  const router = useRouter();

  const onSubmitAddress = (data: FormData) => {
    Cookies.set("firstName", data.firstName);
    Cookies.set("lastName", data.lastName);
    Cookies.set("phone", data.phone || "");
    Cookies.set("address", data.address);
    Cookies.set("address2", data.address2 || "");
    Cookies.set("city", data.city);
    Cookies.set("country", data.country);
    Cookies.set("state", data.state);
    Cookies.set("zipCode", data.zipCode);

    router.push("/checkout/summary");
  };
  return (
    <ShopLayout title="Address" pageDescription="Confirm your shipping address">
      <form onSubmit={handleSubmit(onSubmitAddress)}>
        <Typography variant="h1" component="h1" marginBottom={4}>
          Address
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <TextField
              label="First name (optional)"
              variant="filled"
              fullWidth
              {...register("firstName")}
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              label="Last name"
              variant="filled"
              fullWidth
              {...register("lastName", {
                required: "Last name is required",
                minLength: {
                  value: 2,
                  message: "Must be at least 2 characters",
                },
              })}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Phone (optional)"
              variant="filled"
              fullWidth
              {...register("phone")}
              error={!!errors.phone}
              helperText={errors.phone?.message}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Address"
              variant="filled"
              fullWidth
              {...register("address", { required: "Address is required" })}
              error={!!errors.address}
              helperText={errors.address?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Apartment, suite, etc. (optional)"
              variant="filled"
              fullWidth
              {...register("address2")}
              error={!!errors.address2}
              helperText={errors.address2?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="City"
              variant="filled"
              fullWidth
              {...register("city", { required: "City is required" })}
              error={!!errors.city}
              helperText={errors.city?.message}
            />
          </Grid>

          <Grid item xs={4} sm={2}>
            <FormControl fullWidth>
              <TextField
                select
                label="Country/Region"
                variant="filled"
                defaultValue={"US"}
                {...register("country", { required: "Country is required" })}
                error={!!errors.country}
              >
                {countries.map((country) => (
                  <MenuItem key={country.code} value={country.code}>
                    {country.name}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
          </Grid>
          <Grid item xs={4} sm={2}>
            <TextField
              label="State"
              variant="filled"
              fullWidth
              {...register("state", { required: "State is required" })}
              error={!!errors.state}
              helperText={errors.state?.message}
            />
          </Grid>
          <Grid item xs={4} sm={2}>
            <TextField
              label="ZIP code"
              variant="filled"
              fullWidth
              {...register("zipCode", { required: "Zip code is required" })}
              error={!!errors.zipCode}
              helperText={errors.zipCode?.message}
            />
          </Grid>

          <Grid item xs={12} sm={6}></Grid>
        </Grid>

        <Box marginTop={5} display="flex" justifyContent="center">
          <Button
            type="submit"
            color="secondary"
            className="circular-btn"
            size="large"
          >
            Check order
          </Button>
        </Box>
      </form>
    </ShopLayout>
  );
};

export default AddressPage;
