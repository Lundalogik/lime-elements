export interface WidgetProps {
    id: string;
    label: string;
    schema: any;
    value: any;
    formData: any;
    registry: any;
    placeholder: string;
    required: boolean;
    disabled: boolean;
    readonly: boolean;
    autofocus: boolean;
    errorSchema: any;
    idSchema: any;
    idPrefix: any;
    onDropPropertyClick: (key: any) => void;
    onKeyChange: (value: any, errorSchema?: any) => void;
    onChange: (value: any, errorSchema?: any) => void;
    onBlur: (id: string, value: any) => void;
    onFocus: (id: string, value: any) => void;
    options: {
        enumOptions: Array<{
            label: string;
            value: string;
        }>;
    };
    formContext: any;
    rawErrors: string[];
    multiple?: boolean;
}
