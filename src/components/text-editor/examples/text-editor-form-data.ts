import { FormSchema } from '@limetech/lime-elements';

export interface FormComponentFormData {
    name?: string;
    value?: {
        html: string;
    };
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
            type: 'object',
            title: 'Description',
            description: 'A personal description',
            lime: {
                component: {
                    name: 'limel-text-editor',
                    props: {
                        placeholder: 'Enter a personal description',
                    },
                },
            },
        },
    },
};
