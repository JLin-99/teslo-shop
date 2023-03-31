import { Typography } from "@mui/material";

import { ShopLayout } from "@/components/layouts";
import { ProductList } from "@/components/products";
import { useProducts } from "@/hooks";
import FullScreenLoading from "@/components/ui/FullScreenLoading";

export default function WomenPage() {
  const { products, isLoading } = useProducts("/products?gender=women");

  return (
    <ShopLayout
      title={"TesloShop - Women"}
      pageDescription={"Find the best products for women from Teslo here!"}
    >
      <Typography variant="h1" component="h1">
        Women
      </Typography>
      <Typography variant="h2" sx={{ mb: 1 }}>
        Products for women
      </Typography>

      {isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
    </ShopLayout>
  );
}
