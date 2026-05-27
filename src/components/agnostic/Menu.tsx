import { styled } from "@mui/material"
import MUIMenu, { MenuProps as MUIMenuProps } from "@mui/material/Menu"
import MUIMenuItem, {
    MenuItemProps as MUIMenuItemProps,
} from "@mui/material/MenuItem"
import {
    FC,
    forwardRef,
    MutableRefObject,
    ReactNode,
    useCallback,
    useImperativeHandle,
    useRef,
    useState,
} from "react"

import { SizeMapping } from "src/components/agnostic/Text"
import { Button, ButtonProps } from "src/components/agnostic/buttons/Button"
import { LinkButton } from "src/components/agnostic/buttons/LinkButton"

export type MenuItemLinkProps = {
    href: string
}

export type MenuItemButtonProps = {
    href?: never
}

export type MenuItemProps = Omit<ButtonProps, "onClick"> &
    Pick<MUIMenuItemProps, "onClick"> &
    (MenuItemLinkProps | MenuItemButtonProps)

const StyledMUIMenuItem = styled(MUIMenuItem)<MenuItemProps>(
    ({ theme, size }) => ({
        color: theme.palette.common.white,
        fontSize:
            size === "small"
                ? SizeMapping[8]
                : size === "large"
                ? SizeMapping[6]
                : undefined,
    })
)

const MenuItem: FC<MenuItemProps> = ({ children, ...props }) =>
    props.href ? (
        <StyledMUIMenuItem component={LinkButton} {...props}>
            {children}
        </StyledMUIMenuItem>
    ) : (
        <StyledMUIMenuItem component={Button} {...props}>
            {children}
        </StyledMUIMenuItem>
    )

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnchorElRef = MutableRefObject<any>
export type AnchorEl = (ref: AnchorElRef) => ReactNode

export interface MenuProps extends Pick<MUIMenuProps, "anchorOrigin"> {
    anchorEl: AnchorEl
    items: Array<MenuItemProps>
}

export interface MenuRef {
    open: () => void
    close: () => void
}

// eslint-disable-next-line react/display-name
export const Menu = forwardRef<MenuRef, MenuProps>(
    ({ anchorEl, items, anchorOrigin }, ref) => {
        const anchorElRef = useRef(null)
        const [isOpen, setIsOpen] = useState(false)

        const open = useCallback(() => setIsOpen(true), [])
        const close = useCallback(() => setIsOpen(false), [])

        useImperativeHandle(ref, () => ({ open, close }), [open, close])

        return (
            <>
                {anchorEl(anchorElRef)}
                <MUIMenu
                    anchorEl={anchorElRef.current}
                    anchorOrigin={anchorOrigin}
                    open={isOpen}
                    onClose={close}
                >
                    {items.map(({ children, ...props }, index) => (
                        <MenuItem key={index} {...props}>
                            {children}
                        </MenuItem>
                    ))}
                </MUIMenu>
            </>
        )
    }
)
