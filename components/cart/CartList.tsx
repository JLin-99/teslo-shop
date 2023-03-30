import { Typography } from "@mui/material";

import { initialData } from "@/database/products";

const productsInCart = [
  initialData.products[0],
  initialData.products[1],
  initialData.products[2],
];
export const CartList = () => {
  return (
    <>
      {productsInCart.map((products) => (
        <Typography key={products.slug}>{products.slug}</Typography>
      ))}
    </>
  );
};
