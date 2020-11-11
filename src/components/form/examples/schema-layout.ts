export const schema = {
    type: 'object',
    lime: {
        layout: {
            type: 'grid',
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
        pet: {
            type: 'string',
            title: 'Pet',
            lime: {
                layout: {
                    colSpan: 'all',
                },
            },
        },
        address: {
            type: 'object',
            lime: {
                layout: {
                    span: 'all',
                },
            },
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
            lime: {
                collapsible: true,
                layout: {
                    type: 'grid',
                    span: 'all',
                },
            },
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
        },
    },
};
