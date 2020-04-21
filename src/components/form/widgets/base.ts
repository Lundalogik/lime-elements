import React from 'react';
import { LimeElementsWidgetAdapter } from '../adapter';

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

/**
 * Higher order component for widgets to allow for rendering of custom
 * widgets based on overrides in a schema
 *
 * @param {any} widget The react component for the widget
 *
 * @returns {any} The react component to render the widget with the necessary override logic
 */
export const base = widget => {
    return props => {
        // Intercept on change of overriden widgets to avoid propagating on change event
        const handleChange = event => {
            event.stopPropagation();

            props.onChange(event.detail);
        };

        // Check if we should use custom widget
        if (hasOverridenWidget(props.schema)) {
            const { name, props: overridenWidgetProps } = getOverridenWidget(
                props.schema
            );

            return React.createElement(LimeElementsWidgetAdapter, {
                name: name,
                value: props.value,
                widgetProps: props,
                extraProps: {
                    ...overridenWidgetProps,
                    widget: widget, // Pass widget so we can override and rerender the original widget if desired
                },
                events: {
                    change: handleChange,
                },
            });
        }

        // Render regular widget
        return React.createElement(widget, props);
    };
};
