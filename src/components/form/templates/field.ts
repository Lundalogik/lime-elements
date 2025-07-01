import React, { CSSProperties } from 'react';
import { FormSchema } from '../form.types';
import { isObjectType } from '../schema';

export const FieldTemplate = (props) => {
    let classNames = props.classNames;
    const colSpan = getColSpan(props.schema);
    const rowSpan = getRowSpan(props.schema);
    let style: CSSProperties;

    if (colSpan) {
        classNames += ` limel-form-layout-colspan--${colSpan}`;
    }

    if (rowSpan) {
        style = {
            gridRow: `span ${rowSpan}`,
            minHeight: `calc(var(--min-height-of-one-row) * ${rowSpan})`,
        };
    }

    return React.createElement(
        'div',
        {
            className: classNames,
            style: style,
        },
        props.children
    );
};

function getColSpan(schema: FormSchema) {
    const layout = schema.lime?.layout;
    const colSpan = layout?.colSpan;

    if (!colSpan && isObjectType(schema)) {
        return 'all';
    }

    return colSpan;
}

function getRowSpan(schema: FormSchema) {
    const layout = schema.lime?.layout;

    return layout?.rowSpan;
}
