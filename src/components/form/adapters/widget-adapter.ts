import React from 'react';
import { WidgetProps } from '../widgets/types';
import {
    hasValue,
    isFieldInvalid,
    isFieldRequired,
    getErrorText,
} from '../validation-display';
import { getHelpComponent } from '../help';
import { RowLayoutContext } from '../row/row-context';

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
    public static readonly contextType = RowLayoutContext;
    declare context: React.ContextType<typeof RowLayoutContext>;

    state = {
        modified: false,
    };

    constructor(public props: WidgetAdapterProps) {
        super(props);

        this.handleBlur = this.handleBlur.bind(this);
    }

    private handleBlur() {
        this.setState({ modified: true });
    }

    private getLabel() {
        if (this.context) {
            return '';
        }

        const { schema, label, hideLabel } = this.props.widgetProps;

        if (hideLabel) {
            return '';
        }

        return label || schema.title;
    }

    private isInvalid() {
        const { modified } = this.state;
        const { rawErrors, required, schema, registry } =
            this.props.widgetProps;

        return isFieldInvalid({
            hasErrors: !!rawErrors,
            modified: modified,
            hasValue: hasValue(this.getValue()),
            required: isFieldRequired({ required, minItems: schema.minItems }),
            revealErrors: registry?.formContext?.revealErrors === true,
        });
    }

    private getHelperText() {
        const { rawErrors, schema } = this.props.widgetProps;

        if (!this.isInvalid()) {
            return this.context ? '' : schema.description;
        }

        return getErrorText(rawErrors || [], schema.description);
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
                required: isFieldRequired({
                    required: this.props.widgetProps.required,
                    minItems: this.props.widgetProps.schema.minItems,
                }),
                invalid: this.isInvalid(),
                'helper-text': this.getHelperText(),
                ...extraProps,
                onChange: this.handleChange,
                onBlur: this.handleBlur,
            }),
            getHelpComponent(this.props.widgetProps.schema)
        );
    }

    private handleChange = (
        event: React.SyntheticEvent<Element, CustomEvent>
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
