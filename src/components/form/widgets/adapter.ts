import React from 'react';
import { WidgetProps } from './types';

export class LimeElementsAdapter extends React.Component {
    public refs: { component: HTMLElement };
    public state = {
        modified: false,
    };

    constructor(public props: LimeElementsAdapterProps) {
        super(props);
        this.handleBlur = this.handleBlur.bind(this);
        this.setComponentProperty = this.setComponentProperty.bind(this);
        this.initState();
    }

    private initState() {
        if (this.hasValue(this.props.value)) {
            this.state.modified = true;
        }
    }

    private hasValue(value: any) {
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

    public componentDidMount() {
        const element = this.refs.component;

        element.addEventListener('change', this.props.onChange);
        element.addEventListener('blur', this.handleBlur);

        const props = { value: this.props.value, ...this.props.extraProps };
        Object.entries(props).forEach(this.setComponentProperty);
    }

    private setComponentProperty([key, value]: [string, any]) {
        const element = this.refs.component;
        element[key] = value;
    }

    public componentWillUnmount() {
        const element = this.refs.component;

        element.removeEventListener('change', this.props.onChange);
        element.removeEventListener('blur', this.handleBlur);
    }

    public componentDidUpdate(prevProps: any) {
        const props = { value: this.props.value, ...this.props.extraProps };
        Object.entries(props)
            .filter(([key, value]) => {
                return prevProps[key] !== value;
            })
            .forEach(this.setComponentProperty);
    }

    public render() {
        const { name, widgetProps } = this.props;

        return React.createElement(name, {
            label: getLabel(widgetProps),
            disabled: widgetProps.disabled,
            required: this.isRequired(),
            invalid: this.isInvalid(),
            'helper-text': this.getHelperText(
                widgetProps.schema,
                widgetProps.rawErrors
            ),
            ref: 'component',
        });
    }

    private handleBlur() {
        this.setState({
            modified: true,
        });
    }

    private isInvalid() {
        if (!this.state.modified) {
            return false;
        }

        return !!this.props.widgetProps.rawErrors;
    }

    private isRequired() {
        const props = this.props.widgetProps;
        return props.required || props.schema.minItems > 0;
    }

    private getHelperText(schema: any, errors: string[] = []) {
        if (!this.isInvalid()) {
            return schema.description;
        }

        if (errors) {
            return capitalize(errors[0]);
        }

        return schema.description;
    }
}

export interface LimeElementsAdapterProps {
    /**
     * Name of the component to render
     */
    name: string;
    /**
     * Value of the component
     */
    value: any;
    /**
     * The properties passed to the widget
     */
    widgetProps: WidgetProps;
    /**
     * Additional properties for the component
     */
    extraProps: any;
    /**
     * Called when the value has been changed inside the component
     */
    onChange: (event: CustomEvent) => void;
}

function getLabel(props: WidgetProps) {
    return props.label || props.schema.title;
}

function capitalize(text: string = '') {
    return text.charAt(0).toUpperCase() + text.slice(1);
}
