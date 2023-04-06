import { useContext, useEffect } from "react";

import { useRouter } from "next/router";

import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
} from "@mui/material";

import { CartList } from "@/components/cart";
import { ShopLayout } from "@/components/layouts";
import { OrderSummary } from "@/components/cart/OrderSummary";
import { CartContext } from "@/context";

const CartPage = () => {
  const { isLoaded, cart } = useContext(CartContext);
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !cart.length) {
      router.replace("/cart/empty");
    }
  }, [isLoaded, cart, router]);

  if (!isLoaded || !cart.length) return null;

  return (
    <ShopLayout title="Shopping Cart - 3" pageDescription="Shopping cart">
      <Typography variant="h1" component="h1" marginBottom={4}>
        Shopping Cart
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} sm={7}>
          <CartList editable />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Card className="summary-card">
            <CardContent>
              <Typography variant="h2">Order</Typography>
              <Divider sx={{ my: 1 }} />
              <OrderSummary />

              <Box sx={{ mt: 3 }}>
                <Button
                  color="secondary"
                  className="circular-btn"
                  fullWidth
                  href="/checkout/address"
                >
                  Checkout
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};
export default CartPage;
