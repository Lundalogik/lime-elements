import { isEmpty, isEqual, isPlainObject } from 'lodash-es';

/**
 * The value with the defaults that a change made apply or changed, such as
 * those of a new list item or of fields that depend on the changed one
 *
 * @param value - the value after the change
 * @param before - the defaults of the value before the change
 * @param after - the defaults of the value after the change
 * @returns the value, with the new defaults in it
 */
export function withNewDefaults(
    value: unknown,
    before: unknown,
    after: unknown
): unknown {
    if (value === undefined) {
        return getChangedDefaults(before, after);
    }

    if (isPlainObject(value) && isPlainObject(after)) {
        return withNewDefaultsInObject(
            value as Record<string, unknown>,
            isPlainObject(before) ? (before as Record<string, unknown>) : {},
            after as Record<string, unknown>
        );
    }

    if (Array.isArray(value) && Array.isArray(after)) {
        const beforeItems = Array.isArray(before) ? before : [];
        const items = value.map((item, index) =>
            withNewDefaults(item, beforeItems[index], after[index])
        );

        return items.every((item, index) => item === value[index])
            ? value
            : items;
    }

    return value;
}

function getChangedDefaults(before: unknown, after: unknown): unknown {
    if (isPlainObject(before) && isPlainObject(after)) {
        const changed = withNewDefaultsInObject(
            {},
            before as Record<string, unknown>,
            after as Record<string, unknown>
        );

        return isEmpty(changed) ? undefined : changed;
    }

    return isEqual(before, after) ? undefined : after;
}

function withNewDefaultsInObject(
    value: Record<string, unknown>,
    before: Record<string, unknown>,
    after: Record<string, unknown>
) {
    let result = value;
    for (const [key, defaults] of Object.entries(after)) {
        const property = withNewDefaults(value[key], before[key], defaults);
        if (property !== undefined && property !== value[key]) {
            result = { ...result, [key]: property };
        }
    }

    return result;
}
