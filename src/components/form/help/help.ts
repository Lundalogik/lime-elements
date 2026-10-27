import React from 'react';
import { FormSchema } from '../form.types';
import { getHelpProps } from '../../form-header/help-props';

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

    return React.createElement('limel-help', {
        ...getHelpProps(help),
        ...extraProps,
    });
}
