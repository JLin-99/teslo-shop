import NextLink from "next/link";

import { Chip, Grid, Link, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

import { ShopLayout } from "@/components/layouts";

const columns: GridColDef[] = [
  { field: "id", headerName: "Id", width: 100 },
  { field: "name", headerName: "Name", width: 200 },
  {
    field: "paid",
    headerName: "Paid",
    width: 200,
    renderCell: (params) => {
      return params.value ? (
        <Chip color="success" label="Paid" variant="outlined" />
      ) : (
        <Chip color="error" label="Unpaid" variant="outlined" />
      );
    },
  },
  {
    field: "Order",
    headerName: "View order",
    width: 200,
    sortable: false,
    renderCell: (params) => (
      <NextLink href={`/orders/${params.id}`} passHref legacyBehavior>
        <Link underline="always">View order</Link>
      </NextLink>
    ),
  },
];

const rows = [
  { id: 1, paid: true, name: "John Doe" },
  { id: 2, paid: false, name: "Jane Smith" },
];

const HistoryPage = () => {
  return (
    <ShopLayout
      title="Order history"
      pageDescription="Order history from client"
    >
      <Typography variant="h1" component="h1" marginBottom={2}>
        Order history
      </Typography>

      <Grid container>
        <Grid item xs={12} sx={{ height: 650, width: "100%" }}>
          <DataGrid rows={rows} columns={columns} />
        </Grid>
      </Grid>
    </ShopLayout>
  );
};
export default HistoryPage;
