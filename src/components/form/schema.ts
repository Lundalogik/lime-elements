import { JSONSchema7TypeName } from 'json-schema';
import { FormSchema } from './form.types';

export function isObjectType(schema: FormSchema = {}) {
    return isType(schema.type, 'object');
}

export function isArrayType(schema: FormSchema) {
    return isType(schema.type, 'array');
}

export function isStringType(schema: FormSchema) {
    return isType(schema.type, 'string');
}

export function isNumberType(schema: FormSchema) {
    return isType(schema.type, 'number');
}

export function isIntegerType(schema: FormSchema) {
    return isType(schema.type, 'integer');
}

function isType(input: FormSchema['type'], type: JSONSchema7TypeName) {
    if (Array.isArray(input)) {
        return input.includes(type);
    }

    return input === type;
}
