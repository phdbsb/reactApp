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
import GenericTable from "../GenericTable/GenericTable";

const AdminDashboard = () => {
  const { data: users = [] } = useGetAllusersQuery();
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
    <GenericTable
      title={t("table.title")}
      rows={users}
      columns={columns}
      getRowId={(row) => row.userId}
      onSave={handleSave}
      onCancel={handleCancel}
      disableAction={selectedRows.size === 0}
      getRowClassName={(params) =>
        selectedRows.has(params.row.userId) ? styles["edited-row"] : ""
      }
    />
  );
};

export default AdminDashboard;
