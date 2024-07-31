import React from 'react';
import { LimeElementsAdapter } from '../adapters';
import { FieldProps } from '@rjsf/core';

export class CodeEditor extends React.Component {
    constructor(public props: FieldProps & { onValidate: Function }) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    public render() {
        const props = this.props;
        let value: string = '{}';

        try {
            value = JSON.stringify(props.formData, null, '    ');
        } catch {
            // N/A
        }

        return React.createElement(LimeElementsAdapter, {
            name: 'limel-code-editor',
            elementProps: {
                value: value,
                language: 'json',
                lineNumbers: true,
                fold: true,
                lint: true,
            },
            events: {
                change: this.handleChange,
            },
        });
    }

    private handleChange(event: CustomEvent<string>) {
        const props = this.props;
        event.stopPropagation();

        if (!props.onChange) {
            return;
        }

        try {
            const value = JSON.parse(event.detail);

            props.onChange(value);
            props.onValidate();
        } catch {
            props.onValidate('Should be a valid JSON document');
        }
    }
}
