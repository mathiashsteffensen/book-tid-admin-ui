import Link from "next/link"
import { useRouter } from "next/router"

import { api, AuthToken } from "src/api-client"
import {
    Button,
    Form,
    FormGroup,
    Paper,
    Spacer,
    Stack,
    Text,
    Spinner,
} from "src/components/agnostic"
import { Layout } from "src/components/custom"
import { PathHelper, StringHelper } from "src/helpers"
import { useFormValues } from "src/hooks"

export default function Login() {
    const router = useRouter()

    const form = useFormValues({
        initialValues: {
            email: "",
            password: "",
        },
        onSubmit: async (values) => {
            const { authenticationToken } = await api().user.authenticate(
                values
            )

            AuthToken.set(authenticationToken)
            await router.push(PathHelper.calendarPath)
        },
    })

    return (
        <Layout
            title="Log ind"
            size="sm"
            altHeaderProps={{ showBackLink: false }}
        >
            <Paper>
                <Spacer all={4}>
                    <Form onSubmit={form.onSubmit}>
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

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                        >
                            {form.submitting ? (
                                <Spinner variant="light" />
                            ) : (
                                "Log Ind"
                            )}
                        </Button>

                        {form.submitError && (
                            <Text color="error" align="center">
                                {form.submitError}
                            </Text>
                        )}

                        <Spacer top={2}>
                            <Stack direction="row">
                                <Text>Har du ikke en bruger?</Text>
                                <Spacer right={1} />
                                <Link href={PathHelper.signupPath}>
                                    <Text color="primary">Opret dig her</Text>
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
    } else {
        return {
            props: {},
        }
    }
}
