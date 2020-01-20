import React from 'react';
import { Checkbox } from './checkbox';
import { DatePicker } from './date-picker';
import { InputField } from './input-field';
import { Select } from './select';

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
    CheckboxWidget: Checkbox,
    DateTimeWidget: DatePicker,
    DateWidget: DatePicker,
    EmailWidget: InputField,
    TextWidget: InputField,
    SelectWidget: Select,
};
