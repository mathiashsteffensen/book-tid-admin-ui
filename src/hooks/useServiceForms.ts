import { api } from "src/api-client"
import { Category } from "src/types"

import { useResourceFormModal } from "./useResourceFormModal"

export const useServiceForms = (
    categories: Array<Category>,
    refresh: () => void
) => {
    return useResourceFormModal({
        name: "Service",
        resource: () => api().services,
        transforms: {
            price: {
                toForm: (value) => value / 100,
                fromForm: (value) => value * 100,
            },
        },
        formGroups: ({ formGroup }) => [
            formGroup("name", "Navn", { type: "text" }),
            formGroup("description", "Beskrivelse", {
                type: "text",
                multiline: true,
            }),
            {
                stack: {
                    direction: { xs: "column", sm: "row" },
                    spacing: 3,
                    formGroups: [
                        formGroup("minutesTaken", "Varighed (i minutter)", {
                            type: "number",
                            min: 1,
                        }),
                        formGroup("breakAfter", "Pause efter (i minutter)", {
                            type: "number",
                            min: 0,
                        }),
                        formGroup("price", "Pris", { type: "number", min: 0 }),
                    ],
                },
            },
            {
                name: "categoryId",
                label: "Kategori",
                input: {
                    type: "search-select",
                    options: (categories || []).map((c) => ({
                        id: c.id,
                        label: c.name,
                    })),
                },
            },
        ],
        refresh,
    })
}
