import { ConfirmationNumberOutlined } from "@mui/icons-material";
import { Chip, Grid } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import useSWR from "swr";

import { AdminLayout } from "@/components/layouts";
import { IOrder, IUser } from "@/interfaces";
import { format } from "@/utils/currency";

const columns: GridColDef[] = [
  { field: "id", headerName: "Order ID", width: 250 },
  { field: "email", headerName: "Email", width: 200 },
  { field: "name", headerName: "Full name", width: 200 },
  { field: "total", headerName: "Total amount", width: 100 },
  {
    field: "isPaid",
    headerName: "Status",
    renderCell: ({ row }) => {
      return row.isPaid ? (
        <Chip variant="outlined" label="Paid" color="success" />
      ) : (
        <Chip variant="outlined" label="Unpaid" color="error" />
      );
    },
  },
  {
    field: "numberProducts",
    headerName: "Number of products",
    align: "center",
    width: 150,
  },
  {
    field: "check",
    headerName: "View order",
    renderCell: ({ row }) => {
      return (
        <a href={`/admin/orders/${row.id}`} target="_blank" rel="noreferrer">
          View order
        </a>
      );
    },
  },
  { field: "createdAt", headerName: "Created at", width: 200 },
];

const OrdersPage = () => {
  const { data, error } = useSWR<IOrder[]>("/api/admin/orders");

  if (!data && !error) return null;

  const rows = data!.map((order) => ({
    id: order._id,
    email: (order.user as IUser).email,
    name: (order.user as IUser).name,
    total: format(order.total),
    isPaid: order.isPaid,
    numberProducts: order.numberOfItems,
    createdAt: order.createdAt,
  }));

  return (
    <AdminLayout
      title={"Orders"}
      subTitle={"Orders maintenance"}
      icon={<ConfirmationNumberOutlined />}
    >
      <Grid container className="fadeIn">
        <Grid item xs={12} sx={{ height: 650, width: "100%" }}>
          <DataGrid rows={rows} columns={columns} />
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export default OrdersPage;
