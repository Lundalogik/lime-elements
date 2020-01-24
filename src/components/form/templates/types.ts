// These are defined by react-jsonschema-form and added
// here as interfaces for type hinting

export interface TemplateProps {
    disabled: boolean;
    readonly: boolean;
    required: boolean;
    schema: any;
    uiSchema: any;
    formContext: any;
}

export interface FieldTemplateProps extends TemplateProps {
    id: string;
    classNames: string;
    label: string;
    description: any;
    rawDescription: string;
    children: any;
    errors: any;
    rawErrors: string[];
    help: any;
    rawHelp: string;
    hidden: boolean;
    displayLabel: boolean;
    fields: any[];
}

export interface ObjectFieldTemplateProps extends TemplateProps {
    title: string;
    description: string;
    properties: ObjectFieldProperty[];
    idSchema: any;
    formData: object;
}

export interface ObjectFieldProperty {
    content: any;
    name: string;
    disabled: boolean;
    readonly: boolean;
}

export interface ArrayFieldTemplateProps extends TemplateProps {
    canAdd: boolean;
    className: string;
    idSchema: any;
    items: ArrayFieldItem[];
    onAddClick: (event: any) => void;
    title: string;
    formData: object;
}

export interface ArrayFieldItem {
    children: any;
    className: string;
    disabled: boolean;
    hasMoveDown: boolean;
    hasMoveUp: boolean;
    hasRemove: boolean;
    hasToolbar: boolean;
    index: number;
    key: string;
    onAddIndexClick: (index: number) => (event: any) => void;
    onDropIndexClick: (index: number) => (event: any) => void;
    onReorderClick: (index: number, newIndex: number) => (event: any) => void;
    readonly: boolean;
}
