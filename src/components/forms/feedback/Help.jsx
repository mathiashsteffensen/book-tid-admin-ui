import React from 'react';

import { Tooltip, IconButton } from '@material-ui/core';
import HelpIcon from '@material-ui/icons/Help';

export default function Help({ helpText }) {
    return (
        <Tooltip title={helpText} aria-label={helpText}>
            <IconButton size="small">
                <HelpIcon style={{ width: 20 }} />
            </IconButton>
        </Tooltip>
    );
}
