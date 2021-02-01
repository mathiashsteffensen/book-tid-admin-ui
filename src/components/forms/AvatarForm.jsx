import React, { useState, createRef, useEffect } from 'react';
import FormModel from './FormModel';

import { Avatar, Button } from '@material-ui/core';

import {
    uploadAvatar,
    getAvatars,
    updateAvatar,
    deleteAvatar,
} from '../../requests';

import axios from 'axios';
import PhotoGrid from '../PhotoGrid/PhotoGrid';

export default function AvatarForm({ closeForm, formProps }) {
    let { pictureURL, avatarClass, calendarID, updateBG } = formProps;

    const fileInput = createRef();

    const [error, setError] = useState('');
    const [shouldUpdate, setShouldUpdate] = useState(false);
    const [currentAvatar, setCurrentAvatar] = useState(pictureURL);
    const [avatars, setAvatars] = useState([]);

    const abortController = axios.CancelToken.source();

    const update = () => {
        setShouldUpdate(!shouldUpdate);
    };

    const handleUpload = () => {
        uploadAvatar(
            localStorage.getItem('apiKey'),
            calendarID,
            fileInput.current.files[0]
        )
            .then(update)
            .catch((err) => setError(err.message));
    };

    const usePhoto = async (apiKey, photoURL) => {
        return await updateAvatar(apiKey, calendarID, photoURL)
            .then(() => {
                setCurrentAvatar(photoURL);
            })
            .then(updateBG)
            .catch((err) => setError(err.message));
    };

    const deletePhoto = async (apiKey, photoURL) => {
        return await deleteAvatar(apiKey, photoURL)
            .then(update)
            .then(updateBG)
            .catch((err) => setError(err.message));
    };

    useEffect(() => {
        getAvatars(localStorage.getItem('apiKey'), abortController)
            .then((res) => setAvatars(res))
            .catch((err) => setError(err.message));
        return () => abortController.cancel();
    }, [shouldUpdate]);

    return (
        <FormModel title="Upload billede" closeForm={closeForm}>
            <div className="my-4 flex flex-col justify-center items-center">
                <Avatar className={avatarClass} src={currentAvatar} />
                <span className="h-4"></span>
                <div className="w-full flex justify-between items-center">
                    <input
                        type="file"
                        name="avatar"
                        id="avatar"
                        ref={fileInput}
                    />
                    <Button color="primary" onClick={handleUpload}>
                        Upload
                    </Button>
                </div>
            </div>

            <PhotoGrid
                deletePhoto={deletePhoto}
                usePhoto={usePhoto}
                photos={avatars}
            />

            <p>{error}</p>
        </FormModel>
    );
}
