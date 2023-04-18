import { useContext, useState } from "react";

import { GetStaticPaths, GetStaticProps, NextPage } from "next";

import { Box, Button, Chip, Grid, Typography } from "@mui/material";

import { ShopLayout } from "@/components/layouts";
import { ProductSlideshow } from "@/components/products";
import { SizeSelector } from "@/components/products/SizeSelector";
import { ItemCounter } from "@/components/ui";
import { dbProducts } from "@/database";
import { ICartProduct, IProduct, ISize } from "@/interfaces";
import { CartContext } from "@/context";
import { useRouter } from "next/router";

interface Props {
  product: IProduct;
}

const ProductPage: NextPage<Props> = ({ product }) => {
  const { addProductToCart } = useContext(CartContext);

  const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
    _id: product._id,
    image: product.images[0],
    price: product.price,
    slug: product.slug,
    title: product.title,
    gender: product.gender,
    quantity: 1,
  });

  const router = useRouter();

  const onSelectedSize = (size: ISize) => {
    setTempCartProduct({ ...tempCartProduct, size });
  };

  const onUpdateQuantity = (quantity: number) => {
    setTempCartProduct({ ...tempCartProduct, quantity });
  };

  const onAddProduct = () => {
    if (!tempCartProduct.size) return;

    addProductToCart(tempCartProduct);
    router.push("/cart");
  };

  return (
    <ShopLayout title={product.title} pageDescription={product.description}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={7}>
          <ProductSlideshow images={product.images} />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Box display="flex" flexDirection="column">
            <Typography variant="h1" component="h1">
              {product.title}
            </Typography>
            <Typography variant="subtitle1" component="h2">
              ${product.price}
            </Typography>

            <Box sx={{ my: 2 }}>
              <Typography variant="subtitle2">Quantity</Typography>
              <ItemCounter
                currentValue={tempCartProduct.quantity}
                updatedQuantity={onUpdateQuantity}
                maxValue={product.inStock > 10 ? 10 : product.inStock}
              />
              <SizeSelector
                sizes={product.sizes}
                selectedSize={tempCartProduct.size}
                onSelectedSize={onSelectedSize}
              />
            </Box>

            {product.inStock > 0 ? (
              tempCartProduct.size ? (
                <Button
                  color="secondary"
                  className="circular-btn"
                  onClick={onAddProduct}
                >
                  Add to cart
                </Button>
              ) : (
                <Chip
                  label="Choose product size"
                  color="warning"
                  variant="outlined"
                  sx={{ cursor: "not-allowed" }}
                />
              )
            ) : (
              <Chip
                label="Out of stock"
                color="error"
                variant="outlined"
                sx={{ cursor: "not-allowed" }}
              />
            )}

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2">Description</Typography>
              <Typography variant="body2">{product.description}</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

// export const getServerSideProps: GetServerSideProps = async ({ params }) => {
//   const { slug = "" } = params as { slug: string };
//   const product = await dbProducts.getProductBySlug(slug);

//   if (!product) {
//     return {
//       redirect: {
//         destination: "/",
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: {
//       product,
//     },
//   };
// };

export const getStaticPaths: GetStaticPaths = async (context) => {
  const productSlugs = await dbProducts.getAllProductSlugs();

  return {
    paths: productSlugs.map(({ slug }) => ({ params: { slug } })),
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug = "" } = params as { slug: string };
  const product = await dbProducts.getProductBySlug(slug);

  if (!product) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24, //ISR every 24hs
  };
};

export default ProductPage;
