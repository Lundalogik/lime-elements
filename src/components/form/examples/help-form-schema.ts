import { FormSchema } from '@limetech/lime-elements';

type Race = 'search' | 'recommendation' | 'ads' | 'work' | 'workshop';
export interface HelpFormData {
    address?: {
        planet?: string;
        galaxy?: string;
        email?: string;
        race?: Race;
    };
}

export const schema: FormSchema<HelpFormData> = {
    type: 'object',
    properties: {
        address: {
            type: 'object',
            title: 'Book a demo',
            properties: {
                planet: {
                    type: 'string',
                    title: 'Name',
                    description: 'Please write your name & surname',
                    lime: {
                        help: {
                            value: '**Why do we need this information?** <br> This enables our sales representatives to contact you personally. We will keep all your personal information safe!',
                            readMoreLink: {
                                href: 'https://www.lime-technologies.com/en/av-saas/',
                                title: 'This link opens in a new tab',
                                target: '_blank',
                                text: 'Our Terms & Privacy Policies',
                            },
                        },
                    },
                },
                galaxy: {
                    type: 'string',
                    title: 'Company',
                    description: 'Please write your company name',
                },
                email: {
                    type: 'string',
                    title: 'Work Email',
                    format: 'email',
                    lime: {
                        help: {
                            value: 'Enter a valid email address so that we can contact you. We will not share this information with any third parties.',
                            readMoreLink: {
                                href: 'https://www.lime-technologies.com/en/av-saas/',
                                title: 'This link opens in a new tab',
                                target: '_blank',
                                text: 'Our Terms & Privacy Policies',
                            },
                        },
                    },
                },
                race: {
                    type: 'string',
                    title: 'How did you hear about Lime CRM?',
                    oneOf: [
                        {
                            type: 'string',
                            const: 'search',
                            title: 'Internet search',
                        },
                        {
                            type: 'string',
                            const: 'recommendation',
                            title: 'Recommendation from a friend or a colleague',
                        },
                        {
                            type: 'string',
                            const: 'ads',
                            title: 'Advertising campaigns',
                        },
                        {
                            type: 'string',
                            const: 'work',
                            title: 'Worked with Lime CRM before',
                        },
                        {
                            type: 'string',
                            const: 'workshop',
                            title: 'Watched a workshop online',
                        },
                    ],
                    lime: {
                        help: {
                            value: '**Why do we need this information?** <br> This enables us to improve our marketing efforts and get a better understanding of how people perceive us as a brand.',
                        },
                    },
                },
            },
        },
    },
};
