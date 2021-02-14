import React, { useState, useRef, useEffect } from 'react'

export interface NavDropdown {
    title: React.ReactElement | string,
    id?: string,
    children: React.ReactChild | React.ReactChildren
}

export const NavDropdown: React.FC<NavDropdown> = ( { title, id, children } ) => {
    const [show, setShow] = useState(false)

    const ref = useRef(null)

    useEffect(() => {
        const menu = ref.current

        if (!menu) return;

        // @ts-ignore
        const items: HTMLAllCollection = menu.querySelectorAll('.dropdown-item')

        const clickHandler = () => setShow(false)

        for (let i = 0; i < items.length; i++) {
            const item = items[i]

            item.addEventListener('click', clickHandler)
        }
        return () => {
            for (let i = 0; i < items.length; i++) {
                const item = items[i]
    
                item.removeEventListener('click', clickHandler)
            }
        }
    }, [ref])

    return (
        <div className="dropdown">
            <a 
                id={id} 
                href="#"
                className="dropdown-toggle nav-item"
                aria-haspopup="true"
                aria-expanded={show}
                role="button"
                onClick={() => setShow(!show)}
            >{title}</a>

            <div
                aria-labelledby={id}
                className={show ? "dropdown-menu show" : "dropdown-menu"}
                style={{position: 'absolute', top: '0px', left: '0px', margin: '0px', right: 'auto', bottom: 'auto', transform: 'translate(7.77778px, 40px)', opacity: show ? 1 : 0}}
                ref={ref}
            >
                {children}
            </div>
        </div>
    )
}

export const Item = ({ className, children, ...otherProps }) => {
    return (
        <a className={`dropdown-item ${className}`} {...otherProps}>
            {children}
        </a>
    )
}

// @ts-ignore
NavDropdown.Item = Item