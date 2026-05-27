import { api } from "src/api-client"
import { Button, Paper, Spinner, Stack, Text } from "src/components/agnostic"
import { Layout } from "src/components/custom"
import { useAsync, useResourceFormModal, useServiceForms } from "src/hooks"

export default function ServicesListPage() {
    const { data, loading, error, refresh } = useAsync(() =>
        api().categories.listWithServices()
    )

    const serviceForms = useServiceForms(data || [], refresh)

    const categoryForms = useResourceFormModal({
        name: "Kategori",
        resource: () => api().categories,
        formGroups: ({ formGroup }) => [
            formGroup("name", "Navn", { type: "text" }),
        ],
        refresh,
    })

    return (
        <Layout
            title="Services og Kategorier"
            subtitle="Rediger i dine services og kategorier"
            CTAs={
                <>
                    <Button
                        variant="outlined"
                        onClick={() => categoryForms.create()}
                    >
                        Tilføj Kategori
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => serviceForms.create()}
                    >
                        Tilføj Service
                    </Button>
                </>
            }
        >
            {loading && (
                <Stack justifyContent="center" alignItems="center">
                    <Spinner />
                </Stack>
            )}

            {error && <Text color="error">{error}</Text>}

            <Stack direction="column" spacing={3}>
                {data &&
                    data
                        .filter((c) => !!c.id || c.services.length > 0)
                        .map((category) => (
                            <Paper
                                key={category.id}
                                onClick={() => categoryForms.update(category)}
                            >
                                <Stack direction="column" spacing={1}>
                                    <Text size={6}>{category.name}</Text>

                                    {category.services.length !== 0 ? (
                                        category.services.map((service) => (
                                            <Paper
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    e.stopPropagation()
                                                    serviceForms.update(service)
                                                }}
                                                elevation={2}
                                                key={service.id}
                                            >
                                                <Stack
                                                    direction="row"
                                                    key={service.id}
                                                >
                                                    {service.name}
                                                </Stack>
                                            </Paper>
                                        ))
                                    ) : (
                                        <Paper
                                            onClick={(e) => {
                                                e.preventDefault()
                                                e.stopPropagation()
                                                serviceForms.create({
                                                    categoryId: category.id,
                                                })
                                            }}
                                            elevation={2}
                                        >
                                            Ingen services
                                        </Paper>
                                    )}
                                </Stack>
                            </Paper>
                        ))}
            </Stack>
        </Layout>
    )
}

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
