import { FormSchema } from '../form.types';

export interface FieldProps {
    readonly: boolean;
    title?: string;
    disabled: boolean;
    required: boolean;
    name: string;
    schema: FormSchema;
    uiSchema: any;
    idSchema: any;
    formData: any;
    errorSchema: any;
    registry: Registry;
    formContext: any;
    onChange: (formData: any) => void;
}

export interface ArrayProps {
    disabled: boolean;
    errorSchema: any;
    formContext: any;
    formData: any;
    idPrefix: any;
    idSchema: any;
    name: string;
    rawErrors: any;
    readonly: boolean;
    registry: any;
    required: boolean;
    schema: FormSchema;
    uiSchema: any;
    wasPropertyKeyModified: boolean;
    onChange: (formData: any, errorSchema: any) => void;
}

export interface Registry {
    fields: any;
    widgets: any;
    rootSchema: FormSchema;
    formContext: any;
    definitions: any;
}
