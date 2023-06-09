import NextLink from "next/link";

import { AddOutlined, CategoryOutlined } from "@mui/icons-material";
import { Box, Button, CardMedia, Grid, Link } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import useSWR from "swr";

import { IProduct } from "@/interfaces";
import { AdminLayout } from "@/components/layouts";
import { format } from "@/utils/currency";

const columns: GridColDef[] = [
  {
    field: "img",
    headerName: "Image",
    renderCell: ({ row }) => {
      return (
        <a href={`/product/${row.slug}`} target="_blank" rel="noreferrer">
          <CardMedia
            component="img"
            alt={row.title}
            className="fadeIn"
            image={row.img}
          />
        </a>
      );
    },
  },
  {
    field: "title",
    headerName: "Title",
    flex: 1,
    renderCell: ({ row }) => {
      return (
        <NextLink href={`/admin/products/${row.slug}`} passHref legacyBehavior>
          <Link underline="always">{row.title}</Link>
        </NextLink>
      );
    },
  },
  { field: "gender", headerName: "Gender" },
  { field: "type", headerName: "Type" },
  { field: "inStock", headerName: "In stock" },
  { field: "price", headerName: "Price" },
  { field: "sizes", headerName: "Sizes", width: 250 },
];

const ProductsPage = () => {
  const { data, error } = useSWR<IProduct[]>("/api/admin/products");

  if (!data && !error) return null;

  const rows = data!.map((product) => ({
    id: product._id,
    img: product.images[0],
    title: product.title,
    gender: product.gender,
    type: product.type,
    inStock: product.inStock,
    price: format(product.price),
    sizes: product.sizes.join(", "),
    slug: product.slug,
  }));

  return (
    <AdminLayout
      title={`Products (${data?.length})`}
      subTitle={"Products maintenance"}
      icon={<CategoryOutlined />}
    >
      <Box display="flex" justifyContent="end" sx={{ mb: 2 }}>
        <Button
          startIcon={<AddOutlined />}
          color="secondary"
          href="/admin/products/new"
        >
          Add new product
        </Button>
      </Box>

      <Grid container className="fadeIn">
        <Grid item xs={12} sx={{ height: 650, width: "100%" }}>
          <DataGrid rows={rows} columns={columns} />
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export default ProductsPage;
