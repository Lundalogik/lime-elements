export const schema = {
    description: 'This form has the row layout',
    type: 'object',
    properties: {
        info: {
            title: 'Preferences',
            description:
                'These settings will not affect how others see the data. These are only for you.',
            type: 'object',
            lime: {
                layout: {
                    type: 'row',
                },
            },
            properties: {
                language: {
                    type: 'string',
                    title: 'Language',
                    description: 'Select the app language',
                    default: 'ua',
                    oneOf: [
                        {
                            type: 'string',
                            const: 'sv',
                            title: 'Swedish',
                        },
                        {
                            type: 'string',
                            const: 'ua',
                            title: 'Ukrainian',
                        },
                        {
                            type: 'string',
                            const: 'en',
                            title: 'English',
                        },
                        {
                            type: 'string',
                            const: 'am',
                            title: 'Amharic',
                        },
                        {
                            type: 'string',
                            const: 'fa',
                            title: 'Farsi',
                        },
                    ],
                },
                date: {
                    type: 'string',
                    title: 'Date format',
                    default: 'yyyy-mm-dd',
                    lime: {
                        layout: {
                            icon: 'calendar',
                        },
                    },
                    oneOf: [
                        {
                            type: 'string',
                            const: 'yyyy-mm-dd',
                            title: '1999-01-31',
                        },
                        {
                            type: 'string',
                            const: 'yyyy.dd.mm',
                            title: '1999.01.31',
                        },
                        {
                            type: 'string',
                            const: 'yyyy/dd/mm',
                            title: '1999/01/31',
                        },
                    ],
                },
                notification: {
                    type: 'boolean',
                    title: 'Receive email notifications',
                },
                frequency: {
                    type: 'number',
                    title: 'Frequency of notifications',
                    description:
                        'How many times per day can we sent you email notifications at most?',
                    minimum: 0,
                    maximum: 10,
                    multipleOf: 1,
                    lime: {
                        layout: {
                            icon: 'notification_center_92458',
                        },
                    },
                },
                personalNumber: {
                    type: 'integer',
                    title: 'Personal identity number',
                    lime: {
                        layout: {
                            icon: 'numbers_input_form',
                        },
                    },
                },
            },
        },
    },
};
