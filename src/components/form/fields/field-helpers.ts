import { union, isEqual, isPlainObject, negate } from 'lodash-es';
import { retrieveSchema, ADDITIONAL_PROPERTY_FLAG } from '@rjsf/core/lib/utils';
import { FormSchema } from '../form.types';

/**
 * Given two objects, get a list of keys for each value that is different between
 * the two objects. Compares using deep comparison
 *
 * @param a - first object
 * @param b - second object
 * @returns the array of keys
 */
const getDifferentKeys = (a: object = {}, b: object = {}): any[] => {
    const keys = union(Object.keys(a), Object.keys(b));

    return keys.filter((key) => {
        return !isEqual(b[key], a[key]);
    });
};

/**
 * Given the data for the current SchemaField, detect if the changed data
 * has any other fields that are dependent on it, and if so reset those dependent fields
 * (by deleting them from the data so that their defaults are populated on the next rerender).
 * Call onChange with the updated data
 *
 * @param oldData - The previous data before a data change event
 * @param newData - The form data from a change event
 * @param schema - The schema associated with the data
 * @param rootSchema - The root schema
 */
// eslint-disable-next-line sonarjs/no-invariant-returns
export const resetDependentFields = (oldData, newData, schema, rootSchema) => {
    // Dependencies only exist on object types
    if (!isPlainObject(newData)) {
        return newData;
    }

    if (isCustomObjectSchema(schema)) {
        return newData;
    }

    // Get the schema generated by the current data
    const currentSchema = retrieveSchema(schema, rootSchema, oldData);

    // Get the new schema that is calculated for the new data
    const newSchema = retrieveSchema(schema, rootSchema, newData);

    // Get property keys whose schema changed due to the new data.
    // These properties that have changed are the properties that are dependent on
    // data that has changed in the current onChange event
    const dependentPropertyKeys = getDifferentKeys(
        newSchema.properties,
        currentSchema.properties,
    );

    // Reset keys that are dependent on the changed value.
    // The values for these dependent fields will be repopulated
    // with defaults during the next render
    for (const dependentPropertyKey of dependentPropertyKeys) {
        delete newData[dependentPropertyKey];
    }

    return newData;
};

/**
 * Check if the schema is of type object and have no declared properties
 *
 * @param schema - the schema
 * @returns true if the schema is for a custom object
 */
export function isCustomObjectSchema(schema: FormSchema) {
    if (!schema.additionalProperties) {
        return false;
    }

    if (!('properties' in schema)) {
        return true;
    }

    const properties = Object.values(schema.properties);

    return properties.filter(negate(isAdditionalProperty)).length === 0;
}

function isAdditionalProperty(schema: FormSchema): boolean {
    return schema[ADDITIONAL_PROPERTY_FLAG] === true;
}
