import MUIAppBar from "@mui/material/AppBar"
import MUIDrawer from "@mui/material/Drawer"
import MUIToolbar from "@mui/material/Toolbar"
import { useRouter } from "next/router"
import { FC, forwardRef, ReactNode, useRef, useState } from "react"

import { api, AuthToken } from "src/api-client"
import { Icon } from "src/components/agnostic"
import {
    Button,
    ButtonProps,
    ButtonRef,
    Spacer,
    Stack,
    Text,
} from "src/components/agnostic"
import { Menu, MenuRef } from "src/components/agnostic/Menu"
import { PathHelper } from "src/helpers"
import { useAsync } from "src/hooks"
import { User } from "src/types"

// eslint-disable-next-line react/display-name
const NavLink = forwardRef<ButtonRef, ButtonProps>(
    ({ children, ...props }, ref) => (
        <Button ref={ref} size="small" variant="text" {...props}>
            {children}
        </Button>
    )
)

const drawerWidth = 240

const NavItems: FC<{
    user: User | undefined
    direction: "row" | "column"
    logo: ReactNode
}> = ({ user, direction, logo }) => {
    const router = useRouter()
    const settingsMenu = useRef<MenuRef>(null)

    const signOut = () => {
        AuthToken.clear()
        router.push(PathHelper.signinPath)
    }

    return (
        <Stack direction={direction} alignItems={"center"} grow>
            <Spacer
                right={direction === "row" ? 6 : undefined}
                vertical={direction === "column" ? 6 : undefined}
            >
                <Stack direction={direction} alignItems="center" spacing={3}>
                    {logo}

                    {user && !user.subscribing && (
                        <NavLink
                            icon="plus"
                            href={PathHelper.upgradePath}
                            variant="contained"
                            color="primary"
                        >
                            Opgrader
                        </NavLink>
                    )}
                </Stack>
            </Spacer>

            <Stack
                direction={direction}
                spacing={3}
                justifyContent={
                    direction === "row" ? "space-between" : "flex-start"
                }
                alignItems="center"
                grow
            >
                <Stack
                    direction={direction}
                    spacing={3}
                    alignItems="center"
                    grow={direction === "row"}
                >
                    <NavLink icon="calendar" href={PathHelper.calendarPath}>
                        Kalender
                    </NavLink>
                    <NavLink icon="people" href={PathHelper.customersPath}>
                        Kunder
                    </NavLink>
                </Stack>

                <Stack direction={direction} alignItems="center" spacing={3}>
                    <Menu
                        ref={settingsMenu}
                        anchorEl={(ref) => (
                            <NavLink
                                ref={ref}
                                onClick={() => {
                                    settingsMenu.current?.open()
                                }}
                                icon="settings"
                            >
                                Indstillinger
                            </NavLink>
                        )}
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "left",
                        }}
                        items={[
                            {
                                size: "small",
                                href: PathHelper.employeesPath,
                                children: "Medarbejdere",
                            },
                            {
                                size: "small",
                                href: PathHelper.servicesPath,
                                children: "Services",
                            },
                        ]}
                    />

                    <NavLink href="/profil" icon="account">
                        Min profil
                    </NavLink>

                    <NavLink onClick={signOut} color="error" variant="outlined">
                        Log ud
                    </NavLink>
                </Stack>
            </Stack>
        </Stack>
    )
}

export const Header = () => {
    const { data: user } = useAsync(() => api().user.get())

    const headerLogo = (
        <Text component="h1" size={2}>
            BOOKTID.NET
        </Text>
    )

    const [drawerOpen, setDrawerOpen] = useState(false)
    const toggleDrawer = () => setDrawerOpen((prev) => !prev)

    return (
        <>
            <MUIAppBar
                sx={{ boxShadow: "none" }}
                position="static"
                color="transparent"
            >
                <Spacer bottom={4}>
                    <MUIToolbar sx={{ display: { xs: "none", md: "flex" } }}>
                        <NavItems
                            user={user}
                            direction="row"
                            logo={headerLogo}
                        />
                    </MUIToolbar>

                    <MUIToolbar sx={{ display: { xs: "flex", md: "none" } }}>
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            grow
                        >
                            {headerLogo}

                            <Button variant="text" onClick={toggleDrawer}>
                                <Icon size="large" name="menuRight" />
                            </Button>
                        </Stack>
                    </MUIToolbar>
                </Spacer>
            </MUIAppBar>
            <MUIDrawer
                onClose={toggleDrawer}
                open={drawerOpen}
                anchor="right"
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                    display: { xs: "block", md: "none" },
                    "& .MuiDrawer-paper": {
                        boxSizing: "border-box",
                        width: drawerWidth,
                    },
                }}
            >
                <NavItems user={user} direction="column" logo={headerLogo} />
            </MUIDrawer>
        </>
    )
}
