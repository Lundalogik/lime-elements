import React from 'react';

export class Checkbox extends React.Component {
    public refs: any;

    constructor(public props: WidgetProps) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    public componentDidMount() {
        const element: HTMLLimelCheckboxElement = this.refs.ref;
        element.addEventListener('change', this.handleChange);
    }

    public componentWillUnmount() {
        const element: HTMLLimelCheckboxElement = this.refs.ref;
        element.removeEventListener('change', this.handleChange);
    }

    public render() {
        const props = this.props;

        return React.createElement('limel-checkbox', {
            checked: !!props.value,
            label: props.label,
            disabled: props.disabled,
            required: props.required,
            ref: 'ref',
        });
    }

    private handleChange(event: CustomEvent<boolean>) {
        const props = this.props;
        event.stopPropagation();

        if (!props.onChange) {
            return;
        }

        props.onChange(event.detail);
    }
}
