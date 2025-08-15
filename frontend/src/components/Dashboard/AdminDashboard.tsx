import { useEffect, useMemo, useState } from "react";
import {
  DataGrid,
  GridCellParams,
  GridColDef,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import { UserDisplay } from "@/api/endpoints/user/types";
import {
  useGetAllusersQuery,
  useGetUsersIdImageQuery,
  useUpdateUserRoleMutation,
} from "@/api/endpoints/user";
import { Typography, Button, Avatar } from "@mui/material";
import RoleCell from "./RoleCell";
import styles from "./style.module.css";
import { UserRole } from "@/api/endpoints/auth/types";
import { useGetImagesQuery } from "@/api/endpoints/images";
import { useTranslation } from "react-i18next";

const AdminDashboard = () => {
  const { data: users = [], isLoading } = useGetAllusersQuery();
  const [updateRole] = useUpdateUserRoleMutation();

  const { t } = useTranslation();

  const { data: userIdImage = [] } = useGetUsersIdImageQuery();
  const { data: imagesData = [] } = useGetImagesQuery(userIdImage, {
    skip: userIdImage.length === 0,
  });

  const [editedRoles, setEditedRoles] = useState<Record<string, UserRole>>({});
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const imageMap = useMemo(() => {
    const map: Record<string, string> = {};
    imagesData.forEach((img: { userId: string; imageData: Blob }) => {
      map[img.userId] = URL.createObjectURL(img.imageData);
    });
    return map;
  }, [imagesData]);

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
    {
      field: "name",
      headerName: t("table.name"),
      width: 280,
      renderCell: (params: GridRenderCellParams) => {
        const user = params.row as UserDisplay;
        const avatarUrl = imageMap[user.userId];
        return (
          <div className={styles["userName"]}>
            <Avatar
              src={avatarUrl}
              sx={{ width: 32, height: 32, marginRight: 1 }}
            />
            <div>{`${user.firstName} ${user.lastName}`}</div>
          </div>
        );
      },
    },
    { field: "email", headerName: t("table.email"), width: 300 },
    {
      field: "role",
      headerName: t("table.role"),
      flex: 1,
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
          <Typography variant="h4">{t("table.title")}</Typography>
          <div className={styles["button-group"]}>
            <button
              onClick={handleCancel}
              className={styles["button-cancel"]}
              disabled={selectedRows.size === 0}
            >
              {t("dialog.cancel")}
            </button>
            <button
              onClick={handleSave}
              className={styles["button-save"]}
              disabled={selectedRows.size === 0}
            >
              {t("form.save")}
            </button>
          </div>
        </div>
        <DataGrid
          rows={users}
          columns={columns}
          getRowId={(row) => row.userId}
          loading={isLoading}
          disableRowSelectionOnClick
          sx={{
            "& .MuiDataGrid-columnHeader": {
              backgroundColor: "var(--background-primary)",
            },
            backgroundColor: "var(--background-primary)",
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "var(--table-row-hover)",
            },
          }}
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
