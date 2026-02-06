import React from 'react';
import { FieldProps } from '@rjsf/core';
import { isEmpty } from 'lodash-es';

export class CodeEditor extends React.Component {
    public state: { validationError: string } = { validationError: '' };

    constructor(public props: FieldProps) {
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

        const { validationError } = this.state;
        const { errorSchema } = props;
        const hasSchemaErrors = !isEmpty(errorSchema);
        const isInvalid = validationError.length > 0 || hasSchemaErrors;

        let helperText: string | undefined;
        if (validationError) {
            helperText = validationError;
        } else if (hasSchemaErrors && '__errors' in errorSchema) {
            helperText = errorSchema.__errors[0];
        }

        return React.createElement('limel-code-editor', {
            value: value,
            language: 'json',
            lineNumbers: true,
            fold: true,
            lint: true,
            onChange: this.handleChange,
            invalid: isInvalid,
            helperText: helperText,
        });
    }

    public componentDidUpdate(prevProps: FieldProps) {
        if (
            prevProps.formData !== this.props.formData &&
            this.state.validationError
        ) {
            this.setState({ validationError: '' });
        }
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
            this.setState({ validationError: '' });
        } catch (error) {
            const validationError =
                error instanceof SyntaxError
                    ? `Invalid JSON: ${error.message}`
                    : 'Should be a valid JSON document';
            this.setState({ validationError });
        }
    }
}
