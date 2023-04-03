import { Typography } from "@mui/material";

import { ShopLayout } from "@/components/layouts";
import { ProductList } from "@/components/products";
import { GetServerSideProps } from "next";
import { dbProducts } from "@/database";
import { IProduct } from "@/interfaces";

interface Props {
  products: IProduct[];
}

export default function SearchPage({ products }: Props) {
  return (
    <ShopLayout
      title={"TesloShop - Search"}
      pageDescription={"Find the best products from Teslo here!"}
    >
      <Typography variant="h1" component="h1">
        Search product
      </Typography>
      <Typography variant="h2" sx={{ mb: 1 }}>
        TODO
      </Typography>

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

  return {
    props: { products },
  };
};
