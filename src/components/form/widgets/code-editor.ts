import React from 'react';
import { FieldProps } from '@rjsf/core';
import { isEmpty } from 'lodash-es';

interface CodeEditorState {
    validationError: string;
    modified: boolean;
}

export class CodeEditor extends React.Component<FieldProps, CodeEditorState> {
    public state: CodeEditorState = { validationError: '', modified: false };

    constructor(props: FieldProps) {
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

        const { validationError, modified } = this.state;
        const { errorSchema, formData, required } = props;
        const hasSchemaErrors = !isEmpty(errorSchema);
        const hasValue = formData !== undefined && formData !== null;
        const shouldShowSchemaErrors =
            hasSchemaErrors && (modified || hasValue || !required);
        const isInvalid = validationError.length > 0 || shouldShowSchemaErrors;

        let helperText: string | undefined;
        if (validationError) {
            helperText = validationError;
        } else if (shouldShowSchemaErrors) {
            helperText = findFirstError(errorSchema);
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

    public componentDidUpdate(prevProps: Readonly<FieldProps>) {
        if (
            prevProps.formData !== this.props.formData &&
            (this.state.validationError !== '' || this.state.modified)
        ) {
            this.setState({ validationError: '', modified: false });
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

        let value: unknown;
        try {
            value = JSON.parse(event.nativeEvent.detail);
        } catch (error) {
            const validationError =
                error instanceof SyntaxError
                    ? `Invalid JSON: ${error.message}`
                    : 'Should be a valid JSON document';
            this.setState({ validationError, modified: true });

            return;
        }

        props.onChange(value);
        this.setState({ validationError: '', modified: true });
    }
}

/**
 * Represents a nested error schema structure from rjsf validation.
 * Each level can contain __errors array and nested child schemas.
 */
interface ErrorSchemaNode {
    __errors?: string[];
    [key: string]: ErrorSchemaNode | string[] | undefined;
}

/**
 * Recursively finds the first error message in a potentially nested errorSchema.
 * Checks for __errors at the current level, then recurses into nested objects.
 * When an error is found in a nested property, the property name is prepended
 * to the message for context (e.g. `"method: is a required property"`).
 *
 * @param schema - The error schema to search for errors
 * @returns The first error message found, or undefined if no errors
 */
function findFirstError(schema: ErrorSchemaNode): string | undefined {
    if (!schema || typeof schema !== 'object') {
        return undefined;
    }

    if ('__errors' in schema && Array.isArray(schema.__errors)) {
        const errors = schema.__errors;
        if (errors.length > 0) {
            return errors[0];
        }
    }

    for (const key of Object.keys(schema)) {
        if (key === '__errors') {
            continue;
        }

        const nested = schema[key];
        if (nested && typeof nested === 'object') {
            const found = findFirstError(nested as ErrorSchemaNode);
            if (found) {
                return `${key}: ${found}`;
            }
        }
    }

    return undefined;
}
