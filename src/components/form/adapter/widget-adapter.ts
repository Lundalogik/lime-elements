import React from 'react';
import { WidgetProps } from '../widgets/types';
import { LimeElementsAdapter } from './base-adapter';

function capitalize(text: string = '') {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Adapter to render a web component by string name from React.
 *
 * Specifically for Widgets in react-jsonschema-form
 */
export class LimeElementsWidgetAdapter extends React.Component {
    state = {
        modified: false,
    };

    constructor(
        public props: {
            name: string;
            value?: any;
            widgetProps: WidgetProps;
            extraProps?: any;
            events?: { [key: string]: (event: any) => void };
        }
    ) {
        super(props);

        this.handleBlur = this.handleBlur.bind(this);
    }

    hasValue() {
        const value = this.getValue();
        if (!value) {
            return false;
        }

        if (Array.isArray(value)) {
            return !!value.length;
        }

        if (typeof value === 'object') {
            return !!Object.entries(value).length;
        }

        return true;
    }

    handleBlur() {
        this.setState({ modified: true });
    }

    getLabel() {
        const {
            widgetProps: { schema, label },
        } = this.props;

        return label || schema.title;
    }

    isInvalid() {
        const { modified } = this.state;
        const {
            widgetProps: { rawErrors },
        } = this.props;

        if (!modified) {
            return false;
        }

        return !!rawErrors;
    }

    isRequired() {
        const {
            widgetProps: { required, schema },
        } = this.props;

        return required || schema.minItems > 0;
    }

    getHelperText() {
        const {
            widgetProps: { rawErrors, schema },
        } = this.props;

        if (!this.isInvalid()) {
            return schema.description;
        }

        if (rawErrors) {
            return capitalize(rawErrors[0]);
        }

        return schema.description;
    }

    getValue() {
        const {
            value,
            widgetProps: { value: widgetValue },
        } = this.props;

        // Use widgetValue unless its overriden in widget
        return value || widgetValue;
    }

    render() {
        const {
            name,
            events,
            extraProps,
            widgetProps,
            widgetProps: { disabled, onChange },
        } = this.props;

        const value = this.getValue();

        const newEvents = {
            change: onChange,
            blur: this.handleBlur,
            ...events,
        };

        return React.createElement(LimeElementsAdapter, {
            name: name,
            elementProps: {
                value: value,
                label: this.getLabel(),
                disabled: disabled,
                required: this.isRequired(),
                invalid: this.isInvalid(),
                'helper-text': this.getHelperText(),
                widgetProps: widgetProps,
                ...extraProps,
            },
            events: newEvents,
        });
    }
}
