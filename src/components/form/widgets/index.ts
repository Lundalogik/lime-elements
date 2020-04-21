import { Checkbox } from './checkbox';
import { DatePicker } from './date-picker';
import { InputField } from './input-field';
import { Select } from './select';
import { base } from './base';

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

export const widgets: Partial<Record<WidgetType, any>> = {
    CheckboxWidget: base(Checkbox),
    DateTimeWidget: base(DatePicker),
    DateWidget: base(DatePicker),
    EmailWidget: base(InputField),
    TextWidget: base(InputField),
    SelectWidget: base(Select),
};
