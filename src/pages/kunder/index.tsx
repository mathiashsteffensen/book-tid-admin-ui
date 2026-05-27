import { api } from "src/api-client"
import { Button, DataGrid, GridColDef, Paper } from "src/components/agnostic"
import { Layout } from "src/components/custom"
import { useAsync, useResourceFormModal } from "src/hooks"
import { Customer } from "src/types"

const columnDef: Array<GridColDef<Customer>> = [
    {
        field: "name",
        headerName: "Navn",
        width: 150,
    },
    {
        field: "email",
        headerName: "Email",
        width: 200,
    },
    {
        field: "phoneNumber",
        headerName: "Telefonnummer",
        width: 100,
    },
]

export default function CustomersPage() {
    const { data: customers, refresh: refreshCustomers } = useAsync(() =>
        api().customers.list()
    )

    const customerForms = useResourceFormModal({
        name: "Kunde",
        resource: () => api().customers,
        refresh: refreshCustomers,
        formGroups: ({ formGroup }) => [
            formGroup("name", "Navn", { type: "text", required: true }),
            formGroup("email", "Email", { type: "email", required: true }),
            formGroup("phoneNumber", "Telefonnummer", { type: "phonenumber" }),
            formGroup("note", "Note", { type: "text", multiline: true }),
        ],
    })

    return (
        <Layout
            title="Kunder"
            subtitle="Søg i og rediger dine kunder"
            CTAs={
                <Button
                    onClick={() => customerForms.create()}
                    variant="outlined"
                >
                    Ny Kunde
                </Button>
            }
        >
            <Paper>
                <DataGrid
                    columns={columnDef}
                    rows={customers || []}
                    onRowClick={({ row }) => {
                        customerForms.update(row)
                    }}
                    disableRowSelectionOnClick
                />
            </Paper>
        </Layout>
    )
}

export async function getServerSideProps({ req }) {
    const user = await api(req)
        .user.get()
        .catch(() => {})

    if (user) {
        return {
            props: { user },
        }
    } else
        return {
            redirect: {
                permanent: false,
                destination: "/login",
            },
        }
}
