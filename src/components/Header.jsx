import React, {useState} from 'react'

import Link from 'next/link'

import Logo from '../../public/logo.svg'

import {AppBar, Toolbar, IconButton, Button, Menu, MenuItem, Drawer, List, ListItem, ListItemIcon, Divider, ListItemText} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu';
import DropDownIcon from '@material-ui/icons/ArrowDropDown';
import SettingsIcon from '@material-ui/icons/Settings';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import EventNoteIcon from '@material-ui/icons/EventNote';

function DropDownMenu({dropDown, dropDownAnchor, closeDropDown, color})
{
    return (
        <div>
            <Button
                endIcon={<DropDownIcon className={color} />}
                startIcon={<SettingsIcon className={color}/>}
                onClick={dropDown}
            >
                <span className={color}>indstillinger</span>
            </Button>

            <Menu
                size="small"
                open={Boolean(dropDownAnchor)}
                anchorEl={dropDownAnchor}
                onClose={closeDropDown}
                elevation={2}
                getContentAnchorEl={null}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <MenuItem onClick={closeDropDown} disableGutters={true}><Link href="/kalendere-og-aabningstider"><a className="w-full px-4">Kalendere & Åbningstider</a></Link></MenuItem>
                <MenuItem onClick={closeDropDown} disableGutters={true}><Link href="/services"><a className="w-full px-4">Services</a></Link></MenuItem>
                <MenuItem onClick={closeDropDown} disableGutters={true}><Link href="/online-booking"><a className="w-full px-4">Online Booking</a></Link></MenuItem>
            </Menu>
        </div>
    )
}

function MenuList({closeMenu, dropDown, dropDownAnchor, closeDropDown, color})
{
    return (
        <div
            onClick={closeMenu}
            onKeyDown={closeMenu}
        >
            <List className="pr-4" >
                <ListItem>
                    <div className="w-full mb-2">
                       <Logo className="w-32 h-12" /> 
                    </div>
                </ListItem>

                <Link href="/kalender">
                     <a>
                        <ListItem button >
                            <ListItemIcon>
                                <EventNoteIcon />
                            </ListItemIcon>
                            <ListItemText primary="Kalender" />   
                        </ListItem>
                    </a>
                </Link>

                <Link href="/kunder">
                    <a>
                        <ListItem button >
                            <ListItemIcon>
                                <PeopleAltIcon />
                            </ListItemIcon>
                            <ListItemText primary="Kunder" />   
                        </ListItem>
                     </a>
                </Link>
            </List>
            <Divider />
            <List>
                <ListItem button>
                    <DropDownMenu color="text-gray-700" dropDown={dropDown} dropDownAnchor={dropDownAnchor} closeDropDown={closeDropDown} />
                </ListItem>
            </List> 
        </div>
        
    )
}

export default function Header({firstName}) 
{
    const [dropDownAnchor, setDropDownAnchor] = useState(null)

    const [openMenu, setOpenMenu] = useState(false)

    let dropDown = (e) =>
    {
        setDropDownAnchor(e.target)
    }

    let closeDropDown = () =>
    {
        setDropDownAnchor(null)
    }

    return (
        <AppBar position="static">
            <Toolbar className="flex justify-between">
                <div className="flex flex-row-reverse w-full sm:w-1/4 sm:flex-row items-center justify-between">
                    <Link href="/kalender">
                        <IconButton>
                            <Logo className="w-32 h-12" /> 
                        </IconButton>
                    </Link>

                    <Link href="/kalender">
                        <a className="hidden sm:flex">
                            <Button
                                startIcon={<EventNoteIcon className="text-gray-100"/>}
                            >
                                <span className="text-gray-100">
                                    kalender
                                </span>
                            </Button>
                        </a>
                    </Link>

                    <Link href="/kunder">
                        <a className="hidden sm:flex">
                            <Button
                                startIcon={<PeopleAltIcon className="text-gray-100"/>}
                            >
                                <span className="text-gray-100">
                                    kunder
                                </span>
                            </Button>
                        </a>
                    </Link>
                    <div className="sm:hidden">
                        <IconButton
                            onClick={() => setOpenMenu(true)}
                        >
                            <MenuIcon />
                        </IconButton>

                        <Drawer
                            anchor="left"
                            open={openMenu}
                            onClose={() => setOpenMenu(false)}
                        >
                            <MenuList dropDown={dropDown} dropDownAnchor={dropDownAnchor} closeDropDown={closeDropDown} closeMenu={() => setOpenMenu(false)} />
                        </Drawer>
                    </div>
                    
                </div>

                <div className="hidden sm:flex">
                    <DropDownMenu color="text-gray-100" dropDown={dropDown} dropDownAnchor={dropDownAnchor} closeDropDown={closeDropDown} />
                </div>
            </Toolbar>
        </AppBar>
    )
}
