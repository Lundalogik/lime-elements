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
        koko: {
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
    },
};

const nestedFirstSchema: any = { ...schema };
nestedFirstSchema.properties = {
    nested: {
        type: 'object',
        $ref: '#/definitions/nested',
    },
    data: {
        type: 'string',
    },
};

const nestedFirstWithTitleSchema: any = { ...schema };
nestedFirstWithTitleSchema.properties = {
    nested: {
        type: 'object',
        $ref: '#/definitions/nested',
    },
    data: {
        type: 'string',
    },
    title: {
        type: 'string',
    },
};

const list1FirstSchema: any = { ...schema };
list1FirstSchema.properties = {
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
};

const list2FirstSchema: any = { ...schema };
list2FirstSchema.properties = {
    list2: {
        type: 'array',
        items: {
            type: 'object',
            $ref: '#/definitions/nested',
        },
    },
};

const schemaRequiredProperty: any = { ...schema };
schemaRequiredProperty.required = ['data'];

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
            input: [
                { nested: { data: 'nestedName' } },
                nestedFirstSchema,
                schema,
            ],
            output: 'Nested name',
        },
        {
            input: [
                { nested: { data: 'nestedName' }, title: 'My title' },
                nestedFirstWithTitleSchema,
                schema,
            ],
            output: 'My title',
        },
        {
            input: [{ list1: ['item1'] }, list1FirstSchema, schema],
            output: 'Item1',
        },
        {
            input: [
                { list2: [{ data: 'itemData' }] },
                list2FirstSchema,
                schema,
            ],
            output: 'Item data',
        },
        {
            input: [
                { koko: 'loko', data: 'test' },
                schemaRequiredProperty,
                schema,
            ],
            output: 'test',
        },
    ].forEach(({ input, output }) => {
        const inputJson = JSON.stringify(input[1]);
        it(`returns ${output} when called with ${inputJson}`, () => {
            expect(findTitle.apply(null, input)).toEqual(output); // eslint-disable-line prefer-spread
        });
    });
});
