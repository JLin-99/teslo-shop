import { Typography } from "@mui/material";

import { ShopLayout } from "@/components/layouts";
import { ProductList } from "@/components/products";
import { useProducts } from "@/hooks";
import FullScreenLoading from "@/components/ui/FullScreenLoading";

export default function SearchPage() {
  const { products, isLoading } = useProducts("/search/cyber");

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

      {isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
    </ShopLayout>
  );
}
