import { JSONSchema7TypeName } from 'json-schema';
import { FormSchema } from './form.types';

/**
 *
 * @param schema
 */
export function isObjectType(schema: FormSchema = {}) {
    return isType(schema.type, 'object');
}

/**
 *
 * @param schema
 */
export function isArrayType(schema: FormSchema) {
    return isType(schema.type, 'array');
}

/**
 *
 * @param schema
 */
export function isStringType(schema: FormSchema) {
    return isType(schema.type, 'string');
}

/**
 *
 * @param schema
 */
export function isNumberType(schema: FormSchema) {
    return isType(schema.type, 'number');
}

/**
 *
 * @param schema
 */
export function isIntegerType(schema: FormSchema) {
    return isType(schema.type, 'integer');
}

function isType(input: FormSchema['type'], type: JSONSchema7TypeName) {
    if (Array.isArray(input)) {
        return input.includes(type);
    }

    return input === type;
}
