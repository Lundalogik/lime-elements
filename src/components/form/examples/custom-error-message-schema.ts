import { FormSchema } from '@limetech/lime-elements';

export const schema: FormSchema = {
    title: 'Personal identity number form',
    description: 'Please enter your personal identity number',
    type: 'object',
    required: ['personalIdentityNumber'],
    properties: {
        personalIdentityNumber: {
            type: 'string',
            title: 'Personal identity number',
            description: 'Enter your personal identity number',
            pattern: '[0-9]{8}[-][0-9]{4}',
        },
    },
};
