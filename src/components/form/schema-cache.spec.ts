import { getValidator, getSchemaId } from './schema-cache';

it('getValidator returns a validator for a given schema', () => {
    const schema = { type: 'object', properties: { name: { type: 'string' } } };
    const validator = getValidator(schema);
    expect(typeof validator).toBe('function');
});

it('getValidator returns the same validator for identical schema content', () => {
    const schema1 = {
        type: 'object',
        properties: { name: { type: 'string' } },
    };
    const schema2 = {
        type: 'object',
        properties: { name: { type: 'string' } },
    };
    const validator1 = getValidator(schema1);
    const validator2 = getValidator(schema2);
    expect(validator1).toBe(validator2);
});

it('getValidator returns a different validator when schema content changes', () => {
    const schema1 = {
        type: 'object',
        properties: { name: { type: 'string' } },
    };
    const schema2 = { type: 'object', properties: { age: { type: 'number' } } };
    const validator1 = getValidator(schema1);
    const validator2 = getValidator(schema2);
    expect(validator1).not.toBe(validator2);
});

it('getValidator validates data correctly', () => {
    const schema = {
        type: 'object',
        properties: { name: { type: 'string' } },
        required: ['name'],
    };
    const validator = getValidator(schema);
    expect(validator({ name: 'test' })).toBe(true);
    expect(validator({})).toBe(false);
});

it('getSchemaId returns the same id for identical schema content', () => {
    const schema1 = {
        type: 'object',
        properties: { name: { type: 'string' } },
    };
    const schema2 = {
        type: 'object',
        properties: { name: { type: 'string' } },
    };
    const id1 = getSchemaId(schema1);
    const id2 = getSchemaId(schema2);
    expect(id1).toBe(id2);
});

it('getSchemaId returns different ids for different schemas', () => {
    const schema1 = {
        type: 'object',
        properties: { name: { type: 'string' } },
    };
    const schema2 = { type: 'object', properties: { age: { type: 'number' } } };
    const id1 = getSchemaId(schema1);
    const id2 = getSchemaId(schema2);
    expect(id1).not.toBe(id2);
});

it('getSchemaId preserves existing $id as prefix', () => {
    const schema = { $id: 'my-form', type: 'object' };
    const id = getSchemaId(schema);
    expect(id).toMatch(/^my-form-/);
});

it('getValidator does not throw when schema $id is reused with different content', () => {
    const schemaV1 = {
        $id: 'dynamic-schema',
        type: 'object',
        properties: { name: { type: 'string' } },
    };
    const schemaV2 = {
        $id: 'dynamic-schema',
        type: 'object',
        properties: { age: { type: 'number' } },
    };

    getValidator(schemaV1);
    expect(() => getValidator(schemaV2)).not.toThrow();
});

it('getValidator returns the same validator for schemas differing only in $id', () => {
    const schema1 = {
        $id: 'x',
        type: 'object',
        properties: { a: { type: 'string' } },
    };
    const schema2 = {
        $id: 'y',
        type: 'object',
        properties: { a: { type: 'string' } },
    };
    const validator1 = getValidator(schema1);
    const validator2 = getValidator(schema2);
    expect(validator1).toBe(validator2);
});

it('getValidator returns the same validator regardless of property insertion order', () => {
    const schema1 = { type: 'object', properties: { a: { type: 'string' } } };
    const schema2 = { properties: { a: { type: 'string' } }, type: 'object' };
    const validator1 = getValidator(schema1);
    const validator2 = getValidator(schema2);
    expect(validator1).toBe(validator2);
});

it('validating one form does not corrupt errors read by another form with the same schema', () => {
    const schema = {
        type: 'object',
        properties: { name: { type: 'string' } },
        required: ['name'],
    };
    const validator = getValidator(schema);

    validator({ name: 'valid' });
    const errorsAfterValid = [...(validator.errors || [])];

    validator({});

    expect(errorsAfterValid).toEqual([]);
});
