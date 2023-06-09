import { useState } from "react";

import { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";

import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import {
  CreditCardOffOutlined,
  CreditScoreOutlined,
} from "@mui/icons-material";
import { PayPalButtons } from "@paypal/react-paypal-js";

import { CartList } from "@/components/cart";
import { ShopLayout } from "@/components/layouts";
import { OrderSummary } from "@/components/cart/OrderSummary";
import { dbOrders } from "@/database";
import { IOrder } from "@/interfaces";
import { tesloAPI } from "@/api";

interface Props {
  order: IOrder;
}

export type OrderResponseBody = {
  id: string;
  status:
    | "COMPLETED"
    | "SAVED"
    | "APPROVED"
    | "VOIDED"
    | "PAYER_ACTION_REQUIRED"
    | "CREATED";
};

const OrderPage: NextPage<Props> = ({ order }) => {
  const router = useRouter();

  const { shippingAddress } = order;
  const [isPaying, setIsPaying] = useState(false);

  const onOrderCompleted = async (details: OrderResponseBody) => {
    if (details.status !== "COMPLETED") {
      return alert("No PayPal payment");
    }

    setIsPaying(true);

    try {
      const { data } = await tesloAPI.post(`/orders/pay`, {
        transactionId: details.id,
        orderId: order._id,
      });

      router.reload();
    } catch (error) {
      setIsPaying(false);
      console.log(error);
      alert("Error");
    }
  };

  return (
    <ShopLayout title="Order" pageDescription="Order Summary">
      <Typography variant="h1" component="h1">
        Order {order._id}
      </Typography>

      {order.isPaid ? (
        <Chip
          sx={{ my: 2 }}
          label="Paid"
          variant="outlined"
          color="success"
          icon={<CreditScoreOutlined />}
        />
      ) : (
        <Chip
          sx={{ my: 2 }}
          label="Pending payment"
          variant="outlined"
          color="error"
          icon={<CreditCardOffOutlined />}
        />
      )}

      <Grid container spacing={2} className="fadeIn">
        <Grid item xs={12} sm={7}>
          <CartList products={order.orderItems} />
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
              </Box>

              <Typography>
                {shippingAddress.lastName}
                {shippingAddress.firstName
                  ? `, ${shippingAddress.firstName}`
                  : ""}
              </Typography>
              <Typography>
                {shippingAddress.address}
                {shippingAddress.address2
                  ? `, ${shippingAddress.address2}`
                  : ""}
              </Typography>
              <Typography>
                {shippingAddress.city}, {shippingAddress.zipCode}
              </Typography>
              <Typography>{shippingAddress.country}</Typography>
              <Typography>{shippingAddress.phone}</Typography>

              <Divider sx={{ my: 2 }} />

              <OrderSummary
                orderValues={{
                  numberOfItems: order.numberOfItems,
                  subTotal: order.subTotal,
                  total: order.total,
                  tax: order.tax,
                }}
              />

              <Box sx={{ mt: 3 }}>
                <Box
                  display={isPaying ? "flex" : "none"}
                  justifyContent="center"
                  className="fadeIn"
                >
                  <CircularProgress />
                </Box>

                <Box
                  sx={{
                    display: isPaying ? "none" : "flex",
                    flex: 1,
                    flexDirection: "column",
                  }}
                >
                  {order.isPaid ? (
                    <Chip
                      label="Paid"
                      variant="outlined"
                      color="success"
                      icon={<CreditScoreOutlined />}
                    />
                  ) : (
                    <PayPalButtons
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          purchase_units: [
                            {
                              amount: {
                                value: order.total.toString(),
                              },
                            },
                          ],
                        });
                      }}
                      onApprove={(data, actions) => {
                        return actions.order!.capture().then((details) => {
                          onOrderCompleted(details);
                        });
                      }}
                    />
                  )}
                </Box>
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
