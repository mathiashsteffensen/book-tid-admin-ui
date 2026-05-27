import { Alert } from "@mui/material"
import { FC } from "react"

import { api } from "src/api-client"
import { Button, Form, FormGroup, Icon, Stack } from "src/components/agnostic"
import { useAsyncLazy, useFormValues } from "src/hooks"
import { Category, Service } from "src/types"

export interface ServiceFormProps {
    service?: Partial<Service>
    categories: Array<Category>
    onSave: () => void
    onDelete?: () => void
}

type ServiceFormValues = {
    name: string
    description: string
    minutesTaken: number
    breakAfter: number
    price: number
    categoryId: string | null
}

export const ServiceForm: FC<ServiceFormProps> = ({
    service,
    categories,
    onSave,
    onDelete,
}) => {
    const isEdit = !!service?.id

    const {
        execute: save,
        loading: saveLoading,
        error: saveError,
    } = useAsyncLazy(
        (values: ServiceFormValues) =>
            isEdit
                ? api().services.update(service.id!, values)
                : api().services.create(values),
        { onSuccess: onSave }
    )

    const {
        execute: destroy,
        loading: destroyLoading,
        error: destroyError,
    } = useAsyncLazy(() => api().services.delete(service!.id!), {
        onSuccess: onDelete,
    })

    const form = useFormValues<ServiceFormValues>({
        initialValues: {
            name: service?.name || "",
            description: service?.description || "",
            minutesTaken: service?.minutesTaken || 60,
            breakAfter: service?.breakAfter || 0,
            price: (service?.price || 0) / 100,
            categoryId: service?.categoryId || null,
        },
        requiredFields: ["name", "minutesTaken", "breakAfter", "price"],
        onSubmit: save,
    })

    const saveButton = (
        <Button
            loading={saveLoading}
            type="submit"
            variant="contained"
            color="primary"
        >
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
                name="description"
                form={form}
                label="Beskrivelse"
                input={{ type: "text", multiline: true }}
            />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
                <FormGroup
                    name="minutesTaken"
                    form={form}
                    label="Varighed (i minutter)"
                    input={{ type: "number", min: 1 }}
                />

                <FormGroup
                    name="breakAfter"
                    form={form}
                    label="Pause efter (i minutter)"
                    input={{ type: "number", min: 0 }}
                />

                <FormGroup
                    name="price"
                    form={form}
                    label="Pris"
                    input={{ type: "number", min: 0 }}
                />
            </Stack>

            <FormGroup
                name="categoryId"
                form={form}
                label={"Kategori"}
                input={{
                    type: "search-select",
                    options: categories.map((c) => ({
                        id: c.id,
                        label: c.name,
                    })),
                }}
            />

            {isEdit ? (
                <Stack
                    direction={{ xs: "column", md: "row-reverse" }}
                    justifyContent={{ md: "flex-start" }}
                    spacing={2}
                >
                    {saveButton}

                    <Button
                        loading={destroyLoading}
                        onClick={destroy}
                        color="error"
                        variant="outlined"
                    >
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
