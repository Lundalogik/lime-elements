import { FormSchema } from '@limetech/lime-elements';

export const schema: FormSchema = {
    type: 'object',
    properties: {
        name: {
            type: 'string',
            title: 'Name',
            description: 'Name of the superhero deal',
        },
        value: {
            type: 'integer',
            title: 'Value',
            description: 'Amount to pay to hero',
        },
        hero: {
            type: 'integer',
            title: 'Hero',
            lime: {
                component: {
                    name: 'limel-example-custom-picker',
                    props: {
                        helperText: 'Pick your superhero!',
                    },
                },
            },
        },
    },
};
