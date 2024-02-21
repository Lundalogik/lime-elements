import { FormSchema } from '@limetech/lime-elements';

export const schema: FormSchema = {
    type: 'object',
    properties: {
        hero: {
            type: 'integer',
            title: 'Hero',
            lime: {
                component: {
                    name: 'limel-example-props-factory-picker',
                },
            },
        },
    },
};
