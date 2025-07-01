import { isCustomObjectSchema, resetDependentFields } from './field-helpers';

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
                schemaWithReferences
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
                schemaWithReferences
            )
        ).toEqual({
            type: 'String',
            value: 'cheese',
        });
    });
});

describe('isCustomObjectSchema', () => {
    let schema;
    describe('when additionalProperties is not true', () => {
        it('returns false', () => {
            schema = {
                type: 'object',
            };
            expect(isCustomObjectSchema(schema)).toBe(false);
        });

        it('returns false', () => {
            schema = {
                type: 'object',
                additionalProperties: false,
            };
            expect(isCustomObjectSchema(schema)).toBe(false);
        });
    });

    describe('when additionalProperties is true', () => {
        it('returns true when no properties are set', () => {
            schema = {
                type: 'object',
                additionalProperties: true,
            };
            expect(isCustomObjectSchema(schema)).toBe(true);
        });

        it('returns true when no properties are set', () => {
            schema = {
                type: 'object',
                additionalProperties: true,
                properties: {},
            };
            expect(isCustomObjectSchema(schema)).toBe(true);
        });

        describe('when schema has properties', () => {
            it('returns false', () => {
                schema = {
                    type: 'object',
                    additionalProperties: true,
                    properties: {
                        foo: {
                            type: 'string',
                        },
                        bar: {
                            type: 'string',
                            __additional_property: true,
                        },
                    },
                };
                expect(isCustomObjectSchema(schema)).toBe(false);
            });
        });

        describe('when all schema properties have __additional_property flag', () => {
            it('returns true', () => {
                schema = {
                    type: 'object',
                    additionalProperties: true,
                    properties: {
                        foo: {
                            type: 'string',
                            __additional_property: true,
                        },
                        bar: {
                            type: 'string',
                            __additional_property: true,
                        },
                    },
                };
                expect(isCustomObjectSchema(schema)).toBe(true);
            });
        });
    });
});
