import { useState } from "react";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { UserDisplay } from "@/api/endpoints/user/types";
import {
  useGetAllusersQuery,
  useUpdateUserRoleMutation,
} from "@/api/endpoints/user";
import { Typography, Button } from "@mui/material";
import RoleCell from "./RoleCell";
import styles from "./style.module.css";
import { UserRole } from "@/api/endpoints/auth/types";

const AdminDashboard = () => {
  const { data: users = [], isLoading } = useGetAllusersQuery();
  const [updateRole] = useUpdateUserRoleMutation();

  const [editedRoles, setEditedRoles] = useState<Record<string, UserRole>>({});
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const handleRoleChange = (user: UserDisplay, newRole: UserRole) => {
    const editedRole = user.role;
    const userId = user.userId;

    setEditedRoles((prev) => {
      const updated = { ...prev };
      if (newRole === editedRole) {
        delete updated[userId];
      } else {
        updated[userId] = newRole;
      }
      return updated;
    });

    setSelectedRows((prev) => {
      const updated = new Set(prev);
      if (newRole === editedRole) {
        updated.delete(userId);
      } else {
        updated.add(userId);
      }
      return updated;
    });
  };

  const handleSave = async () => {
    try {
      await updateRole(editedRoles);
      setEditedRoles({});
      setSelectedRows(new Set());
    } catch (err) {
      console.error("Error sending role changes", err);
    }
  };

  const handleCancel = () => {
    setEditedRoles({});
    setSelectedRows(new Set());
  };

  const columns: GridColDef[] = [
    { field: "firstName", headerName: "First Name", width: 150 },
    { field: "lastName", headerName: "Last Name", width: 150 },
    { field: "email", headerName: "Email", width: 250 },
    {
      field: "role",
      headerName: "Role",
      width: 250,
      renderCell: (params: GridRenderCellParams) => (
        <RoleCell
          user={params.row as UserDisplay}
          editedRole={editedRoles[params.row.userId]}
          onRoleChange={(newRole: UserRole) =>
            handleRoleChange(params.row as UserDisplay, newRole)
          }
        />
      ),
    },
  ];

  return (
    <div className={styles["admin-dashboard"]}>
      <div className={styles["inner-dashboard"]}>
        <div className={styles["table-header"]}>
          <Typography variant="h4">Admin Dashboard</Typography>
          <div className={styles["button-group"]}>
            <button
              onClick={handleCancel}
              className={styles["button-cancel"]}
              disabled={selectedRows.size === 0}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className={styles["button-save"]}
              disabled={selectedRows.size === 0}
            >
              Save
            </button>
          </div>
        </div>
        <DataGrid
          rows={users}
          columns={columns}
          getRowId={(row) => row.userId}
          loading={isLoading}
          disableRowSelectionOnClick
          getRowClassName={(params) =>
            selectedRows.has(params.row.userId) ? styles["edited-row"] : ""
          }
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10, page: 0 },
            },
          }}
          pageSizeOptions={[5, 10, 15]}
          showToolbar
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
