import React, { useState } from 'react';

import {
    getBookingSettings,
    updateBookingSettings,
    verifyApiKey,
} from '../../requests';
import { getSettingLabelFromKey } from '../../utils.tsx';

import Main from '../../components/custom/Main';
import FullPageInput from '../../components/custom/FullPageInput';
import { Button } from '../../components/agnostic/Button';
import { Input } from '../../components/agnostic/Form/Input';
import { InputGroup } from '../../components/agnostic/Form/InputGroup';
import { Form } from '../../components/agnostic/Form/Form';

import { Snackbar, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';


export default function OnlineBooking({ bookingSettings, user, apiKey }) {
    const [state, setState] = useState({
        bookingSettings: bookingSettings,
        editDomain: false,
    });

    const [editAgreementDeclaration, setEditAgreementDeclaration] = useState(false)
    const [editPersonalDataPolicy, setEditPersonalDataPolicy] = useState(false)

    const [title, setTitle] = useState("Online booking indstillinger")
    const [subtitle, setSubtitle] = useState("Her kan du ændre i dine indstillinger for hvordan du modtager online bookings")

    const back = () => {
        editAgreementDeclaration && setEditAgreementDeclaration(false)
        editPersonalDataPolicy && setEditPersonalDataPolicy(false)
        setTitle("Online booking indstillinger")
        setSubtitle("Her kan du ændre i dine indstillinger for hvordan du modtager online bookings")
    }

    const showAgreementDeclaration = () => {
        setEditAgreementDeclaration(true)
        setTitle("Rediger din samtykkeerklæring")
        setSubtitle("")
    }

    const showPersonalDataPolicy = () => {
        setEditPersonalDataPolicy(true)
        setTitle("Rediger din persondatapolitik")
        setSubtitle("")
    }

    const [openSucces, setOpenSuccess] = useState(false);

    const [shouldUpdate, setShouldUpdate] = useState(false);
    const update = () => setShouldUpdate(!shouldUpdate);

    const handleChange = (key, value) => {
        let newState = state;
        state.bookingSettings[key] = value;
        setState(newState);
        update();
    };
    
    const handlePolicyChange = (key, value) => {
        let newState = state;
        state.bookingSettings.personalDataPolicy[key] = value;
        setState(newState);
        update();
    }

    return (
        <Main
            title={title}
            subtitle={subtitle}
            CTAs={
                <div>
                    {(!editAgreementDeclaration && !editPersonalDataPolicy) && <Button
                        onClick={() =>
                            updateBookingSettings(
                                localStorage.getItem('apiKey'),
                                state.bookingSettings
                            ).then(() => setOpenSuccess(true))
                        }
                    >
                        Gem
                    </Button>}

                    {(editAgreementDeclaration || editPersonalDataPolicy) && <Button onClick={back} className="flex justify-center items-center" variant="outline-dark" >
                            <ArrowBackIcon className="mr-2"/>
                            Tilbage
                        </Button>}
                </div>
            }
            subscriptionType={
                user.subscriptionType === 'free'
                    ? user.subscriptionType
                    : user.subscriptionTypeName
            }
            apiKey={apiKey}
        >
           { (!editAgreementDeclaration && !editPersonalDataPolicy) &&  <div className="w-11/12 divide-y divide-gray-300">
                <FullPageInput
                    title={getSettingLabelFromKey('domainPrefix').title}
                    subtitle={getSettingLabelFromKey('domainPrefix').subtitle}
                    extraInfo={<a target="_blank" href={`https://${bookingSettings.domainPrefix}.booktid.net`} className="text-xs link">Gå til booking side</a>}
                    input={
                        <div className="flex ml-2 justify-center items-center w-full">
                            <InputGroup>
                                <Input
                                    className="text-right"
                                    value={state.bookingSettings.domainPrefix}
                                    onChange={(e) =>
                                        handleChange(
                                            'domainPrefix',
                                            e.target.value
                                        )
                                    }
                                    readOnly={!state.editDomain}
                                />
                                <InputGroup.Append>
                                    <InputGroup.Text>
                                        .booktid.net
                                    </InputGroup.Text>
                                </InputGroup.Append>
                            </InputGroup>

                            <p
                                onClick={() =>
                                    setState({
                                        ...state,
                                        ...{ editDomain: !state.editDomain },
                                    })
                                }
                                className="ml-4 cursor-pointer underline text-center text-2xs text-blue-700 font-medium"
                            >
                                {state.editDomain
                                    ? 'Klik her for at låse dit domænenavn'
                                    : 'Klik her for at redigerer dit domæne navn'}
                            </p>
                        </div>
                    }
                />

                <FullPageInput
                    title={getSettingLabelFromKey('latestBookingBefore').title}
                    subtitle={
                        getSettingLabelFromKey('latestBookingBefore').subtitle
                    }
                    input={
                        <div className="ml-2 flex justify-start items-center w-full">
                            <Input
                                select
                                value={
                                    state.bookingSettings.latestBookingBefore
                                }
                                onChange={(e) =>
                                    handleChange(
                                        'latestBookingBefore',
                                        e.target.value
                                    )
                                }
                                className="w-full"
                                
                            >
                                <option value={30}>30 min</option>
                                <option value={60}>1 time (standard)</option>
                                <option value={120}>2 timer</option>
                                <option value={180}>3 timer</option>
                                <option value={240}>4 timer</option>
                                <option value={300}>5 timer</option>
                                <option value={360}>6 timer</option>
                                <option value={720}>12 timer</option>
                                <option value={1440}>1 dag</option>
                                <option value={2880}>2 dage</option>
                                <option value={4320}>3 dage</option>
                            </Input>
                        </div>
                    }
                />

                <FullPageInput
                    title={getSettingLabelFromKey('latestCancelbefore').title}
                    subtitle={
                        getSettingLabelFromKey('latestCancelbefore').subtitle
                    }
                    input={
                        <div className="ml-2 flex justify-start items-center w-full">
                            <Input
                                select
                                value={state.bookingSettings.latestCancelBefore}
                                onChange={(e) =>
                                    handleChange(
                                        'latestCancelBefore',
                                        e.target.value
                                    )
                                }
                                style={{ width: '100%' }}
                            >
                                <option value={30}>30 min</option>
                                <option value={60}>1 time</option>
                                <option value={120}>2 timer</option>
                                <option value={180}>3 timer</option>
                                <option value={240}>4 timer</option>
                                <option value={300}>5 timer</option>
                                <option value={360}>6 timer</option>
                                <option value={720}>12 timer (standard)</option>
                                <option value={1440}>1 dag</option>
                                <option value={2880}>2 dage</option>
                                <option value={4320}>3 dage</option>
                            </Input>
                        </div>
                    }
                />

                <FullPageInput
                    title={getSettingLabelFromKey('maxDaysBookAhead').title}
                    subtitle={
                        getSettingLabelFromKey('maxDaysBookAhead').subtitle
                    }
                    input={
                        <div className="ml-2 flex justify-start items-center w-full">
                            <Input
                                select
                                value={state.bookingSettings.maxDaysBookAhead}
                                onChange={(e) =>
                                    handleChange(
                                        'maxDaysBookAhead',
                                        e.target.value
                                    )
                                }
                                style={{ width: '100%' }}
                            >
                                <option value={7}>1 uge</option>
                                <option value={14}>2 uger</option>
                                <option value={30}>1 måned</option>
                                <option value={60}>2 måneder</option>
                                <option value={90}>3 måneder</option>
                                <option value={120}>4 måneder</option>
                                <option value={150}>5 måneder</option>
                                <option value={180}>6 måneder</option>
                                <option value={210}>7 måneder</option>
                                <option value={240}>8 måneder</option>
                                <option value={270}>9 måneder</option>
                                <option value={300}>10 måneder</option>
                                <option value={330}>11 måneder</option>
                                <option value={364}>1 år</option>
                                <option value={728}>2 år</option>
                                <option value={1092}>3 år (standard)</option>
                            </Input>
                        </div>
                    }
                />

                <FullPageInput
                    title={
                        getSettingLabelFromKey('requireCustomerAddress').title
                    }
                    subtitle={
                        getSettingLabelFromKey('requireCustomerAddress')
                            .subtitle
                    }
                    input={
                        <div className="ml-2 flex justify-start items-center w-full">
                            <Form.Switch
                                customSize="sm"
                                id="requireCustomerAddress"
                                checked={
                                    state.bookingSettings.requireCustomerAddress
                                }
                                onChange={(e) =>
                                    handleChange(
                                        'requireCustomerAddress',
                                        e.target.checked
                                    )
                                }
                                color="primary"
                            />
                        </div>
                    }
                />

                <FullPageInput
                    title={
                        getSettingLabelFromKey('hideCustomerCommentSection')
                            .title
                    }
                    subtitle={
                        getSettingLabelFromKey('hideCustomerCommentSection')
                            .subtitle
                    }
                    input={
                        <div className="ml-2 flex justify-start items-center w-full">
                            <Form.Switch
                                customSize="sm"
                                id="hideCustomerCommentSection"
                                className="cursor-pointer"
                                checked={
                                    state.bookingSettings
                                        .hideCustomerCommentSection
                                }
                                onChange={(e) =>
                                    handleChange(
                                        'hideCustomerCommentSection',
                                        e.target.checked
                                    )
                                }
                                color="primary"
                            />
                        </div>
                    }
                />

                <FullPageInput
                    title={getSettingLabelFromKey('hideServiceDuration').title}
                    subtitle={
                        getSettingLabelFromKey('hideServiceDuration').subtitle
                    }
                    input={
                        <div className="ml-2 flex justify-start items-center w-full">
                            <Form.Switch
                                customSize="sm"
                                id="hideServiceDuration"
                                checked={
                                    state.bookingSettings.hideServiceDuration
                                }
                                onChange={(e) =>
                                    handleChange(
                                        'hideServiceDuration',
                                        e.target.checked
                                    )
                                }
                                color="primary"
                            />
                        </div>
                    }
                />

                <FullPageInput
                    title={getSettingLabelFromKey('hideServicePrice').title}
                    subtitle={
                        getSettingLabelFromKey('hideServicePrice').subtitle
                    }
                    input={
                        <div className="ml-2 flex justify-start items-center w-full">
                            <Form.Switch
                                customSize="sm"
                                id="hideServicePrice"
                                checked={state.bookingSettings.hideServicePrice}
                                onChange={(e) =>
                                    handleChange(
                                        'hideServicePrice',
                                        e.target.checked
                                    )
                                }
                                color="primary"
                            />
                        </div>
                    }
                />

                <FullPageInput
                    title={getSettingLabelFromKey('hideContactInfo').title}
                    subtitle={
                        getSettingLabelFromKey('hideContactInfo').subtitle
                    }
                    input={
                        <div className="ml-2 flex justify-start items-center w-full">
                            <Form.Switch
                                customSize="sm"
                                id="hideContactInfo"
                                checked={state.bookingSettings.hideContactInfo}
                                onChange={(e) =>
                                    handleChange(
                                        'hideContactInfo',
                                        e.target.checked
                                    )
                                }
                                color="primary"
                            />
                        </div>
                    }
                />

                <FullPageInput
                    title={getSettingLabelFromKey('hideGoogleMaps').title}
                    subtitle={
                        getSettingLabelFromKey('hideGoogleMaps').subtitle
                    }
                    input={
                        <div className="ml-2 flex justify-start items-center w-full">
                            <Form.Switch
                                customSize="sm"
                                id="hideContactInfo"
                                checked={state.bookingSettings.hideGoogleMaps}
                                onChange={(e) =>
                                    handleChange(
                                        'hideGoogleMaps',
                                        e.target.checked
                                    )
                                }
                                color="primary"
                            />
                        </div>
                    }
                />

                <FullPageInput
                    title={getSettingLabelFromKey('personalDataPolicy').title}
                    subtitle={
                        getSettingLabelFromKey('personalDataPolicy').subtitle
                    }
                    input={
                        <div className="ml-4 flex flex-col sm:flex-row justify-center items-center gap-x-4 gap-y-2">
                            <Button onClick={showAgreementDeclaration} variant="outline-primary">
                                Ændr din samtykkeerklæring
                            </Button>

                            <Button onClick={showPersonalDataPolicy} variant="outline-secondary">
                                Ændr din persondatapolitik
                            </Button>
                        </div>
                    }
                />
            </div>}

            { editAgreementDeclaration && (
                <div className="w-full md:px-24">
                    <Input style={{minHeight: 300}} onChange={({ target }) => {
                        handlePolicyChange("agreementDeclaration", target.value)
                    }} value={state.bookingSettings.personalDataPolicy.agreementDeclaration} textarea />

                    <div className="w-full flex justify-between items-center mt-2">
                        <div></div>
                        <Button
                            onClick={() =>
                                updateBookingSettings(
                                    localStorage.getItem('apiKey'),
                                    state.bookingSettings
                                ).then(() => setOpenSuccess(true))
                            }
                        >
                            Gem
                        </Button>
                    </div>
                </div>
            ) }

            { editPersonalDataPolicy && (
                <div className="w-full md:px-24">
                    <Input style={{minHeight: 300}} onChange={({ target }) => {
                        handlePolicyChange("personalData", target.value)
                    }} value={state.bookingSettings.personalDataPolicy.personalData} textarea />

                    <div className="w-full flex justify-between items-center mt-2">
                        <div></div>
                        <Button
                            onClick={() =>
                                updateBookingSettings(
                                    localStorage.getItem('apiKey'),
                                    state.bookingSettings
                                ).then(() => setOpenSuccess(true))
                            }
                        >
                            Gem
                        </Button>
                    </div>
                </div>
            ) }

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
        </Main>
    );
}

export async function getServerSideProps({ req, res }) {
    const apiKey = req.cookies.apiKey;
    const isValid = await verifyApiKey(apiKey).catch((err) => console.log(err));

    if (isValid) {
        let bookingSettings = await getBookingSettings(
            req.cookies.apiKey
        ).catch((err) => console.log(err.message));
        return {
            props: {
                valid: Boolean(isValid),
                user: isValid,
                bookingSettings,
                apiKey,
            },
        };
    } else
        return {
            redirect: {
                permanent: false,
                destination: '/login',
            },
        };
}
