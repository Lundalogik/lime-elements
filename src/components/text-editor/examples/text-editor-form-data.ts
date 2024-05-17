import { FormSchema } from '@limetech/lime-elements';

export interface FormComponentFormData {
    name?: string;
    value?: string;
}

export const schema: FormSchema<FormComponentFormData> = {
    type: 'object',
    properties: {
        name: {
            type: 'string',
            title: 'Name',
            description: 'Your name',
        },
        value: {
            type: 'string',
            title: 'Description',
            description: 'A personal description',
            lime: {
                component: {
                    name: 'limel-text-editor',
                    props: {
                        contentType: 'html',
                    },
                },
            },
        },
    },
};
