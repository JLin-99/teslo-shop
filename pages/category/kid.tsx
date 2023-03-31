import { Typography } from "@mui/material";

import { ShopLayout } from "@/components/layouts";
import { ProductList } from "@/components/products";
import { useProducts } from "@/hooks";
import FullScreenLoading from "@/components/ui/FullScreenLoading";

export default function KidPage() {
  const { products, isLoading } = useProducts("/products?gender=kid");

  return (
    <ShopLayout
      title={"TesloShop - Kids"}
      pageDescription={"Find the best products for kids from Teslo here!"}
    >
      <Typography variant="h1" component="h1">
        Kids
      </Typography>
      <Typography variant="h2" sx={{ mb: 1 }}>
        Products for kids
      </Typography>

      {isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
    </ShopLayout>
  );
}
