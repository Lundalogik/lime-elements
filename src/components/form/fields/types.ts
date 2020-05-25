export interface FieldProps {
    readonly: boolean;
    title?: string;
    disabled: boolean;
    required: boolean;
    name: string;
    schema: any;
    uiSchema: any;
    idSchema: any;
    formData: any;
    errorSchema: any;
    registry: Registry;
    formContext: any;
    onChange: (formData: any) => void;
}

export interface Registry {
    fields: any;
    widgets: any;
    rootSchema: any;
    formContext: any;
    definitions: any;
}
