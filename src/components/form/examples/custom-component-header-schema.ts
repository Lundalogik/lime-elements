import { FormSchema } from '@limetech/lime-elements';

export interface CustomComponentHeaderFormData {
    widgets?: Array<{ name: string }>;
    hero?: number;
}

export const schema: FormSchema<CustomComponentHeaderFormData> = {
    type: 'object',
    title: 'Start page',
    properties: {
        widgets: {
            type: 'array',
            title: 'Widgets',
            description: 'The widgets to show on the start page.',
            minItems: 1,
            items: {
                type: 'object',
                properties: {
                    name: { type: 'string' },
                },
            },
            lime: {
                help: 'The widgets are shown in this order.',
                component: {
                    name: 'limel-example-custom-card-list',
                    showHeader: true,
                },
            },
        },
        hero: {
            type: 'integer',
            title: 'Hero',
            description: 'The hero who greets the user.',
            lime: {
                component: {
                    name: 'limel-example-custom-picker',
                    showHeader: true,
                },
            },
        },
    },
};
