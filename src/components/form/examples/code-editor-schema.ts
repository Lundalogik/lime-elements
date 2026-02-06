import { FormSchema } from '@limetech/lime-elements';

export const schema: FormSchema = {
    title: 'API endpoint',
    type: 'object',
    required: ['label', 'payload'],
    properties: {
        label: {
            type: 'string',
            title: 'Label',
            description: 'A descriptive name for this endpoint',
            minLength: 1,
        },
        payload: {
            type: 'object',
            title: 'Request payload',
            description:
                'The JSON payload to send. Must include "method" and "url".',
            additionalProperties: true,
            required: ['method', 'url'],
        },
    },
};
