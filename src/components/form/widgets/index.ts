import React from 'react';
import { InputField } from './input-field';

// These are defined by react-json-schema-form
export type WidgetType =
    | 'AltDateTimeWidget'
    | 'AltDateWidget'
    | 'CheckboxesWidget'
    | 'CheckboxWidget'
    | 'ColorWidget'
    | 'DateTimeWidget'
    | 'DateWidget'
    | 'EmailWidget'
    | 'FileWidget'
    | 'HiddenWidget'
    | 'PasswordWidget'
    | 'RadioWidget'
    | 'RangeWidget'
    | 'SelectWidget'
    | 'TextareaWidget'
    | 'TextWidget'
    | 'UpDownWidget'
    | 'URLWidget';

export const widgets: Partial<Record<WidgetType, React.Component>> = {
    EmailWidget: InputField,
    TextWidget: InputField,
};
