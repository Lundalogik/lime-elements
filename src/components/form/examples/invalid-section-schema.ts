import { FormSchema, ValidationError } from '@limetech/lime-elements';

export interface InvalidSectionFormData {
    personal?: {
        name?: string;
        email?: string;
    };
    work?: {
        company?: string;
        jobTitle?: string;
        startYear?: number;
    };
    contacts?: Array<{
        name?: string;
        phone?: string;
    }>;
}

export const schema: FormSchema<InvalidSectionFormData> = {
    type: 'object',
    properties: {
        personal: {
            type: 'object',
            title: 'Personal information',
            properties: {
                name: {
                    type: 'string',
                    title: 'Name',
                    minLength: 1,
                },
                email: {
                    type: 'string',
                    title: 'Email',
                    format: 'email',
                    minLength: 1,
                },
            },
            required: ['name', 'email'],
            lime: {
                collapsible: true,
                collapsed: false,
            },
        },
        work: {
            type: 'object',
            title: 'Work',
            properties: {
                company: {
                    type: 'string',
                    title: 'Company',
                    minLength: 1,
                },
                jobTitle: {
                    type: 'string',
                    title: 'Job title',
                    minLength: 1,
                },
                startYear: {
                    type: 'integer',
                    title: 'Start year',
                    minimum: 1900,
                    description: 'The start year must be 1900 or later.',
                },
            },
            required: ['company', 'jobTitle'],
            lime: {
                collapsible: true,
                collapsed: true,
            },
        },
        contacts: {
            type: 'array',
            title: 'Emergency contacts',
            items: {
                type: 'object',
                title: 'Contact',
                properties: {
                    name: { type: 'string', title: 'Name', minLength: 1 },
                    phone: { type: 'string', title: 'Phone', minLength: 1 },
                },
                required: ['name', 'phone'],
            },
            lime: {},
        },
    },
};

export const serverErrors: ValidationError = {
    personal: {
        email: ['This email is already registered'],
    },
};
