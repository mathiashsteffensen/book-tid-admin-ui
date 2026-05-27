import MUIAutocomplete, { AutocompleteProps } from "@mui/material/Autocomplete"
import MUITextField, { TextFieldProps } from "@mui/material/TextField"
import { AutocompleteValue } from "@mui/material/useAutocomplete/useAutocomplete"

export interface SelectOption {
    id: string
    label: string
}

export interface SearchSelectProps
    extends Pick<
            AutocompleteProps<SelectOption, false, true, true>,
            "value" | "getOptionLabel"
        >,
        Pick<TextFieldProps, "label"> {
    options: Array<SelectOption>
    name: string
    onChange: (
        value: AutocompleteValue<SelectOption, false, true, true>,
        name: string
    ) => void
}

export const SearchSelect = ({
    options,
    label,
    name,
    value,
    onChange,
    ...props
}: SearchSelectProps) => (
    <MUIAutocomplete
        freeSolo
        disableClearable
        options={options}
        value={options.length !== 0 ? value : ""}
        onChange={(_event, value) =>
            onChange(typeof value === "string" ? value : value.id, name)
        }
        {...props}
        getOptionLabel={(option) => {
            const resolvedOption =
                typeof option === "string"
                    ? options.find((o) => o.id === option)
                    : option

            return resolvedOption?.label || ""
        }}
        isOptionEqualToValue={(option, value) =>
            typeof option === "string"
                ? typeof value === "string"
                    ? option === value
                    : option === value.id
                : typeof value === "string"
                ? option.id === value
                : option.id === value.id
        }
        renderInput={(params) => (
            <MUITextField
                {...params}
                name={name}
                label={label}
                slotProps={{
                    input: {
                        ...params.InputProps,
                        type: "search",
                    },
                }}
            />
        )}
    />
)
