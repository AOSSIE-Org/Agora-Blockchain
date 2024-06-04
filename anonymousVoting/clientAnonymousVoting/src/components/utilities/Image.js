import React from 'react';

export const ImageComponent = React.memo(function Image({ src, className }) {
    return <img src={src} alt='img' className={className}/>;
});