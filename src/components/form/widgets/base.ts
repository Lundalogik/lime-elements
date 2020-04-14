import React from 'react';
import { LimeElementsAdapter } from '../adapter';

const hasOverridenWidget = (schema): boolean => {
    return Boolean(schema.lime?.overrides?.widget?.name);
};

const getOverridenWidget = (
    schema
): { name: string; props: { [key: string]: any } } => {
    const name = schema.lime?.overrides?.widget?.name;
    const props = schema.lime?.overrides?.widget?.props || {};

    return { name: name, props: props };
};

export const base = widget => {
    return props => {
        console.log('Render widget', props, widget);
        if (hasOverridenWidget(props.schema)) {
            const { name, props: overridenWidgetProps } = getOverridenWidget(
                props.schema
            );

            return React.createElement(LimeElementsAdapter, {
                name: name,
                elementProps: {
                    ...overridenWidgetProps,
                    widgetProps: props,
                    widget: widget
                }
            });
        }
        return React.createElement(widget, props);
    };
};
