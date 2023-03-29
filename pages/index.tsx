import { Typography } from "@mui/material";

import { ShopLayout } from "@/components/layouts";
import { initialData } from "@/database/products";
import { ProductList } from "@/components/products";

export default function HomePage() {
  return (
    <ShopLayout
      title={"TesloShop - Home"}
      pageDescription={"Find the best products from Teslo here!"}
    >
      <Typography variant="h1" component="h1">
        Shop
      </Typography>
      <Typography variant="h2" sx={{ mb: 1 }}>
        All Products
      </Typography>

      <ProductList products={initialData.products as any} />
    </ShopLayout>
  );
}
