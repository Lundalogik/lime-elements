import React, { CSSProperties } from 'react';
import { GridLayoutOptions } from '../../../interface';
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

function getColSpan(schema: any) {
    const layout: GridLayoutOptions = schema.lime?.layout;
    const colSpan = layout?.colSpan;

    if (!colSpan && isObjectType(schema)) {
        return 'all';
    }

    return colSpan;
}

function getRowSpan(schema: any) {
    const layout: GridLayoutOptions = schema.lime?.layout;

    return layout?.rowSpan;
}
