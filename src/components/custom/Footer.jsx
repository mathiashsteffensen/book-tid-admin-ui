import React from 'react';
import dayjs from 'dayjs';

export default function Footer() {
    return (
        <footer className="w-screen z-10 flex justify-center items-center py-4 bg-gray-100 shadow-xs">
            <div>
                <p className="text-sm font-semibold text-blue-900">
                    BOOKTID.NET © {dayjs().year()}
                </p>
            </div>
        </footer>
    );
}
