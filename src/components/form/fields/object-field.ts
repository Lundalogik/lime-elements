import JSONObjectField from '@rjsf/core/lib/components/fields/ObjectField';
import React from 'react';
import { FieldProps } from '@rjsf/core';
import { CodeEditor } from '../widgets/code-editor';
import { renderDescription, renderTitle } from '../templates/common';
import { isCustomObjectSchema } from './field-helpers';
import { FormSchema } from '../form.types';

export class ObjectField extends React.Component<FieldProps, any> {
    constructor(props) {
        super(props);

        this.state = {
            error: null,
        };
    }

    private handleValidation = (error: string) => {
        this.setState({
            error: error,
        });
    };

    render() {
        if (!isCustomObjectSchema(this.props.schema as FormSchema)) {
            return React.createElement(JSONObjectField, this.props);
        }

        return React.createElement(
            React.Fragment,
            {},
            renderTitle(this.props.schema.title),
            renderDescription(this.props.schema.description),
            React.createElement(CodeEditor, {
                ...this.props,
                onValidate: this.handleValidation,
            } as any),
            this.renderErrors(),
        );
    }

    private renderErrors() {
        if (!this.state.error) {
            return;
        }

        return React.createElement(
            'div',
            {
                role: 'alert',
                className: 'form-error',
            },
            this.state.error,
        );
    }
}
