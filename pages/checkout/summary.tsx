import { useContext, useEffect, useState } from "react";

import NextLink from "next/link";
import { useRouter } from "next/router";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Link,
  Typography,
} from "@mui/material";
import Cookies from "js-cookie";

import { CartList } from "@/components/cart";
import { ShopLayout } from "@/components/layouts";
import { OrderSummary } from "@/components/cart/OrderSummary";
import { CartContext } from "@/context";

const SummaryPage = () => {
  const { shippingAddress, createOrder } = useContext(CartContext);

  const [isPostingOrder, setIsPostingOrder] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();

  useEffect(() => {
    if (!Cookies.get("lastName")) {
      router.push("/checkout/address");
    }
  }, []);

  const onCreateOrder = async () => {
    setIsPostingOrder(true);
    const { hasError, message } = await createOrder();

    if (hasError) {
      setIsPostingOrder(false);
      setErrorMessage(message);
      return;
    }

    router.replace(`/orders/${message}`);
  };

  if (!shippingAddress) return null;

  const {
    firstName,
    lastName,
    phone = "",
    address,
    address2 = "",
    city,
    country,
    state,
    zipCode,
  } = shippingAddress;

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

              <Typography>
                {firstName} {lastName}
              </Typography>
              <Typography>
                {address}
                {address2 ? `, ${address2}` : ""}
              </Typography>
              <Typography>
                {city}, {zipCode}
              </Typography>
              <Typography>{country}</Typography>
              <Typography>{phone}</Typography>

              <Divider sx={{ my: 2 }} />

              <Box display="flex" justifyContent="end" marginBottom={2}>
                <NextLink href="/cart" passHref legacyBehavior>
                  <Link underline="always">Edit</Link>
                </NextLink>
              </Box>

              <OrderSummary />

              <Box sx={{ mt: 3 }} display="flex" flexDirection="column">
                <Button
                  color="secondary"
                  className="circular-btn"
                  fullWidth
                  onClick={onCreateOrder}
                  disabled={isPostingOrder}
                >
                  Confirm order
                </Button>

                <Chip
                  color="error"
                  variant="outlined"
                  label={errorMessage}
                  sx={{ display: errorMessage ? "flex" : "none", mt: 2 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};
export default SummaryPage;
