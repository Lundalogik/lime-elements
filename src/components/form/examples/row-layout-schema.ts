import { FormSchema } from '../form.types';

type Language = 'sv' | 'ua' | 'en' | 'am' | 'fa';

export interface RowLayoutFormData {
    info?: {
        language?: Language;
        date?: string;
        notification?: boolean;
        frequency?: number;
        personalNumber?: number;
    };
}

export const schema: FormSchema<RowLayoutFormData> = {
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
                    default: 'ua',
                    lime: {
                        help: {
                            value: 'This will affect both the language of the user interface of our app, and also the language of the emails we send you.',
                        },
                        layout: {
                            icon: 'globe',
                        },
                    },
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
                    title: 'Receive summary notifications via email',
                    lime: {
                        help: {
                            value: 'You can read more about how we handle our communications with you in our Terms & Privacy Policies.',
                            readMoreLink: {
                                href: 'https://www.lime-technologies.com/en/av-saas/',
                                title: 'This link opens in a new tab',
                                target: '_blank',
                                text: 'Our Terms & Privacy Policies',
                            },
                        },
                        layout: {
                            icon: 'filled_message',
                        },
                    },
                },
                frequency: {
                    type: 'number',
                    title: 'Frequency of email notifications',
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
