import Link from "next/link"
import { useRouter } from "next/router"
import { useMemo } from "react"

import { api, AuthToken } from "src/api-client"
import {
    Spinner,
    Button,
    Spacer,
    Text,
    Form,
    FormGroup,
    Stack,
    Paper,
} from "src/components/agnostic"
import { Layout } from "src/components/custom"
import { PathHelper } from "src/helpers"
import { useFormValues } from "src/hooks"
import { createBookingDomainPrefix } from "src/utils"

export default function SignUp() {
    const router = useRouter()

    const form = useFormValues({
        initialValues: {
            name: "",
            email: "",
            password: "",
            companyName: "",
        },
        onSubmit: async ({ companyName, ...user }) => {
            const { authenticationToken } = await api().user.create({
                user,
                company: {
                    name: companyName,
                    bookingDomainPrefix: bookingDomainPrefix,
                },
            })

            AuthToken.set(authenticationToken)
            await router.push(PathHelper.calendarPath)
        },
    })

    const bookingDomainPrefix = useMemo(
        () => createBookingDomainPrefix(form.values.companyName),
        [form.values.companyName]
    )

    return (
        <Layout altHeaderProps={{ showBackLink: false }}>
            <Paper>
                <Spacer all={4}>
                    <Text size={3}>Opret bruger</Text>

                    <Form onSubmit={form.onSubmit}>
                        <FormGroup
                            name="name"
                            form={form}
                            label="Navn"
                            input={{
                                type: "text",
                                autoComplete: "name",
                                required: true,
                            }}
                        />

                        <FormGroup
                            name="email"
                            form={form}
                            label="E-mail"
                            input={{
                                type: "email",
                                autoComplete: "email",
                                required: true,
                            }}
                        />

                        <FormGroup
                            name="password"
                            form={form}
                            label="Kodeord"
                            input={{
                                type: "password",
                                required: true,
                            }}
                        />

                        <FormGroup
                            name="companyName"
                            form={form}
                            label="Firmanavn"
                            input={{
                                type: "text",
                                autoComplete: "organization",
                                required: true,
                            }}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                        >
                            {form.submitting ? (
                                <Spinner variant="light" />
                            ) : (
                                "Opret bruger"
                            )}
                        </Button>

                        {form.submitError && (
                            <Text color="error" align="center">
                                {form.submitError}
                            </Text>
                        )}

                        <Spacer top={2}>
                            <Stack direction="row">
                                <Text>Har du allerede en bruger?</Text>
                                <Spacer right={1} />
                                <Link href={PathHelper.signinPath}>
                                    <Text color="primary">Log ind her</Text>
                                </Link>
                            </Stack>
                        </Spacer>
                    </Form>
                </Spacer>
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
            redirect: {
                permanent: false,
                destination: PathHelper.calendarPath,
            },
        }
    }

    return {
        props: {
            valid: false,
        },
    }
}
