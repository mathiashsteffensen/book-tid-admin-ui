import React, { useState } from 'react';

import axios from 'axios';

import { updateCategory } from '../../requests';

import { Button, TextField } from '@material-ui/core';

import FormModel from './FormModel';

export default function UpdateCategory({ closeForm, formProps }) {
    const { name, _id } = formProps;

    const [catName, setName] = useState(name);
    const [error, setError] = useState('');

    const abortController = axios.CancelToken.source();

    const handleSubmit = () => {
        updateCategory(
            localStorage.getItem('apiKey'),
            abortController,
            catName,
            _id
        )
            .then(() => closeForm())
            .catch((err) => setError(err.response.data.msg));
    };

    return (
        <FormModel
            title="Rediger Kategori"
            closeForm={closeForm}
            resetError={() => setError('')}
        >
            <div className="flex flex-col justify-center items-center w-full px-6 pb-4">
                <TextField
                    value={catName}
                    onChange={(e) => setName(e.target.value)}
                    size="small"
                    margin="normal"
                    className="w-full"
                    color="primary"
                    label="Navn på kategorien"
                    type="text"
                    required
                    variant="outlined"
                />
            </div>

            <Button
                onClick={handleSubmit}
                margin="normal"
                variant="contained"
                color="primary"
            >
                Opdater
            </Button>

            <h4 className="text-red-700 mt-2">{error}</h4>
        </FormModel>
    );
}
