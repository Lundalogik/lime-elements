import React from 'react';
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

        return React.createElement('limel-code-editor', {
            value: value,
            language: 'json',
            lineNumbers: true,
            fold: true,
            lint: true,
            onChange: this.handleChange,
        });
    }

    private handleChange(
        event: React.SyntheticEvent<
            HTMLLimelCodeEditorElement,
            CustomEvent<string>
        >
    ) {
        const props = this.props;
        event.stopPropagation();

        if (!props.onChange) {
            return;
        }

        try {
            const value = JSON.parse(event.nativeEvent.detail);

            props.onChange(value);
            props.onValidate();
        } catch {
            props.onValidate('Should be a valid JSON document');
        }
    }
}
