import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { T } from "react-router/dist/development/fog-of-war-BLArG-qZ";
import styles from "./style.module.css";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

interface GenericTableProps<T> {
  title: string;
  rows: T[];
  columns: GridColDef[];
  getRowId: (row: T) => string;
  loading?: boolean;

  onSave?: () => void;
  onCancel?: () => void;
  disableAction?: boolean;
}

const GenericTable = <T,>({
  title,
  rows,
  columns,
  getRowId,
  loading,
  onSave,
  onCancel,
  disableAction,
}: GenericTableProps<T>) => {
  const { t } = useTranslation();

  return (
    <div className={styles["dashboard"]}>
      <div className={styles["inner-dashboard"]}>
        <div className={styles["table-header"]}>
          <Typography variant="h4">{title}</Typography>
          {(onSave || onCancel) && (
            <div className={styles["button-group"]}>
              {onCancel && (
                <button
                  onClick={onCancel}
                  className={styles["button-cancel"]}
                  disabled={disableAction}
                >
                  Cancel
                </button>
              )}
              {onSave && (
                <button
                  onClick={onSave}
                  className={styles["button-save"]}
                  disabled={disableAction}
                >
                  Save
                </button>
              )}
            </div>
          )}
        </div>

        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={getRowId}
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

export default GenericTable;
