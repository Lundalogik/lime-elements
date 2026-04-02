import Ajv from 'ajv';
import { isInteger } from './validators';

const ajv = new Ajv({
    unknownFormats: 'ignore',
    allErrors: true,
    multipleOfPrecision: 2,
}).addFormat('integer', isInteger);

const validators = new Map<string, Ajv.ValidateFunction>();

/**
 * Returns a compiled JSON Schema validator, using a cached version
 * if the same schema content has been seen before.
 *
 * @param schema - the JSON Schema to compile
 */
export function getValidator(
    schema: Record<string, any>
): Ajv.ValidateFunction {
    const key = hashSchema(schema);
    const cached = validators.get(key);
    if (cached) {
        return cached;
    }

    const { $id, id, ...schemaWithoutId } = schema;
    const validator = ajv.compile(schemaWithoutId);
    validators.set(key, validator);

    return validator;
}

/**
 * Generates a deterministic ID from schema content, preserving any
 * existing `$id` as a prefix. Used to work around RJSF #1563 where
 * identical schemas need stable IDs to avoid validation cache collisions.
 *
 * @param schema - the JSON Schema to generate an ID for
 */
export function getSchemaId(schema: Record<string, any>): string {
    const hash = hashSchema(schema);
    const prefix = schema.$id ? `${schema.$id}-` : '';

    return `${prefix}${hash}`;
}

function hashSchema(schema: Record<string, any>): string {
    const { $id, id, ...schemaWithoutId } = schema;

    return djb2Hash(JSON.stringify(schemaWithoutId, sortedReplacer));
}

function sortedReplacer(_: string, value: unknown): unknown {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
        return Object.fromEntries(
            Object.entries(value).sort(([a], [b]) => a.localeCompare(b))
        );
    }

    return value;
}

function djb2Hash(str: string): string {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) + hash + str.codePointAt(i)) & 0xff_ff_ff_ff;
    }

    return (hash >>> 0).toString(36);
}
