import { resetDependentFields, getFactoryProps } from './schema-field';

describe('resetDependentFields()', () => {
    const schema = {
        type: 'object',
        properties: {
            type: {
                title: 'Type',
                type: 'string',
                enum: ['String', 'Object'],
            },
        },
        required: ['type'],
        dependencies: {
            type: {
                oneOf: [
                    {
                        properties: {
                            type: {
                                const: 'String',
                            },
                            value: {
                                type: 'string',
                                title: 'String Type',
                            },
                        },
                    },
                    {
                        properties: {
                            type: {
                                const: 'Object',
                            },
                            value: {
                                type: 'object',
                                title: 'Object Type',
                                properties: {
                                    name: {
                                        type: 'string',
                                    },
                                    other: {
                                        type: 'string',
                                    },
                                },
                            },
                        },
                    },
                ],
            },
        },
    };

    const schemaWithReferences = {
        definitions: {
            ObjectSchema: {
                title: 'Object Type',
                properties: {
                    name: {
                        type: 'string',
                    },
                    other: {
                        type: 'string',
                    },
                },
            },
            MainSchema: {
                type: 'object',
                properties: {
                    type: {
                        title: 'Type',
                        type: 'string',
                        enum: ['String', 'Object'],
                    },
                },
                required: ['type'],
                dependencies: {
                    type: {
                        oneOf: [
                            {
                                properties: {
                                    type: {
                                        const: 'String',
                                    },
                                    value: {
                                        type: 'string',
                                        title: 'String Type',
                                    },
                                },
                            },
                            {
                                properties: {
                                    type: {
                                        const: 'Object',
                                    },
                                    value: {
                                        type: 'object',
                                        $ref: '#definitions/ObjectSchema',
                                    },
                                },
                            },
                        ],
                    },
                },
            },
        },
        $ref: '#/definitions/MainSchema',
    };

    it('should reset a populated value if the schema changes', () => {
        const oldData = {
            type: 'String',
            value: 'bacon',
        };

        const newData = {
            type: 'Object',
            value: 'bacon',
        };

        expect(resetDependentFields(oldData, newData, schema, {})).toEqual({
            type: 'Object',
        });
    });

    it('should not reset a populated value if the schema does not change', () => {
        const oldData = {
            type: 'String',
            value: 'bacon',
        };

        const newData = {
            type: 'String',
            value: 'cheese',
        };

        expect(resetDependentFields(oldData, newData, schema, {})).toEqual({
            type: 'String',
            value: 'cheese',
        });
    });

    it('should reset a populated value if the schema changes (with definitions)', () => {
        const oldData = {
            type: 'String',
            value: 'bacon',
        };

        const newData = {
            type: 'Object',
            value: 'bacon',
        };

        expect(
            resetDependentFields(
                oldData,
                newData,
                schemaWithReferences,
                schemaWithReferences.definitions
            )
        ).toEqual({
            type: 'Object',
        });
    });

    it('should not reset a populated value if the schema does not change (with definitions)', () => {
        const oldData = {
            type: 'String',
            value: 'bacon',
        };

        const newData = {
            type: 'String',
            value: 'cheese',
        };

        expect(
            resetDependentFields(
                oldData,
                newData,
                schemaWithReferences,
                schemaWithReferences.definitions
            )
        ).toEqual({
            type: 'String',
            value: 'cheese',
        });
    });
});

describe('getFactoryProps', () => {
    describe('when no factory is given', () => {
        it('returns an empty object', () => {
            const props = getFactoryProps({}, {});
            expect(props).toEqual({});
        });
    });

    describe('when a factory is set', () => {
        describe('when the factory returns an object', () => {
            it('returns the props from the factory', () => {
                const props = getFactoryProps(
                    {
                        propsFactory: () => ({ foo: 'bar' }),
                    },
                    {}
                );
                expect(props).toEqual({ foo: 'bar' });
            });
        });

        describe('when the factory not returns an object', () => {
            it('returns an empty object', () => {
                const props = getFactoryProps(
                    {
                        propsFactory: () => null,
                    },
                    {}
                );
                expect(props).toEqual({});
            });
        });
    });
});
