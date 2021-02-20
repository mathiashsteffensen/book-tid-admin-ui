import React, { useState } from 'react';
import Link from 'next/link';

import { Navbar } from '../../agnostic/Navbar/Navbar';
import { Nav } from '../../agnostic/Nav/Nav';
import { NavDropdown } from '../../agnostic/NavDropdown/NavDropdown';
import { Button } from '../../agnostic/Button';

import AppStoreIcon from '../../../assets/app-store.svg'
import SettingsIcon from '@material-ui/icons/Settings';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import EventNoteIcon from '@material-ui/icons/EventNote';
import HelpIcon from '@material-ui/icons/HelpOutlineRounded';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import { logout } from '../../../requests';

// TODO: Add help page / FAQ

export default function Header() {
    const [toggleDropdown, setToggleDropdown] = useState(false);
    return (
        <Navbar
            onSelect={() => setToggleDropdown(false)}
            onToggle={() => setToggleDropdown(!toggleDropdown)}
            expanded={toggleDropdown}
            className="px-6 py-2 justify-center"
            bg="dark"
            variant="dark"
            expand="md"
        >
            <Link href="/kalender">
                <a>
                    <Navbar.Brand>
                        <h1>BOOKTID.NET</h1>
                        {process.env.NODE_ENV === 'development' && (
                            <p className="text-sm">BETA v0.2.0</p>
                        )}
                    </Navbar.Brand>  
                </a>
            </Link>
            <Navbar.Toggle aria-controls="navbar" />
            <Navbar.Collapse
                className="flex flex-col md:flex-row md:justify-between"
                id="navbar"
            >
                <Nav className="md:float-left">
                    <Link href="/kalender">
                        <a
                            onClick={() => setToggleDropdown(false)}
                            className="nav-link flex justify-center items-center"
                        >
                            <EventNoteIcon className="mr-1" />
                            Kalender
                        </a>
                    </Link>
                    <Link href="/kunder">
                        <a
                            onClick={() => setToggleDropdown(false)}
                            className="nav-link flex justify-center items-center"
                        >
                            <PeopleAltIcon className="mr-1" />
                            Kunder
                        </a>
                    </Link>
                </Nav>

                <Nav className="md:float-right">
                    <Link href="/faq">
                        <a className="nav-link flex justify-center items-center">
                            <HelpIcon />
                        </a>
                    </Link>
                    
                    <Link href="/app-store">
                        <a
                            onClick={() => setToggleDropdown(false)}
                            className="nav-link flex justify-center items-center"
                        >
                            <AppStoreIcon className="MuiSvgIcon-root mr-1" />
                            Apps
                        </a>
                    </Link>

                    <NavDropdown
                        title={
                            <div className="flex justify-center items-center">
                                <SettingsIcon className="mr-1 " /> Indstillinger
                            </div>
                        }
                        id="basic-nav-dropdown"
                    >
                        <Link href="/kalendere-og-aabningstider">
                            <a
                                onClick={() => setToggleDropdown(false)}
                                className="dropdown-item"
                                href="/kalendere-og-aabningstider"
                            >
                                Kalendere & Åbningstider
                            </a>
                        </Link>

                        <Link href="/services">
                            <a className="dropdown-item" onClick={() => setToggleDropdown(false)} >Services</a>
                        </Link>
                        <Link href="/online-booking">
                            <a className="dropdown-item" onClick={() => setToggleDropdown(false)} >
                                Online Booking
                            </a>
                        </Link>

                        <div className="px-6 py-2">
                            <Button
                                onClick={logout}
                                variant="outline-danger"
                                className="w-full"
                            >
                                Log Ud
                            </Button>
                        </div>
                    </NavDropdown>

                    <Link href="/profil">
                        <a
                            onClick={() => setToggleDropdown(false)}
                            className="nav-link flex justify-center items-center"
                        >
                            <AccountCircleIcon className="mr-1" />
                            Min Profil
                        </a>
                    </Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}
