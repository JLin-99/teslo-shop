import { useState, useEffect } from "react";
import { PeopleOutline } from "@mui/icons-material";
import useSWR from "swr";

import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Grid, Select, MenuItem } from "@mui/material";

import { IUser } from "@/interfaces";
import { AdminLayout } from "@/components/layouts";
import { tesloAPI } from "@/api";

const UsersPage = () => {
  const { data, error } = useSWR<IUser[]>("/api/admin/users");
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    if (data) {
      setUsers(data);
    }
  }, [data]);

  if (!data && !error) return null;

  const onRoleUpdated = async (userId: string, newRole: string) => {
    const previousUsers = users.map((user) => ({ ...user }));
    const updatedUsers = users.map((user) => ({
      ...user,
      role: userId === user._id ? newRole : user.role,
    }));

    setUsers(updatedUsers);

    try {
      await tesloAPI.put("/admin/users", { userId, role: newRole });
    } catch (error) {
      setUsers(previousUsers);
      console.log(error);
      alert("Could not update user role");
    }
  };

  const columns: GridColDef[] = [
    { field: "email", headerName: "Email", width: 250 },
    { field: "name", headerName: "Full name", width: 300 },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
      cellClassName: "p-0",
      renderCell: ({ row }) => (
        <Select
          value={row.role}
          label="Role"
          onChange={({ target }) => onRoleUpdated(row.id, target.value)}
          fullWidth
        >
          <MenuItem value="admin"> Admin </MenuItem>
          <MenuItem value="client"> Client </MenuItem>
          <MenuItem value="super-user"> Super User </MenuItem>
          <MenuItem value="SEO"> SEO </MenuItem>
        </Select>
      ),
    },
  ];

  const rows = users.map((user) => ({
    id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
  }));

  return (
    <AdminLayout
      title={"Users"}
      subTitle={"Users maintenance"}
      icon={<PeopleOutline />}
    >
      <Grid container className="fadeIn">
        <Grid item xs={12} sx={{ height: 650, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            sx={{ "& .p-0": { padding: 0 } }}
          />
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export default UsersPage;
