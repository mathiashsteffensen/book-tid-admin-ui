import React, { useState, useEffect, useRef } from 'react'
import useSWR from 'swr'

import { App } from '../../GlobalTypes'

import { Button } from '../agnostic/Button'
import { Col } from '../agnostic/Col'
import { Row } from '../agnostic/Row'
import { Subtitle } from '../agnostic/Subtitle'
import { Input } from '../agnostic/Form/Input'
import { Switch } from '../agnostic/Form/Switch'
import { Spinner } from '../agnostic/Spinner'

import FullPageInput from '../custom/FullPageInput'

import { Snackbar, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
// @ts-ignore
import { renderTextWithBreaks, generateTimeOfDayOptions } from '../../utils.tsx'

import { getAppSettings, updateAppSettings, uploadLogo } from '../../requests'
import { Alert } from '../agnostic/Alert'
import { settings } from 'node:cluster'


export const AppSettings = ({ app, back }: { app: App, back: () => void }) => {
    const [openSuccess, setOpenSuccess] = useState(false)
    const [revalidate, setRevalidate] = useState(true)

    const { data: serverData, error, mutate } = useSWR([app.id, localStorage.getItem('apiKey')], getAppSettings)
    console.log(serverData)
    const update = () => {
        setRevalidate(true)
        mutate(null, true)
    }

    const [editableData, setEditableData]: [undefined | typeof serverData, React.Dispatch<React.SetStateAction<undefined | typeof serverData>>] = useState(undefined)

    const fileInputs = app.settings.filter(setting => setting.type === 'image')

    if (process.env.NODE_ENV === 'development' && fileInputs.length > 1) throw new Error('ERROR: Only one file input possible per app')

    if (fileInputs.length !== 0) var fileRef = useRef(null)

    if (fileInputs[0].id === 'logo') {
        var [fileError, setFileError]: [false | string, any] = useState(false)

        var uploadFile = () => {
            if (!fileRef.current) return;
            setFileError(false)
            uploadLogo(
                localStorage.getItem('apiKey'),
                // @ts-ignore
                fileRef.current.files[0]
            )
                .then(update)
                .catch((err) => setFileError(err.message));
        }
    }

    useEffect(() => {
        if (serverData && revalidate) {
            setEditableData(serverData)
            setRevalidate(false)
        }
    }, [serverData])

    const handleChange = (value: string, settingId: string) => {
        setEditableData({
            ...editableData,
            ...{
                [settingId]: value
            }
        })
    }

    const handleSave = () => {
        updateAppSettings(app.id, localStorage.getItem('apiKey'), editableData)
            .then(() => {
                setRevalidate(true)
                mutate(null, true)
                setOpenSuccess(true)
            })
        
    }
    
    return (
        <Row className="w-full gap-y-2 p-4 sm:w-10/12">
            <Col sm={2} >
                <Button onClick={back} className="flex justify-center items-center" variant="outline-dark">
                    <ArrowBackIcon className="mr-2"/>
                    Tilbage
                </Button>
            </Col>
            <Col sm={10}>
                <Subtitle size="lg" as="h1" >{app.name}</Subtitle>
                <Subtitle size="sm" as="h3" >{app.description}</Subtitle>
            </Col>
            <Col sm={12}>
                { (editableData && !error) && app.settings.map((setting) => (
                    <FullPageInput
                        key={setting.id}
                        title={setting.name}
                        subtitle={renderTextWithBreaks(setting.description)}
                        input={<div className="w-full mx-4">
                            { setting.type === 'select' && <Input {...setting.otherProps}  onChange={(e) => handleChange(e.target.value, setting.id)} value={editableData[setting.id]} select={true}>
                                { setting.options === 'timeOfDay' && generateTimeOfDayOptions().map((time: string) => (
                                    <option key={time} value={time} >
                                        {time}
                                    </option>
                                )) }
                            </Input> }
                            
                            { setting.type === 'image' && <div className="flex flex-col sm:flex-row gap-2 justify-center items-center py-2">
                                <input {...setting.otherProps} id={setting.id} className="input primary" ref={fileRef} type="file"/>
                                
                                <Button onClick={uploadFile} size="sm" variant="outline-primary">Upload</Button>

                                <figure>
                                    <img className="mx-auto" style={{maxWidth: 150, maxHeight: 100}} src={editableData[setting.id]} alt="img preview"/>
                                    <figcaption className="text-xs">Det nuværende logo på din bookingside</figcaption>
                                </figure>
                            </div> }

                            { setting.type === 'color' && <Input style={{height: 50, width: 100}} {...setting.otherProps} type={setting.type} onChange={(e) => handleChange(e.target.value, setting.id)} value={editableData[setting.id]} /> }

                            { setting.type === 'switch' && <Switch {...setting.otherProps}  onChange={(e) => handleChange(e.target.checked, setting.id)} checked={editableData[setting.id]} customSize="sm" /> }
                            
                            { (setting.type !== 'select' && setting.type !== 'switch' && setting.type !== 'image' && setting.type !== 'color') && <Input {...setting.otherProps} type={setting.type} onChange={(e) => handleChange(e.target.value, setting.id)} value={editableData[setting.id]} /> }
                        </div>}
                        extraInfo=""
                    />
                ) ) }

                { (!editableData && !error) && <Spinner variant="primary" /> }

                { error && <Alert className="mt-2" variant="danger">{error.message}</Alert> }

                { fileError && <Alert className="mt-2" variant="danger">{fileError}</Alert> }
            </Col>
            <Col sm={11} />
            <Col sm={1} >
                <Button onClick={handleSave} >Gem</Button>
            </Col>

            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                open={openSuccess}
                autoHideDuration={3000}
                onClose={() => setOpenSuccess(false)}
                message="Ændringer gemt"
                action={
                    <React.Fragment>
                        <IconButton
                            size="small"
                            aria-label="close"
                            color="inherit"
                            onClick={() => setOpenSuccess(false)}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </React.Fragment>
                }
            />
        </Row>
    )
}
