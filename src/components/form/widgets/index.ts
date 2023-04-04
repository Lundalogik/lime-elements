import { Checkbox } from './checkbox';
import { DateOnlyPicker } from './date-only-picker';
import { DatePicker } from './date-picker';
import { InputField } from './input-field';
import { Select } from './select';
import { Slider } from './slider';

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
    CheckboxWidget: Checkbox,
    DateTimeWidget: DatePicker,
    DateWidget: DateOnlyPicker,
    EmailWidget: InputField,
    TextWidget: InputField,
    SelectWidget: Select,
    RangeWidget: Slider,
};
