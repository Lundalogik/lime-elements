export const schema = {
    type: 'object',
    properties: {
        name: {
            type: 'string',
            title: 'Name',
            description: 'Name of the superhero deal',
        },
        value: {
            type: 'integer',
            title: 'Value',
            description: 'Amount to pay to hero',
        },
        hero: {
            type: 'integer',
            title: 'Hero',
        },
    },
};
