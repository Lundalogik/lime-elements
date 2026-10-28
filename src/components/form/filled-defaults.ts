import { isEmpty, isEqual, isPlainObject } from 'lodash-es';

/**
 * The value without the defaults that were filled into the value the form was
 * given, as long as they still hold their default. A default the user changed
 * stays, and so do the defaults of what the user added, such as a list item.
 *
 * @param value - the value the form holds, with the defaults filled in
 * @param filled - the value the form was given, with the defaults filled in
 * @param given - the value the form was given
 * @returns the value without the defaults that were filled in
 */
export function withoutFilledDefaults(
    value: unknown,
    filled: unknown,
    given: unknown
): unknown {
    // A change can bring in objects that hold nothing, which mean nothing
    if (isPlainObject(value)) {
        return withoutFilledProperties(
            value as Record<string, unknown>,
            isPlainObject(filled) ? (filled as Record<string, unknown>) : {},
            given
        );
    }

    if (Array.isArray(value)) {
        return withoutFilledItems(
            value,
            Array.isArray(filled) ? filled : [],
            given
        );
    }

    return given === undefined && isEqual(value, filled) ? undefined : value;
}

function withoutFilledProperties(
    value: Record<string, unknown>,
    filled: Record<string, unknown>,
    given: unknown
) {
    const givenProperties = isPlainObject(given)
        ? (given as Record<string, unknown>)
        : {};
    // In the order they were given, so a saved value keeps its key order
    const keys = new Set([
        ...Object.keys(givenProperties),
        ...Object.keys(value),
    ]);
    const result: Record<string, unknown> = {};
    for (const key of keys) {
        if (!Object.hasOwn(value, key)) {
            continue;
        }

        const kept = withoutFilledDefaults(
            value[key],
            filled[key],
            givenProperties[key]
        );
        if (kept !== undefined) {
            result[key] = kept;
        }
    }

    return isEmpty(result) && given == null ? given : result;
}

// Items are paired with the ones the form was given by content, so a removed
// or moved item does not shift the others onto the defaults of their
// neighbors. An item that no longer equals any of them is paired with the one
// it has the most in common with, so an edited item still loses its defaults
function withoutFilledItems(
    items: unknown[],
    filled: unknown[],
    given: unknown
) {
    // A list that was not given is a default as a whole: once the user
    // changes it, it is the user's
    if (!Array.isArray(given)) {
        return isEqual(items, filled) ? given : items;
    }

    const givenItems = given;
    const matches = pairItems(items, filled);
    const result: unknown[] = [];
    for (const [index, item] of items.entries()) {
        const match = matches.get(index);
        if (match === undefined) {
            result.push(item);
            continue;
        }

        const kept = withoutFilledDefaults(
            item,
            filled[match],
            givenItems[match]
        );
        if (kept !== undefined) {
            result.push(kept);
        }
    }

    return result;
}

function pairItems(items: unknown[], filled: unknown[]): Map<number, number> {
    const matches = new Map<number, number>();
    const unmatched = new Set(filled.keys());
    const pair = (index: number, match: number) => {
        matches.set(index, match);
        unmatched.delete(match);
    };

    for (const [index, item] of items.entries()) {
        if (unmatched.has(index) && isEqual(item, filled[index])) {
            pair(index, index);
        }
    }

    for (const [index, item] of items.entries()) {
        if (matches.has(index)) {
            continue;
        }

        const same = [...unmatched].find((i) => isEqual(item, filled[i]));
        if (same !== undefined) {
            pair(index, same);
        }
    }

    for (const [index, item] of items.entries()) {
        if (matches.has(index)) {
            continue;
        }

        const closest = findClosest(item, filled, unmatched);
        if (closest !== undefined) {
            pair(index, closest);
        }
    }

    return matches;
}

// The one item that shares the most equal properties, if it shares any at
// all. When several share as many there is no telling which the item was, and
// it is left as it is, since a kept default means the same as a missing one
// while a lost value does not
function findClosest(
    item: unknown,
    filled: unknown[],
    candidates: Set<number>
): number | undefined {
    if (!isPlainObject(item)) {
        return undefined;
    }

    let closest: number | undefined;
    let best = 0;
    let isTied = false;
    for (const candidate of candidates) {
        const score = sharedProperties(
            item as Record<string, unknown>,
            filled[candidate]
        );
        if (score === best) {
            isTied = true;
            continue;
        }

        if (score < best) {
            continue;
        }

        best = score;
        closest = candidate;
        isTied = false;
    }

    return isTied ? undefined : closest;
}

function sharedProperties(item: Record<string, unknown>, other: unknown) {
    if (!isPlainObject(other)) {
        return 0;
    }

    return Object.entries(item).filter(([key, value]) =>
        isEqual(value, (other as Record<string, unknown>)[key])
    ).length;
}
