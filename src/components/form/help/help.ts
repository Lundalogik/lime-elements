import React from 'react';
import { FormSchema } from '../form.types';

export function getHelpComponent(schema: FormSchema) {
    const help = schema.lime?.help;

    if (!help) {
        return;
    }

    if (typeof help === 'string') {
        return React.createElement('limel-help', { value: help });
    }

    const helpProps = help;

    return React.createElement('limel-help', helpProps);
}
