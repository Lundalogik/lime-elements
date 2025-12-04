import React from 'react';
import { FormSchema } from '../form.types';

/**
 *
 * @param schema
 * @param extraProps - additional props to pass to the limel-help element
 */
export function getHelpComponent(
    schema: FormSchema,
    extraProps?: Record<string, unknown>
) {
    const help = schema.lime?.help;

    if (!help) {
        return;
    }

    if (typeof help === 'string') {
        return React.createElement('limel-help', {
            value: help,
            ...extraProps,
        });
    }

    const helpProps = help;

    return React.createElement('limel-help', { ...helpProps, ...extraProps });
}
