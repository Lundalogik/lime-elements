import React, { CSSProperties } from 'react';
import { FormSchema } from '../form.types';
import { isObjectType } from '../schema';
import { toSchemaPath } from './object-field';

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
            'data-schema-path': getFieldSchemaPath(props),
        },
        props.children
    );
};

// Objects mark their own layout wrapper, so only the fields they hold get
// the path here. It lets a host find the element of one field by its path.
function getFieldSchemaPath(props): string | undefined {
    if (isObjectType(props.schema)) {
        return undefined;
    }

    const path = props.fieldPathId?.path;

    return path ? toSchemaPath(path.map(String)) : undefined;
}

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
