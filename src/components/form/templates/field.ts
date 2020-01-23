import React from 'react';

export const FieldTemplate = props => {
    const { classNames, children } = props;
    return React.createElement(
        'div',
        {
            className: classNames,
        },
        children
    );
};
