import React, { useState } from 'react'

import { Spinner } from '../agnostic/Spinner'

import CompleteIcon from '@material-ui/icons/CheckCircleOutline';

import { resendConfirmationEmail } from '../../requests'

export default function EmailConfirmationBanner({ email }) {
    const [submitting, setSubmitting] = useState(false)
    const [newConfirmationSent, setNewConfirmationSent] = useState(false)

    const handleResendConfirmationEmail = () =>
    {
        setSubmitting(true)
        resendConfirmationEmail(localStorage.getItem('apiKey'))
            .finally(() => {
                setNewConfirmationSent(true)
                setSubmitting(false)
            })
    }

    return (
        <div className="w-full bg-gray-100 flex justify-center items-center py-3">
            { (!submitting && !newConfirmationSent) && <p className="mx-4">
                Din e-mail er ikke bekræftet. Vi har sendt en email til dig på <span className="link text-secondary">{email}</span>.
                <br/>
                <span className="text-sm text-muted">Har du ikke modtaget en bekræftelses e-mail? <button onClick={handleResendConfirmationEmail} className="link">Klik her</button> for at sende den igen</span>
            </p> }

            { submitting && <Spinner variant="primary" animation="border" /> }

            { (!submitting && newConfirmationSent) && <div  className="mx-4 flex justify-center items-center">
                <CompleteIcon className="mr-4" color="primary" />
                <p>
                    Vi har sendt en ny bekræftelses e-mail til <span className="link text-secondary">{ email }</span>
                </p>
            </div> }
        </div>
    )
}
