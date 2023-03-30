import NextLink from "next/link";

import { AuthLayout } from "@/components/layouts";
import { Box, Button, Grid, Link, TextField, Typography } from "@mui/material";

const RegisterPage = () => {
  return (
    <AuthLayout title={"Register"}>
      <Box sx={{ width: 350, padding: "10px 20px" }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h1" component="h1">
              Create account
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField label="Name" variant="filled" fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Email" variant="filled" fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Password"
              type="password"
              variant="filled"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              color="secondary"
              className="circular-btn"
              size="large"
              fullWidth
            >
              Log In
            </Button>
          </Grid>

          <Grid item xs={12} display="flex" justifyContent="flex-end">
            <NextLink href="/auth/login" passHref legacyBehavior>
              <Link underline="always">Already have an account?</Link>
            </NextLink>
          </Grid>
        </Grid>
      </Box>
    </AuthLayout>
  );
};
export default RegisterPage;
