import React, { useRef, useEffect } from 'react'

import { Toggle } from './Toggle'
import { Collapse } from './Collapse'
import { Brand } from './Brand'

export interface Navbar extends React.HTMLAttributes<any> {
    bg: 'primary' | 'secondary' | 'light' | 'dark' | 'info' | 'warning' | 'danger',
    variant: 'primary' | 'secondary' | 'light' | 'dark' | 'info' | 'warning' | 'danger',
    expand: 'sm' | 'md' | 'lg' | 'xl',
    expanded: boolean,
    onSelect: () => void,
    onToggle: () => void
}

export const Navbar = ({ bg = 'primary' , variant = 'primary' , expand = 'md', className, children, expanded, onSelect, onToggle, ...otherProps }: Navbar) => {
    const classes = `navbar bg-${bg} navbar-${variant} navbar-expand-${expand}`

    const navRef = useRef(null)

    useEffect(() =>
    {

        const nav = navRef.current

        if (!nav) return;

        // @ts-ignore
        const toggler = nav.querySelector('.navbar-toggler')

        // @ts-ignore
        const navLinks: Array<HTMLAnchorElement> = nav.querySelectorAll('.nav-link')

        toggler.addEventListener('click', onToggle)

        for (let i = 0; i < navLinks.length; i++) {
            const navLink = navLinks[i]
            if (!navLink) return;
            navLink.addEventListener('click', onSelect)
        }
    }, [navRef])

    useEffect(() =>
    {
        const nav = navRef.current

        if (!nav) return;

        // @ts-ignore
        const toggler: HTMLButtonElement = nav.querySelector('.navbar-toggler')

        toggler.addEventListener('click', onToggle)

        // @ts-ignore
        const controls: HTMLElement = nav.querySelector(`#${toggler.getAttribute('aria-controls')}`)

        if (expanded) {
            console.log(controls);
            controls.classList.add('open')
            controls.classList.remove('closed')
        } else {
            controls.classList.add('closed')
            controls.classList.remove('open')
        }

        return () => {
            toggler.removeEventListener('click', onToggle)
        }
    }, [expanded])

    return (
        <nav
            ref={navRef} 
            className={classes}
            {...otherProps}
        >
            {children}
        </nav>
    )
}

Navbar.Toggle = Toggle
Navbar.Collapse = Collapse
Navbar.Brand = Brand