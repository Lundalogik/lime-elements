export interface WidgetProps {
    id: string;
    label: string;
    schema: any;
    value: any;
    placeholder: string;
    required: boolean;
    disabled: boolean;
    readonly: boolean;
    autofocus: boolean;
    onChange: (value: any) => void;
    onBlur: (id: string, value: any) => void;
    onFocus: (id: string, value: any) => void;
    options: object;
    formContext: any;
    rawErrors: string[];
}
