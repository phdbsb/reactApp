import {
  DataGrid,
  GridColDef,
  GridRowClassNameParams,
  GridValidRowModel,
} from "@mui/x-data-grid";
import styles from "./style.module.css";
import { Typography } from "@mui/material";

interface GenericTableProps<T extends GridValidRowModel> {
  title: string;
  rows: T[];
  columns: GridColDef[];
  getRowId: (row: T) => string;

  onSave?: () => void;
  onCancel?: () => void;
  disableAction?: boolean;
  getRowClassName?: (params: GridRowClassNameParams<T>) => string;
}

const GenericTable = <T extends GridValidRowModel>({
  title,
  rows,
  columns,
  getRowId,
  onSave,
  onCancel,
  disableAction,
  getRowClassName,
}: GenericTableProps<T>) => {
  return (
    <div className={styles["dashboard"]}>
      <div className={styles["inner-dashboard"]}>
        <div className={styles["table-header"]}>
          <Typography variant="h4">{title}</Typography>
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
        </div>

        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={getRowId}
          disableRowSelectionOnClick
          getRowClassName={getRowClassName}
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
