import React, { useState, useEffect } from 'react'
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

import { getAppSettings, updateAppSettings } from '../../requests'


export const AppSettings = ({ app, back }: { app: App, back: () => void }) => {
    const [openSuccess, setOpenSuccess] = useState(false)
    const [revalidate, setRevalidate] = useState(true)

    const { data: serverData, error, mutate } = useSWR([app.id, localStorage.getItem('apiKey')], getAppSettings)

    console.log(serverData);

    const [editableData, setEditableData]: [undefined | typeof serverData, React.Dispatch<React.SetStateAction<undefined | typeof serverData>>] = useState(undefined)

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
                mutate(null, true)
                setRevalidate(true)
                setOpenSuccess(true)
            })
        
    }
    
    return (
        <Row className="w-full p-4 sm:w-10/12">
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
                        key={setting.name}
                        title={setting.name}
                        subtitle={renderTextWithBreaks(setting.description)}
                        input={<div className="w-full mx-4">
                            { setting.type === 'select' && <Input onChange={(e) => handleChange(e.target.value, setting.id)} value={editableData[setting.id]} select={true}>
                                { setting.options === 'timeOfDay' && generateTimeOfDayOptions().map((time: string) => (
                                    <option key={time} value={time} >
                                        {time}
                                    </option>
                                )) }
                            </Input> }
                            { setting.type === 'switch' && <Switch onChange={(e) => handleChange(e.target.checked, setting.id)} checked={editableData[setting.id]} customSize="sm" /> }
                        </div>}
                        extraInfo=""
                    />
                ) ) }

                { (!editableData && !error) && <Spinner variant="primary" /> }
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
