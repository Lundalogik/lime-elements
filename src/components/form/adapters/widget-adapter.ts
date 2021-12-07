import React from 'react';
import { WidgetProps } from '../widgets/types';
import { LimeElementsAdapter } from './base-adapter';
import { capitalize } from 'lodash-es';
import { LimeSchemaOptions } from '../form.types';

interface WidgetAdapterProps {
    name: string;
    value?: any;
    widgetProps: WidgetProps;
    extraProps?: any;
    events?: { [key: string]: (event: any) => void };
}

/**
 * A widget is a concept in react-jsonschema-form (rjsf).
 * It represents a HTML tag for the user to enter data, eg. input, select, etc.
 *
 * We use the widget adapter exclusively so we can use lime-elements instead of the
 * default input/select/checkbox/etc fields that rjsf provides.
 *
 * Please read the docs for more info.
 * Link: https://react-jsonschema-form.readthedocs.io/
 */
export class LimeElementsWidgetAdapter extends React.Component {
    state = {
        modified: false,
    };

    constructor(public props: WidgetAdapterProps) {
        super(props);

        this.handleBlur = this.handleBlur.bind(this);
        this.initState();
    }

    private initState() {
        if (this.hasValue()) {
            this.state.modified = true;
        }
    }

    private hasValue() {
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

    private handleBlur() {
        this.setState({ modified: true });
    }

    private getLabel() {
        const { schema, label } = this.props.widgetProps;

        return label || schema.title;
    }

    private isInvalid() {
        const { modified } = this.state;
        const { rawErrors } = this.props.widgetProps;

        if (!modified) {
            return false;
        }

        return !!rawErrors;
    }

    private isRequired() {
        const { required, schema } = this.props.widgetProps;

        return required || schema.minItems > 0;
    }

    private getHelperText() {
        const { rawErrors, schema } = this.props.widgetProps;

        if (!this.isInvalid()) {
            return schema.description;
        }

        if (rawErrors) {
            return capitalize(rawErrors[0]);
        }

        return schema.description;
    }

    private getValue() {
        const { value } = this.props;
        const { value: widgetValue } = this.props.widgetProps;

        // Use widgetValue unless its overriden in widget
        return value || widgetValue;
    }

    render() {
        const { name, events, extraProps } = this.props;
        const disabled = this.isDisabled();
        const value = this.getValue();
        const readonly = this.isReadOnly();

        const newEvents = {
            change: this.props.widgetProps.onChange,
            blur: this.handleBlur,
            ...events,
        };

        return React.createElement(LimeElementsAdapter, {
            name: name,
            elementProps: {
                value: value,
                label: this.getLabel(),
                disabled: disabled,
                readonly: readonly,
                required: this.isRequired(),
                invalid: this.isInvalid(),
                'helper-text': this.getHelperText(),
                ...extraProps,
            },
            events: newEvents,
        });
    }

    private isDisabled() {
        const widgetProps = this.props.widgetProps;
        const options: LimeSchemaOptions = widgetProps.schema.lime;

        return (
            widgetProps.disabled ||
            options?.disabled ||
            options?.component?.props?.disabled
        );
    }

    private isReadOnly() {
        const widgetProps = this.props.widgetProps;

        return widgetProps.readonly;
    }
}
