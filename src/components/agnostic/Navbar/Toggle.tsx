import React from 'react'

export const Toggle = (props: React.ButtonHTMLAttributes<any>) => {
    return (
        <button aria-label="Toggle navigation" {...props} className="navbar-toggler">
            <span className="navbar-toggler-icon"></span>
        </button>
    )
}
