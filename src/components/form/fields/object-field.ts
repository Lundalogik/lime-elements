import JSONObjectField from '@rjsf/core/lib/components/fields/ObjectField';
import React from 'react';
import { FieldProps } from '@rjsf/core';
import { CodeEditor } from '../widgets/code-editor';
import { renderDescription, renderTitle } from '../templates/common';
import { isCustomObjectSchema } from './field-helpers';
import { FormSchema } from '../form.types';

export class ObjectField extends React.Component<FieldProps, any> {
    render() {
        if (!isCustomObjectSchema(this.props.schema as FormSchema)) {
            return React.createElement(JSONObjectField, this.props);
        }

        return React.createElement(
            React.Fragment,
            {},
            renderTitle(this.props.schema.title),
            renderDescription(this.props.schema.description),
            React.createElement(CodeEditor, this.props)
        );
    }
}
