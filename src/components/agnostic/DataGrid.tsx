import {
    DataGrid as MUIDataGrid,
    DataGridProps as MUIDataGridProps,
    GridColDef as MUIGridColDef,
    GridValidRowModel,
} from "@mui/x-data-grid"

/* eslint-disable @typescript-eslint/no-explicit-any */
export type GridColDef<
    R extends GridValidRowModel = any,
    V = any,
    F = V
> = MUIGridColDef<R, V, F>
/* eslint-enable @typescript-eslint/no-explicit-any */

export type DataGridProps<T extends GridValidRowModel> = MUIDataGridProps<T>

export const DataGrid = <T extends GridValidRowModel>(
    props: DataGridProps<T>
) => {
    return (
        <MUIDataGrid
            {...props}
            sx={{
                "& .MuiDataGrid-row--borderBottom[role=row]": {
                    backgroundColor: "unset",
                },
            }}
        />
    )
}
