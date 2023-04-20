import { FC, useContext } from "react";

import NextLink from "next/link";

import {
  Button,
  CardActionArea,
  CardMedia,
  Grid,
  Link,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";

import { ItemCounter } from "../ui";
import { CartContext } from "@/context";
import { ICartProduct, IOrderItem } from "@/interfaces";

interface Props {
  editable?: boolean;
  products?: IOrderItem[];
}

export const CartList: FC<Props> = ({ editable = false, products }) => {
  const { cart, updateProductQuantity, removeProduct } =
    useContext(CartContext);

  const onNewItemQuantityValue = (
    product: ICartProduct,
    newQuantityValue: number
  ) => {
    product.quantity = newQuantityValue;
    updateProductQuantity(product);
  };

  const productsToShow = products ? products : cart;

  return (
    <>
      {productsToShow.map((product) => (
        <Grid
          container
          spacing={2}
          sx={{ mb: 1 }}
          key={product.slug + product.size}
        >
          <Grid item xs={3}>
            <NextLink href={`/product/${product.slug}`} passHref legacyBehavior>
              <Link>
                <CardActionArea>
                  <CardMedia
                    image={product.image}
                    component="img"
                    sx={{ borderRadius: "5px" }}
                  />
                </CardActionArea>
              </Link>
            </NextLink>
          </Grid>
          <Grid item xs={7}>
            <Box display="flex" flexDirection="column">
              <Typography variant="body1">{product.title}</Typography>
              <Typography variant="body1">
                Size: <strong>{product.size}</strong>
              </Typography>

              {editable ? (
                <ItemCounter
                  currentValue={product.quantity}
                  maxValue={10}
                  updatedQuantity={(value) => {
                    onNewItemQuantityValue(product as ICartProduct, value);
                  }}
                />
              ) : (
                <Typography variant="h6" component="p">
                  {product.quantity} {product.quantity > 1 ? "items" : "item"}
                </Typography>
              )}
            </Box>
          </Grid>
          <Grid
            item
            xs={2}
            display="flex"
            alignItems="center"
            flexDirection="column"
          >
            <Typography variant="subtitle1">${product.price}</Typography>

            {editable && (
              <Button
                variant="text"
                color="secondary"
                onClick={() => removeProduct(product as ICartProduct)}
              >
                Remove
              </Button>
            )}
          </Grid>
        </Grid>
      ))}
    </>
  );
};
