import { FormEvent, forwardRef, ReactNode } from "react"

import { Spacer } from "src/components/agnostic/Spacer"
import { Stack } from "src/components/agnostic/Stack"

export interface FormProps {
    children: ReactNode
    action?: string
    method?: "POST" | "GET"
    onSubmit: (e: FormEvent<HTMLFormElement>) => void
}

// eslint-disable-next-line react/display-name
export const Form = forwardRef<HTMLFormElement, FormProps>(
    ({ children, ...otherProps }, ref) => {
        return (
            <form ref={ref} className="form" {...otherProps}>
                <Spacer top={7}>
                    <Stack direction="column" spacing={4}>
                        {children}
                    </Stack>
                </Spacer>
            </form>
        )
    }
)
