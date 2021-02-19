import React, { ReactChild } from 'react';

export interface SubtitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
    variant?:
        | 'primary'
        | 'secondary'
        | 'light'
        | 'dark'
        | 'info'
        | 'warning'
        | 'danger';
    size?: 'sm' | 'lg' | '';
    children: ReactChild;
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

export interface Subtitle extends React.FC<SubtitleProps> {}

export const Subtitle: Subtitle = ({ variant = 'dark', size = '', children, as = 'h2', ...otherProps }) => {

    const CustomTag = as

    return <CustomTag {...otherProps} className={`subtitle ${variant} ${size}`}>{children}</CustomTag>;
};
