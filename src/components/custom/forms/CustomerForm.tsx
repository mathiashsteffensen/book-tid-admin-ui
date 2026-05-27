import { Alert } from "@mui/material"
import { FC } from "react"

import { api } from "src/api-client"
import {
    Button,
    Form,
    FormGroup,
    Icon,
    Spinner,
    Stack,
} from "src/components/agnostic"
import { useAsyncLazy, useFormValues } from "src/hooks"
import { Customer } from "src/types"

export interface CustomerFormProps {
    customer?: Customer
    onSave: () => void
    onDelete?: () => void
}

type CustomerFormValues = Pick<
    Customer,
    "name" | "email" | "phoneNumber" | "note"
>

export const CustomerForm: FC<CustomerFormProps> = ({
    customer,
    onSave,
    onDelete,
}) => {
    const isEdit = !!customer?.id

    const {
        execute: save,
        loading: saveLoading,
        error: saveError,
    } = useAsyncLazy(
        (values: CustomerFormValues) =>
            isEdit
                ? api().customers.update(customer!.id!, values)
                : api().customers.create(values),
        { onSuccess: onSave }
    )

    const {
        execute: destroy,
        loading: destroyLoading,
        error: destroyError,
    } = useAsyncLazy(() => api().customers.delete(customer!.id!), {
        onSuccess: onDelete,
    })

    const form = useFormValues<CustomerFormValues>({
        initialValues: {
            name: customer?.name || "",
            email: customer?.email || "",
            phoneNumber: customer?.phoneNumber || "",
            note: customer?.note || "",
        },
        requiredFields: ["name", "email"],
        onSubmit: save,
    })

    const saveButton = (
        <Button type="submit" variant="contained" color="primary">
            {saveLoading && <Spinner />}
            {isEdit ? "Opdater" : "Opret"}
        </Button>
    )

    return (
        <Form onSubmit={form.onSubmit}>
            {saveError ||
                (destroyError && (
                    <Alert icon={<Icon name="close" />} color="error">
                        {saveError || destroyError}
                    </Alert>
                ))}

            <FormGroup
                name="name"
                form={form}
                label="Navn"
                input={{ type: "text" }}
            />

            <FormGroup
                name="email"
                form={form}
                label="Email"
                input={{ type: "email" }}
            />

            <FormGroup
                name="phoneNumber"
                form={form}
                label="Telefonnummer"
                input={{ type: "phonenumber" }}
            />

            <FormGroup
                name="note"
                form={form}
                label="Note"
                input={{ type: "text", multiline: true }}
            />

            {isEdit ? (
                <Stack
                    direction={{ xs: "column", md: "row-reverse" }}
                    justifyContent={{ md: "flex-start" }}
                    spacing={2}
                >
                    {saveButton}

                    <Button onClick={destroy} color="error" variant="outlined">
                        {destroyLoading && <Spinner />}
                        Slet
                    </Button>
                </Stack>
            ) : (
                <Stack
                    direction={{ md: "row" }}
                    justifyContent={{ md: "flex-end" }}
                >
                    {saveButton}
                </Stack>
            )}
        </Form>
    )
}
