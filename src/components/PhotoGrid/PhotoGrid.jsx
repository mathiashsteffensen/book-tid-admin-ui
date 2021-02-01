import React, { useState } from 'react';

import { GridList } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import PhotoTile from './PhotoTile';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    gridList: {
        width: 400,
        height: 200,
    },
    tileBar: {
        height: 28,
    },
}));

export default function PhotoGrid({ photos, usePhoto, deletePhoto }) {
    const classes = useStyles();

    if (photos) {
        return (
            <div>
                <GridList
                    cols={4}
                    cellHeight={100}
                    className={classes.gridList}
                >
                    {photos.map((photo, i) => (
                        <PhotoTile
                            tileBarClass={classes.tileBar}
                            usePhoto={usePhoto}
                            deletePhoto={deletePhoto}
                            photo={photo}
                            key={i}
                        />
                    ))}
                </GridList>
            </div>
        );
    } else {
    }
}
