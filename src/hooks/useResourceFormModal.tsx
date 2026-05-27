import { Alert } from "@mui/material"
import { useCallback, useMemo } from "react"

import { MultipleResource } from "src/api-client/MultipleResource"
import {
    Button,
    Form,
    FormGroup,
    FormGroupProps,
    Icon,
    Stack,
    StackProps,
} from "src/components/agnostic"
import {
    useAsyncLazy,
    useFormValues,
    UseFormValuesOnChangeHelpers,
    useModal,
    useToast
} from "src/hooks"
import { Model } from "src/types"

type OnChangeConfiguration<T extends Record<string, unknown>> = {
    onChange?: (helpers: UseFormValuesOnChangeHelpers<T>) => void
}

type FormGroupConfiguration<
    T extends Record<string, unknown>,
    TKey extends keyof T
> = Omit<FormGroupProps<T, TKey>, "form"> & { required?: boolean } & OnChangeConfiguration<T>

type FormGroupStackConfiguration<T extends Record<string, unknown>> = {
    stack: Omit<StackProps, "children"> & {
        formGroups: FormGroups<T>
    }
}

type FormGroups<T extends Record<string, unknown>> = Array<
    FormGroupConfiguration<T, keyof T> | FormGroupStackConfiguration<T>
>

const isStack = <T extends Record<string, unknown>>(
    group: FormGroupConfiguration<T, keyof T> | FormGroupStackConfiguration<T>
): group is FormGroupStackConfiguration<T> => "stack" in group

export type FormGroupsHelpers<T extends Record<string, unknown>> = {
    formGroup: <TKey extends keyof T>(
        name: TKey,
        label: FormGroupProps<T, TKey>["label"],
        input: FormGroupProps<T, TKey>["input"] & OnChangeConfiguration<T>
    ) => FormGroupConfiguration<T, TKey>
}

type PropertyTransforms<T> = {
    [K in keyof T]?: {
        toForm: (value: T[K]) => T[K]
        fromForm: (value: T[K]) => T[K]
    }
}

type OnlyPropertyTransformsProps<T> = {
    transforms?: PropertyTransforms<T>
}

type InstanceTransformProps<T, TInsert, TFormType> = {
    transforms: {
        toForm: (instance: Partial<T>) => Partial<TFormType>
        fromForm: (instance: Partial<TFormType>) => TInsert
    } & PropertyTransforms<TFormType>
}

export type UseResourceFormModalParams<
    T extends Partial<Model>,
    TInsert extends Partial<Model> = T,
    TFormType extends Record<string, unknown> = T
> = {
    name: string
    resource: () => MultipleResource<T, TInsert>
    formGroups: (helpers: FormGroupsHelpers<TFormType>) => FormGroups<TFormType>
    refresh: () => void
} & (TFormType extends T
    ? OnlyPropertyTransformsProps<TFormType>
    : InstanceTransformProps<T, TInsert, TFormType>)

type ResourceFormOwnProps<T extends Partial<Model>, TInsert, TFormType> = {
    onSave: () => void
    resourceInstance?: Partial<T>
    onDelete?: () => void
    transform: {
        fromForm: (instance: Partial<TFormType>) => TInsert
        toForm: (instance: Partial<T>) => Partial<TFormType>
    }
}

type ResourceFormProps<
    T extends Partial<Model>,
    TInsert extends Partial<Model> = T,
    TFormType extends Record<string, unknown> = T
> = Omit<UseResourceFormModalParams<T, TInsert, TFormType>, "transforms"> &
    ResourceFormOwnProps<T, TInsert, TFormType>

const ResourceForm = <
    T extends Partial<Model>,
    TInsert extends Partial<Model> = T,
    TFormType extends Record<string, unknown> = T
