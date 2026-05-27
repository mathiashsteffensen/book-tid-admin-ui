import { DataGrid, DataGridProps } from "src/components/agnostic/DataGrid"

export type CalendarGridProps = Omit<
    DataGridProps<{ id: number }>,
    | "showCellVerticalBorder"
    | "unstable_rowSpanning"
    | "disableRowSelectionOnClick"
    | "disableColumnResize"
    | "disableColumnSorting"
    | "disableColumnMenu"
    | "hideFooterPagination"
>

export const CalendarGrid = (props: CalendarGridProps) => {
    return (
        <DataGrid
            showCellVerticalBorder
            unstable_rowSpanning
            disableRowSelectionOnClick
            disableColumnResize
            disableColumnSorting
            disableColumnMenu
            hideFooterPagination
            {...props}
        />
    )
}
