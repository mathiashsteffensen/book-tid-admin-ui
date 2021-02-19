import React, { useState } from 'react'

import { App } from '../../GlobalTypes'

import { Button } from '../agnostic/Button'
import { Card } from '../agnostic/Card/Card'
import { FlexContainer } from '../agnostic/FlexContainer'
import { Spinner } from '../agnostic/Spinner'

import { activateApp, deactivateApp } from '../../requests'

export const AppCard = ( { app, disabled, isActive, showSettings }: { app: App, disabled: boolean, isActive: boolean, showSettings: (app: App) => void } ) => {
    const [loading, setLoading] = useState(false)

    const handleActivate = () => {
        setLoading(true)
        activateApp(app, localStorage.getItem('apiKey'))
            .catch((err) => console.log(err))
            .finally(() => {
                setLoading(false)
                window.location.reload()
            })
    }

    const handleDeactivate = () => {
        setLoading(true)

        deactivateApp(app, localStorage.getItem('apiKey'))
            .catch((err) => console.log(err))
            .finally(() => {
                setLoading(false)
                window.location.reload()
            })
    }

    return (
        <Card className="alert info p-0">
            <Card.Body>
                <FlexContainer className="w-full pb-4" justify="space-evenly" >
                    <img className="w-16 float-left" src={app.icon} alt="App ikon"/>
                    <Card.Title className="m-0">{app.name}</Card.Title>
                </FlexContainer>

                <Card.Text>{app.description}</Card.Text>
            </Card.Body>
            <Card.Footer>
                { isActive ? (
                    <FlexContainer justify="space-evenly">
                        <Button onClick={() => showSettings(app)}>Indstillinger</Button>
                        <Button onClick={handleDeactivate} variant="danger" >{ loading ? <Spinner variant="light" /> : 'Deaktivèr'}</Button>
                    </FlexContainer>
                ) : (
                    <Button disabled={disabled} onClick={handleActivate} size="lg" className="w-full flex justify-center">{ loading ? <Spinner variant="light" /> : 'Aktivèr'}</Button>
                ) }
            </Card.Footer>
        </Card>
    )
}
