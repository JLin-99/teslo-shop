import { ShopLayout } from "@/components/layouts";
import { Typography } from "@mui/material";

export default function Home() {
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
    </ShopLayout>
  );
}
