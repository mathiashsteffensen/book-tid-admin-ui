import React, {useState} from 'react'

import {getBookingSettings, updateBookingSettings, verifyApiKey} from '../../requests'
import {getSettingLabelFromKey} from '../../utils'

import Main from '../../components/Main'
import FullPageInput from '../../components/FullPageInput'

import {Button, Snackbar, IconButton, TextField, Select, MenuItem, Switch} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'

export default function OnlineBooking({bookingSettings}) {
    const [state, setState] = useState({
        bookingSettings: bookingSettings,
        editDomain: false,
    })

    const [openSucces, setOpenSuccess] = useState(false)

    const [shouldUpdate, setShouldUpdate] = useState(false)
    const update = () => setShouldUpdate(!shouldUpdate)

    const handleChange = (key, value) =>
    {
        let newState = state
        state.bookingSettings[key] = value
        setState(newState)
        update()
    }

    return (
        <Main
            title="Online booking indstillinger"
            subtitle="Her kan du ændre i dine indstillinger for hvordan du modtager online bookings"
            CTAs={
                <div>
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={() => updateBookingSettings(localStorage.getItem('apiKey'), state.bookingSettings).then(() => setOpenSuccess(true))}
                    >
                        Gem
                    </Button> 
                </div>
            }
        >
            <div className="w-11/12 divide-y divide-gray-300">
                <FullPageInput 
                    title={getSettingLabelFromKey("domainPrefix").title}
                    subtitle={getSettingLabelFromKey("domainPrefix").subtitle}
                    input={
                        <div className="flex justify-center items-center w-full">
                            <TextField
                                className="w-full text-xs md:text-base"
                                style={{marginLeft: '0.5rem'}}
                                disabled={!state.editDomain} 
                                inputProps={{style: {textAlign: 'right', paddingRight: 0, width: '100%'}}}
                                value={state.bookingSettings.domainPrefix}
                                onChange={(e) => handleChange('domainPrefix', e.target.value)}
                            />
                            <span style={{fontSize: '16px'}}>.booktid.net</span>
                            <p 
                                onClick={() => setState({...state, ...{editDomain: !state.editDomain}})} 
                                className="ml-4 cursor-pointer underline text-center text-2xs text-blue-700 font-medium"
                            >
                                    {state.editDomain 
                                        ? 'Klik her for at låse dit domænenavn' 
                                        : 'Klik her for at redigerer dit domæne navn'
                                    }
                            </p>
                        </div>
                    }
                />

                <FullPageInput 
                    title={getSettingLabelFromKey("latestBookingBefore").title}
                    subtitle={getSettingLabelFromKey("latestBookingBefore").subtitle}
                    input={
                        <div className="ml-2 flex justify-start items-center w-full">
                            <Select
                                value={state.bookingSettings.latestBookingBefore}
                                onChange={(e) => handleChange('latestBookingBefore', e.target.value)}
                                style={{width: '100%'}}
                                variant="outlined"
                            >
                                <MenuItem value={30}>30 min</MenuItem>
                                <MenuItem value={60}>1 time (standard)</MenuItem>
                                <MenuItem value={120}>2 timer</MenuItem>
                                <MenuItem value={180}>3 timer</MenuItem>
                                <MenuItem value={240}>4 timer</MenuItem>
                                <MenuItem value={300}>5 timer</MenuItem>
                                <MenuItem value={360}>6 timer</MenuItem>
                                <MenuItem value={720}>12 timer</MenuItem>
                                <MenuItem value={1440}>1 dag</MenuItem>
                                <MenuItem value={2880}>2 dage</MenuItem>
                                <MenuItem value={4320}>3 dage</MenuItem>
                            </Select>
                        </div>
                    }
                />

                <FullPageInput 
                    title={getSettingLabelFromKey("latestCancelbefore").title}
                    subtitle={getSettingLabelFromKey("latestCancelbefore").subtitle}
                    input={
                        <div className="ml-2 flex justify-start items-center w-full">
                            <Select
                                value={state.bookingSettings.latestCancelbefore}
                                onChange={(e) => handleChange('latestCancelbefore', e.target.value)}
                                style={{width: '100%'}}
                                variant="outlined"
                            >
                                <MenuItem value={30}>30 min</MenuItem>
                                <MenuItem value={60}>1 time</MenuItem>
                                <MenuItem value={120}>2 timer</MenuItem>
                                <MenuItem value={180}>3 timer</MenuItem>
                                <MenuItem value={240}>4 timer</MenuItem>
                                <MenuItem value={300}>5 timer</MenuItem>
                                <MenuItem value={360}>6 timer</MenuItem>
                                <MenuItem value={720}>12 timer (standard)</MenuItem>
                                <MenuItem value={1440}>1 dag</MenuItem>
                                <MenuItem value={2880}>2 dage</MenuItem>
                                <MenuItem value={4320}>3 dage</MenuItem>
                            </Select>
                        </div>
                    }
                />

                <FullPageInput 
                    title={getSettingLabelFromKey("maxDaysBookAhead").title}
                    subtitle={getSettingLabelFromKey("maxDaysBookAhead").subtitle}
                    input={
                        <div className="ml-2 flex justify-start items-center w-full">
                            <Select
                                value={state.bookingSettings.maxDaysBookAhead}
                                onChange={(e) => handleChange('maxDaysBookAhead', e.target.value)}
                                style={{width: '100%'}}
                                variant="outlined"
                            >
                                <MenuItem value={7}>1 uge</MenuItem>
                                <MenuItem value={14}>2 uger</MenuItem>
                                <MenuItem value={30}>1 måned</MenuItem>
                                <MenuItem value={60}>2 måneder</MenuItem>
                                <MenuItem value={90}>3 måneder</MenuItem>
                                <MenuItem value={120}>4 måneder</MenuItem>
                                <MenuItem value={150}>5 måneder</MenuItem>
                                <MenuItem value={180}>6 måneder</MenuItem>
                                <MenuItem value={210}>7 måneder</MenuItem>
                                <MenuItem value={240}>8 måneder</MenuItem>
                                <MenuItem value={270}>9 måneder</MenuItem>
                                <MenuItem value={300}>10 måneder</MenuItem>
                                <MenuItem value={330}>11 måneder</MenuItem>
                                <MenuItem value={364}>1 år</MenuItem>
                                <MenuItem value={728}>2 år</MenuItem>
                                <MenuItem value={1092}>3 år (standard)</MenuItem>
                            </Select>
                        </div>
                    }
                />

                <FullPageInput 
                    title={getSettingLabelFromKey("requireCustomerAddress").title}
                    subtitle={getSettingLabelFromKey("requireCustomerAddress").subtitle}
                    input={
                        <div className="ml-2 flex justify-start items-center w-full">
                            <Switch 
                                checked={state.bookingSettings.requireCustomerAddress}
                                onChange={(e) => handleChange('requireCustomerAddress', e.target.checked)}
                                color="primary"
                            />
                        </div>
                    }
                />

                <FullPageInput 
                    title={getSettingLabelFromKey("hideCustomerCommentSection").title}
                    subtitle={getSettingLabelFromKey("hideCustomerCommentSection").subtitle}
                    input={
                        <div className="ml-2 flex justify-start items-center w-full">
                            <Switch 
                                checked={state.bookingSettings.hideCustomerCommentSection}
                                onChange={(e) => handleChange('hideCustomerCommentSection', e.target.checked)}
                                color="primary"
                            />
                        </div>
                    }
                />

                <FullPageInput 
                    title={getSettingLabelFromKey("hideServiceDuration").title}
                    subtitle={getSettingLabelFromKey("hideServiceDuration").subtitle}
                    input={
                        <div className="ml-2 flex justify-start items-center w-full">
                            <Switch 
                                checked={state.bookingSettings.hideServiceDuration}
                                onChange={(e) => handleChange('hideServiceDuration', e.target.checked)}
                                color="primary"
                            />
                        </div>
                    }
                />

                <FullPageInput 
                    title={getSettingLabelFromKey("hideServicePrice").title}
                    subtitle={getSettingLabelFromKey("hideServicePrice").subtitle}
                    input={
                        <div className="ml-2 flex justify-start items-center w-full">
                            <Switch 
                                checked={state.bookingSettings.hideServicePrice}
                                onChange={(e) => handleChange('hideServicePrice', e.target.checked)}
                                color="primary"
                            />
                        </div>
                    }
                />

                <FullPageInput 
                    title={getSettingLabelFromKey("hideContactInfo").title}
                    subtitle={getSettingLabelFromKey("hideContactInfo").subtitle}
                    input={
                        <div className="ml-2 flex justify-start items-center w-full">
                            <Switch 
                                checked={state.bookingSettings.hideContactInfo}
                                onChange={(e) => handleChange('hideContactInfo', e.target.checked)}
                                color="primary"
                            />
                        </div>
                    }
                />
            </div>
            <Snackbar 
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                open={openSucces}
                autoHideDuration={3000}
                onClose={() => setOpenSuccess(false)}
                message="Ændringer gemt"
                action={
                    <React.Fragment>
                        <IconButton size="small" aria-label="close" color="inherit" onClick={() => setOpenSuccess(false)}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </React.Fragment>
                }
            />
        </Main>
    )
}

export async function getServerSideProps({req, res}) 
{
    const apiKey = req.cookies.apiKey
    const isValid = await verifyApiKey(apiKey).catch(err => console.log(err))

    if (isValid)
    {
        let bookingSettings = await getBookingSettings(req.cookies.apiKey).catch((err) => console.log(err.message))
        return {
            props: {
                valid: Boolean(isValid),
                bookingSettings
            },
        }
    } else return {
        redirect: {
            permanent: false,
            destination: '/login'
        }
    }
}