interface Warned<Key> {
    has(key: Key): boolean;
    add(key: Key): unknown;
}

/**
 * @param message - what to say, without the name of the component
 */
export function warn(message: string) {
    console.warn(`limel-table: ${message}`);
}

/**
 * Warns once for each key.
 *
 * @param warned - the keys that this warning has been given for
 * @param key - what the warning is about, for example a column object
 * @param message - what to say, without the name of the component
 */
export function warnOnce<Key>(warned: Warned<Key>, key: Key, message: string) {
    if (warned.has(key)) {
        return;
    }

    warned.add(key);
    warn(message);
}
