import { FC, ReactNode } from "react"

import {
    Footer,
    AltHeader,
    AltHeaderProps,
    Header,
    Main,
    MainProps,
    UpgradeBanner,
} from "src/components/custom"
import { User } from "src/types"

export interface LayoutProps extends MainProps {
    children: ReactNode
    altHeaderProps?: AltHeaderProps
    upgrading?: boolean
    user?: User
}

export const Layout: FC<LayoutProps> = ({
    children,
    altHeaderProps,
    upgrading,
    user,
    ...mainProps
}) => (
    <div className="min-h-screen flex flex-col justify-between">
        {!upgrading && <UpgradeBanner user={user} />}

        {altHeaderProps ? <AltHeader {...altHeaderProps} /> : <Header />}

        <Main {...mainProps}>{children}</Main>

        <Footer />
    </div>
)
