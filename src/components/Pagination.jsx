import React from 'react';

import { ButtonGroup, Button } from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackwardIcon from '@material-ui/icons/ArrowBackIos';

export default function Pagination({
    next,
    previous,
    disableNext,
    disablePrevious,
}) {
    return (
        <ButtonGroup variant="outlined" color="primary" disableElevation>
            <Button disabled={disablePrevious} onClick={previous}>
                <ArrowBackwardIcon />
            </Button>

            <Button disabled={disableNext} onClick={next}>
                <ArrowForwardIcon />
            </Button>
        </ButtonGroup>
    );
}
