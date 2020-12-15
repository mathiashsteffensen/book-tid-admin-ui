import React, {useState} from 'react'
import Link from 'next/link'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Nav from 'react-bootstrap/Nav'

import SettingsIcon from '@material-ui/icons/Settings';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import EventNoteIcon from '@material-ui/icons/EventNote';
import HelpIcon from '@material-ui/icons/HelpOutlineRounded'

export default function Header() 
{
    const [toggleDropdown, setToggleDropdown] = useState(false)
    return (
        <Navbar onSelect={() => setToggleDropdown(false)} onToggle={() => setToggleDropdown(!toggleDropdown)} expanded={toggleDropdown} fixed="top" className="px-16 py-2 justify-center" bg="dark" variant="dark" expand="md">
            <Link href="/kalender"><Navbar.Brand>BOOKTID.NET</Navbar.Brand></Link>
            <Navbar.Toggle aria-controls="navbar"/>
            <Navbar.Collapse className="flex flex-col md:flex-row md:justify-between py-2 md:py-0" id="navbar">
                <Nav className="md:float-left">
                    <Link href="/kalender">
                            <Nav.Link as="a" href="/kalender" className="flex justify-center items-center">
                                <EventNoteIcon className="mr-1" />
                                Kalender
                            </Nav.Link>   
                    </Link>
                    <Link href="/kunder">
                        <Nav.Link as="a" href="/kunder" className="flex justify-center items-center">
                            <PeopleAltIcon className="mr-1" />
                            Kunder
                        </Nav.Link>   
                    </Link>
                    
                </Nav>

                <Nav className="md:float-right">
                    <NavDropdown title={<div className="flex justify-center items-center"><SettingsIcon className="mr-1 " /> Indstillinger</div>} id="basic-nav-dropdown">
                        <Link href="/kalendere-og-aabningstider">
                           <NavDropdown.Item as="a" href="/kalendere-og-aabningstider">
                               Kalendere & Åbningstider
                            </NavDropdown.Item>
                        </Link>

                        <Link href="/services">
                            <NavDropdown.Item as="a" href="/services">
                                Services
                            </NavDropdown.Item>
                        </Link>
                        <Link href="/online-booking">
                            <NavDropdown.Item as="a" href="/online-booking">
                                Online Booking
                            </NavDropdown.Item>
                        </Link>
                    </NavDropdown>
                    <Nav.Link className="flex justify-center items-center">
                        <HelpIcon />
                    </Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}
