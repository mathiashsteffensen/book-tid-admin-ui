import { Alert } from "@mui/material"
import { FC } from "react"

import { api } from "src/api-client"
import { Button, Form, FormGroup, Icon, Stack } from "src/components/agnostic"
import { useAsyncLazy, useFormValues } from "src/hooks"
import { Category } from "src/types"

export interface CategoryFormProps {
    category?: Partial<Category>
    onSave: () => void
    onDelete?: () => void
}

type CategoryFormValues = {
    name: string
}

export const CategoryForm: FC<CategoryFormProps> = ({
    category,
    onSave,
    onDelete,
}) => {
    const isEdit = !!category?.id

    const {
        execute: save,
        loading: saveLoading,
        error: saveError,
    } = useAsyncLazy(
        (values: CategoryFormValues) =>
            isEdit
                ? api().categories.update(category.id!, values)
                : api().categories.create(values),
        { onSuccess: onSave }
    )

    const {
        execute: destroy,
        loading: destroyLoading,
        error: destroyError,
    } = useAsyncLazy(() => api().categories.delete(category!.id!), {
        onSuccess: onDelete,
    })

    const form = useFormValues<CategoryFormValues>({
        initialValues: {
            name: category?.name || "",
        },
        requiredFields: ["name"],
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
