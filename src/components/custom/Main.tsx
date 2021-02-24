import React from 'react';
import dayjs from 'dayjs';
import useSWR from 'swr';

import getter from '../../getter';
import { Alert } from '../agnostic/Alert'
 
export default function Main({
    title,
    subtitle,
    CTAs,
    children,
    subscriptionType,
    apiKey,
}: {
    title?: string,
    subtitle?: string,
    CTAs?: React.ReactChild | React.ReactChildren,
    children: React.ReactChild | React.ReactChildren,
    subscriptionType?: string,
    apiKey?: string
}) {
    if (subscriptionType && apiKey)
        var { data, error } = useSWR(
            `/appointment/in-month/${apiKey}/${dayjs().toJSON().slice(0, 10)}`,
            getter
        );

    return (
        <main className="w-full h-full px-2 mt-3 md:mt-22 mb-3 flex flex-col justify-center items-center">
            {!error &&
                data &&
                (subscriptionType === 'free' ||
                    subscriptionType === 'Basic') && (
                    <div className="flex justify-between items-center w-full mb-3 md:w-11/12">
                        <Alert className="w-2/3" variant="warning">
                            Din bruger er begrænset til{' '}
                            {subscriptionType === 'free' ? 50 : 150} bookinger
                            per måned og de fleste features er ikke aktiveret.{' '}
                            <a
                                className="link"
                                href={
                                    subscriptionType === 'free'
                                        ? '/opgrader'
                                        : '/profil'
                                }
                            >
                                Opgrader til premium
                            </a>{' '}
                            for at få det meste ud af BOOKTID.NET
                        </Alert>

                        <Alert className="w-1/3" variant="info">
                            {data.length}/
                            {subscriptionType === 'free' ? '50 ' : '150 '}
                            bookinger
                        </Alert>
                    </div>
                )}

            <div className="w-full h-full mx-2 md:w-11/12 rounded-lg px-2 md:px-4 py-4 border-opacity-50 border-secondary border-solid border-2 flex items-center justify-start flex-col">
                <div className="w-full px-4 py-2 flex justify-between items-center">
                    <div className="w-1/2">
                        <h1 className="text-lg font-medium text-gray-900">
                            {title}
                        </h1>
                        <h2 className="text-md text-gray-700">{subtitle}</h2>
                    </div>
                    <div className="flex justify-center items-center md:m-0">
                        {CTAs && CTAs}
                    </div>
                </div>
                {children}
            </div>
        </main>
    );
}
