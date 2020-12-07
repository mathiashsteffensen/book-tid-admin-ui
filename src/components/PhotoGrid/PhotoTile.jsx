import React, {useState} from 'react'

import {GridListTile, GridListTileBar, IconButton, Menu, MenuItem} from '@material-ui/core'
import MoreIcon from '@material-ui/icons/MoreVert';

export default function PhotoTile({photo, usePhoto, deletePhoto, tileBarClass}) 
{
    const [menuAnchor, setMenuAnchor] = useState(null)

    const openMenu = (e) =>
    {
        setMenuAnchor(e.currentTarget)
    }

    const closeMenu = () =>
    {
        setMenuAnchor(null)
    }
    return (
        <GridListTile
            style={{
                width: 100,
                height: 100
            }}
        >
            <img src={photo} alt="Et billede"/>
            <GridListTileBar
                className={tileBarClass}
                actionPosition="right"
                actionIcon={
                    <IconButton
                        size="small"
                        onClick={openMenu}
                    >
                        <MoreIcon fontSize="small" htmlColor="white" />
                    </IconButton>
                }
            />
            <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={closeMenu}
            >
                <MenuItem 
                    onClick={() => 
                    {
                        usePhoto(localStorage.getItem('apiKey'), photo)
                        .then(closeMenu)
                    }}
                >Brug Billede</MenuItem>

                <MenuItem
                    onClick={() => 
                    {
                        deletePhoto(localStorage.getItem('apiKey'), photo)
                        closeMenu()
                    }}
                >Slet Billede</MenuItem>
            </Menu>
        </GridListTile>
    )
}
