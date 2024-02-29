import { FormSchema } from '@limetech/lime-elements';

export const schema: FormSchema = {
    title: 'Registration form',
    description: 'Please enter your personal information',
    type: 'object',
    required: ['name', 'email', 'newsletters'],
    properties: {
        name: {
            type: 'string',
            title: 'Name',
            default: 'Batman',
            description: 'Enter your heroic name',
            minLength: 5,
            maxLength: 20,
        },
        email: {
            type: 'string',
            title: 'Email',
            description: 'Enter your email address',
            format: 'email',
        },
        home: {
            type: 'string',
            title: 'Home',
            default: 'Earth',
            readOnly: true,
        },
        happiness: {
            type: 'number',
            title: 'Happiness',
            description: 'How happy are you?',
            minimum: 0,
            maximum: 1,
            multipleOf: 0.01,
        },
        bananas: {
            type: 'number',
            title: 'Bananas',
            description: 'How many bananas do you want?',
            minimum: 0,
            maximum: 50,
            multipleOf: 10,
        },
        date: {
            type: 'string',
            title: 'Birthdate',
            format: 'date',
            description: 'Pick a nice date!',
        },
        color: {
            type: 'string',
            title: 'Favorite cape color',
            description: 'Preferably matching your boots',
            oneOf: [
                {
                    type: 'string',
                    const: 'red',
                    title: 'Red',
                },
                {
                    type: 'string',
                    const: 'yellow',
                    title: 'Yellow',
                },
                {
                    type: 'string',
                    const: 'green',
                    title: 'Green',
                },
                {
                    type: 'string',
                    const: 'blue',
                    title: 'Blue',
                },
                {
                    type: 'string',
                    const: 'black',
                    title: 'Black',
                },
            ],
        },
        sidekicks: {
            type: 'array',
            title: 'Sidekicks',
            description: 'Please select your sidekicks',
            uniqueItems: true,
            minItems: 2,
            items: {
                title: 'Friends',
                type: 'string',
                anyOf: [
                    {
                        type: 'string',
                        const: 'super',
                        title: 'Superman',
                    },
                    {
                        type: 'string',
                        const: 'widow',
                        title: 'Black Widow',
                    },
                    {
                        type: 'string',
                        const: 'america',
                        title: 'Captain America',
                    },
                    {
                        type: 'string',
                        const: 'squirrel',
                        title: 'Squirrel Girl',
                    },
                    {
                        type: 'string',
                        const: 'devil',
                        title: 'Daredevil',
                    },
                    {
                        type: 'string',
                        const: 'marvel',
                        title: 'Captain Marvel',
                    },
                    {
                        type: 'string',
                        const: 'fantastic',
                        title: 'Mr. Fantastic',
                    },
                ],
            },
        },
        newsletters: {
            type: 'boolean',
            title: 'I want to receive daily newsletters!',
            default: false,
            const: true,
        },
        params: {
            type: 'object',
            title: 'Parameters',
            description: 'Additional data to send',
            additionalProperties: true,
        },
    },
};
