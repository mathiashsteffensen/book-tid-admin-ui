import React, { useState } from 'react';

import { TextField, Button } from '@material-ui/core';

import axios from 'axios';

import FormModel from './FormModel';

import { createCategory } from '../../../requests';

export default function AddCategory({ closeForm }) {
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const abortController = axios.CancelToken.source();

    const handleSubmit = () => {
        createCategory(localStorage.getItem('apiKey'), abortController, name)
            .then(() => closeForm())
            .catch((err) => setError(err.response.data.msg));
    };

    return (
        <FormModel
            title="Opret Kategori"
            closeForm={closeForm}
            resetError={() => setError('')}
        >
            <div className="flex flex-col justify-center items-center w-full px-6 pb-4">
                <TextField
                    value={name}
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
                Opret
            </Button>

            <h4 className="text-red-700 mt-2">{error}</h4>
        </FormModel>
    );
}
