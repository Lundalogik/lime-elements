import React from 'react';
import { FormLayoutOptions } from '../form.types';

export const FieldTemplate = (props) => {
    let classNames = props.classNames;
    const layout: FormLayoutOptions = props.schema.lime?.layout;

    if (layout?.span) {
        classNames += ` limel-form-layout-span--${layout.span}`;
    }

    return React.createElement(
        'div',
        {
            className: classNames,
        },
        props.children
    );
};
