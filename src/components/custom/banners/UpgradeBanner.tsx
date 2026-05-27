import Link from "next/link"

import { Button, Stack } from "src/components/agnostic"
import { PathHelper } from "src/helpers"
import { User } from "src/types"

export type UpgradeBannerProps = {
    user?: User
}

export const UpgradeBanner = ({ user }: UpgradeBannerProps) => {
    if (!user || user.subscribing) {
        return null
    }

    return (
        <div className="w-full bg-gray-100 py-3">
            <Stack justifyContent="center" alignItems="center">
                <Link href={PathHelper.upgradePath}>
                    <Button>{"Opgrader til premium".toUpperCase()}</Button>
                </Link>
            </Stack>
        </div>
    )
}