>({
    resourceInstance,
    resource,
    formGroups,
    onSave,
    onDelete,
    transform,
}: ResourceFormProps<T, TInsert, TFormType>) => {
    const isEdit = !!resourceInstance?.id

    const {
        execute: save,
        loading: saveLoading,
        error: saveError,
    } = useAsyncLazy(
        (values: Partial<TFormType>) =>
            isEdit
                ? resource().update(
                      resourceInstance.id!,
                      transform.fromForm(values)
                  )
                : resource().create(transform.fromForm(values)),
        { onSuccess: onSave }
    )

    const {
        execute: destroy,
        loading: destroyLoading,
        error: destroyError,
    } = useAsyncLazy(() => resource().delete(resourceInstance!.id!), {
        onSuccess: onDelete,
    })

    const formGroup: FormGroupsHelpers<TFormType>["formGroup"] = useCallback(
        <TKey extends keyof TFormType>(
            name: TKey,
            label: FormGroupProps<TFormType, TKey>["label"],
            {onChange, ...input}: FormGroupProps<TFormType, TKey>["input"] & OnChangeConfiguration<TFormType>
        ): FormGroupConfiguration<TFormType, TKey> => ({
            name,
            label,
            input: input as FormGroupProps<TFormType, TKey>["input"],
            onChange,
        }),
        []
    )

    const resolvedFormGroups = useMemo(
        () =>
            formGroups({
                formGroup,
            }),
        [formGroups, formGroup]
    )

    const flatMapFormGroups = (group: (typeof resolvedFormGroups)[number]) =>
        (isStack(group) ? group.stack.formGroups.flatMap(flatMapFormGroups) : group)
    const flattenedFormGroups = resolvedFormGroups.flatMap(flatMapFormGroups) as Array<FormGroupConfiguration<TFormType, keyof TFormType>>

    const formGroupByName = (name: keyof TFormType): FormGroupConfiguration<TFormType, keyof TFormType> | undefined => {
        return flattenedFormGroups.find((group) => group.name === name)
    }

    const defaultInitialValues = flattenedFormGroups.reduce((acc, group) => ({
        ...acc,
        [group.name]: "",
    }), {}) as TFormType

    const form = useFormValues<TFormType>({
        initialValues: {
            ...defaultInitialValues,
            ...(transform.toForm(resourceInstance || {}) as TFormType)
        },
        requiredFields: resolvedFormGroups
            .filter((group) => !isStack(group) && group.required)
            .map(
                (group) =>
                    (group as FormGroupConfiguration<
                        TFormType,
                        keyof TFormType
                    >).name
            ),
        onSubmit: save,
        onChange: (name, value, helpers) => {
            const formGroup = formGroupByName(name)

            if (formGroup && formGroup.onChange) {
                helpers.values[name] = value
                formGroup.onChange(helpers)
            }
        }
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

    const renderStackFormGroups = (key: number, stack: FormGroupStackConfiguration<TFormType>) => {
        const {formGroups, ...stackProps} = stack.stack

        return (
            <Stack key={key} {...stackProps}>
                {formGroups.map(renderFormGroup)}
            </Stack>
        )
    }

    const renderFormGroup = (
        group: FormGroups<TFormType>[number],
        index: number
    ) =>
        isStack(group) ? (
            renderStackFormGroups(index, group)
        ) : (
            <FormGroup key={group.name as string} {...group} form={form} />
        )

    return (
        <Form onSubmit={form.onSubmit}>
            {saveError ||
                (destroyError && (
                    <Alert icon={<Icon name="close" />} color="error">
                        {saveError || destroyError}
                    </Alert>
                ))}

            {resolvedFormGroups.map(renderFormGroup)}

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

export const useResourceFormModal = <
    T extends Partial<Model>,
    TInsert extends Partial<Model> = T,
    TFormType extends Record<string, unknown> = T
>(
    params: UseResourceFormModalParams<T, TInsert, TFormType>
) => {
    const instanceToForm = (instance: Partial<T>): Partial<TFormType> => {
        return params.transforms?.toForm
            ? (params.transforms as InstanceTransformProps<
                  T,
                  TInsert,
                  TFormType
              >["transforms"]).toForm(instance)
            : (instance as Partial<TFormType>)
    }

    const instanceFromForm = (instance: Partial<TFormType>): TInsert => {
        return params.transforms?.toForm
            ? (params.transforms as InstanceTransformProps<
                  T,
                  TInsert,
                  TFormType
              >["transforms"]).fromForm(instance)
            : ((instance as unknown) as TInsert)
    }

    const transformInstanceProperties = (
        instance: Partial<TFormType>,
        method: "toForm" | "fromForm"
    ) => {
        const transformedInstance: Partial<TFormType> = {}

        for (const key in instance) {
            const value = instance[key]

            if (params.transforms && params.transforms[key]) {
                if (key === "toForm" || key === "fromForm") {
                    break
                }

                transformedInstance[
                    key
                ] = (params.transforms as PropertyTransforms<TFormType>)[key]?.[
                    method
                ](value as TFormType[typeof key])
            } else {
                transformedInstance[key] = value
            }
        }

        return transformedInstance
    }

    const TypedResourceForm = ResourceForm<T, TInsert, TFormType>

    const renderForm = ({
        resourceInstance,
        ...props
    }: Omit<ResourceFormOwnProps<T, TInsert, TFormType>, "transform">) => {
        const mergedProps: ResourceFormProps<T, TInsert, TFormType> = {
            ...params,
            ...props,
            resourceInstance,
            transform: {
                toForm: (instance) => {
                    const formType = instanceToForm(instance)

                    return transformInstanceProperties(formType, "toForm")
                },
                    fromForm: (instance) => {
                    const formType = transformInstanceProperties(
                        instance,
                        "fromForm"
                    )

                    return instanceFromForm(formType)
                },
            },
        }

        return <TypedResourceForm {...mergedProps} />
    }

    const createdToast = useToast({
        id: `${params.name}/created`,
        severity: "success",
        content: `${params.name} oprettet`,
    })

    const createModal = useModal({
        id: `${params.name}/create`,
        title: `Opret ${params.name}`,
        content: (resourceInstance?: Partial<T>) =>
            renderForm({
                resourceInstance,
                onSave: () => {
                    createModal.close()
                    createdToast.show()
                },
            }),
        onClose: params.refresh,
    })

    const updatedToast = useToast({
        id: `${params.name}/updated`,
        severity: "success",
        content: `${params.name} opdateret`,
    })

    const updateModal = useModal({
        id: `${params.name}/update`,
        title: `Opdater ${params.name}`,
        content: (resourceInstance: T) =>
            renderForm({
                resourceInstance,
                onSave: () => {
                    updateModal.close()
                    updatedToast.show()
                },
                onDelete: updateModal.close,
            }),
        onClose: params.refresh,
    })

    return {
        create: (resourceInstance?: Partial<T>) =>
            createModal.show(resourceInstance),
        update: (resourceInstance: T) => updateModal.show(resourceInstance),
    }
}
