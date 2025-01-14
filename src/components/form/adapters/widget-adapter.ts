import React from 'react';
import { WidgetProps } from '../widgets/types';
import { capitalize } from 'lodash-es';
import { getHelpComponent } from '../help';

export interface WidgetAdapterProps {
    name: string;
    value?: any;
    widgetProps: WidgetProps;
    extraProps?: any;
    events: { change: (event: CustomEvent) => void };
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
export class LimeElementsWidgetAdapter extends React.Component<WidgetAdapterProps> {
    state = {
        modified: false,
    };

    constructor(public props: WidgetAdapterProps) {
        super(props);

        this.handleBlur = this.handleBlur.bind(this);
    }

    private hasValue() {
        const value = this.getValue();
        if (!value) {
            return false;
        }

        if (Array.isArray(value)) {
            return !!value.length;
        }

        if (value instanceof Date) {
            return true;
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

        return (
            !!rawErrors && (modified || this.hasValue() || !this.isRequired())
        );
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
        const { name, extraProps } = this.props;
        const disabled = this.isDisabled();
        const value = this.getValue();
        const readonly = this.isReadOnly();

        return React.createElement(
            React.Fragment,
            {},
            React.createElement(name, {
                value: value,
                label: this.getLabel(),
                disabled: disabled,
                readonly: readonly,
                required: this.isRequired(),
                invalid: this.isInvalid(),
                'helper-text': this.getHelperText(),
                ...extraProps,
                onChange: this.handleChange,
                onBlur: this.handleBlur,
            }),
            getHelpComponent(this.props.widgetProps.schema),
        );
    }

    private handleChange = (
        event: React.SyntheticEvent<Element, CustomEvent>,
    ) => {
        this.props.events.change(event.nativeEvent);
    };

    private isDisabled() {
        const widgetProps = this.props.widgetProps;
        const options = widgetProps.schema.lime;

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
