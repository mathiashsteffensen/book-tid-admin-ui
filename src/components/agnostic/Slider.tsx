import React, { ReactChild, useState } from 'react'

import { Button, ButtonProps } from './Button'

export interface SliderProps {
    title: string,
    sliderKey: string,
    handleClick?: (sliderKey: string) => void,
    isOpen?: boolean,
    children: ReactChild | Array<ReactChild> | null,
    disabled?: boolean
    variant?: ButtonProps["variant"]
}

export const Slider = ({title, handleClick, isOpen, children, disabled = false, sliderKey, variant = 'secondary'}: SliderProps)  =>
{

    if (typeof handleClick === 'undefined' && typeof isOpen === 'undefined') 
    {
        var [open, setOpen] = useState(false)

        handleClick = (sliderKey: string) =>
        {
            setOpen(!open)
        }

        return (
            <section className={open ? `slider ${variant} open` : `slider ${variant} closed`}>
                <div className="header">
                    <Button 
                        onClick={ () => handleClick && handleClick(sliderKey) }
                        disabled={disabled}
                        variant={variant}
                    >
                        { title }
                    </Button>
                </div>
    
                <div className="content">
                    { children }
                </div>
            </section>
        )
    }

    return (
        <section className={isOpen ? `slider ${variant} open` : `slider ${variant} closed`}>
            <div className="header">
                <Button 
                    onClick={ () => handleClick && handleClick(sliderKey) }
                    disabled={disabled}
                    variant={variant}
                >
                    { title }
                </Button>
            </div>

            <div className="content">
                { children }
            </div>
        </section>
    )
}
