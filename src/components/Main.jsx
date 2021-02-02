import React from 'react';
import dayjs from 'dayjs';
import useSWR from 'swr';

import getter from '../getter';

export default function Main({
    title,
    subtitle,
    CTAs,
    children,
    subscriptionType,
    apiKey,
}) {
    if (subscriptionType && apiKey)
        var { data, error } = useSWR(
            `/appointment/in-month/${apiKey}/${dayjs().toJSON().slice(0, 10)}`,
            getter
        );

    return (
        <main className="w-full px-2 mt-3 md:mt-22 mb-48 flex flex-col justify-center items-center">
            {!error &&
                data &&
                (subscriptionType === 'free' ||
                    subscriptionType === 'Basic') && (
                    <div className="flex justify-between items-center w-full md:w-11/12">
                        <div className="alert alert-warning border-warning w-2/3">
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
                        </div>

                        <div className="alert alert-info border-info ml-4 text-center w-1/3">
                            {data.length}/
                            {subscriptionType === 'free' ? '50 ' : '150 '}
                            bookinger
                        </div>
                    </div>
                )}

            <div className="w-full mx-2 md:w-11/12 rounded-lg md:px-4 py-4 border-opacity-50 border-primary border-solid border-2 flex items-center justify-center flex-col">
                <div className="w-full px-4 py-2 flex flex-col md:flex-row justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-medium text-gray-900">
                            {title}
                        </h1>
                        <h2 className="text-lg text-gray-700">{subtitle}</h2>
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
