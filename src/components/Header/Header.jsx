import React, {useState} from 'react'
import Link from 'next/link'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Nav from 'react-bootstrap/Nav'
import Button from 'react-bootstrap/Button'

import SettingsIcon from '@material-ui/icons/Settings';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import EventNoteIcon from '@material-ui/icons/EventNote';
import HelpIcon from '@material-ui/icons/HelpOutlineRounded'
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import { logout } from '../../requests'


// TODO: Add help page / FAQ

export default function Header() 
{
    const [toggleDropdown, setToggleDropdown] = useState(false)
    return (
        <Navbar onSelect={() => setToggleDropdown(false)} onToggle={() => setToggleDropdown(!toggleDropdown)} expanded={toggleDropdown} className="px-16 py-2 justify-center" bg="dark" variant="dark" expand="md">
            <Link href="/kalender">
                <Navbar.Brand>
                    <h1>BOOKTID.NET</h1>
                    <h5 className="text-sm">BETA v0.2.0</h5>
                </Navbar.Brand>
            </Link>
            <Navbar.Toggle aria-controls="navbar"/>
            <Navbar.Collapse className="flex flex-col md:flex-row md:justify-between py-2 md:py-0" id="navbar">
                <Nav className="md:float-left">
                    <Link href="/kalender">
                        <Nav.Link as="a" className="flex justify-center items-center">
                            <EventNoteIcon className="mr-1" />
                            Kalender
                        </Nav.Link>   
                    </Link>
                    <Link href="/kunder">
                        <Nav.Link as="a" className="flex justify-center items-center">
                            <PeopleAltIcon className="mr-1" />
                            Kunder
                        </Nav.Link>   
                    </Link>
                    
                </Nav>

                <Nav className="md:float-right">
                    <Nav.Link className="flex justify-center items-center">
                        <HelpIcon />
                    </Nav.Link>
                    
                    <NavDropdown title={<div className="flex justify-center items-center"><SettingsIcon className="mr-1 " /> Indstillinger</div>} id="basic-nav-dropdown">
                        <Link href="/kalendere-og-aabningstider">
                           <NavDropdown.Item as="a" href="/kalendere-og-aabningstider">
                               Kalendere & Åbningstider
                            </NavDropdown.Item>
                        </Link>

                        <Link href="/services">
                            <NavDropdown.Item as="a">
                                Services
                            </NavDropdown.Item>
                        </Link>
                        <Link href="/online-booking">
                            <NavDropdown.Item as="a">
                                Online Booking
                            </NavDropdown.Item>
                        </Link>
                        
                        <div className="px-6 py-2">
                            <Button onClick={logout} variant="outline-danger" className="w-full">
                                Log Ud
                            </Button>   
                        </div>
                        
                    </NavDropdown>
                    
                    <Link href="/profil">
                        <Nav.Link as="a" className="flex justify-center items-center">
                            <AccountCircleIcon className="mr-1" />
                            Min Profil
                        </Nav.Link>
                    </Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}
