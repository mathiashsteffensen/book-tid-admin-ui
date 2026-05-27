import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined"
import AddIcon from "@mui/icons-material/Add"
import ArrowBackwardIcon from "@mui/icons-material/ArrowBackIos"
import ArrowForwardIcon from "@mui/icons-material/ArrowForwardIos"
import CalendarIcon from "@mui/icons-material/CalendarMonth"
import CloseIcon from "@mui/icons-material/Close"
import MenuOpenOutlinedIcon from "@mui/icons-material/MenuOpenOutlined"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline"
import RemoveIcon from "@mui/icons-material/Remove"
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined"
import { SvgIconOwnProps } from "@mui/material"
import { FC } from "react"

const IconMapping = {
    more: MoreVertIcon,
    arrowForward: ArrowForwardIcon,
    arrowBackward: ArrowBackwardIcon,
    calendar: CalendarIcon,
    close: CloseIcon,
    plus: AddIcon,
    minus: RemoveIcon,
    people: PeopleOutlineIcon,
    settings: SettingsOutlinedIcon,
    account: AccountCircleOutlinedIcon,
    menuRight: MenuOpenOutlinedIcon,
}

export interface IconProps extends Pick<SvgIconOwnProps, "color"> {
    name: keyof typeof IconMapping
    size?: SvgIconOwnProps["fontSize"]
}

export const Icon: FC<IconProps> = ({
    name,
    size = "medium",
    color = "inherit",
}: IconProps) => {
    const Component = IconMapping[name]

    return <Component color={color} fontSize={size} />
}
