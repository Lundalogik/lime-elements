import React from 'react';
import { getDefaultRegistry } from '@rjsf/core';
import { FieldProps } from '@rjsf/utils';
import { CodeEditor } from '../widgets/code-editor';
import { renderDescription, renderTitle } from '../templates/common';
import { isCustomObjectSchema } from './field-helpers';
import { FormSchema } from '../form.types';

const { fields: defaultFields } = getDefaultRegistry();
const BaseObjectField = defaultFields.ObjectField;

export class ObjectField extends React.Component<FieldProps, any> {
    render() {
        if (!isCustomObjectSchema(this.props.schema as FormSchema)) {
            return React.createElement(BaseObjectField, this.props);
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
