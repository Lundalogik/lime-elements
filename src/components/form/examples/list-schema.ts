export const schema = {
    type: 'object',
    properties: {
        villains: {
            type: 'array',
            title: 'Villains',
            description: 'Enter the evil villains to capture',
            items: {
                type: 'string',
                title: 'Name',
                description: 'Enter the name of an evil villain',
                default: 'The Penguin',
            },
        },
        squad: {
            type: 'array',
            title: 'Hero squad',
            description: 'Enter the team of heroes to capture them',
            items: {
                type: 'object',
                title: 'Hero data',
                description: 'Name and powers of super heroes',
                properties: {
                    name: {
                        type: 'string',
                        title: 'Name',
                        description: 'Super hero name',
                    },
                    powers: {
                        type: 'array',
                        title: 'Powers',
                        description: 'Available, powers',
                        uniqueItems: true,
                        items: {
                            anyOf: [
                                {
                                    type: 'string',
                                    const: 'strength',
                                    title: 'Super human strength',
                                },
                                {
                                    type: 'string',
                                    const: 'speed',
                                    title: 'Lightning fast',
                                },
                                {
                                    type: 'string',
                                    const: 'invisibility',
                                    title: 'Invisibility',
                                },
                                {
                                    type: 'string',
                                    const: 'vision',
                                    title: 'X-Ray vision',
                                },
                                {
                                    type: 'string',
                                    const: 'flight',
                                    title: 'Flight',
                                },
                            ],
                        },
                    },
                },
            },
        },
    },
};
