import { api, ApiClient } from "src/api-client"
import { EmployeesInsert, EmployeesSelect } from "src/api-client/Employees"
import {
    Button,
    Text,
    GridColDef,
    DataGrid,
    Paper,
    Stack,
} from "src/components/agnostic"
import { Layout } from "src/components/custom"
import {
    useAsync,
    useAsyncLazy,
    useModal,
    useResourceFormModal,
} from "src/hooks"
import { User } from "src/types"

type EmployeeListResult = Awaited<ReturnType<ApiClient["employees"]["list"]>>

const columnDef = (
    userId: string,
    onDeleteClick: (id: string) => void
): Array<GridColDef<EmployeeListResult[0]>> => [
    {
        field: "name",
        headerName: "Navn",
        minWidth: 150,
        valueGetter: (_, row) => row.user.name,
        display: "flex",
    },
    {
        field: "email",
        headerName: "Email",
        minWidth: 200,
        valueGetter: (_, row) => row.user.email,
        display: "flex",
    },
    {
        field: "actions",
        headerName: "",
        minWidth: 100,
        display: "flex",
        flex: 1,
        align: "right",
        renderCell: ({ row }) =>
            row.user.id !== userId ? (
                <Button onClick={() => onDeleteClick(row.id)} color="error">
                    Slet
                </Button>
            ) : null,
    },
]

const paginationModel = { page: 0, pageSize: 5 }

const EmployeeListPage = ({ user }: { user: User }) => {
    const { data: employees, refresh } = useAsync(() => api().employees.list())
    const { data: subscription } = useAsync(() => api().subscription.get())

    const hasEmployeeCapacity =
        employees && subscription && subscription.quantity > employees.length

    const {
        execute: employeeDelete,
        loading: employeeDeleteLoading,
    } = useAsyncLazy(async (id: string) => {
        await api().employees.delete(id)
        await refresh()
        employeeDeleteConfirmDialog.close()
    })

    const employeeDeleteConfirmDialog = useModal({
        type: "dialog",
        id: "employee/delete",
        title: "Bekræft sletning",
        content: (id: string) => (
            <Stack direction="column" spacing={2}>
                <Text>Er du sikker på at du vil slette denne medarbejder?</Text>
                <Button
                    color="error"
                    variant="contained"
                    onClick={() => employeeDelete(id)}
                    loading={employeeDeleteLoading}
                    grow
                >
                    Ja
                </Button>
            </Stack>
        ),
    })

    const employeeForms = useResourceFormModal<
        EmployeesSelect,
        EmployeesInsert,
        Partial<User>
    >({
        name: "Medarbejder",
        resource: () => api().employees,
        refresh,
        formGroups: ({ formGroup }) => [
            formGroup("name", "Navn", { type: "text" }),
            formGroup("email", "Email", { type: "email" }),
        ],
        transforms: {
            toForm: (employee) => employee.user || {},
            fromForm: (user) => ({ user }),
        },
    })

    return (
        <Layout
            title="Medarbejdere"
            subtitle="Rediger I dine medarbejderes indstillinger og åbningstider"
            CTAs={
                hasEmployeeCapacity && (
                    <Button onClick={() => employeeForms.create()}>
                        Opret medarbejder
                    </Button>
                )
            }
        >
            <Paper>
                <DataGrid
                    columns={columnDef(user.id, (id) => {
                        employeeDeleteConfirmDialog.show(id)
                    })}
                    rows={employees}
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[5, 10]}
                    disableRowSelectionOnClick
                />
            </Paper>
        </Layout>
    )
}

export default EmployeeListPage

export async function getServerSideProps({ req }) {
    const user = await api(req)
        .user.get()
        .catch(() => {})

    if (user) {
        return {
            props: {
                user,
            },
        }
    } else
        return {
            redirect: {
                permanent: false,
                destination: "/login",
            },
        }
}
