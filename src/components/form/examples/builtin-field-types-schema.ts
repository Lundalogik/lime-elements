import { FormSchema } from '@limetech/lime-elements';

type Priority = 'low' | 'medium' | 'high' | 'critical';
type Category = 'work' | 'personal' | 'urgent' | 'optional';

export interface BuiltinFieldTypesFormData {
    // String types
    textField?: string;
    emailField?: string;
    readonlyField?: string;

    // Date/time types
    dateField?: string;
    dateTimeField?: string;
    timeField?: string;

    // Number types
    numberField?: number;
    integerField?: number;
    sliderField?: number;
    percentField?: number;

    // Boolean
    checkboxField?: boolean;

    // Select (oneOf)
    selectField?: Priority;

    // Multi-select (array with anyOf)
    multiSelectField?: Category[];

    // Array of strings
    stringArrayField?: string[];

    // Nested object
    nestedObject?: {
        city?: string;
        country?: string;
    };

    // Object with additionalProperties (code editor)
    jsonField?: Record<string, any>;
}

export const schema: FormSchema<BuiltinFieldTypesFormData> = {
    title: 'Built-in Field Types',
    description:
        'This form showcases all field types available out of the box without custom components.',
    type: 'object',
    properties: {
        textField: {
            type: 'string',
            title: 'Text Field',
            description: 'A basic string input field (type: string)',
            minLength: 2,
            maxLength: 100,
        },
        emailField: {
            type: 'string',
            title: 'Email Field',
            description:
                'An email input with validation (type: string, format: email)',
            format: 'email',
        },
        readonlyField: {
            type: 'string',
            title: 'Readonly Field',
            description: 'A readonly text field (type: string, readOnly: true)',
            default: 'This value cannot be changed',
            readOnly: true,
        },
        dateField: {
            type: 'string',
            title: 'Date Field',
            description: 'A date picker (type: string, format: date)',
            format: 'date',
        },
        dateTimeField: {
            type: 'string',
            title: 'Date-Time Field',
            description: 'A date-time picker (type: string, format: date-time)',
            format: 'date-time',
        },
        timeField: {
            type: 'string',
            title: 'Time Field',
            description: 'A time picker (type: string, format: time)',
            format: 'time',
        },
        numberField: {
            type: 'number',
            title: 'Number Field',
            description:
                'A decimal number input (type: number). Supports min/max validation.',
            minimum: 0,
            maximum: 1000,
        },
        integerField: {
            type: 'integer',
            title: 'Integer Field',
            description:
                'An integer input (type: integer). Only whole numbers allowed.',
            minimum: 1,
            maximum: 100,
        },
        sliderField: {
            type: 'number',
            title: 'Slider Field',
            description:
                'A slider appears when minimum, maximum, AND multipleOf are all specified.',
            minimum: 0,
            maximum: 100,
            multipleOf: 5,
        },
        percentField: {
            type: 'number',
            title: 'Percentage Slider',
            description:
                'A percentage slider (min: 0, max: 1, multipleOf < 1 shows as %)',
            minimum: 0,
            maximum: 1,
            multipleOf: 0.01,
        },
        checkboxField: {
            type: 'boolean',
            title: 'I agree to the terms and conditions',
            description: 'A checkbox field (type: boolean)',
            default: false,
        },
        selectField: {
            type: 'string',
            title: 'Select Field',
            description:
                'A dropdown select (type: string with oneOf containing const values)',
            oneOf: [
                {
                    type: 'string',
                    const: 'low',
                    title: 'Low Priority',
                },
                {
                    type: 'string',
                    const: 'medium',
                    title: 'Medium Priority',
                },
                {
                    type: 'string',
                    const: 'high',
                    title: 'High Priority',
                },
                {
                    type: 'string',
                    const: 'critical',
                    title: 'Critical Priority',
                },
            ],
        },
        multiSelectField: {
            type: 'array',
            title: 'Multi-Select Field',
            description:
                'A multi-select with chips (type: array with uniqueItems and anyOf items)',
            uniqueItems: true,
            items: {
                type: 'string',
                anyOf: [
                    {
                        type: 'string',
                        const: 'work',
                        title: 'Work',
                    },
                    {
                        type: 'string',
                        const: 'personal',
                        title: 'Personal',
                    },
                    {
                        type: 'string',
                        const: 'urgent',
                        title: 'Urgent',
                    },
                    {
                        type: 'string',
                        const: 'optional',
                        title: 'Optional',
                    },
                ],
            },
        },
        stringArrayField: {
            type: 'array',
            title: 'String Array Field',
            description:
                'An array of string inputs (type: array with items: { type: string })',
            items: {
                type: 'string',
                title: 'Item',
                description: 'Enter a value',
            },
        },
        nestedObject: {
            type: 'object',
            title: 'Nested Object',
            description:
                'A nested object with its own fields (type: object with properties)',
            lime: {
                collapsible: true,
            },
            properties: {
                city: {
                    type: 'string',
                    title: 'City',
                    description: 'Enter your city',
                },
                country: {
                    type: 'string',
                    title: 'Country',
                    description: 'Enter your country',
                },
            },
        },
        jsonField: {
            type: 'object',
            title: 'JSON Editor Field',
            description:
                'A code editor for arbitrary JSON (type: object with additionalProperties: true)',
            additionalProperties: true,
        },
    },
};
