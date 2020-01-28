import { findTitle } from './common';

const schema = {
    type: 'object',
    definitions: {
        nested: {
            type: 'object',
            properties: {
                data: {
                    type: 'string',
                    oneOf: [
                        {
                            type: 'string',
                            const: 'nestedName',
                            title: 'Nested name',
                        },
                        {
                            type: 'string',
                            const: 'itemData',
                            title: 'Item data',
                        },
                    ],
                },
            },
        },
    },
    properties: {
        data: {
            type: 'string',
        },
        title: {
            type: 'string',
        },
        name: {
            type: 'string',
            oneOf: [
                {
                    type: 'string',
                    const: 'a',
                    title: 'A',
                },
                {
                    type: 'string',
                    const: 'name',
                    title: 'Name',
                },
            ],
        },
        nested: {
            type: 'object',
            $ref: '#/definitions/nested',
        },
        list1: {
            type: 'array',
            items: {
                type: 'string',
                anyOf: [
                    {
                        type: 'string',
                        const: 'item1',
                        title: 'Item1',
                    },
                    {
                        type: 'string',
                        const: 'item2',
                        title: 'Item2',
                    },
                ],
            },
        },
        list2: {
            type: 'array',
            items: {
                type: 'object',
                $ref: '#/definitions/nested',
            },
        },
    },
};

describe('findTitle()', () => {
    [
        {
            input: ['test', {}, schema],
            output: 'test',
        },
        {
            input: [null, {}, schema],
            output: null,
        },
        {
            input: [{ data: 'test' }, schema, schema],
            output: 'test',
        },
        {
            input: [{ data: 'test', title: 'title' }, schema, schema],
            output: 'title',
        },
        {
            input: [{ data: 'test', name: 'name' }, schema, schema],
            output: 'Name',
        },
        {
            input: [
                { data: 'test', name: 'name', title: 'title' },
                schema,
                schema,
            ],
            output: 'title',
        },
        {
            input: [{ nested: { data: 'nestedName' } }, schema, schema],
            output: 'Nested name',
        },
        {
            input: [{ list1: ['item1'] }, schema, schema],
            output: 'Item1',
        },
        {
            input: [{ list2: [{ data: 'itemData' }] }, schema, schema],
            output: 'Item data',
        },
    ].forEach(({ input, output }) => {
        const inputJson = JSON.stringify(input[1]);
        it(`returns ${output} when called with ${inputJson}`, () => {
            expect(findTitle.apply(null, input)).toEqual(output);
        });
    });
});
