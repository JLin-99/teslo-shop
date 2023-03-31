import { Typography } from "@mui/material";

import { ShopLayout } from "@/components/layouts";
import { ProductList } from "@/components/products";
import { useProducts } from "@/hooks";
import FullScreenLoading from "@/components/ui/FullScreenLoading";

export default function MenPage() {
  const { products, isLoading } = useProducts("/products?gender=men");

  return (
    <ShopLayout
      title={"TesloShop - Men"}
      pageDescription={"Find the best products for men from Teslo here!"}
    >
      <Typography variant="h1" component="h1">
        Men
      </Typography>
      <Typography variant="h2" sx={{ mb: 1 }}>
        Products for men
      </Typography>

      {isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
    </ShopLayout>
  );
}
