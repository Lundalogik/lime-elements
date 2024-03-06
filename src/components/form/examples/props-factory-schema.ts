import { FormSchema } from '@limetech/lime-elements';

export interface PropsFactoryFormData {
    hero?: number;
}

export const schema: FormSchema<PropsFactoryFormData> = {
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
