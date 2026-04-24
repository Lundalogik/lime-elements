import { FormSchema } from './form.types';

export const stringSchema: FormSchema = {
    type: 'object',
    properties: {
        name: { type: 'string', title: 'Name' },
    },
};

export const numberSchema: FormSchema = {
    type: 'object',
    properties: {
        age: { type: 'number', title: 'Age' },
    },
};

export const booleanSchema: FormSchema = {
    type: 'object',
    properties: {
        active: { type: 'boolean', title: 'Active' },
    },
};

export const enumSchema: FormSchema = {
    type: 'object',
    properties: {
        color: {
            type: 'string',
            title: 'Color',
            enum: ['red', 'green', 'blue'],
        },
    },
};

export const requiredFieldSchema: FormSchema = {
    type: 'object',
    properties: {
        name: { type: 'string', title: 'Name' },
    },
    required: ['name'],
};

export const emailFormatSchema: FormSchema = {
    type: 'object',
    properties: {
        email: { type: 'string', title: 'Email', format: 'email' },
    },
    required: ['email'],
};

export const arraySchema: FormSchema = {
    type: 'object',
    properties: {
        tags: {
            type: 'array',
            title: 'Tags',
            items: { type: 'string' },
        },
    },
};

export const nestedObjectSchema: FormSchema = {
    type: 'object',
    properties: {
        address: {
            type: 'object',
            title: 'Address',
            properties: {
                street: { type: 'string', title: 'Street' },
                city: { type: 'string', title: 'City' },
            },
        },
    },
};

export const arrayOfObjectsSchema: FormSchema = {
    type: 'object',
    properties: {
        heroes: {
            type: 'array',
            title: 'Heroes',
            items: {
                type: 'object',
                title: 'Hero',
                properties: {
                    name: { type: 'string', title: 'Name' },
                },
            },
        },
    },
};

export const dynamicSchema: FormSchema = {
    type: 'object',
    properties: {
        name: { type: 'string', title: 'Name' },
    },
};

export const dynamicSchemaUpdated: FormSchema = {
    type: 'object',
    properties: {
        name: { type: 'string', title: 'Name' },
        email: { type: 'string', title: 'Email' },
    },
};

export const helpSchema: FormSchema = {
    type: 'object',
    properties: {
        name: {
            type: 'string',
            title: 'Name',
            lime: {
                help: {
                    value: 'Enter your full name',
                },
            },
        },
    },
};

export const gridLayoutSchema: FormSchema = {
    type: 'object',
    properties: {
        first: { type: 'string', title: 'First' },
        second: { type: 'string', title: 'Second' },
    },
    lime: {
        layout: {
            type: 'grid',
            columns: 2,
        },
    },
};

export const collapsibleSchema: FormSchema = {
    type: 'object',
    properties: {
        details: {
            type: 'object',
            title: 'Details',
            properties: {
                info: { type: 'string', title: 'Info' },
            },
            lime: {
                collapsible: true,
            },
        },
    },
};

export const dateSchema: FormSchema = {
    type: 'object',
    properties: {
        birthday: { type: 'string', title: 'Birthday', format: 'date' },
    },
};

export const integerSchema: FormSchema = {
    type: 'object',
    properties: {
        count: { type: 'integer', title: 'Count' },
    },
};

export const serverErrorsSchema: FormSchema = {
    type: 'object',
    properties: {
        name: { type: 'string', title: 'Name' },
    },
};

export const transformErrorsSchema: FormSchema = {
    type: 'object',
    properties: {
        code: { type: 'string', title: 'Code', pattern: '^[A-Z]{3}$' },
    },
    required: ['code'],
};

export const customComponentSchema: FormSchema = {
    type: 'object',
    properties: {
        enabled: {
            type: 'boolean',
            title: 'Enabled',
            lime: {
                component: {
                    name: 'limel-switch',
                },
            },
        },
    },
};

export const undefinedComponentSchema: FormSchema = {
    type: 'object',
    properties: {
        field: {
            type: 'string',
            title: 'Field',
            lime: {
                component: {
                    name: 'limel-does-not-exist',
                },
            },
        },
    },
};

export const emptySchema: FormSchema = {
    type: 'object',
    properties: {},
};

export const hiddenFieldSchema: FormSchema = {
    type: 'object',
    properties: {
        visible: { type: 'string', title: 'Visible' },
        secret: {
            type: 'string',
            title: 'Secret',
            lime: { hidden: true },
        },
    },
};

export const readOnlyFieldSchema: FormSchema = {
    type: 'object',
    properties: {
        locked: {
            type: 'string',
            title: 'Locked',
            readOnly: true,
        },
    },
};

export const arrayMaxItemsSchema: FormSchema = {
    type: 'object',
    properties: {
        tags: {
            type: 'array',
            title: 'Tags',
            items: { type: 'string' },
            maxItems: 2,
        },
    },
};

export const arrayItemControlsSchema: FormSchema = {
    type: 'object',
    properties: {
        items: {
            type: 'array',
            title: 'Items',
            items: { type: 'string' },
            lime: {
                allowItemReorder: false,
                allowItemRemoval: false,
            },
        },
    },
};

export const rowLayoutSchema: FormSchema = {
    type: 'object',
    properties: {
        first: {
            type: 'string',
            title: 'First',
            description: 'First field description',
        },
        second: {
            type: 'string',
            title: 'Second',
            description: 'Second field description',
        },
    },
    lime: {
        layout: {
            type: 'row',
        },
    },
};

export const rowLayoutWithCustomComponentSchema: FormSchema = {
    type: 'object',
    properties: {
        name: {
            type: 'string',
            title: 'Name',
            description: 'Name description',
        },
        active: {
            type: 'boolean',
            title: 'Active',
            description: 'Active description',
            lime: {
                component: {
                    name: 'limel-switch',
                },
            },
        },
    },
    lime: {
        layout: {
            type: 'row',
        },
    },
};

export const nestedArrayObjectSchema: FormSchema = {
    type: 'object',
    properties: {
        people: {
            type: 'array',
            title: 'People',
            items: {
                type: 'object',
                title: 'Person',
                properties: {
                    name: { type: 'string', title: 'Name' },
                    address: {
                        type: 'object',
                        title: 'Address',
                        properties: {
                            street: { type: 'string', title: 'Street' },
                            city: { type: 'string', title: 'City' },
                        },
                    },
                },
            },
        },
    },
};

export const topLevelStringCustomComponentSchema: FormSchema = {
    type: 'object',
    properties: {
        icon: {
            type: 'string',
            title: 'Icon',
            lime: { component: { name: 'limel-input-field' } },
        },
    },
};

export const nestedStringCustomComponentSchema: FormSchema = {
    type: 'object',
    properties: {
        views: {
            type: 'array',
            title: 'Views',
            items: {
                type: 'object',
                properties: {
                    icon: {
                        type: 'string',
                        title: 'Icon',
                        lime: { component: { name: 'limel-input-field' } },
                    },
                },
            },
        },
    },
};
