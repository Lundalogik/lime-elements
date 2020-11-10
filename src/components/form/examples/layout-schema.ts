export const schema = {
    title: 'Registration form',
    description:
        'This main form has no specified layout, so it gets the default 1 column.',
    type: 'object',
    properties: {
        info: {
            title: 'Player info',
            description: 'This section has a 4 column grid layout.',
            type: 'object',
            lime: {
                collapsible: true,
                layout: {
                    type: 'grid',
                    columns: 4,
                },
            },
            properties: {
                name: {
                    type: 'string',
                    title: 'Name',
                },
                age: {
                    type: 'integer',
                    title: 'Age',
                },
                race: {
                    type: 'string',
                    title: 'Race',
                    oneOf: [
                        {
                            type: 'string',
                            const: 'angel',
                            title: 'Angel',
                        },
                        {
                            type: 'string',
                            const: 'dragon',
                            title: 'Dragon',
                        },
                        {
                            type: 'string',
                            const: 'elf',
                            title: 'Elf',
                        },
                        {
                            type: 'string',
                            const: 'yeti',
                            title: 'Yeti',
                        },
                        {
                            type: 'string',
                            const: 'vampire',
                            title: 'Vampire',
                        },
                        {
                            type: 'string',
                            const: 'warewolf',
                            title: 'Werewolf',
                        },
                        {
                            type: 'string',
                            const: 'orc',
                            title: 'Orc',
                        },
                        {
                            type: 'string',
                            const: 'wizard',
                            title: 'Wizard',
                        },
                    ],
                },
                placeOfBirth: {
                    type: 'string',
                    title: 'Place of birth',
                    oneOf: [
                        {
                            type: 'string',
                            const: 'palight',
                            title: 'Palight',
                        },
                        {
                            type: 'string',
                            const: 'ekudshire',
                            title: 'Ekudshire',
                        },
                        {
                            type: 'string',
                            const: 'blarc',
                            title: 'Blarc',
                        },
                        {
                            type: 'string',
                            const: 'kamond',
                            title: 'Kamond',
                        },
                        {
                            type: 'string',
                            const: 'blodholm',
                            title: 'Blodholm',
                        },
                        {
                            type: 'string',
                            const: 'wuacross',
                            title: 'Wuacross',
                        },
                        {
                            type: 'string',
                            const: 'bruhgnathal',
                            title: 'Bruhgnathal',
                        },
                        {
                            type: 'string',
                            const: 'orasas',
                            title: 'Orasas',
                        },
                    ],
                },
            },
        },
        address: {
            title: 'Player address',
            description: 'This section has a 2 column grid layout.',
            type: 'object',
            lime: {
                collapsible: true,
                layout: {
                    type: 'grid',
                    columns: 2,
                },
            },
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
        emails: {
            title: "Friends' emails",
            description:
                'This section has a grid layout, but no colSpan is specified; which will result in a 5 column layout.',
            type: 'object',
            lime: {
                collapsible: true,
                layout: {
                    type: 'grid',
                },
            },
            properties: {
                email1: {
                    type: 'string',
                    title: 'Email',
                    description: 'Enter a valid email address',
                    format: 'email',
                },
                email2: {
                    type: 'string',
                    title: 'Email',
                    description: 'Enter a valid email address',
                    format: 'email',
                },
                email3: {
                    type: 'string',
                    title: 'Email',
                    description: 'Enter a valid email address',
                    format: 'email',
                },
                email4: {
                    type: 'string',
                    title: 'Email',
                    description: 'Enter a valid email address',
                    format: 'email',
                },
                email5: {
                    type: 'string',
                    title: 'Email',
                    description: 'Enter a valid email address',
                    format: 'email',
                },
            },
        },
    },
};
