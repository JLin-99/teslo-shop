import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Link,
  Typography,
} from "@mui/material";

import { CartList } from "@/components/cart";
import { ShopLayout } from "@/components/layouts";
import { OrderSummary } from "@/components/cart/OrderSummary";
import NextLink from "next/link";

const SummaryPage = () => {
  return (
    <ShopLayout title="Order Summary" pageDescription="Order Summary">
      <Typography variant="h1" component="h1" marginBottom={4}>
        Order summary
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={7}>
          <CartList />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Card className="summary-card">
            <CardContent>
              <Typography variant="h2">Summary</Typography>
              <Divider sx={{ my: 1 }} />

              <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle1" marginBottom={1}>
                  Shipping address
                </Typography>
                <NextLink href="/checkout/address" passHref legacyBehavior>
                  <Link underline="always">Edit</Link>
                </NextLink>
              </Box>

              <Typography>John Doe</Typography>
              <Typography>False Street 123</Typography>
              <Typography>Nix, HYA 23S</Typography>
              <Typography>Narnia</Typography>
              <Typography>+1 2345 1234</Typography>

              <Divider sx={{ my: 2 }} />

              <Box display="flex" justifyContent="end" marginBottom={2}>
                <NextLink href="/cart" passHref legacyBehavior>
                  <Link underline="always">Edit</Link>
                </NextLink>
              </Box>

              <OrderSummary />

              <Box sx={{ mt: 3 }}>
                <Button color="secondary" className="circular-btn" fullWidth>
                  Confirm order
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};
export default SummaryPage;
