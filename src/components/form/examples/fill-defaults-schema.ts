import { FormSchema } from '@limetech/lime-elements';

export interface FillDefaultsFormData {
    name?: string;
    columns?: number;
    dense?: boolean;
}

export const schema: FormSchema<FillDefaultsFormData> = {
    type: 'object',
    properties: {
        name: {
            type: 'string',
            title: 'Name',
        },
        columns: {
            type: 'integer',
            title: 'Number of columns',
            default: 5,
        },
        dense: {
            type: 'boolean',
            title: 'Dense layout',
            default: true,
        },
    },
};
