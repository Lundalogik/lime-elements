import { FormSchema } from '@limetech/lime-elements';

export interface HeadingLevelFormData {
    name?: string;
    address?: {
        city?: string;
        delivery?: {
            instructions?: string;
        };
    };
}

export const schema: FormSchema<HeadingLevelFormData> = {
    type: 'object',
    title: 'Customer',
    properties: {
        name: {
            type: 'string',
            title: 'Name',
        },
        address: {
            type: 'object',
            title: 'Address',
            properties: {
                city: {
                    type: 'string',
                    title: 'City',
                },
                delivery: {
                    type: 'object',
                    title: 'Delivery',
                    properties: {
                        instructions: {
                            type: 'string',
                            title: 'Instructions',
                        },
                    },
                },
            },
        },
    },
};
