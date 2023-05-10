import React from 'react';
import { LimeElementsAdapter } from '../adapters/base-adapter';
import { LimeJSONSchema } from '../internal.types';

export function getHelpComponent(schema: LimeJSONSchema) {
    const help = schema.lime?.help;

    if (!help) {
        return;
    }

    if (typeof help === 'string') {
        return React.createElement('limel-help', { value: help });
    }

    const helpProps = help;

    return React.createElement(LimeElementsAdapter, {
        name: 'limel-help',
        elementProps: helpProps,
    });
}
