import { FormSchema } from '@limetech/lime-elements';

export interface NestedFormData {
    name?: string;
    age?: number;
    address?: {
        city?: string;
        country?: string;
    };
    data?: {
        eyeColor?: string;
        shoeSize?: number;
    };
}

export const schema: FormSchema<NestedFormData> = {
    type: 'object',
    properties: {
        name: {
            type: 'string',
            title: 'Name',
        },
        age: {
            type: 'integer',
            title: 'Age',
        },
        address: {
            type: 'object',
            title: 'Location',
            description: 'Please enter your location',
            properties: {
                city: {
                    type: 'string',
                    title: 'City',
                },
                country: {
                    type: 'string',
                    title: 'Country',
                    description: 'It might also be a planet',
                },
            },
        },
        data: {
            type: 'object',
            title: 'Data',
            description: 'Some additional data we would like you to submit',
            properties: {
                eyeColor: {
                    type: 'string',
                    title: 'Eye color',
                },
                shoeSize: {
                    type: 'integer',
                    title: 'Shoe size',
                },
            },
            lime: {
                collapsible: true,
            },
        },
    },
};
