import { Box, Typography } from "@mui/material";

import { ShopLayout } from "@/components/layouts";
import { ProductList } from "@/components/products";
import { GetServerSideProps } from "next";
import { dbProducts } from "@/database";
import { IProduct } from "@/interfaces";

interface Props {
  products: IProduct[];
  foundProducts: boolean;
  query: string;
}

export default function SearchPage({ products, foundProducts, query }: Props) {
  return (
    <ShopLayout
      title={"TesloShop - Search"}
      pageDescription={"Find the best products from Teslo here!"}
    >
      <Typography variant="h1" component="h1">
        Search products
      </Typography>

      {foundProducts ? (
        <Typography variant="h2" marginBottom={1} textTransform="capitalize">
          Term: {query}
        </Typography>
      ) : (
        <Box display="flex">
          <Typography variant="h2" marginBottom={1}>
            {"There are no products with the term"}
          </Typography>
          <Typography variant="h2" marginLeft={1} color="secondary">
            {query}
          </Typography>
        </Box>
      )}

      <ProductList products={products} />
    </ShopLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { query = "" } = params as { query: string };

  if (!query.length) {
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };
  }

  let products = await dbProducts.getProductsByTerm(query);
  const foundProducts = products.length > 0;

  if (!foundProducts) {
    products = await dbProducts.getProductsByTerm("shirt");
  }

  return {
    props: { products, foundProducts, query },
  };
};
