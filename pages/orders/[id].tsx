import NextLink from "next/link";
import { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";

import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Link,
  Typography,
} from "@mui/material";
import {
  CreditCardOffOutlined,
  CreditScoreOutlined,
} from "@mui/icons-material";

import { CartList } from "@/components/cart";
import { ShopLayout } from "@/components/layouts";
import { OrderSummary } from "@/components/cart/OrderSummary";
import { dbOrders } from "@/database";
import { IOrder } from "@/interfaces";

interface Props {
  order: IOrder;
}

const OrderPage: NextPage<Props> = ({ order }) => {
  return (
    <ShopLayout title="Order" pageDescription="Order Summary">
      <Typography variant="h1" component="h1" marginBottom={4}>
        Order ABC123
      </Typography>

      <Chip
        sx={{ my: 2 }}
        label="Pending payment"
        variant="outlined"
        color="error"
        icon={<CreditCardOffOutlined />}
      />
      <Chip
        sx={{ my: 2 }}
        label="Paid"
        variant="outlined"
        color="success"
        icon={<CreditScoreOutlined />}
      />

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
                <Typography variant="h1" component="p">
                  Pay
                </Typography>
                <Chip
                  sx={{ my: 2 }}
                  label="Paid"
                  variant="outlined"
                  color="success"
                  icon={<CreditScoreOutlined />}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  const { id = "" } = query;
  const session: any = await getSession({ req });
  if (!session) {
    return {
      redirect: {
        destination: `/auth/login?p=/orders/${id}`,
        permanent: false,
      },
    };
  }

  const order = await dbOrders.getOrderById(id.toString());

  if (!order) {
    return {
      redirect: {
        destination: "/orders/history",
        permanent: false,
      },
    };
  }

  if (order.user !== session.user.id) {
    return {
      redirect: {
        destination: "/orders/history",
        permanent: false,
      },
    };
  }

  return {
    props: {
      order,
    },
  };
};

export default OrderPage;
