import React from 'react';
import { renderCustomTemplateAdapter, hasOverridenTemplate } from './common';

export const FieldTemplate = (props) => {
    const { classNames, children, schema } = props;

    // Object and array template overrides are handled in their respective template files
    // because the object and array templates receive different props than this generic field
    // template
    if (
        schema.type !== 'object' &&
        schema.type !== 'array' &&
        hasOverridenTemplate(schema)
    ) {
        return renderCustomTemplateAdapter(props);
    }

    return React.createElement(
        'div',
        {
            className: classNames,
        },
        children
    );
};
